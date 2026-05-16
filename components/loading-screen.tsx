"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setVisible(false), 1400);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(14px)" }}
          transition={{ duration: 0.55 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-[#130813]"
        >
          <motion.div
            initial={{ scale: 0.82, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="mx-auto mb-5 grid h-24 w-24 place-items-center rounded-[2rem] border border-white/35 bg-pink-300/20 shadow-glossy backdrop-blur-2xl">
              <span className="text-4xl">22</span>
            </div>
            <p className="font-display text-xl uppercase tracking-[0.25em] text-pink-100">
              loading iconic mode
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
