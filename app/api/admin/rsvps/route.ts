import { NextResponse } from "next/server";
import { deleteRSVP, getRSVPs } from "@/lib/rsvp-store";

export async function POST(request: Request) {
  const { password, action, id } = await request.json().catch(() => ({ password: "" }));
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

  const rsvps = await getRSVPs();
  return NextResponse.json({
    ok: true,
    rsvps,
    emailConfigured: Boolean(process.env.RESEND_API_KEY),
    recipient: process.env.RSVP_TO_EMAIL || "enzo.pereira60200@gmail.com"
  });
}
