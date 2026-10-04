import { promises as fs } from "fs";
import path from "path";
import { normalizeFirstName } from "./game-utils";
import { getRedis } from "./redis";
import { DEFAULT_GAME_STATE, type Duo, type GameState, type Player } from "./game-schema";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "game.json");

const KEY_PLAYERS = "game_players";
const KEY_DUOS = "game_duos";
const KEY_STATE = "game_state";

type LocalShape = {
  players: Record<string, Player>;
  duos: Record<string, Duo>;
  state: GameState;
};

async function readLocal(): Promise<LocalShape> {
  try {
    const file = await fs.readFile(dataFile, "utf8");
    const parsed = JSON.parse(file) as Partial<LocalShape>;
    return {
      players: parsed.players || {},
      duos: parsed.duos || {},
      state: parsed.state || DEFAULT_GAME_STATE
    };
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return { players: {}, duos: {}, state: DEFAULT_GAME_STATE };
    throw error;
  }
}

async function writeLocal(data: LocalShape) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2), "utf8");
}

async function getPlayersMap(): Promise<Record<string, Player>> {
  const redis = getRedis();
  if (redis) {
    const raw = await redis.get<string>(KEY_PLAYERS);
    return raw ? (typeof raw === "string" ? JSON.parse(raw) : raw) : {};
  }
  return (await readLocal()).players;
}

async function setPlayersMap(players: Record<string, Player>) {
  const redis = getRedis();
  if (redis) {
    await redis.set(KEY_PLAYERS, JSON.stringify(players));
    return;
  }
  const local = await readLocal();
  await writeLocal({ ...local, players });
}

async function getDuosMap(): Promise<Record<string, Duo>> {
  const redis = getRedis();
  if (redis) {
    const raw = await redis.get<string>(KEY_DUOS);
    return raw ? (typeof raw === "string" ? JSON.parse(raw) : raw) : {};
  }
  return (await readLocal()).duos;
}

async function setDuosMap(duos: Record<string, Duo>) {
  const redis = getRedis();
  if (redis) {
    await redis.set(KEY_DUOS, JSON.stringify(duos));
    return;
  }
  const local = await readLocal();
  await writeLocal({ ...local, duos });
}

export async function getGameState(): Promise<GameState> {
  const redis = getRedis();
  if (redis) {
    const raw = await redis.get<string>(KEY_STATE);
    if (!raw) return DEFAULT_GAME_STATE;
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  }
  return (await readLocal()).state;
}

export async function setGameState(patch: Partial<GameState>) {
  const current = await getGameState();
  const next = { ...current, ...patch };
  const redis = getRedis();
  if (redis) {
    await redis.set(KEY_STATE, JSON.stringify(next));
    return next;
  }
  const local = await readLocal();
  await writeLocal({ ...local, state: next });
  return next;
}

export async function getPlayerByName(normalizedName: string): Promise<Player | null> {
  const players = await getPlayersMap();
  return players[normalizedName] || null;
}

export async function getPlayerById(id: string): Promise<Player | null> {
  const players = await getPlayersMap();
  return Object.values(players).find((player) => player.id === id) || null;
}

export async function savePlayer(player: Player) {
  const players = await getPlayersMap();
  players[player.normalizedName] = player;
  await setPlayersMap(players);
}

export async function listPlayers(): Promise<Player[]> {
  const players = await getPlayersMap();
  return Object.values(players);
}

export async function getDuos(): Promise<Duo[]> {
  const duos = await getDuosMap();
  return Object.values(duos);
}

export async function getDuoById(id: string): Promise<Duo | null> {
  const duos = await getDuosMap();
  return duos[id] || null;
}

export async function saveDuos(duos: Duo[]) {
  const duosMap: Record<string, Duo> = {};
  for (const duo of duos) duosMap[duo.id] = duo;
  await setDuosMap(duosMap);

  const players = await getPlayersMap();
  for (const duo of duos) {
    for (const memberId of duo.memberIds) {
      const player = Object.values(players).find((candidate) => candidate.id === memberId);
      if (player) player.duoId = duo.id;
    }
  }
  await setPlayersMap(players);
}

export async function updatePlayer(
  id: string,
  patch: { firstName?: string; profileAnswers?: number[] }
): Promise<Player | null> {
  const players = await getPlayersMap();
  const oldKey = Object.keys(players).find((key) => players[key].id === id);
  if (!oldKey) return null;

  const player = players[oldKey];
  const updated: Player = { ...player };

  if (typeof patch.profileAnswers !== "undefined") {
    updated.profileAnswers = patch.profileAnswers;
  }

  let newKey = oldKey;
  if (patch.firstName && patch.firstName.trim() && patch.firstName.trim() !== player.firstName) {
    updated.firstName = patch.firstName.trim();
    newKey = normalizeFirstName(updated.firstName);
  }

  if (newKey !== oldKey) delete players[oldKey];
  players[newKey] = updated;
  await setPlayersMap(players);

  if (updated.duoId && newKey !== oldKey) {
    const duos = await getDuosMap();
    const duo = duos[updated.duoId];
    if (duo) {
      duo.memberNames = duo.memberNames.map((name) => (name === player.firstName ? updated.firstName : name));
      duos[updated.duoId] = duo;
      await setDuosMap(duos);
    }
  }

  return updated;
}

export async function recordAnswer(duoId: string, questionIndex: number, correct: boolean) {
  const duos = await getDuosMap();
  const duo = duos[duoId];
  if (!duo) return null;
  if (duo.answeredQuestionIndexes.includes(questionIndex)) return duo;

  duo.answeredQuestionIndexes.push(questionIndex);
  if (correct) duo.score += 1;
  duos[duoId] = duo;
  await setDuosMap(duos);
  return duo;
}

export async function resetGame() {
  const redis = getRedis();
  if (redis) {
    await redis.set(KEY_PLAYERS, JSON.stringify({}));
    await redis.set(KEY_DUOS, JSON.stringify({}));
    await redis.set(KEY_STATE, JSON.stringify(DEFAULT_GAME_STATE));
    return;
  }
  await writeLocal({ players: {}, duos: {}, state: DEFAULT_GAME_STATE });
}
