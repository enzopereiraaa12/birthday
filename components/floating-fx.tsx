"use client";

import { useEffect } from "react";

const ornaments = ["✦", "♡", "✧", "♥", "✶", "✦", "♡"];

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
          className="absolute animate-floaty text-pink-100/70 drop-shadow-[0_0_14px_rgba(255,105,180,.9)]"
          style={{
            left: `${8 + index * 14}%`,
            top: `${10 + (index % 4) * 18}%`,
            animationDelay: `${index * 0.62}s`,
            fontSize: `${18 + (index % 3) * 8}px`
          }}
        >
          {ornament}
        </span>
      ))}
    </div>
  );
}
