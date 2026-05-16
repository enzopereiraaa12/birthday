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

    await saveRSVP(record);
    const emailResult = await sendRSVPEmail(record);

    return NextResponse.json({ ok: true, email: emailResult });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, message: "Impossible d'envoyer le RSVP pour le moment." },
      { status: 500 }
    );
  }
}
