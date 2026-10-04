import { Trophy } from "lucide-react";

export default function JeuTab() {
  return (
    <a
      href="/jeu"
      className="fixed bottom-4 right-4 z-50 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 bg-black/35 px-4 text-xs font-black uppercase tracking-[0.16em] text-pink-100 shadow-chrome backdrop-blur-xl transition active:scale-95"
      aria-label="Ouvrir le jeu"
    >
      <Trophy size={15} />
      Jeu
    </a>
  );
}
