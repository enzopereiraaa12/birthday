export type Player = {
  id: string;
  firstName: string;
  normalizedName: string;
  passwordHash: string;
  profileAnswers: number[] | null;
  duoId: string | null;
  createdAt: string;
};

export type Duo = {
  id: string;
  memberIds: string[];
  memberNames: string[];
  score: number;
  answeredQuestionIndexes: number[];
};

export type GamePhase = "profiling" | "matched_pending" | "matched" | "live" | "ended";

export type GameState = {
  phase: GamePhase;
  currentQuestionIndex: number;
  currentQuestionStartedAt: number | null;
};

export const DEFAULT_GAME_STATE: GameState = {
  phase: "profiling",
  currentQuestionIndex: -1,
  currentQuestionStartedAt: null
};
