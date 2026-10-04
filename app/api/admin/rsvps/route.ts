import { NextResponse } from "next/server";
import { deleteRSVP, getRSVPs, updateRSVP } from "@/lib/rsvp-store";
import type { RSVPRecord } from "@/lib/rsvp-schema";

export async function POST(request: Request) {
  const { password, action, id, patch } = await request.json().catch(() => ({ password: "" }));
  const expected = process.env.ADMIN_PASSWORD || "change-me";

  if (!password || password !== expected) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  if (action === "delete") {
    if (!id || typeof id !== "string") {
      return NextResponse.json({ ok: false, message: "Missing RSVP id" }, { status: 400 });
    }
    await deleteRSVP(id);
  }

  if (action === "edit") {
    if (!id || typeof id !== "string" || !patch || typeof patch !== "object") {
      return NextResponse.json({ ok: false, message: "Missing id or patch" }, { status: 400 });
    }
    const allowedKeys: Array<keyof RSVPRecord> = [
      "firstName",
      "attending",
      "plusOne",
      "plusOneName",
      "allergies",
      "alcohol",
      "message"
    ];
    const safePatch: Partial<RSVPRecord> = {};
    for (const key of allowedKeys) {
      if (key in patch) {
        (safePatch as Record<string, unknown>)[key] =
          typeof patch[key] === "string" ? patch[key].trim() : patch[key];
      }
    }
    const updated = await updateRSVP(id, safePatch);
    if (!updated) {
      return NextResponse.json({ ok: false, message: "RSVP introuvable" }, { status: 404 });
    }
  }

  const rsvps = await getRSVPs();
  return NextResponse.json({
    ok: true,
    rsvps,
    emailConfigured: Boolean(process.env.RESEND_API_KEY),
    recipient: process.env.RSVP_TO_EMAIL || "enzo.pereira60200@gmail.com"
  });
}
