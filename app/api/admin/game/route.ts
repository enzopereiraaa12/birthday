import { NextResponse } from "next/server";
import { TRIVIA_QUESTIONS } from "@/lib/game-config";
import {
  getDuos,
  getGameState,
  listPlayers,
  resetGame,
  saveDuos,
  setGameState,
  updatePlayer
} from "@/lib/game-store";
import type { Duo } from "@/lib/game-schema";
import { proposeMatching } from "@/lib/matching";

async function snapshot() {
  const state = await getGameState();
  const players = await listPlayers();
  const duos = await getDuos();

  return {
    state,
    players: players.map((player) => ({
      id: player.id,
      firstName: player.firstName,
      hasProfile: Array.isArray(player.profileAnswers),
      profileAnswers: player.profileAnswers,
      duoId: player.duoId
    })),
    duos: duos
      .map((duo) => ({ id: duo.id, memberIds: duo.memberIds, memberNames: duo.memberNames, score: duo.score }))
      .sort((a, b) => b.score - a.score)
  };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { password, action } = body;
  const expected = process.env.ADMIN_PASSWORD || "change-me";

  if (!password || password !== expected) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  if (action === "match") {
    const players = await listPlayers();
    const proposed = proposeMatching(players);
    const duos: Duo[] = proposed.map((duo) => ({
      id: duo.id,
      memberIds: duo.memberIds,
      memberNames: duo.memberNames,
      score: 0,
      answeredQuestionIndexes: []
    }));
    await saveDuos(duos);
    await setGameState({ phase: "matched_pending" });
  }

  if (action === "setDuos") {
    const { duos: incoming } = body as { duos?: Array<{ id?: string; memberIds: string[] }> };
    if (Array.isArray(incoming)) {
      const players = await listPlayers();
      const duos: Duo[] = incoming.map((entry) => ({
        id: entry.id || crypto.randomUUID(),
        memberIds: entry.memberIds,
        memberNames: entry.memberIds.map((id) => players.find((p) => p.id === id)?.firstName || "?"),
        score: 0,
        answeredQuestionIndexes: []
      }));
      await saveDuos(duos);
    }
  }

  if (action === "validate") {
    await setGameState({ phase: "matched" });
  }

  if (action === "startLive") {
    await setGameState({ phase: "live", currentQuestionIndex: 0, currentQuestionStartedAt: Date.now() });
  }

  if (action === "nextQuestion") {
    const state = await getGameState();
    const nextIndex = state.currentQuestionIndex + 1;
    if (nextIndex >= TRIVIA_QUESTIONS.length) {
      await setGameState({ phase: "ended" });
    } else {
      await setGameState({ currentQuestionIndex: nextIndex, currentQuestionStartedAt: Date.now() });
    }
  }

  if (action === "end") {
    await setGameState({ phase: "ended" });
  }

  if (action === "reset") {
    await resetGame();
  }

  if (action === "updatePlayer") {
    const { playerId, firstName, profileAnswers } = body as {
      playerId?: string;
      firstName?: string;
      profileAnswers?: number[];
    };
    if (typeof playerId === "string") {
      await updatePlayer(playerId, { firstName, profileAnswers });
    }
  }

  return NextResponse.json({ ok: true, ...(await snapshot()) });
}
