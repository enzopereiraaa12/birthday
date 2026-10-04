"use client";

import { ArrowLeft, Check, Heart, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { PROFILE_QUESTIONS } from "@/lib/game-config";
import { defaultPasswordFor, normalizeFirstName } from "@/lib/game-utils";

type Session = { playerId: string; firstName: string };
type MeState = { hasProfile: boolean; duo: { partnerNames: string[]; score: number } | null } | null;

const STORAGE_KEY = "enzo22_game_player";

export default function QuizPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [firstName, setFirstName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [takenNames, setTakenNames] = useState<string[]>([]);
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [me, setMe] = useState<MeState>(null);
  const [answers, setAnswers] = useState<Array<number | null>>(Array(PROFILE_QUESTIONS.length).fill(null));
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setSession(JSON.parse(raw));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    fetch("/api/game/state")
      .then((res) => res.json())
      .then((json) => setTakenNames(json.takenNames || []))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!passwordTouched) setPassword(firstName ? defaultPasswordFor(firstName) : "");
  }, [firstName, passwordTouched]);

  useEffect(() => {
    if (!session) return;
    fetch(`/api/game/state?playerId=${session.playerId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.playerFound === false) {
          window.localStorage.removeItem(STORAGE_KEY);
          setSession(null);
          setLoginError("Ta session a expiré (le jeu a été réinitialisé), reconnecte-toi.");
          return;
        }
        setMe(json.me || null);
        if (json.me?.hasProfile) setSubmitted(true);
      })
      .catch(() => undefined);
  }, [session]);

  const nameTaken =
    firstName.length > 1 &&
    takenNames.some((name) => normalizeFirstName(name) === normalizeFirstName(firstName)) &&
    !session;

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
      if (!response.ok || !json.ok) {
        throw new Error(json.message || "Connexion impossible.");
      }
      const next: Session = { playerId: json.playerId, firstName: json.firstName };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSession(next);
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Connexion impossible.");
    } finally {
      setLoggingIn(false);
    }
  };

  const [submitError, setSubmitError] = useState("");

  const submitProfile = async () => {
    if (!session || answers.some((a) => a === null)) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/game/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: session.playerId, answers })
      });
      const json = await response.json();
      if (json.ok) {
        setSubmitted(true);
      } else if (response.status === 404) {
        window.localStorage.removeItem(STORAGE_KEY);
        setSession(null);
        setLoginError("Ta session a expiré (le jeu a été réinitialisé), reconnecte-toi.");
      } else {
        setSubmitError(json.message || "L'envoi a échoué, réessaie.");
      }
    } catch {
      setSubmitError("L'envoi a échoué, vérifie ta connexion et réessaie.");
    } finally {
      setSubmitting(false);
    }
  };

  const logout = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setSession(null);
    setMe(null);
    setSubmitted(false);
    setFirstName("");
    setPassword("");
    setPasswordTouched(false);
  };

  if (!session) {
    return (
      <Shell>
        <p className="font-display text-xs uppercase tracking-[0.28em] text-pink-200">quiz de goûts</p>
        <h1 className="chrome-text mt-2 font-display text-4xl font-black uppercase sm:text-5xl">
          T'es plutôt quoi, 2000s ?
        </h1>
        <p className="mt-4 max-w-md text-pink-50/78">
          Réponds à 10 questions pour trouver ton binôme du jour J. Crée ton compte avec ton prénom.
        </p>

        <div className="glass mt-7 flex flex-col gap-3 rounded-[1.4rem] p-5">
          <input
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="Ton prénom"
            className="min-h-13 rounded-2xl border border-white/22 bg-white/12 px-4 font-bold text-white outline-none placeholder:text-pink-100/44 focus:border-pink-100/80"
          />
          {nameTaken && (
            <p className="text-xs font-semibold text-pink-100">
              Il y a déjà un·e {firstName} inscrit·e. Si ce n'est pas toi, précise ton prénom (ex: {firstName} B.).
            </p>
          )}
          <input
            value={password}
            onChange={(event) => {
              setPasswordTouched(true);
              setPassword(event.target.value);
            }}
            type="text"
            placeholder="Mot de passe"
            className="min-h-13 rounded-2xl border border-white/22 bg-white/12 px-4 font-bold text-white outline-none placeholder:text-pink-100/44 focus:border-pink-100/80"
          />
          <p className="text-xs text-pink-100/60">
            Mot de passe suggéré : ton prénom + 2000. Retiens-le pour te reconnecter.
          </p>
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

  if (submitted || me?.hasProfile) {
    if (me?.duo) {
      return (
        <Shell>
          <ConnectedBadge firstName={session.firstName} onLogout={logout} />
          <div className="stamp-pop rounded-2xl border-2 border-white/70 px-6 py-4 text-center">
            <p className="font-display text-xs uppercase tracking-[0.24em] text-pink-200">ton binôme</p>
            <p className="chrome-text mt-2 font-display text-4xl font-black uppercase">
              {me.duo.partnerNames.join(" & ")}
            </p>
          </div>
          <p className="mt-6 max-w-sm text-center text-pink-50/80">
            Rendez-vous le 14 novembre, direction l'onglet "Jeu" pour jouer ensemble.
          </p>
        </Shell>
      );
    }
    return (
      <Shell>
        <ConnectedBadge firstName={session.firstName} onLogout={logout} />
        <div className="glossy-button grid h-16 w-16 place-items-center rounded-full">
          <Heart fill="white" size={28} />
        </div>
        <h1 className="mt-5 font-display text-2xl font-black uppercase text-white">C'est noté, {session.firstName} !</h1>
        <p className="mt-3 max-w-sm text-center text-pink-50/78">
          Ton binôme sera révélé ici dès qu'Enzo aura lancé l'appariement. Reviens plus tard !
        </p>
      </Shell>
    );
  }

  return (
    <Shell wide>
      <ConnectedBadge firstName={session.firstName} onLogout={logout} />
      <p className="font-display text-xs uppercase tracking-[0.28em] text-pink-200">salut {session.firstName}</p>
      <h1 className="chrome-text mt-2 font-display text-3xl font-black uppercase sm:text-4xl">10 questions, go</h1>

      <div className="mt-7 w-full space-y-5 text-left">
        {PROFILE_QUESTIONS.map((q, qIndex) => (
          <div key={q.question} className="glass rounded-[1.4rem] p-5">
            <p className="font-display text-base font-black text-white">{q.question}</p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {q.options.map((option, optionIndex) => {
                const selected = answers[qIndex] === optionIndex;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setAnswers((prev) => {
                        const next = [...prev];
                        next[qIndex] = optionIndex;
                        return next;
                      })
                    }
                    className={`flex min-h-12 items-center justify-between rounded-xl border px-4 text-left text-sm font-bold transition active:scale-[.98] ${
                      selected
                        ? "border-white/70 bg-pink-300/30 shadow-chrome"
                        : "border-white/18 bg-white/10 hover:border-pink-100/55"
                    }`}
                  >
                    {option}
                    {selected && <Check size={16} />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {submitError && <p className="mt-4 text-sm font-semibold text-pink-100">{submitError}</p>}
      <button
        type="button"
        onClick={submitProfile}
        disabled={submitting || answers.some((a) => a === null)}
        className="glossy-button mt-4 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full font-black uppercase tracking-[0.12em] disabled:opacity-60"
      >
        {submitting ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
        Valider mes réponses
      </button>
    </Shell>
  );
}

function ConnectedBadge({ firstName, onLogout }: { firstName: string; onLogout: () => void }) {
  return (
    <div className="mb-5 flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-400/15 px-4 py-1.5 text-xs font-bold text-emerald-200">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
      Connecté en tant que {firstName}
      <button type="button" onClick={onLogout} className="ml-1 text-emerald-200/70 underline">
        changer de compte
      </button>
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
