import type { DatePlanStep } from "@/types/date-game";

export type StepResolution = "completed" | "skipped";

interface StepResolutionState {
  completedStepIds: string[];
  skippedStepIds: string[];
}

interface Identifiable {
  id: string;
}

export function resolveDateStep(
  state: StepResolutionState,
  stepId: string,
  resolution: StepResolution,
): StepResolutionState {
  const completedStepIds = state.completedStepIds.filter((id) => id !== stepId);
  const skippedStepIds = state.skippedStepIds.filter((id) => id !== stepId);

  if (resolution === "completed") {
    completedStepIds.push(stepId);
  } else {
    skippedStepIds.push(stepId);
  }

  return { completedStepIds, skippedStepIds };
}

export function getCurrentDateStep(
  steps: readonly DatePlanStep[],
  completedStepIds: readonly string[],
  skippedStepIds: readonly string[],
): DatePlanStep | null {
  const resolvedIds = new Set([...completedStepIds, ...skippedStepIds]);
  return steps.find((step) => !resolvedIds.has(step.id)) ?? null;
}

export function getDateProgress(
  steps: readonly DatePlanStep[],
  completedStepIds: readonly string[],
  skippedStepIds: readonly string[],
): number {
  if (steps.length === 0) {
    return 1;
  }

  const validStepIds = new Set(steps.map((step) => step.id));
  const resolvedIds = new Set(
    [...completedStepIds, ...skippedStepIds].filter((id) => validStepIds.has(id)),
  );

  return Math.min(1, resolvedIds.size / steps.length);
}

export function chooseUnseenItem<T extends Identifiable>(
  items: readonly T[],
  seenIds: readonly string[],
  randomValue = Math.random(),
): { item: T | null; allSeen: boolean } {
  if (items.length === 0) {
    return { item: null, allSeen: true };
  }

  const seenIdSet = new Set(seenIds);
  const unseenItems = items.filter((item) => !seenIdSet.has(item.id));
  const pool = unseenItems.length > 0 ? unseenItems : items;
  const normalizedRandom = Math.min(0.999999, Math.max(0, randomValue));
  const item = pool[Math.floor(normalizedRandom * pool.length)] ?? pool[0];

  return { item, allSeen: unseenItems.length === 0 };
}
