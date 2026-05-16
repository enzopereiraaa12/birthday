"use client";

import { useEffect, useMemo, useState } from "react";
import { EVENT } from "@/lib/event-config";
import SectionReveal from "./section-reveal";

const units = [
  ["days", "jours"],
  ["hours", "heures"],
  ["minutes", "minutes"],
  ["seconds", "secondes"]
] as const;

export default function Countdown() {
  const target = useMemo(() => new Date(EVENT.targetDate).getTime(), []);
  const [remaining, setRemaining] = useState<ReturnType<typeof getRemaining> | null>(null);

  useEffect(() => {
    setRemaining(getRemaining(target));
    const interval = window.setInterval(() => setRemaining(getRemaining(target)), 1000);
    return () => window.clearInterval(interval);
  }, [target]);

  return (
    <SectionReveal className="relative z-20 px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-white/20 bg-gradient-to-br from-pink-400/28 via-white/10 to-fuchsia-900/24 p-5 shadow-glossy backdrop-blur-2xl sm:p-8">
        <p className="font-display text-xs uppercase tracking-[0.28em] text-pink-100">countdown live</p>
        <h2 className="mt-2 font-display text-3xl font-black uppercase text-white">Until iconic mode</h2>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {units.map(([key, label]) => (
            <div key={key} className="rounded-[1.4rem] border border-white/22 bg-black/22 p-4 text-center shadow-chrome">
              <div className="chrome-text font-display text-4xl font-black tabular-nums">
                {remaining ? String(remaining[key]).padStart(2, "0") : "--"}
              </div>
              <div className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-pink-100/80">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
}

function getRemaining(target: number) {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60)
  };
}
