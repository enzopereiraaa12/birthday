"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart, MessageCircle, Sparkles, Star, X } from "lucide-react";
import { useEffect, useState } from "react";

const BURST_ICONS = [Heart, Star, Sparkles, Heart, Star, Sparkles];

export default function RetroPopup() {
  const [visible, setVisible] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setVisible(true), 2400);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!clicked) return;
    document.body.classList.add("vip-mode");
    const timeout = window.setTimeout(() => document.body.classList.remove("vip-mode"), 4200);
    return () => {
      window.clearTimeout(timeout);
      document.body.classList.remove("vip-mode");
    };
  }, [clicked]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: clicked ? 1.03 : 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.94 }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm overflow-visible rounded-2xl border border-white/35 bg-white/15 shadow-glossy backdrop-blur-2xl"
        >
          {clicked && (
            <div aria-hidden className="pointer-events-none absolute inset-0 z-20 overflow-visible">
              {BURST_ICONS.map((Icon, index) => {
                const angle = (index / BURST_ICONS.length) * Math.PI * 2;
                const distance = 42;
                return (
                  <motion.span
                    key={index}
                    initial={{ opacity: 1, x: "50%", y: "50%", scale: 0.4 }}
                    animate={{
                      opacity: 0,
                      x: `calc(50% + ${Math.cos(angle) * distance}px)`,
                      y: `calc(50% + ${Math.sin(angle) * distance}px)`,
                      scale: 1,
                      rotate: index % 2 === 0 ? 40 : -40
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute left-0 top-0 text-pink-100 drop-shadow-[0_0_10px_rgba(255,105,180,.9)]"
                  >
                    <Icon size={16} fill="currentColor" />
                  </motion.span>
                );
              })}
              <motion.div
                initial={{ opacity: 0.3 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 rounded-2xl bg-white"
              />
            </div>
          )}

          <div className="relative z-10 flex items-center justify-between border-b border-white/18 bg-pink-300/25 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em] text-white">
              <span className="relative grid h-6 w-6 place-items-center rounded-full border border-white/50 bg-gradient-to-br from-pink-200 to-fuchsia-500 text-[10px] font-black text-white">
                E
                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-white bg-emerald-400" />
              </span>
              <MessageCircle size={16} />
              Enzo Messenger
            </div>
            <button type="button" onClick={() => setVisible(false)} aria-label="Fermer" className="rounded-full p-1 text-white/80">
              <X size={18} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setClicked(true)}
            className="relative z-10 block w-full overflow-hidden p-4 text-left transition active:scale-[.99]"
          >
            {clicked && (
              <motion.div
                initial={{ x: "-120%" }}
                animate={{ x: "120%" }}
                transition={{ duration: 0.9 }}
                className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/35 to-transparent"
              />
            )}
            <p className="flex items-center gap-2 text-sm font-semibold text-pink-50">
              {clicked ? (
                <>
                  <Sparkles size={17} />
                  VIP mood unlocked. Pink mode activé.
                </>
              ) : (
                "Enzo vient de se connecter. Clique pour débloquer le mood."
              )}
            </p>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
