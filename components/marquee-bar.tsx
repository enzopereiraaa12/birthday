const DEFAULT_ITEMS = [
  "ENZO 22",
  "NOVEMBER 12",
  "PINK ONLY",
  "AMIENS 19H30",
  "GLOSS UP",
  "CAMERA FLASH READY",
  "NO BASIC ENERGY",
  "ONE NIGHT ONLY"
];

export default function MarqueeBar({
  items = DEFAULT_ITEMS,
  reverse = false
}: {
  items?: string[];
  reverse?: boolean;
}) {
  const content = items.join("  ★  ") + "  ★  ";

  return (
    <div className="relative z-20 -my-1 -rotate-1 overflow-hidden border-y-2 border-white/40 bg-[linear-gradient(90deg,#ff0f9c,#ffa8dc,#c400ff,#ff0f9c)] py-3 shadow-[0_0_60px_rgba(255,20,160,.6)]">
      <div className={`flex w-max whitespace-nowrap ${reverse ? "marquee-track-reverse" : "marquee-track"}`}>
        <span className="px-4 font-display text-lg font-black uppercase tracking-[0.14em] text-white [text-shadow:0_2px_0_rgba(0,0,0,.35),0_0_18px_rgba(255,255,255,.6)] sm:text-xl">
          {content}
        </span>
        <span aria-hidden className="px-4 font-display text-lg font-black uppercase tracking-[0.14em] text-white [text-shadow:0_2px_0_rgba(0,0,0,.35),0_0_18px_rgba(255,255,255,.6)] sm:text-xl">
          {content}
        </span>
      </div>
    </div>
  );
}
