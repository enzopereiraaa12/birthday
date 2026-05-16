import { LockKeyhole } from "lucide-react";

export default function AdminTab() {
  return (
    <a
      href="/admin"
      className="fixed bottom-4 left-4 z-50 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 bg-black/35 px-4 text-xs font-black uppercase tracking-[0.16em] text-pink-100 shadow-chrome backdrop-blur-xl transition active:scale-95"
      aria-label="Ouvrir l'admin RSVP"
    >
      <LockKeyhole size={15} />
      Admin
    </a>
  );
}
