"use client";

import { useEffect } from "react";

const ornaments = ["✦", "♡", "✧", "♥", "✶", "✦", "♡", "★", "✦", "♥", "✧", "✶"];

const stickers = [
  { label: "22", left: "6%", top: "22%", rot: -10 },
  { label: "VIP", left: "88%", top: "14%", rot: 8 },
  { label: "★", left: "92%", top: "48%", rot: -6 },
  { label: "PINK", left: "4%", top: "62%", rot: 7 },
  { label: "♥", left: "82%", top: "78%", rot: -12 }
];

export default function FloatingFX() {
  useEffect(() => {
    let last = 0;
    const onPointerMove = (event: PointerEvent) => {
      const now = Date.now();
      if (now - last < 85) return;
      last = now;
      const sparkle = document.createElement("span");
      sparkle.className = "sparkle-cursor";
      sparkle.style.left = `${event.clientX}px`;
      sparkle.style.top = `${event.clientY}px`;
      document.body.appendChild(sparkle);
      window.setTimeout(() => sparkle.remove(), 700);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {ornaments.map((ornament, index) => (
        <span
          key={`${ornament}-${index}`}
          className="absolute animate-floaty text-pink-100/85 drop-shadow-[0_0_18px_rgba(255,20,160,1)]"
          style={{
            left: `${4 + index * 8.2}%`,
            top: `${8 + (index % 5) * 17}%`,
            animationDelay: `${index * 0.5}s`,
            animationDuration: `${4 + (index % 3)}s`,
            fontSize: `${20 + (index % 4) * 10}px`
          }}
        >
          {ornament}
        </span>
      ))}

      {stickers.map((sticker) => (
        <span
          key={sticker.label}
          className="sticker-badge absolute grid place-items-center px-3 py-1.5 font-display text-[10px] font-black uppercase tracking-[0.1em] text-white/95"
          style={{ left: sticker.left, top: sticker.top, ["--jitter-rot" as string]: `${sticker.rot}deg` }}
        >
          {sticker.label}
        </span>
      ))}
    </div>
  );
}
