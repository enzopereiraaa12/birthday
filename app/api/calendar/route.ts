import { NextResponse } from "next/server";
import { buildICS } from "@/lib/calendar";

export async function GET() {
  return new NextResponse(buildICS(), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="enzo-22.ics"'
    }
  });
}
