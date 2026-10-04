import { EVENT } from "./event-config";

const EVENT_DETAILS = "Enzo's birthday, Y2K, 2000s";

function formatICSDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function escapeICS(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
}

function getStartAndEnd() {
  const start = new Date(EVENT.targetDate);
  const datePart = EVENT.targetDate.split("T")[0];
  const end = new Date(`${datePart}T23:59:00+01:00`);
  return { start, end };
}

export function buildICS() {
  const { start, end } = getStartAndEnd();

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
    `DESCRIPTION:${escapeICS(EVENT_DETAILS)}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ];

  return lines.join("\r\n");
}

export function googleCalendarUrl() {
  const { start, end } = getStartAndEnd();

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${EVENT.birthdayBoy} turns 22`,
    dates: `${formatICSDate(start)}/${formatICSDate(end)}`,
    location: EVENT.location,
    details: EVENT_DETAILS
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
