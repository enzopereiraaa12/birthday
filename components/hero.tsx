"use client";

import { motion } from "framer-motion";
import { CalendarHeart, ChevronDown, Sparkles, Star } from "lucide-react";
import { EVENT } from "@/lib/event-config";
import { smoothScrollTo } from "@/lib/scroll";
import MiniPlayer from "./mini-player";

export default function Hero() {
  return (
    <section className="relative z-20 flex min-h-[100svh] items-center px-5 pb-16 pt-28 sm:px-8 sm:pt-24 lg:min-h-[92vh]">
      <motion.div
        aria-hidden
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.75, delay: 0.15, ease: "easeOut" }}
        className="pointer-events-none fixed inset-0 z-[95] bg-white"
      />

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[68svh] bg-[radial-gradient(circle_at_50%_20%,rgba(255,192,203,.42),transparent_34rem)]" />
        <div
          aria-hidden
          className="starburst absolute left-1/2 top-[30%] h-[140vw] w-[140vw] -translate-x-1/2 -translate-y-1/2 opacity-50 mix-blend-screen sm:h-[90vw] sm:w-[90vw]"
        />
        <div
          aria-hidden
          className="spotlight-beam absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.55),transparent_70%)] mix-blend-screen"
        />
        <div
          aria-hidden
          className="spotlight-beam absolute -right-20 -top-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(255,44,168,.55),transparent_70%)] mix-blend-screen"
          style={{ animationDelay: "1.4s" }}
        />
        <div className="absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full border border-pink-100/20 bg-pink-300/10 blur-2xl" />
        <div className="absolute bottom-6 left-4 right-4 h-40 rounded-[2rem] border border-white/10 bg-white/5 blur-sm" />
      </div>

      {/* corner viewfinder brackets — magazine cover crop marks */}
      <div aria-hidden className="pointer-events-none absolute inset-3 z-0 sm:inset-6">
        <span className="absolute left-0 top-0 h-6 w-6 border-l-2 border-t-2 border-white/35" />
        <span className="absolute right-0 top-0 h-6 w-6 border-r-2 border-t-2 border-white/35" />
        <span className="absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2 border-white/35" />
        <span className="absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-white/35" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        <MiniPlayer />

        {/* magazine masthead row */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="mb-6 flex items-center justify-between font-display text-[11px] uppercase tracking-[0.24em] text-pink-100/85"
        >
          <span>{EVENT.issueNumber} — pink edition</span>
          <span className="hidden items-center gap-1.5 sm:flex">
            <Star size={11} className="fill-pink-100 text-pink-100" />
            one night only
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 38, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.9 }}
          className="relative"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/12 px-4 py-2 text-sm font-semibold text-pink-50 shadow-chrome backdrop-blur-xl">
            <span className="rec-dot h-2 w-2 rounded-full bg-rose-400 shadow-[0_0_10px_rgba(244,63,94,.9)]" />
            hot pink 2000 birthday tape
          </div>

          <div className="relative">
            <h1
              data-text="Enzo"
              className="rgb-split chrome-text max-w-[10ch] font-display text-[clamp(5.2rem,28vw,13rem)] font-black uppercase leading-[0.76] tracking-normal"
            >
              Enzo
            </h1>
            <div className="-mt-2 flex items-center gap-3 sm:-mt-4 sm:gap-6">
              <h1
                data-text="22"
                className="rgb-split chrome-text rotate-[-3deg] font-display text-[clamp(5.2rem,28vw,13rem)] font-black uppercase leading-[0.76] tracking-normal"
              >
                22
              </h1>
              <motion.div
                initial={{ opacity: 0, rotate: -18, scale: 0.4 }}
                animate={{ opacity: 1, rotate: -8, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
                className="holo-sweep is-active glossy-button grid h-16 w-16 shrink-0 place-items-center rounded-full text-center font-display text-[10px] font-black uppercase leading-tight sm:h-24 sm:w-24 sm:text-xs"
              >
                VIP
                <br />
                pass
              </motion.div>
            </div>
          </div>

          <p className="mt-2 font-display text-xs uppercase tracking-[0.3em] text-pink-100/70">
            {EVENT.heroKicker}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3">
              <CalendarHeart size={20} className="text-pink-200" />
              <span className="font-display text-lg uppercase text-white">{EVENT.dateLabel}</span>
            </div>
            <div className="glass rounded-2xl px-4 py-3 text-sm font-semibold text-pink-100">
              {EVENT.time} · Amiens
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {EVENT.heroTags.map((tag, index) => (
              <span
                key={tag}
                className={`rounded-full border px-3.5 py-2 font-display text-[11px] font-black uppercase tracking-[0.14em] backdrop-blur-lg ${
                  index % 2 === 0
                    ? "border-white/50 bg-white text-pink-700 shadow-[0_8px_24px_rgba(255,20,160,.4)]"
                    : "border-pink-100/40 bg-black/30 text-pink-100"
                }`}
                style={{ transform: `rotate(${index % 2 === 0 ? "-3deg" : "2.5deg"})` }}
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="mt-7 max-w-xl text-balance font-display text-2xl font-black uppercase leading-8 text-white sm:text-3xl">
            Lunettes teintées. Rose partout. Attitude clip MTV.
          </p>
          <p className="mt-2 max-w-md text-balance text-base font-semibold leading-6 text-pink-50/78">
            Ce soir-là, tout doit flasher.
          </p>

          <a
            href="#trailer"
            onClick={smoothScrollTo("trailer")}
            className="holo-sweep is-active glossy-button shimmer-line mt-8 inline-flex min-h-14 items-center justify-center gap-2 rounded-full px-8 text-base font-bold uppercase tracking-[0.12em] transition active:scale-95"
          >
            <Sparkles size={18} />
            Open Invitation
          </a>

          <motion.a
            href="#trailer"
            onClick={smoothScrollTo("trailer")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 8, 0] }}
            transition={{ delay: 2, duration: 1.7, repeat: Infinity }}
            className="mt-12 flex w-max items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-pink-100/80"
          >
            Scroll
            <ChevronDown size={18} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
