import type {
  CompatibilityResult,
  DateGameState,
  DatePlan,
  DatePreferences,
  GameStep,
} from "@/types/date-game";

export const DATE_GAME_STORAGE_VERSION = 1;

export type StoredStateParseResult =
  | { ok: true; value: DateGameState }
  | { ok: false };

const gameSteps = new Set<GameStep>([
  "welcome",
  "mood",
  "preferences",
  "player-a-quiz",
  "handoff",
  "player-b-quiz",
  "compatibility",
  "mystery-box",
  "plan",
  "active-date",
  "memory",
]);
const moodIds = new Set(["healing", "romantic", "playful", "conversation", "adventure", "random"]);
const timeIds = new Set(["two-hours", "afternoon", "whole-evening"]);
const budgetIds = new Set(["simple", "refined", "special"]);
const distanceIds = new Set(["nearby", "thirty-minutes", "farther"]);
const relationshipIds = new Set(["first-date", "ambiguous", "stable", "long-term"]);
const planRequiredSteps = new Set<GameStep>(["plan", "active-date", "memory"]);
const compatibilityRequiredSteps = new Set<GameStep>([
  "compatibility",
  "mystery-box",
  "plan",
  "active-date",
  "memory",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isNullableId(value: unknown, ids: Set<string>): value is string | null {
  return value === null || (typeof value === "string" && ids.has(value));
}

function isPreferences(value: unknown): value is DatePreferences {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isNullableId(value.mood, moodIds) &&
    isNullableId(value.time, timeIds) &&
    isNullableId(value.budget, budgetIds) &&
    isNullableId(value.distance, distanceIds) &&
    isNullableId(value.relationship, relationshipIds)
  );
}

function isCompatibility(value: unknown): value is CompatibilityResult | null {
  if (value === null) {
    return true;
  }
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.rawScore === "number" &&
    typeof value.displayScore === "number" &&
    typeof value.matchedCount === "number" &&
    isStringArray(value.sharedInsights) &&
    isStringArray(value.complementaryInsights) &&
    typeof value.planSuggestion === "string" &&
    typeof value.title === "string" &&
    typeof value.description === "string"
  );
}

function isDateGameState(value: unknown): value is DateGameState {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.step === "string" &&
    gameSteps.has(value.step as GameStep) &&
    isPreferences(value.preferences) &&
    isStringArray(value.playerAAnswers) &&
    isStringArray(value.playerBAnswers) &&
    isCompatibility(value.compatibility) &&
    (value.selectedPlanId === null || typeof value.selectedPlanId === "string") &&
    isStringArray(value.seenPlanIds) &&
    Number.isInteger(value.planChangeCount) &&
    (value.planChangeCount as number) >= 0 &&
    isStringArray(value.completedStepIds) &&
    isStringArray(value.skippedStepIds) &&
    typeof value.favoriteMoment === "string" &&
    typeof value.messageToPartner === "string" &&
    typeof value.updatedAt === "number" &&
    Number.isFinite(value.updatedAt)
  );
}

function uniqueValidIds(ids: string[], validIds: Set<string>): string[] {
  return Array.from(new Set(ids.filter((id) => validIds.has(id))));
}

function normalizeDateGameState(
  state: DateGameState,
  plans: readonly DatePlan[],
): DateGameState {
  const plansById = new Map(plans.map((plan) => [plan.id, plan]));
  const validPlanIds = new Set(plansById.keys());
  const selectedPlan = state.selectedPlanId
    ? plansById.get(state.selectedPlanId) ?? null
    : null;
  const validStepIds = new Set(selectedPlan?.steps.map((step) => step.id) ?? []);
  const completedStepIds = uniqueValidIds(state.completedStepIds, validStepIds);
  const completedIdSet = new Set(completedStepIds);
  const skippedStepIds = uniqueValidIds(state.skippedStepIds, validStepIds).filter(
    (id) => !completedIdSet.has(id),
  );
  let step = state.step;

  if (compatibilityRequiredSteps.has(step) && !state.compatibility) {
    step = "player-b-quiz";
  } else if (planRequiredSteps.has(step) && !selectedPlan) {
    step = "mystery-box";
  } else if (
    step === "memory" &&
    selectedPlan &&
    completedStepIds.length + skippedStepIds.length < selectedPlan.steps.length
  ) {
    step = "active-date";
  }

  return {
    ...state,
    step,
    selectedPlanId: selectedPlan?.id ?? null,
    seenPlanIds: uniqueValidIds(state.seenPlanIds, validPlanIds),
    planChangeCount: Math.min(3, state.planChangeCount),
    completedStepIds,
    skippedStepIds,
    favoriteMoment: state.favoriteMoment.slice(0, 120),
    messageToPartner: state.messageToPartner.slice(0, 160),
  };
}

export function serializeStoredDateGameState(state: DateGameState): string {
  return JSON.stringify({
    version: DATE_GAME_STORAGE_VERSION,
    state,
  });
}

export function parseStoredDateGameState(
  rawValue: string,
  plans: readonly DatePlan[],
): StoredStateParseResult {
  try {
    const parsed: unknown = JSON.parse(rawValue);
    if (
      !isRecord(parsed) ||
      parsed.version !== DATE_GAME_STORAGE_VERSION ||
      !isDateGameState(parsed.state)
    ) {
      return { ok: false };
    }

    return { ok: true, value: normalizeDateGameState(parsed.state, plans) };
  } catch {
    return { ok: false };
  }
}

export function hasMeaningfulDateGameState(state: DateGameState): boolean {
  return (
    state.step !== "welcome" ||
    Object.values(state.preferences).some((value) => value !== null) ||
    state.playerAAnswers.length > 0 ||
    state.playerBAnswers.length > 0 ||
    state.selectedPlanId !== null ||
    state.favoriteMoment.length > 0 ||
    state.messageToPartner.length > 0
  );
}
