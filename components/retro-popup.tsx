"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function RetroPopup() {
  const [visible, setVisible] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setVisible(true), 2400);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.94 }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm overflow-hidden rounded-2xl border border-white/35 bg-white/15 shadow-glossy backdrop-blur-2xl"
        >
          <div className="flex items-center justify-between border-b border-white/18 bg-pink-300/20 px-4 py-3">
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
            className="block w-full p-4 text-left transition active:scale-[.99]"
          >
            <p className="text-sm font-semibold text-pink-50">
              {clicked ? "Easter egg unlocked: birthday royalty mode active." : "Enzo vient de se connecter. Clique pour débloquer le mood."}
            </p>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
