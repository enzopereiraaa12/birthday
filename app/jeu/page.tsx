"use client";

import { ArrowLeft, Loader2, Lock, Sparkles, Timer, Trophy, Users, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Session = { playerId: string; firstName: string };
type LeaderboardRow = { id: string; memberNames: string[]; score: number };
type GameStateResponse = {
  phase: "profiling" | "matched_pending" | "matched" | "live" | "ended";
  currentQuestionIndex: number;
  currentQuestionStartedAt: number | null;
  questionDurationSeconds: number;
  totalQuestions: number;
  question: { index: number; question: string; options: string[] } | null;
  leaderboard: LeaderboardRow[];
  me: { hasProfile: boolean; duo: { partnerNames: string[]; score: number } | null } | null;
  playerFound?: boolean;
};

const STORAGE_KEY = "enzo22_game_player";

export default function JeuPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [firstName, setFirstName] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [state, setState] = useState<GameStateResponse | null>(null);
  const [answeredIndex, setAnsweredIndex] = useState<number | null>(null);
  const [lastResult, setLastResult] = useState<"correct" | "wrong" | "teammate" | null>(null);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [answerError, setAnswerError] = useState("");
  const [remaining, setRemaining] = useState(0);
  const lastQuestionIndex = useRef(-1);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setSession(JSON.parse(raw));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (!session) return;
    const poll = () => {
      fetch(`/api/game/state?playerId=${session.playerId}`)
        .then((res) => res.json())
        .then((json: GameStateResponse) => {
          if (json.playerFound === false) {
            window.localStorage.removeItem(STORAGE_KEY);
            setSession(null);
            setLoginError("Ta session a expiré (le jeu a été réinitialisé), reconnecte-toi.");
            return;
          }
          setState(json);
          if (json.question && json.question.index !== lastQuestionIndex.current) {
            lastQuestionIndex.current = json.question.index;
            setAnsweredIndex(null);
            setLastResult(null);
            setCorrectIndex(null);
            setAnswerError("");
          }
        })
        .catch(() => undefined);
    };
    poll();
    const interval = window.setInterval(poll, 1500);
    return () => window.clearInterval(interval);
  }, [session]);

  useEffect(() => {
    if (!state?.question || !state.currentQuestionStartedAt) return;
    const tick = () => {
      const elapsed = (Date.now() - (state.currentQuestionStartedAt ?? 0)) / 1000;
      setRemaining(Math.max(0, Math.ceil(state.questionDurationSeconds - elapsed)));
    };
    tick();
    const interval = window.setInterval(tick, 250);
    return () => window.clearInterval(interval);
  }, [state?.question, state?.currentQuestionStartedAt, state?.questionDurationSeconds]);

  const login = async () => {
    setLoginError("");
    setLoggingIn(true);
    try {
      const response = await fetch("/api/game/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, password })
      });
      const json = await response.json();
      if (!response.ok || !json.ok) throw new Error(json.message || "Connexion impossible.");
      const next: Session = { playerId: json.playerId, firstName: json.firstName };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSession(next);
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Connexion impossible.");
    } finally {
      setLoggingIn(false);
    }
  };

  const logout = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setSession(null);
    setState(null);
    setFirstName("");
    setPassword("");
  };

  const answer = async (optionIndex: number) => {
    if (!session || !state?.question || answeredIndex !== null) return;
    setAnsweredIndex(optionIndex);
    setAnswerError("");
    try {
      const response = await fetch("/api/game/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: session.playerId, questionIndex: state.question.index, optionIndex })
      });
      const json = await response.json();
      if (json.ok) {
        setCorrectIndex(json.correctIndex);
        setLastResult(json.alreadyAnswered ? "teammate" : json.correct ? "correct" : "wrong");
      } else {
        setAnswerError(json.message || "Réponse refusée.");
      }
    } catch {
      setAnswerError("Erreur réseau, réessaie.");
    }
  };

  if (!session) {
    return (
      <Shell>
        <p className="font-display text-xs uppercase tracking-[0.28em] text-pink-200">le jeu</p>
        <h1 className="chrome-text mt-2 font-display text-4xl font-black uppercase">Connexion binôme</h1>
        <div className="glass mt-7 flex w-full flex-col gap-3 rounded-[1.4rem] p-5 text-left">
          <input
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="Ton prénom"
            className="min-h-13 rounded-2xl border border-white/22 bg-white/12 px-4 font-bold text-white outline-none placeholder:text-pink-100/44 focus:border-pink-100/80"
          />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Mot de passe"
            className="min-h-13 rounded-2xl border border-white/22 bg-white/12 px-4 font-bold text-white outline-none placeholder:text-pink-100/44 focus:border-pink-100/80"
          />
          {loginError && <p className="text-sm font-semibold text-pink-100">{loginError}</p>}
          <button
            type="button"
            onClick={login}
            disabled={loggingIn || firstName.trim().length < 2 || password.length < 3}
            className="glossy-button mt-2 inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl font-black uppercase tracking-[0.12em] disabled:opacity-60"
          >
            {loggingIn ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            Entrer
          </button>
        </div>
      </Shell>
    );
  }

  const isOpenToEveryone = state && (state.phase === "live" || state.phase === "ended");

  if (!isOpenToEveryone) {
    return (
      <Shell>
        <div className="mb-5 flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-400/15 px-4 py-1.5 text-xs font-bold text-emerald-200">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
          Connecté en tant que {session.firstName}
          <button type="button" onClick={logout} className="ml-1 text-emerald-200/70 underline">
            changer de compte
          </button>
        </div>
        <div className="grid h-16 w-16 place-items-center rounded-full border border-white/30 bg-white/10">
          <Lock size={26} />
        </div>
        <h1 className="mt-5 font-display text-3xl font-black uppercase text-white">Pas encore ouvert</h1>
        <p className="mt-3 max-w-sm text-pink-50/78">Reviens le 14 novembre à 19h pour jouer avec ton binôme !</p>

        <div className="glass mt-7 w-full max-w-sm rounded-[1.4rem] p-5 text-left">
          <p className="mb-3 font-display text-xs uppercase tracking-[0.2em] text-pink-200">les règles, vite fait</p>
          <ul className="space-y-3 text-sm text-pink-50/90">
            <li className="flex items-start gap-2.5">
              <Users size={16} className="mt-0.5 shrink-0 text-pink-100" />
              Tu joues en équipe avec ton binôme, un quiz de culture 2000s.
            </li>
            <li className="flex items-start gap-2.5">
              <Timer size={16} className="mt-0.5 shrink-0 text-pink-100" />
              10 secondes pour répondre à chaque question.
            </li>
            <li className="flex items-start gap-2.5">
              <Zap size={16} className="mt-0.5 shrink-0 text-pink-100" />
              Le premier des deux à répondre compte pour l'équipe.
            </li>
            <li className="flex items-start gap-2.5">
              <Trophy size={16} className="mt-0.5 shrink-0 text-pink-100" />
              Classement en direct, meilleur binôme à la fin gagne.
            </li>
          </ul>
        </div>
      </Shell>
    );
  }

  if (state?.phase === "ended") {
    return (
      <Shell>
        <Trophy size={32} className="text-pink-100" />
        <h1 className="chrome-text mt-4 font-display text-4xl font-black uppercase">Classement final</h1>
        <Leaderboard rows={state.leaderboard} />
      </Shell>
    );
  }

  if (state?.phase === "live" && state.question) {
    return (
      <Shell wide>
        <p className="font-display text-xs uppercase tracking-[0.28em] text-pink-200">
          Question {state.question.index + 1} / {state.totalQuestions}
        </p>
        <div className="chrome-text mt-2 font-display text-5xl font-black">{remaining}s</div>
        <h2 className="mt-4 max-w-lg text-balance font-display text-2xl font-black text-white">
          {state.question.question}
        </h2>

        {remaining <= 0 && answeredIndex === null && (
          <p className="mt-4 rounded-full border border-pink-100/35 bg-black/30 px-4 py-2 text-sm font-bold text-pink-100">
            Temps écoulé ! En attente de la question suivante...
          </p>
        )}

        {lastResult && (
          <p
            className={`mt-4 rounded-full px-4 py-2 text-sm font-black uppercase tracking-[0.1em] ${
              lastResult === "correct"
                ? "bg-emerald-400/25 text-emerald-200"
                : lastResult === "teammate"
                  ? "bg-pink-300/20 text-pink-100"
                  : "bg-rose-400/25 text-rose-200"
            }`}
          >
            {lastResult === "correct"
              ? "Bonne réponse !"
              : lastResult === "teammate"
                ? "Ton binôme a déjà répondu pour l'équipe !"
                : `Raté, la bonne réponse était : ${correctIndex !== null ? state.question!.options[correctIndex] : "?"}`}
          </p>
        )}

        {answerError && <p className="mt-4 text-sm font-semibold text-pink-100">{answerError}</p>}

        <div className="mt-6 grid w-full gap-3 sm:grid-cols-2">
          {state.question.options.map((option, index) => {
            const isAnswered = answeredIndex !== null;
            const isPicked = answeredIndex === index;
            const isCorrectOption = correctIndex === index;
            return (
              <button
                key={option}
                type="button"
                onClick={() => answer(index)}
                disabled={isAnswered || remaining <= 0}
                className={`min-h-14 rounded-2xl border px-4 text-left text-base font-bold transition active:scale-[.98] disabled:opacity-70 ${
                  isAnswered && isCorrectOption
                    ? "border-emerald-300 bg-emerald-400/25"
                    : isPicked
                      ? lastResult === "wrong"
                        ? "border-rose-300 bg-rose-400/25"
                        : "border-white/70 bg-pink-300/30"
                      : "border-white/18 bg-white/10"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {state.me?.duo && (
          <p className="mt-5 text-sm font-bold text-pink-100/80">
            Score du binôme ({[session.firstName, ...state.me.duo.partnerNames].join(" & ")}) : {state.me.duo.score}
          </p>
        )}

        <Leaderboard rows={state.leaderboard} />
      </Shell>
    );
  }

  return (
    <Shell>
      <Loader2 className="animate-spin text-pink-100" size={28} />
      <p className="mt-4 text-pink-50/80">La partie commence bientôt...</p>
    </Shell>
  );
}

function Leaderboard({ rows }: { rows: LeaderboardRow[] }) {
  if (!rows.length) return null;
  return (
    <div className="glass mt-7 w-full rounded-[1.4rem] p-5 text-left">
      <p className="mb-3 font-display text-xs uppercase tracking-[0.24em] text-pink-200">classement en direct</p>
      <div className="space-y-2">
        {rows.map((row, index) => (
          <div key={row.id} className="flex items-center justify-between rounded-xl border border-white/15 bg-white/8 px-4 py-2.5">
            <span className="font-bold text-white">
              #{index + 1} {row.memberNames.join(" & ")}
            </span>
            <span className="chrome-text font-display text-xl font-black">{row.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Shell({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <main className="relative min-h-screen bg-[#130813] px-5 py-10 text-white sm:px-8">
      <div className="noise" />
      <div className={`relative z-10 mx-auto flex flex-col items-center ${wide ? "max-w-2xl" : "max-w-md"}`}>
        <a href="/" className="mb-6 inline-flex items-center gap-2 self-start text-sm font-bold text-pink-100">
          <ArrowLeft size={16} />
          Retour au site
        </a>
        <div className="flex w-full flex-col items-center text-center">{children}</div>
      </div>
    </main>
  );
}
