import { NextResponse } from "next/server";
import { QUESTION_DURATION_SECONDS, TRIVIA_QUESTIONS } from "@/lib/game-config";
import { getDuoById, getDuos, getGameState, listPlayers } from "@/lib/game-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const playerId = searchParams.get("playerId");

  const state = await getGameState();
  const players = await listPlayers();
  const duos = await getDuos();

  const leaderboard = duos
    .map((duo) => ({ id: duo.id, memberNames: duo.memberNames, score: duo.score }))
    .sort((a, b) => b.score - a.score);

  let question: { index: number; question: string; options: string[] } | null = null;
  if (
    state.phase === "live" &&
    state.currentQuestionIndex >= 0 &&
    state.currentQuestionIndex < TRIVIA_QUESTIONS.length
  ) {
    const current = TRIVIA_QUESTIONS[state.currentQuestionIndex];
    question = { index: state.currentQuestionIndex, question: current.question, options: current.options };
  }

  let me: { hasProfile: boolean; duo: { partnerNames: string[]; score: number } | null } | null = null;
  let playerFound = false;
  if (playerId) {
    const player = players.find((candidate) => candidate.id === playerId);
    if (player) {
      playerFound = true;
      let duoInfo: { partnerNames: string[]; score: number } | null = null;
      const revealDuo = state.phase === "matched" || state.phase === "live" || state.phase === "ended";
      if (revealDuo && player.duoId) {
        const duo = await getDuoById(player.duoId);
        if (duo) {
          duoInfo = {
            partnerNames: duo.memberNames.filter((name) => name !== player.firstName),
            score: duo.score
          };
        }
      }
      me = { hasProfile: Array.isArray(player.profileAnswers), duo: duoInfo };
    }
  }

  return NextResponse.json({
    ok: true,
    phase: state.phase,
    currentQuestionIndex: state.currentQuestionIndex,
    currentQuestionStartedAt: state.currentQuestionStartedAt,
    questionDurationSeconds: QUESTION_DURATION_SECONDS,
    totalQuestions: TRIVIA_QUESTIONS.length,
    question,
    leaderboard,
    takenNames: players.map((player) => player.firstName),
    me,
    playerFound: playerId ? playerFound : undefined
  });
}
