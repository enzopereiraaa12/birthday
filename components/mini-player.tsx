"use client";

import { motion } from "framer-motion";
import { Music2 } from "lucide-react";
import { PLAYLIST_EMBED_SRC } from "@/lib/event-config";

export default function MiniPlayer() {
  if (!PLAYLIST_EMBED_SRC) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.05 }}
      className="glass mb-6 flex items-center gap-3 rounded-2xl p-2.5"
    >
      <div className="hidden shrink-0 items-center gap-1.5 pl-1.5 font-display text-[10px] font-black uppercase tracking-[0.14em] text-pink-100 sm:flex">
        <Music2 size={14} />
        lance le son
      </div>
      <iframe
        src={PLAYLIST_EMBED_SRC}
        className="h-[80px] w-full rounded-xl"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        title="Playlist d'anniversaire d'Enzo"
      />
    </motion.div>
  );
}
