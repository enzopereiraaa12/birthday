import { NextResponse } from "next/server";
import { getPlayerByName, savePlayer } from "@/lib/game-store";
import type { Player } from "@/lib/game-schema";
import { normalizeFirstName } from "@/lib/game-utils";
import { hashPassword } from "@/lib/password";

export async function POST(request: Request) {
  const { firstName, password } = await request.json().catch(() => ({ firstName: "", password: "" }));

  if (typeof firstName !== "string" || firstName.trim().length < 2) {
    return NextResponse.json({ ok: false, message: "Prénom invalide." }, { status: 400 });
  }
  if (typeof password !== "string" || password.length < 3) {
    return NextResponse.json({ ok: false, message: "Mot de passe invalide." }, { status: 400 });
  }

  const normalizedName = normalizeFirstName(firstName);
  const passwordHash = hashPassword(password);
  const existing = await getPlayerByName(normalizedName);

  if (existing) {
    if (existing.passwordHash !== passwordHash) {
      return NextResponse.json(
        { ok: false, message: "Ce prénom existe déjà avec un autre mot de passe." },
        { status: 401 }
      );
    }
    return NextResponse.json({ ok: true, playerId: existing.id, firstName: existing.firstName, isNew: false });
  }

  const player: Player = {
    id: crypto.randomUUID(),
    firstName: firstName.trim(),
    normalizedName,
    passwordHash,
    profileAnswers: null,
    duoId: null,
    createdAt: new Date().toISOString()
  };
  await savePlayer(player);

  return NextResponse.json({ ok: true, playerId: player.id, firstName: player.firstName, isNew: true });
}
