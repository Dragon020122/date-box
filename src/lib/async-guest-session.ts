import { datePlans } from "../data/date-plans.ts";
import { quizQuestions } from "../data/quiz-questions.ts";
import { parseStoredDateGameState } from "./game-state-schema.ts";
import { calculateCompatibility } from "./compatibility.ts";
import { generateDatePlan } from "./plan-generator.ts";
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

function normalizeGuestAnswers(value: unknown): Array<string | null> | null {
  if (!Array.isArray(value) || value.length > quizQuestions.length) {
    return null;
  }

  const answers = Array.from<string | null>({ length: quizQuestions.length }).fill(null);
  for (let index = 0; index < value.length; index += 1) {
    const answer = value[index];
    if (answer === null || answer === "" || answer === undefined) {
      continue;
    }
    if (typeof answer !== "string" || !allowedAnswersByQuestion[index]?.has(answer)) {
      return null;
    }
    answers[index] = answer;
  }
  return answers;
}

function toCompleteAnswers(answers: Array<string | null>): string[] | null {
  return answers.every((answer): answer is string => typeof answer === "string")
    ? answers
    : null;
}

function toDateGameState(
  state: AsyncGuestSessionState,
  invite: AsyncInvitePayload,
): DateGameState {
  return {
    step: state.step,
    preferences: invite.preferences,
    playerAAnswers: invite.hostAnswers,
    playerBAnswers: state.guestAnswers.map((answer) => answer ?? ""),
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
    currentQuestionIndex: 0,
    guestAnswers: normalizeGuestAnswers(state.playerBAnswers) ??
      Array.from<string | null>({ length: quizQuestions.length }).fill(null),
    compatibility: state.compatibility,
    selectedPlanId: state.selectedPlanId,
    seenPlanIds: state.seenPlanIds,
    planChangeCount: state.planChangeCount,
    completedStepIds: state.completedStepIds,
    skippedStepIds: state.skippedStepIds,
    favoriteMoment: state.favoriteMoment,
    messageToPartner: state.messageToPartner,
    resultCreatedAt: null,
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
    currentQuestionIndex: 0,
    guestAnswers: normalizeGuestAnswers(result?.guestAnswers ?? []) ??
      Array.from<string | null>({ length: quizQuestions.length }).fill(null),
    compatibility: null,
    selectedPlanId: result?.selectedPlanId ?? null,
    seenPlanIds: result ? [result.selectedPlanId] : [],
    planChangeCount: 0,
    completedStepIds: [],
    skippedStepIds: [],
    favoriteMoment: "",
    messageToPartner: "",
    resultCreatedAt: result?.createdAt ?? null,
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
    const guestAnswers = normalizeGuestAnswers(state.guestAnswers);
    const hasValidQuestionIndex =
      state.currentQuestionIndex === undefined ||
      (typeof state.currentQuestionIndex === "number" &&
        Number.isInteger(state.currentQuestionIndex) &&
        state.currentQuestionIndex >= 0 &&
        state.currentQuestionIndex < quizQuestions.length);
    if (
      state.inviteId !== invite.id ||
      typeof state.step !== "string" ||
      !allowedGuestSteps.has(state.step) ||
      !guestAnswers ||
      !hasValidQuestionIndex ||
      !(
        state.resultCreatedAt === undefined ||
        state.resultCreatedAt === null ||
        (typeof state.resultCreatedAt === "number" && Number.isFinite(state.resultCreatedAt))
      )
    ) {
      return { ok: false };
    }

    const storedQuestionIndex =
      typeof state.currentQuestionIndex === "number" &&
      Number.isInteger(state.currentQuestionIndex) &&
      state.currentQuestionIndex >= 0 &&
      state.currentQuestionIndex < quizQuestions.length
        ? state.currentQuestionIndex
        : 0;
    const candidate = toDateGameState({
      ...(state as unknown as AsyncGuestSessionState),
      currentQuestionIndex: storedQuestionIndex,
      guestAnswers,
    }, invite);
    const normalized = parseStoredDateGameState(
      JSON.stringify({ version: 1, state: candidate }),
      datePlans,
    );
    if (!normalized.ok || !allowedGuestSteps.has(normalized.value.step)) {
      return { ok: false };
    }

    const completeAnswers = toCompleteAnswers(guestAnswers);
    const firstUnansweredIndex = guestAnswers.findIndex((answer) => answer === null);
    const restored = {
      ...fromDateGameState(invite.id, normalized.value),
      currentQuestionIndex:
        firstUnansweredIndex >= 0
          ? firstUnansweredIndex
          : storedQuestionIndex,
      guestAnswers,
      resultCreatedAt:
        typeof state.resultCreatedAt === "number"
          ? state.resultCreatedAt
          : normalized.value.selectedPlanId
            ? normalized.value.updatedAt
            : null,
    } satisfies AsyncGuestSessionState;

    if (restored.step === "player-b-quiz" && completeAnswers) {
      const compatibility = calculateCompatibility(invite.hostAnswers, completeAnswers, {
        playerA: invite.hostName.trim() || "邀请你的TA",
        playerB: invite.guestName?.trim() || "你",
      });
      const planResult = generateDatePlan({
        plans: datePlans,
        preferences: invite.preferences,
        playerAAnswers: invite.hostAnswers,
        playerBAnswers: completeAnswers,
      });
      restored.step = "handoff";
      restored.compatibility = compatibility;
      restored.selectedPlanId = planResult.plan.id;
      restored.seenPlanIds = Array.from(new Set([...restored.seenPlanIds, planResult.plan.id]));
      restored.resultCreatedAt ??= restored.updatedAt;
    }

    return {
      ok: true,
      value: restored,
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
