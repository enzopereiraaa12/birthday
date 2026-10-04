import { NextResponse } from "next/server";
import { PROFILE_QUESTIONS } from "@/lib/game-config";
import { getPlayerById, savePlayer } from "@/lib/game-store";

export async function POST(request: Request) {
  const { playerId, answers } = await request.json().catch(() => ({}));

  if (typeof playerId !== "string" || !Array.isArray(answers) || answers.length !== PROFILE_QUESTIONS.length) {
    return NextResponse.json({ ok: false, message: "Réponses invalides." }, { status: 400 });
  }
  if (answers.some((value) => typeof value !== "number" || value < 0 || value > 3)) {
    return NextResponse.json({ ok: false, message: "Réponses invalides." }, { status: 400 });
  }

  const player = await getPlayerById(playerId);
  if (!player) {
    return NextResponse.json({ ok: false, message: "Joueur introuvable." }, { status: 404 });
  }

  player.profileAnswers = answers;
  await savePlayer(player);

  return NextResponse.json({ ok: true });
}
