import { Resend } from "resend";
import type { RSVPRecord } from "./rsvp-schema";

const labels = {
  attending: {
    yes: "Oui évidemment",
    no: "Non malheureusement"
  },
  plusOne: {
    none: "Non",
    one: "Oui (+1)"
  },
  alcohol: {
    yes: "Oui",
    no: "Non",
    little: "Un peu"
  }
};

export async function sendRSVPEmail(record: RSVPRecord) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { skipped: true };
  }

  const resend = new Resend(apiKey);
  const to = process.env.RSVP_TO_EMAIL || "enzo.pereira60200@gmail.com";
  const from = process.env.RSVP_FROM_EMAIL || "Enzo RSVP <onboarding@resend.dev>";

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;background:#130813;padding:28px;color:#fff">
      <div style="max-width:620px;margin:auto;border:1px solid rgba(255,192,203,.35);border-radius:24px;background:linear-gradient(145deg,rgba(255,105,180,.28),rgba(255,255,255,.08));padding:28px">
        <h1 style="color:#ffc0cb;margin:0 0 12px;font-size:28px">Nouvelle RSVP 💌</h1>
        <p style="margin:0 0 22px;color:#f8d8e8">Anniversaire 22 ans - 12 novembre</p>
        <table style="width:100%;border-collapse:collapse">
          ${row("Prénom", record.firstName)}
          ${row("Présence", labels.attending[record.attending])}
          ${row("+1", labels.plusOne[record.plusOne])}
          ${row("Accompagnant", record.plusOneName || "-")}
          ${row("Alcool", labels.alcohol[record.alcohol])}
          ${row("Allergies / restrictions", record.allergies || "-")}
          ${row("Message", record.message || "-")}
          ${row("Envoyé le", new Date(record.createdAt).toLocaleString("fr-FR"))}
        </table>
      </div>
    </div>
  `;

  return resend.emails.send({
    from,
    to,
    subject: `Nouvelle RSVP anniversaire 22 ans - ${record.firstName}`,
    html
  });
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:13px 10px;border-top:1px solid rgba(255,255,255,.14);color:#ffc0cb;font-weight:700;width:38%;vertical-align:top">${label}</td>
      <td style="padding:13px 10px;border-top:1px solid rgba(255,255,255,.14);color:#fff;white-space:pre-wrap">${escapeHtml(value)}</td>
    </tr>
  `;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
