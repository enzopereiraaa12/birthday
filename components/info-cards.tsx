import { CalendarDays, Clock, MapPin, Shirt, Sparkles } from "lucide-react";
import { EVENT } from "@/lib/event-config";
import SectionReveal from "./section-reveal";

const cards = [
  { icon: CalendarDays, label: "Date", value: EVENT.dateLabel },
  { icon: Clock, label: "Heure", value: EVENT.time },
  { icon: MapPin, label: "Lieu", value: EVENT.location },
  { icon: Shirt, label: "Dress code", value: EVENT.dressCode },
  { icon: Sparkles, label: "Theme", value: EVENT.theme }
];

export default function InfoCards() {
  return (
    <SectionReveal className="relative z-20 px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7">
          <p className="font-display text-xs uppercase tracking-[0.28em] text-pink-200">the details</p>
          <h2 className="mt-2 font-display text-3xl font-black uppercase text-white sm:text-5xl">
            Night coordinates
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map(({ icon: Icon, label, value }) => (
            <article key={label} className="glass rounded-[1.6rem] p-5 transition hover:-translate-y-1 hover:border-pink-100/45">
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-pink-300/18 text-pink-100">
                <Icon size={22} />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-200/80">{label}</p>
              <p className="mt-2 text-lg font-bold leading-snug text-white">{value}</p>
            </article>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
}
