"use client";

import { motion } from "framer-motion";
import { EVENT, TEASER_PHOTO, TEASER_PHOTO_FALLBACK } from "@/lib/event-config";
import ImageWithFallback from "./image-with-fallback";
import SectionReveal from "./section-reveal";

export default function Trailer() {
  return (
    <SectionReveal className="relative z-20 px-5 py-14 sm:px-8">
      <div id="trailer" className="mx-auto max-w-6xl">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.28em] text-pink-200">cover story</p>
            <h2 className="mt-1 font-display text-3xl font-black uppercase text-white sm:text-4xl">
              The birthday cover
            </h2>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-rose-300/40 bg-black/40 px-3 py-1.5 font-display text-[10px] uppercase tracking-[0.2em] text-rose-200 backdrop-blur-xl sm:flex">
            <span className="rec-dot h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,.9)]" />
            flash ready
          </div>
        </div>

        <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] border border-white/25 bg-black shadow-[0_24px_90px_rgba(255,20,160,.32)]">
          <motion.div
            initial={{ scale: 1.08 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <ImageWithFallback
              src={TEASER_PHOTO}
              fallback={TEASER_PHOTO_FALLBACK}
              alt="Soirée Y2K pink, boule disco et ambiance 2000"
              fit="cover"
              position="50% 40%"
              className="h-full w-full"
            />
          </motion.div>

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(255,192,203,.02),rgba(0,0,0,.5)_78%)]" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent" />

          {/* flash frame corner brackets */}
          <div aria-hidden className="pointer-events-none absolute inset-5 z-10 sm:inset-7">
            <span className="absolute left-0 top-0 h-7 w-7 border-l-2 border-t-2 border-white/55" />
            <span className="absolute right-0 top-0 h-7 w-7 border-r-2 border-t-2 border-white/55" />
            <span className="absolute bottom-0 left-0 h-7 w-7 border-b-2 border-l-2 border-white/55" />
            <span className="absolute bottom-0 right-0 h-7 w-7 border-b-2 border-r-2 border-white/55" />
          </div>

          <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-pink-100/40 bg-black/35 px-4 py-2 font-display text-[10px] uppercase tracking-[0.24em] text-pink-100 backdrop-blur-xl">
            <span className="rec-dot h-1.5 w-1.5 rounded-full bg-rose-500" />
            limited edition
          </div>

          <div className="vhs-mono absolute right-5 top-5 rounded-md border border-white/25 bg-black/45 px-3 py-2 text-[11px] font-bold text-white/85 backdrop-blur-xl">
            N°22
          </div>

          <div className="vhs-mono absolute bottom-6 left-6 z-10 rounded-md bg-black/40 px-2.5 py-1 text-[11px] font-bold text-white/80 backdrop-blur-xl">
            14·11·2026 19:30
          </div>

          <div className="relative z-10 flex min-h-[520px] flex-col justify-end p-6 sm:p-10">
            <p className="mb-3 font-display text-xs uppercase tracking-[0.28em] text-pink-200">
              limited edition
            </p>
            <h2 className="max-w-2xl font-display text-4xl font-black uppercase leading-tight text-white sm:text-6xl">
              Une nuit.
              <br />
              Un anniversaire.
              <br />
              1 an de plus.
            </h2>
            <p className="mt-4 max-w-lg text-lg text-pink-50/82">{EVENT.teaserSubline}</p>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
