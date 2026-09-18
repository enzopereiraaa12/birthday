"use client";

import { motion } from "framer-motion";
import { Ticket } from "lucide-react";

export default function ReserveBar() {
  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center border-b border-white/25 bg-[linear-gradient(90deg,#ff0f9c,#c400ff,#ff0f9c)] px-4 shadow-[0_10px_40px_rgba(255,20,160,.4)] backdrop-blur-xl"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <a
        href="#rsvp"
        className="flex h-12 items-center gap-2 font-display text-xs font-black uppercase tracking-[0.14em] text-white transition active:scale-95 sm:text-sm"
      >
        <Ticket size={16} className="shrink-0" />
        Réserve ta place
      </a>
    </motion.div>
  );
}
