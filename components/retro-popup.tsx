"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

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
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm overflow-hidden rounded-2xl border border-white/35 bg-white/15 shadow-glossy backdrop-blur-2xl"
        >
          <div className="flex items-center justify-between border-b border-white/18 bg-pink-300/25 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em] text-white">
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
            className="relative block w-full overflow-hidden p-4 text-left transition active:scale-[.99]"
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
