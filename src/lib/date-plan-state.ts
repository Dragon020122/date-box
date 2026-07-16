import { generateDatePlan, MAX_PLAN_CHANGES } from "@/lib/plan-generator";
import type { DateGameState, DatePlan } from "@/types/date-game";

interface DatePlanStateResult {
  state: DateGameState;
  notice: string | null;
}

function selectPlan(state: DateGameState, plans: readonly DatePlan[]) {
  return generateDatePlan({
    plans,
    preferences: state.preferences,
    playerAAnswers: state.playerAAnswers,
    playerBAnswers: state.playerBAnswers,
    seenPlanIds: state.seenPlanIds,
    planChangeCount: state.planChangeCount,
    selectedPlanId: state.selectedPlanId,
  });
}

export function revealDatePlan(
  state: DateGameState,
  plans: readonly DatePlan[],
): DatePlanStateResult {
  const result = selectPlan(state, plans);

  return {
    notice: result.message,
    state: {
      ...state,
      step: "plan",
      selectedPlanId: result.plan.id,
      seenPlanIds: Array.from(new Set([...state.seenPlanIds, result.plan.id])),
      completedStepIds: [],
      skippedStepIds: [],
      updatedAt: Date.now(),
    },
  };
}

export function changeDatePlan(
  state: DateGameState,
  plans: readonly DatePlan[],
): DatePlanStateResult {
  if (!state.selectedPlanId || state.planChangeCount >= MAX_PLAN_CHANGES) {
    return { state, notice: null };
  }

  const result = selectPlan(state, plans);
  const changed = result.plan.id !== state.selectedPlanId;

  return {
    notice: result.message,
    state: {
      ...state,
      selectedPlanId: result.plan.id,
      seenPlanIds: Array.from(new Set([...state.seenPlanIds, result.plan.id])),
      planChangeCount: changed
        ? state.planChangeCount + 1
        : state.planChangeCount,
      completedStepIds: changed ? [] : state.completedStepIds,
      skippedStepIds: changed ? [] : state.skippedStepIds,
      updatedAt: Date.now(),
    },
  };
}
