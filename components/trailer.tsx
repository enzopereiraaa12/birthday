import { Play } from "lucide-react";
import { EVENT, VIDEO_POSTER, VIDEO_SRC } from "@/lib/event-config";
import SectionReveal from "./section-reveal";

export default function Trailer() {
  return (
    <SectionReveal
      className="relative z-20 px-5 py-14 sm:px-8"
    >
      <div id="trailer" className="mx-auto max-w-6xl">
        <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] border border-white/20 bg-black shadow-[0_24px_80px_rgba(0,0,0,.45)]">
          {VIDEO_SRC ? (
            <video
              className="absolute inset-0 h-full w-full object-cover opacity-70"
              poster={VIDEO_POSTER}
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={VIDEO_SRC} type="video/mp4" />
            </video>
          ) : (
            <img src={VIDEO_POSTER} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
          )}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,105,180,.16),rgba(0,0,0,.72)_68%)]" />
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/16 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-1/3 animate-scan bg-gradient-to-b from-transparent via-white/12 to-transparent" />

          <div className="relative z-10 flex min-h-[520px] flex-col justify-end p-6 sm:p-10">
            <div className="mb-5 grid h-16 w-16 place-items-center rounded-full border border-white/40 bg-white/15 shadow-chrome backdrop-blur-xl">
              <Play fill="white" size={24} />
            </div>
            <p className="mb-3 font-display text-xs uppercase tracking-[0.28em] text-pink-200">
              official teaser
            </p>
            <h2 className="max-w-2xl text-balance font-display text-4xl font-black uppercase leading-tight text-white sm:text-6xl">
              {EVENT.teaserLine}
            </h2>
            <p className="mt-4 max-w-lg text-lg text-pink-50/82">{EVENT.teaserSubline}</p>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
