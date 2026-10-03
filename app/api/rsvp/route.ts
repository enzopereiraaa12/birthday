import { NextResponse } from "next/server";
import { sendRSVPEmail } from "@/lib/email";
import { rsvpSchema, type RSVPRecord } from "@/lib/rsvp-schema";
import { saveRSVP } from "@/lib/rsvp-store";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const result = rsvpSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { ok: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { honeypot, ...data } = result.data;
    if (honeypot) {
      return NextResponse.json({ ok: true });
    }

    const record: RSVPRecord = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      userAgent: request.headers.get("user-agent") || undefined
    };

    let saved = false;
    try {
      await saveRSVP(record);
      saved = true;
    } catch (error) {
      console.error("saveRSVP failed (read-only filesystem on this host?)", error);
    }

    let emailResult: { data?: unknown; error?: unknown; skipped?: boolean } = {};
    try {
      emailResult = await sendRSVPEmail(record);
    } catch (error) {
      console.error("sendRSVPEmail failed", error);
      emailResult = { error };
    }

    if (!saved && !emailResult.skipped && emailResult.error) {
      return NextResponse.json(
        { ok: false, message: "Impossible d'envoyer le RSVP pour le moment." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, saved, email: emailResult });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, message: "Impossible d'envoyer le RSVP pour le moment." },
      { status: 500 }
    );
  }
}
