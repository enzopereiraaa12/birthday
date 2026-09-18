"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart, Loader2, Sparkles, Star, Ticket } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import RSVPQuiz from "./rsvp-quiz";

type Phase = "idle" | "queuing" | "ready" | "entered";

const STATUS_MESSAGES = [
  "Connexion à la file VIP...",
  "Vérification de ta place...",
  "Synchronisation avec la guest list...",
  "Cryptage de ta position...",
  "Presque prêt(e)..."
];

const BURST_ICONS = [Heart, Star, Sparkles, Heart, Star, Sparkles];

export default function QueueGate() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [startPosition, setStartPosition] = useState(0);
  const [position, setPosition] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const cancelledRef = useRef(false);

  const join = () => {
    const start = 1200 + Math.floor(Math.random() * 2400);
    setStartPosition(start);
    setPosition(start);
    setPhase("queuing");
  };

  useEffect(() => {
    if (phase !== "queuing") return;
    cancelledRef.current = false;
    let current = startPosition;
    let timeoutId: number;

    const tick = () => {
      if (cancelledRef.current) return;
      const step = Math.max(1, Math.round(current * (0.1 + Math.random() * 0.16)));
      current = Math.max(0, current - step);
      setPosition(current);
      if (current <= 0) {
        timeoutId = window.setTimeout(() => {
          if (!cancelledRef.current) setPhase("ready");
        }, 450);
        return;
      }
      timeoutId = window.setTimeout(tick, 240 + Math.random() * 260);
    };

    timeoutId = window.setTimeout(tick, 500);
    return () => {
      cancelledRef.current = true;
      window.clearTimeout(timeoutId);
    };
  }, [phase, startPosition]);

  useEffect(() => {
    if (phase !== "queuing") return;
    const interval = window.setInterval(() => {
      setStatusIndex((index) => (index + 1) % STATUS_MESSAGES.length);
    }, 1150);
    return () => window.clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase !== "ready") return;
    const timeout = window.setTimeout(() => setPhase("entered"), 2200);
    return () => window.clearTimeout(timeout);
  }, [phase]);

  if (phase === "entered") return <RSVPQuiz />;

  const progress =
    phase === "queuing" && startPosition > 0
      ? Math.min(100, Math.round(((startPosition - position) / startPosition) * 100))
      : phase === "ready"
        ? 100
        : 0;

  const estimatedMinutes = Math.max(0, Math.ceil(position / 55));

  return (
    <section id="rsvp" className="relative z-20 px-5 py-14 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-7 text-center">
          <p className="font-display text-xs uppercase tracking-[0.28em] text-pink-200">rsvp / guest quiz</p>
          <h2 className="mt-2 font-display text-3xl font-black uppercase text-white sm:text-5xl">
            Are you coming?
          </h2>
        </div>

        <div className="glass relative min-h-[420px] overflow-hidden rounded-[2rem] p-6 text-center sm:p-10">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-70" />

          <AnimatePresence mode="wait">
            {phase === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
                className="flex min-h-[360px] flex-col items-center justify-center"
              >
                <div className="glossy-button mb-6 grid h-20 w-20 place-items-center rounded-full">
                  <Ticket size={30} />
                </div>
                <p className="font-display text-xs uppercase tracking-[0.28em] text-pink-200">guest list VIP</p>
                <h3 className="mt-3 max-w-sm text-balance font-display text-3xl font-black uppercase leading-tight text-white">
                  La file d'attente est ouverte
                </h3>
                <p className="mt-4 max-w-sm text-balance text-base leading-6 text-pink-50/78">
                  Rejoins la file pour confirmer ta venue. Places limitées, énergie illimitée.
                </p>
                <button
                  type="button"
                  onClick={join}
                  className="holo-sweep is-active glossy-button mt-8 inline-flex min-h-14 items-center justify-center gap-2 rounded-full px-8 text-base font-bold uppercase tracking-[0.12em] transition active:scale-95"
                >
                  <Sparkles size={18} />
                  Rejoindre la file d'attente
                </button>
              </motion.div>
            )}

            {phase === "queuing" && (
              <motion.div
                key="queuing"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
                className="flex min-h-[360px] flex-col items-center justify-center"
              >
                <div className="mb-4 flex items-center gap-2 rounded-full border border-pink-100/35 bg-black/25 px-4 py-1.5 font-display text-[10px] uppercase tracking-[0.2em] text-pink-100">
                  <span className="rec-dot h-1.5 w-1.5 rounded-full bg-rose-400" />
                  file en direct
                </div>

                <p className="font-display text-xs uppercase tracking-[0.24em] text-pink-200">ta position</p>
                <div className="chrome-text vhs-mono mt-2 font-display text-[clamp(3.4rem,16vw,6rem)] font-black leading-none">
                  {position.toLocaleString("fr-FR")}
                </div>
                <p className="mt-1 text-sm font-bold uppercase tracking-[0.14em] text-pink-100/70">
                  personne{position > 1 ? "s" : ""} devant toi
                </p>

                <div className="mt-7 h-3 w-full max-w-sm overflow-hidden rounded-full bg-white/12">
                  <motion.div
                    className="shimmer-line h-full rounded-full bg-gradient-to-r from-pink-200 via-bubblegum to-white"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-pink-100/60">
                  ≈ {estimatedMinutes} min d'attente estimée
                </p>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={statusIndex}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="mt-6 flex items-center gap-2 text-sm font-semibold text-pink-50/85"
                  >
                    <Loader2 className="animate-spin" size={16} />
                    {STATUS_MESSAGES[statusIndex]}
                  </motion.p>
                </AnimatePresence>

                <p className="mt-6 max-w-xs text-balance text-[11px] italic text-pink-100/50">
                  Merci de ne pas rafraîchir la page. Ta place est réservée. ✦
                </p>
              </motion.div>
            )}

            {phase === "ready" && (
              <motion.div
                key="ready"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
                className="relative flex min-h-[360px] flex-col items-center justify-center"
              >
                <div aria-hidden className="pointer-events-none absolute inset-0 overflow-visible">
                  {BURST_ICONS.map((Icon, index) => {
                    const angle = (index / BURST_ICONS.length) * Math.PI * 2;
                    const distance = 130;
                    return (
                      <motion.span
                        key={index}
                        initial={{ opacity: 1, x: "50%", y: "50%", scale: 0.4 }}
                        animate={{
                          opacity: 0,
                          x: `calc(50% + ${Math.cos(angle) * distance}px)`,
                          y: `calc(50% + ${Math.sin(angle) * distance}px)`,
                          scale: 1.2,
                          rotate: index % 2 === 0 ? 50 : -50
                        }}
                        transition={{ duration: 1.1, ease: "easeOut" }}
                        className="absolute left-0 top-0 text-pink-100 drop-shadow-[0_0_10px_rgba(255,105,180,.9)]"
                      >
                        <Icon size={22} fill="currentColor" />
                      </motion.span>
                    );
                  })}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.9, 0] }}
                  transition={{ duration: 0.6 }}
                  className="pointer-events-none absolute inset-0 rounded-[2rem] bg-white"
                />

                <div className="stamp-pop rounded-2xl border-2 border-white/70 px-6 py-3">
                  <p className="chrome-text font-display text-4xl font-black uppercase leading-none sm:text-5xl">
                    C&apos;est ton tour !
                  </p>
                </div>
                <p className="mt-5 max-w-xs text-balance text-base font-semibold text-pink-50/85">
                  Bienvenue dans la guest list. Prépare-toi à confirmer ta venue.
                </p>
                <button
                  type="button"
                  onClick={() => setPhase("entered")}
                  className="glossy-button mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-black uppercase tracking-[0.12em] transition active:scale-95"
                >
                  Entrer
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
