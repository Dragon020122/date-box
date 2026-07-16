export type GameStep =
  | "welcome"
  | "mood"
  | "preferences"
  | "player-a-quiz"
  | "handoff"
  | "player-b-quiz"
  | "compatibility"
  | "mystery-box"
  | "plan"
  | "active-date"
  | "memory";

export type MoodId =
  | "healing"
  | "romantic"
  | "playful"
  | "conversation"
  | "adventure"
  | "random";

export type TimeId = "two-hours" | "afternoon" | "whole-evening";
export type BudgetId = "simple" | "refined" | "special";
export type DistanceId = "nearby" | "thirty-minutes" | "farther";
export type RelationshipId =
  | "first-date"
  | "ambiguous"
  | "stable"
  | "long-term";

export interface DatePreferences {
  mood: MoodId | null;
  time: TimeId | null;
  budget: BudgetId | null;
  distance: DistanceId | null;
  relationship: RelationshipId | null;
}

export interface QuizOption {
  id: string;
  label: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export interface DatePlanStep {
  id: string;
  time: string;
  title: string;
  description: string;
  task?: string;
  icon: string;
}

export interface DatePlan {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  summary: string;
  tags: string[];
  moods: MoodId[];
  times: TimeId[];
  budgets: BudgetId[];
  distances: DistanceId[];
  relationships: RelationshipId[];
  characteristics: string[];
  steps: DatePlanStep[];
  secretTask: string;
  endingQuote: string;
}

export interface CompatibilityResult {
  rawScore: number;
  displayScore: number;
  matchedCount: number;
  sharedInsights: string[];
  complementaryInsights: string[];
  planSuggestion: string;
  title: string;
  description: string;
}

export interface DateGameState {
  step: GameStep;
  preferences: DatePreferences;
  playerAAnswers: string[];
  playerBAnswers: string[];
  compatibility: CompatibilityResult | null;
  selectedPlanId: string | null;
  seenPlanIds: string[];
  planChangeCount: number;
  completedStepIds: string[];
  skippedStepIds: string[];
  favoriteMoment: string;
  messageToPartner: string;
  updatedAt: number;
}

export const DATE_GAME_STORAGE_KEY = "date-box-game-state-v1";

export function createInitialDateGameState(): DateGameState {
  return {
    step: "welcome",
    preferences: {
      mood: null,
      time: null,
      budget: null,
      distance: null,
      relationship: null,
    },
    playerAAnswers: [],
    playerBAnswers: [],
    compatibility: null,
    selectedPlanId: null,
    seenPlanIds: [],
    planChangeCount: 0,
    completedStepIds: [],
    skippedStepIds: [],
    favoriteMoment: "",
    messageToPartner: "",
    updatedAt: Date.now(),
  };
}
