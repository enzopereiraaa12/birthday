import type { Player } from "./game-schema";

export type ProposedDuo = {
  id: string;
  memberIds: string[];
  memberNames: string[];
  similarity: number;
};

function similarity(a: Player, b: Player) {
  if (!a.profileAnswers || !b.profileAnswers) return 0;
  let score = 0;
  for (let i = 0; i < a.profileAnswers.length; i += 1) {
    if (a.profileAnswers[i] === b.profileAnswers[i]) score += 1;
  }
  return score;
}

export function proposeMatching(allPlayers: Player[]): ProposedDuo[] {
  const players = allPlayers.filter((player) => Array.isArray(player.profileAnswers));
  const remaining = new Set(players.map((player) => player.id));
  const byId = new Map(players.map((player) => [player.id, player]));

  const pairs: Array<{ a: Player; b: Player; score: number }> = [];
  for (let i = 0; i < players.length; i += 1) {
    for (let j = i + 1; j < players.length; j += 1) {
      pairs.push({ a: players[i], b: players[j], score: similarity(players[i], players[j]) });
    }
  }
  pairs.sort((x, y) => y.score - x.score);

  const duos: ProposedDuo[] = [];
  for (const pair of pairs) {
    if (remaining.has(pair.a.id) && remaining.has(pair.b.id)) {
      remaining.delete(pair.a.id);
      remaining.delete(pair.b.id);
      duos.push({
        id: crypto.randomUUID(),
        memberIds: [pair.a.id, pair.b.id],
        memberNames: [pair.a.firstName, pair.b.firstName],
        similarity: pair.score
      });
    }
  }

  if (remaining.size === 1) {
    const leftoverId = Array.from(remaining)[0];
    const leftover = byId.get(leftoverId)!;
    let bestDuo: ProposedDuo | null = null;
    let bestScore = -1;
    for (const duo of duos) {
      const total = duo.memberIds.reduce((sum, id) => sum + similarity(leftover, byId.get(id)!), 0);
      if (total > bestScore) {
        bestScore = total;
        bestDuo = duo;
      }
    }
    if (bestDuo) {
      bestDuo.memberIds.push(leftover.id);
      bestDuo.memberNames.push(leftover.firstName);
    } else {
      duos.push({ id: crypto.randomUUID(), memberIds: [leftover.id], memberNames: [leftover.firstName], similarity: 0 });
    }
  }

  return duos;
}
