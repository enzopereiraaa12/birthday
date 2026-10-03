import { EVENT } from "./event-config";

const DURATION_HOURS = 5;

function formatICSDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function escapeICS(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
}

export function buildICS() {
  const start = new Date(EVENT.targetDate);
  const end = new Date(start.getTime() + DURATION_HOURS * 60 * 60 * 1000);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Enzo Birthday//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:enzo-22-${start.getTime()}@enzo-birthday`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART:${formatICSDate(start)}`,
    `DTEND:${formatICSDate(end)}`,
    `SUMMARY:${escapeICS(`${EVENT.birthdayBoy} turns 22`)}`,
    `LOCATION:${escapeICS(EVENT.location)}`,
    `DESCRIPTION:${escapeICS(`Dress code: ${EVENT.dressCode}. ${EVENT.teaserLine}`)}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ];

  return lines.join("\r\n");
}

export function googleCalendarUrl() {
  const start = new Date(EVENT.targetDate);
  const end = new Date(start.getTime() + DURATION_HOURS * 60 * 60 * 1000);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${EVENT.birthdayBoy} turns 22`,
    dates: `${formatICSDate(start)}/${formatICSDate(end)}`,
    location: EVENT.location,
    details: `Dress code: ${EVENT.dressCode}`
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
