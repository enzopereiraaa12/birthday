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
            <h2
              data-text="Night coordinates"
              className="rgb-split chrome-text mt-2 max-w-[9ch] font-display text-6xl font-black uppercase leading-[0.88] sm:max-w-none sm:text-8xl"
            >
              Night coordinates
            </h2>
          </div>
          <div className="hidden rotate-6 rounded-full border border-pink-100/40 bg-pink-300/25 px-5 py-3 font-display text-sm uppercase tracking-[0.2em] text-pink-50 shadow-[0_10px_36px_rgba(255,20,160,.4)] backdrop-blur-xl sm:block">
            VIP file
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map(({ icon: Icon, label, value, tag, sticker }, index) => (
            <article
              key={label}
              className="holo-sweep group relative flex min-h-56 overflow-hidden rounded-[1.4rem] border border-white/30 bg-[linear-gradient(145deg,rgba(255,255,255,.28),rgba(255,20,160,.26)_42%,rgba(28,7,18,.76))] shadow-[0_26px_80px_rgba(255,20,160,.3)] backdrop-blur-2xl transition hover:-translate-y-1.5 hover:rotate-0 hover:scale-[1.02]"
              style={{ transform: `rotate(${index % 2 === 0 ? "-2.4deg" : "2.4deg"})` }}
            >
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border border-white/20 bg-pink-200/15 blur-sm" />
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-70" />

              {/* main stub */}
              <div className="relative flex flex-1 flex-col p-5 pb-4">
                <div className="mb-6 flex items-start justify-between gap-2">
                  <div className="grid h-13 w-13 place-items-center rounded-2xl border border-white/30 bg-white/16 text-pink-50 shadow-chrome">
                    <Icon size={23} />
                  </div>
                  <div className="-rotate-6 rounded-lg border border-pink-100/30 bg-white px-2.5 py-1 font-display text-[10px] uppercase tracking-[0.12em] text-pink-700 shadow-lg">
                    {sticker}
                  </div>
                </div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-pink-200">{label}</p>
                <p className="mt-2 text-xl font-black leading-tight text-white">{value}</p>

                <div className="mt-auto pt-4">
                  <div className="barcode h-5 w-full rounded-[2px] opacity-90" />
                </div>
              </div>

              {/* perforated ticket stub */}
              <div className="relative flex w-11 shrink-0 flex-col items-center justify-between border-l border-dashed border-white/30 py-3">
                <div className="hole-punch -mt-3 h-3 w-3 shrink-0" />
                <p className="my-2 flex-1 [writing-mode:vertical-rl] font-display text-[10px] font-black uppercase tracking-[0.2em] text-pink-100/90">
                  admit one · #{tag}
                </p>
                <div className="hole-punch -mb-3 h-3 w-3 shrink-0" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
}
