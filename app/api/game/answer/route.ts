import { NextResponse } from "next/server";
import { QUESTION_DURATION_SECONDS, TRIVIA_QUESTIONS } from "@/lib/game-config";
import { getDuoById, getGameState, getPlayerById, recordAnswer } from "@/lib/game-store";

export async function POST(request: Request) {
  const { playerId, questionIndex, optionIndex } = await request.json().catch(() => ({}));

  if (typeof playerId !== "string" || typeof questionIndex !== "number" || typeof optionIndex !== "number") {
    return NextResponse.json({ ok: false, message: "Requête invalide." }, { status: 400 });
  }

  const player = await getPlayerById(playerId);
  if (!player || !player.duoId) {
    return NextResponse.json({ ok: false, message: "Binôme introuvable." }, { status: 404 });
  }

  const state = await getGameState();
  if (state.phase !== "live" || state.currentQuestionIndex !== questionIndex) {
    return NextResponse.json({ ok: false, message: "Cette question n'est plus active." }, { status: 409 });
  }

  const startedAt = state.currentQuestionStartedAt ?? 0;
  if (Date.now() - startedAt > QUESTION_DURATION_SECONDS * 1000 + 2000) {
    return NextResponse.json({ ok: false, message: "Trop tard !" }, { status: 409 });
  }

  const question = TRIVIA_QUESTIONS[questionIndex];
  if (!question) {
    return NextResponse.json({ ok: false, message: "Question invalide." }, { status: 400 });
  }

  const existingDuo = await getDuoById(player.duoId);
  const alreadyAnswered = existingDuo?.answeredQuestionIndexes.includes(questionIndex) ?? false;
  const correct = question.correctIndex === optionIndex;
  const duo = await recordAnswer(player.duoId, questionIndex, correct);

  return NextResponse.json({
    ok: true,
    correct,
    alreadyAnswered,
    correctIndex: question.correctIndex,
    score: duo?.score ?? 0
  });
}
