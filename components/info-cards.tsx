import { CalendarDays, Clock, MapPin, Shirt, Sparkles } from "lucide-react";
import { EVENT } from "@/lib/event-config";
import SectionReveal from "./section-reveal";

const cards = [
  { icon: CalendarDays, label: "Date", value: EVENT.dateLabel, tag: "001", sticker: "save it" },
  { icon: Clock, label: "Heure", value: EVENT.time, tag: "002", sticker: "don't be late" },
  { icon: MapPin, label: "Lieu", value: EVENT.location, tag: "003", sticker: "Amiens" },
  { icon: Shirt, label: "Dress code", value: EVENT.dressCode, tag: "004", sticker: "pink only" },
  { icon: Sparkles, label: "Theme", value: EVENT.theme, tag: "005", sticker: "2000 baby" }
];

export default function InfoCards() {
  return (
    <SectionReveal className="relative z-20 px-5 py-14 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.32em] text-pink-200">the details</p>
            <h2 className="chrome-text mt-2 max-w-[9ch] font-display text-5xl font-black uppercase leading-[0.9] sm:max-w-none sm:text-7xl">
              Night coordinates
            </h2>
          </div>
          <div className="hidden rotate-6 rounded-full border border-pink-100/35 bg-pink-300/20 px-5 py-3 font-display text-sm uppercase tracking-[0.2em] text-pink-50 shadow-chrome backdrop-blur-xl sm:block">
            VIP file
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map(({ icon: Icon, label, value, tag, sticker }, index) => (
            <article
              key={label}
              className="group relative min-h-44 overflow-hidden rounded-[1.4rem] border border-white/25 bg-[linear-gradient(145deg,rgba(255,255,255,.24),rgba(255,105,180,.18)_42%,rgba(28,7,18,.72))] p-5 shadow-[0_22px_70px_rgba(255,105,180,.20)] backdrop-blur-2xl transition hover:-translate-y-1 hover:rotate-0"
              style={{ transform: `rotate(${index % 2 === 0 ? "-1.2deg" : "1.2deg"})` }}
            >
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border border-white/20 bg-pink-200/15 blur-sm" />
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-70" />
              <div className="absolute right-4 top-4 rounded-full border border-white/25 bg-black/25 px-3 py-1 font-display text-[10px] uppercase tracking-[0.16em] text-pink-100">
                #{tag}
              </div>

              <div className="mb-6 grid h-13 w-13 place-items-center rounded-2xl border border-white/30 bg-white/16 text-pink-50 shadow-chrome">
                <Icon size={23} />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-pink-200">{label}</p>
              <p className="mt-2 text-xl font-black leading-tight text-white">{value}</p>

              <div className="absolute bottom-4 right-4 -rotate-6 rounded-lg border border-pink-100/30 bg-white px-2.5 py-1 font-display text-[10px] uppercase tracking-[0.12em] text-pink-700 shadow-lg">
                {sticker}
              </div>
            </article>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
}
