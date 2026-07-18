import type { AsyncHostSessionState, AsyncHostStep } from "@/types/async-invite";
import type { DatePreferences } from "@/types/date-game";

export const ASYNC_HOST_STORAGE_VERSION = 1;

export type AsyncHostStorageParseResult =
  | { ok: true; value: AsyncHostSessionState }
  | { ok: false };

const hostSteps = new Set<AsyncHostStep>([
  "create-intro",
  "mood",
  "preferences",
  "host-quiz",
  "generating",
  "share-placeholder",
]);
const moodIds = new Set(["healing", "romantic", "playful", "conversation", "adventure", "random"]);
const timeIds = new Set(["two-hours", "afternoon", "whole-evening"]);
const budgetIds = new Set(["simple", "refined", "special"]);
const distanceIds = new Set(["nearby", "thirty-minutes", "farther"]);
const relationshipIds = new Set(["first-date", "ambiguous", "stable", "long-term"]);
const allowedAnswersByQuestion = [
  new Set(["good-food", "casual-walk", "new-experience", "sit-and-talk"]),
  new Set(["beautiful-photo", "deep-conversation", "funny-moment", "small-souvenir"]),
  new Set(["small-gift", "hidden-place", "unsaid-words", "random-plan"]),
  new Set(["slow-and-easy", "full-and-brisk", "planned-and-free", "follow-the-feeling"]),
  new Set(["companionship", "understanding", "freshness", "romantic-response"]),
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNullableId(value: unknown, allowedIds: Set<string>): value is string | null {
  return value === null || (typeof value === "string" && allowedIds.has(value));
}

function isPreferences(value: unknown): value is DatePreferences {
  return (
    isRecord(value) &&
    isNullableId(value.mood, moodIds) &&
    isNullableId(value.time, timeIds) &&
    isNullableId(value.budget, budgetIds) &&
    isNullableId(value.distance, distanceIds) &&
    isNullableId(value.relationship, relationshipIds)
  );
}

function isPartialAnswerSet(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length <= allowedAnswersByQuestion.length &&
    value.every(
      (answer, index) =>
        typeof answer === "string" && allowedAnswersByQuestion[index].has(answer),
    )
  );
}

function hasCompletePreferences(preferences: DatePreferences): boolean {
  return Object.values(preferences).every((value) => value !== null);
}

function normalizeStep(state: AsyncHostSessionState): AsyncHostStep {
  if (state.step === "share-placeholder" && !state.inviteUrl) {
    return state.hostAnswers.length === 5 ? "generating" : "host-quiz";
  }
  if (
    (state.step === "host-quiz" || state.step === "generating") &&
    !hasCompletePreferences(state.preferences)
  ) {
    return state.preferences.mood ? "preferences" : "mood";
  }
  if (state.step === "preferences" && !state.preferences.mood) {
    return "mood";
  }
  return state.step;
}

export function createInitialAsyncHostSessionState(): AsyncHostSessionState {
  return {
    step: "create-intro",
    hostName: "",
    guestName: "",
    preferences: {
      mood: null,
      time: null,
      budget: null,
      distance: null,
      relationship: null,
    },
    hostAnswers: [],
    inviteUrl: null,
    inviteCreatedAt: null,
  };
}

export function serializeAsyncHostSession(state: AsyncHostSessionState): string {
  return JSON.stringify({ version: ASYNC_HOST_STORAGE_VERSION, state });
}

export function parseAsyncHostSession(rawValue: string): AsyncHostStorageParseResult {
  try {
    const parsed: unknown = JSON.parse(rawValue);
    if (!isRecord(parsed) || parsed.version !== ASYNC_HOST_STORAGE_VERSION || !isRecord(parsed.state)) {
      return { ok: false };
    }

    const state = parsed.state;
    if (
      typeof state.step !== "string" ||
      !hostSteps.has(state.step as AsyncHostStep) ||
      typeof state.hostName !== "string" ||
      Array.from(state.hostName.trim()).length > 12 ||
      typeof state.guestName !== "string" ||
      Array.from(state.guestName.trim()).length > 12 ||
      !isPreferences(state.preferences) ||
      !isPartialAnswerSet(state.hostAnswers) ||
      !(state.inviteUrl === null || (typeof state.inviteUrl === "string" && state.inviteUrl.length <= 12_000)) ||
      !(state.inviteCreatedAt === null || (typeof state.inviteCreatedAt === "number" && Number.isFinite(state.inviteCreatedAt)))
    ) {
      return { ok: false };
    }

    const normalizedState: AsyncHostSessionState = {
      step: state.step as AsyncHostStep,
      hostName: state.hostName.trim(),
      guestName: state.guestName.trim(),
      preferences: state.preferences,
      hostAnswers: state.hostAnswers,
      inviteUrl: state.inviteUrl,
      inviteCreatedAt: state.inviteCreatedAt,
    };

    return {
      ok: true,
      value: { ...normalizedState, step: normalizeStep(normalizedState) },
    };
  } catch {
    return { ok: false };
  }
}

export function hasMeaningfulAsyncHostSession(state: AsyncHostSessionState): boolean {
  return (
    state.step !== "create-intro" ||
    state.hostName.length > 0 ||
    state.guestName.length > 0 ||
    Object.values(state.preferences).some((value) => value !== null) ||
    state.hostAnswers.length > 0 ||
    state.inviteUrl !== null
  );
}
