"use client";

import { CalendarPlus } from "lucide-react";
import { googleCalendarUrl } from "@/lib/calendar";

export default function AddToCalendar() {
  return (
    <div className="mt-7 flex flex-wrap items-center gap-4">
      <a
        href="/api/calendar"
        className="holo-sweep is-active glossy-button inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-black uppercase tracking-[0.12em] transition active:scale-95"
      >
        <CalendarPlus size={18} />
        Ajouter à mon calendrier
      </a>
      <a
        href={googleCalendarUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="font-display text-xs font-bold uppercase tracking-[0.14em] text-pink-100/75 underline underline-offset-4"
      >
        ou via Google Calendar
      </a>
    </div>
  );
}
