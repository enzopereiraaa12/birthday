import { Sparkles } from "lucide-react";

export default function QuizTab() {
  return (
    <a
      href="/quiz"
      className="fixed bottom-20 right-4 z-50 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 bg-black/35 px-4 text-xs font-black uppercase tracking-[0.16em] text-pink-100 shadow-chrome backdrop-blur-xl transition active:scale-95"
      aria-label="Ouvrir le quiz de goûts"
    >
      <Sparkles size={15} />
      Quiz
    </a>
  );
}
