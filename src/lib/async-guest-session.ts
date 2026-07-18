import { datePlans } from "../data/date-plans.ts";
import { quizQuestions } from "../data/quiz-questions.ts";
import { parseStoredDateGameState } from "./game-state-schema.ts";
import type {
  AsyncGuestSessionState,
  AsyncInvitePayload,
  AsyncResultPayload,
} from "@/types/async-invite";
import type { DateGameState } from "@/types/date-game";

export const ASYNC_GUEST_STORAGE_VERSION = 1;

const allowedGuestSteps = new Set([
  "welcome",
  "player-b-quiz",
  "handoff",
  "compatibility",
  "mystery-box",
  "plan",
  "active-date",
  "memory",
]);
const allowedAnswersByQuestion = quizQuestions.map(
  (question) => new Set(question.options.map((option) => option.id)),
);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasValidGuestAnswers(answers: string[]): boolean {
  return (
    answers.length <= quizQuestions.length &&
    answers.every((answer, index) => allowedAnswersByQuestion[index]?.has(answer))
  );
}

function toDateGameState(
  state: AsyncGuestSessionState,
  invite: AsyncInvitePayload,
): DateGameState {
  return {
    step: state.step,
    preferences: invite.preferences,
    playerAAnswers: invite.hostAnswers,
    playerBAnswers: state.guestAnswers,
    compatibility: state.compatibility,
    selectedPlanId: state.selectedPlanId,
    seenPlanIds: state.seenPlanIds,
    planChangeCount: state.planChangeCount,
    completedStepIds: state.completedStepIds,
    skippedStepIds: state.skippedStepIds,
    favoriteMoment: state.favoriteMoment,
    messageToPartner: state.messageToPartner,
    updatedAt: state.updatedAt,
  };
}

function fromDateGameState(
  inviteId: string,
  state: DateGameState,
): AsyncGuestSessionState {
  return {
    inviteId,
    step: state.step as AsyncGuestSessionState["step"],
    guestAnswers: state.playerBAnswers,
    compatibility: state.compatibility,
    selectedPlanId: state.selectedPlanId,
    seenPlanIds: state.seenPlanIds,
    planChangeCount: state.planChangeCount,
    completedStepIds: state.completedStepIds,
    skippedStepIds: state.skippedStepIds,
    favoriteMoment: state.favoriteMoment,
    messageToPartner: state.messageToPartner,
    updatedAt: state.updatedAt,
  };
}

export function createInitialAsyncGuestSession(
  invite: AsyncInvitePayload,
  result?: AsyncResultPayload,
): AsyncGuestSessionState {
  return {
    inviteId: invite.id,
    step: result ? "compatibility" : "welcome",
    guestAnswers: result?.guestAnswers ?? [],
    compatibility: null,
    selectedPlanId: result?.selectedPlanId ?? null,
    seenPlanIds: result ? [result.selectedPlanId] : [],
    planChangeCount: 0,
    completedStepIds: [],
    skippedStepIds: [],
    favoriteMoment: "",
    messageToPartner: "",
    updatedAt: result?.createdAt ?? Date.now(),
  };
}

export function serializeAsyncGuestSession(state: AsyncGuestSessionState): string {
  return JSON.stringify({
    version: ASYNC_GUEST_STORAGE_VERSION,
    inviteId: state.inviteId,
    state,
  });
}

export function parseAsyncGuestSession(
  rawValue: string,
  invite: AsyncInvitePayload,
): { ok: true; value: AsyncGuestSessionState } | { ok: false } {
  try {
    const parsed: unknown = JSON.parse(rawValue);
    if (
      !isRecord(parsed) ||
      parsed.version !== ASYNC_GUEST_STORAGE_VERSION ||
      parsed.inviteId !== invite.id ||
      !isRecord(parsed.state)
    ) {
      return { ok: false };
    }

    const state = parsed.state;
    if (
      state.inviteId !== invite.id ||
      typeof state.step !== "string" ||
      !allowedGuestSteps.has(state.step) ||
      !Array.isArray(state.guestAnswers) ||
      !state.guestAnswers.every((answer) => typeof answer === "string") ||
      !hasValidGuestAnswers(state.guestAnswers)
    ) {
      return { ok: false };
    }

    const candidate = toDateGameState(
      state as unknown as AsyncGuestSessionState,
      invite,
    );
    const normalized = parseStoredDateGameState(
      JSON.stringify({ version: 1, state: candidate }),
      datePlans,
    );
    if (!normalized.ok || !allowedGuestSteps.has(normalized.value.step)) {
      return { ok: false };
    }

    return {
      ok: true,
      value: fromDateGameState(invite.id, normalized.value),
    };
  } catch {
    return { ok: false };
  }
}

export function toAsyncDateGameState(
  state: AsyncGuestSessionState,
  invite: AsyncInvitePayload,
): DateGameState {
  return toDateGameState(state, invite);
}
