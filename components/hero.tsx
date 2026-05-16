"use client";

import { motion } from "framer-motion";
import { CalendarHeart, ChevronDown, Sparkles } from "lucide-react";
import { EVENT } from "@/lib/event-config";

export default function Hero() {
  return (
    <section className="relative z-20 flex min-h-[100svh] items-center px-5 pb-16 pt-20 sm:px-8 lg:min-h-[92vh]">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[68svh] bg-[radial-gradient(circle_at_50%_20%,rgba(255,192,203,.42),transparent_34rem)]" />
        <div className="absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full border border-pink-100/20 bg-pink-300/10 blur-2xl" />
        <div className="absolute bottom-6 left-4 right-4 h-40 rounded-[2rem] border border-white/10 bg-white/5 blur-sm" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 38, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 1.15 }}
        className="mx-auto w-full max-w-6xl"
      >
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/12 px-4 py-2 text-sm font-semibold text-pink-50 shadow-chrome backdrop-blur-xl">
          <Sparkles size={16} />
          vintage 2000 birthday party
        </div>

        <h1 className="chrome-text max-w-[11ch] font-display text-[clamp(4.1rem,22vw,10rem)] font-black uppercase leading-[0.84] tracking-normal">
          {EVENT.altTitle}
        </h1>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3">
            <CalendarHeart size={20} className="text-pink-200" />
            <span className="font-display text-lg uppercase text-white">{EVENT.dateLabel}</span>
          </div>
          <div className="glass rounded-2xl px-4 py-3 text-sm font-semibold text-pink-100">
            Enzo turns 22
          </div>
        </div>

        <p className="mt-7 max-w-xl text-balance text-lg leading-7 text-pink-50/86">
          Invitation privée pour une nuit rose vintage, flash photo, paillettes,
          verres teintés et énergie années 2000. Dress to be remembered.
        </p>

        <a
          href="#trailer"
          className="glossy-button shimmer-line mt-8 inline-flex min-h-14 items-center justify-center rounded-full px-8 text-base font-bold uppercase tracking-[0.12em] transition active:scale-95"
        >
          Open Invitation
        </a>

        <motion.a
          href="#trailer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ delay: 2, duration: 1.7, repeat: Infinity }}
          className="mt-12 flex w-max items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-pink-100/80"
        >
          Scroll
          <ChevronDown size={18} />
        </motion.a>
      </motion.div>
    </section>
  );
}
