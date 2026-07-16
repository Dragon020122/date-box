import type { DatePlan, DatePreferences } from "@/types/date-game";

export const PLAN_MATCH_WEIGHTS = {
  mood: 4,
  time: 2,
  budget: 2,
  distance: 1,
  relationship: 3,
} as const;

export const MAX_PLAN_CHANGES = 3;

const chatRelatedOptions = new Set([
  "sit-and-talk",
  "deep-conversation",
  "unsaid-words",
  "understanding",
]);
const adventureRelatedOptions = new Set([
  "new-experience",
  "hidden-place",
  "random-plan",
  "freshness",
]);
const giftRelatedOptions = new Set(["small-gift", "small-souvenir"]);
const highSpendPlanIds = new Set(["pink-movie-night", "happy-energy-station"]);

interface PlanMatchInput {
  plans: readonly DatePlan[];
  preferences: DatePreferences;
  playerAAnswers: string[];
  playerBAnswers: string[];
}

export interface RankedDatePlan {
  plan: DatePlan;
  score: number;
}

interface PlanSelectionInput extends PlanMatchInput {
  seenPlanIds?: string[];
  planChangeCount?: number;
  selectedPlanId?: string | null;
}

export interface PlanSelectionResult {
  plan: DatePlan;
  score: number;
  rankedPlanIds: string[];
  allPlansSeen: boolean;
  changeLimitReached: boolean;
  message: string | null;
}

function hasAnyAnswer(answers: string[], optionIds: Set<string>): boolean {
  return answers.some((answer) => optionIds.has(answer));
}

function bothPrefer(
  playerAAnswers: string[],
  playerBAnswers: string[],
  optionIds: Set<string>,
): boolean {
  return (
    hasAnyAnswer(playerAAnswers, optionIds) &&
    hasAnyAnswer(playerBAnswers, optionIds)
  );
}

function countAnswerDifferences(
  playerAAnswers: string[],
  playerBAnswers: string[],
): number {
  const questionCount = Math.max(playerAAnswers.length, playerBAnswers.length, 5);

  return Array.from({ length: questionCount }, (_, index) => {
    const playerAAnswer = playerAAnswers[index] ?? "";
    const playerBAnswer = playerBAnswers[index] ?? "";
    return playerAAnswer !== "" &&
      playerBAnswer !== "" &&
      playerAAnswer !== playerBAnswer
      ? 1
      : 0;
  }).reduce<number>((total, difference) => total + difference, 0);
}

function createSeed(input: Omit<PlanMatchInput, "plans">): string {
  const { preferences, playerAAnswers, playerBAnswers } = input;
  return [
    preferences.mood,
    preferences.time,
    preferences.budget,
    preferences.distance,
    preferences.relationship,
    ...playerAAnswers,
    ...playerBAnswers,
  ].join("|");
}

function stableHash(value: string): number {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

export function scoreDatePlan(
  plan: DatePlan,
  preferences: DatePreferences,
  playerAAnswers: string[],
  playerBAnswers: string[],
): number {
  let score = 0;

  if (preferences.mood && plan.moods.includes(preferences.mood)) {
    score += PLAN_MATCH_WEIGHTS.mood;
  }
  if (preferences.time && plan.times.includes(preferences.time)) {
    score += PLAN_MATCH_WEIGHTS.time;
  }
  if (preferences.budget && plan.budgets.includes(preferences.budget)) {
    score += PLAN_MATCH_WEIGHTS.budget;
  }
  if (preferences.distance && plan.distances.includes(preferences.distance)) {
    score += PLAN_MATCH_WEIGHTS.distance;
  }
  if (
    preferences.relationship &&
    plan.relationships.includes(preferences.relationship)
  ) {
    score += PLAN_MATCH_WEIGHTS.relationship;
  }

  if (
    bothPrefer(playerAAnswers, playerBAnswers, chatRelatedOptions) &&
    plan.moods.includes("conversation")
  ) {
    score += 2;
  }
  if (
    bothPrefer(playerAAnswers, playerBAnswers, adventureRelatedOptions) &&
    plan.moods.includes("adventure")
  ) {
    score += 2;
  }
  if (
    playerAAnswers.includes("beautiful-photo") &&
    playerBAnswers.includes("beautiful-photo") &&
    (plan.id === "pink-movie-night" || plan.id === "happy-energy-station")
  ) {
    score += 1;
  }
  if (
    bothPrefer(playerAAnswers, playerBAnswers, giftRelatedOptions) &&
    plan.id === "twenty-yuan-romance"
  ) {
    score += 2;
  }
  if (
    countAnswerDifferences(playerAAnswers, playerBAnswers) >= 4 &&
    plan.characteristics.includes("多类型活动")
  ) {
    score += 2;
  }
  if (
    preferences.relationship === "first-date" &&
    plan.id === "first-step-closer"
  ) {
    score += 3;
  }
  if (
    preferences.budget === "simple" &&
    highSpendPlanIds.has(plan.id)
  ) {
    score -= 9;
  }

  return score;
}

export function rankDatePlans({
  plans,
  preferences,
  playerAAnswers,
  playerBAnswers,
}: PlanMatchInput): RankedDatePlan[] {
  const seed = createSeed({ preferences, playerAAnswers, playerBAnswers });

  return plans
    .map((plan) => ({
      plan,
      score: scoreDatePlan(
        plan,
        preferences,
        playerAAnswers,
        playerBAnswers,
      ),
      tieBreak: stableHash(`${seed}:${plan.id}`),
    }))
    .sort(
      (left, right) =>
        right.score - left.score || left.tieBreak - right.tieBreak,
    )
    .map(({ plan, score }) => ({ plan, score }));
}

export function generateDatePlan({
  plans,
  preferences,
  playerAAnswers,
  playerBAnswers,
  seenPlanIds = [],
  planChangeCount = 0,
  selectedPlanId = null,
}: PlanSelectionInput): PlanSelectionResult {
  if (plans.length === 0) {
    throw new Error("Date Box requires at least one date plan.");
  }

  const rankedPlans = rankDatePlans({
    plans,
    preferences,
    playerAAnswers,
    playerBAnswers,
  });
  const currentPlan = rankedPlans.find(
    ({ plan }) => plan.id === selectedPlanId,
  );

  if (planChangeCount >= MAX_PLAN_CHANGES && currentPlan) {
    return {
      plan: currentPlan.plan,
      score: currentPlan.score,
      rankedPlanIds: rankedPlans.map(({ plan }) => plan.id),
      allPlansSeen: false,
      changeLimitReached: true,
      message: "已经换过三次了，把惊喜留给这一份吧。",
    };
  }

  const seenPlanIdSet = new Set(seenPlanIds);
  const unseenPlan = rankedPlans.find(({ plan }) => !seenPlanIdSet.has(plan.id));
  const allPlansSeen = unseenPlan === undefined;
  const selectedPlan = unseenPlan ?? rankedPlans[0];

  return {
    plan: selectedPlan.plan,
    score: selectedPlan.score,
    rankedPlanIds: rankedPlans.map(({ plan }) => plan.id),
    allPlansSeen,
    changeLimitReached: false,
    message: allPlansSeen
      ? "六种今晚都已经看过了，这次回到最适合你们的一份。"
      : null,
  };
}
