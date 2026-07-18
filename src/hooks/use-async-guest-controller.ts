"use client";

import { useCallback, useEffect, useState } from "react";

import { datePlans } from "@/data/date-plans";
import { quizQuestions } from "@/data/quiz-questions";
import { resolveDateStep, type StepResolution } from "@/lib/active-date-state";
import { createResultUrl } from "@/lib/async-invite-codec";
import { toAsyncDateGameState } from "@/lib/async-guest-session";
import { calculateCompatibility } from "@/lib/compatibility";
import { generateDatePlan, MAX_PLAN_CHANGES } from "@/lib/plan-generator";
import { hasCompleteQuizAnswers, setQuizAnswer } from "@/lib/quiz-state";
import type {
  AsyncGuestSessionState,
  AsyncInvitePayload,
  AsyncResultPayload,
} from "@/types/async-invite";

interface AsyncGuestControllerOptions {
  invite: AsyncInvitePayload;
  initialState: AsyncGuestSessionState;
  saveState: (state: AsyncGuestSessionState) => boolean;
  clearState: () => boolean;
}

export function useAsyncGuestController({
  invite,
  initialState,
  saveState,
  clearState,
}: AsyncGuestControllerOptions) {
  const [state, setState] = useState(initialState);
  const [planNotice, setPlanNotice] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const commit = useCallback(
    (nextState: AsyncGuestSessionState) => {
      setState(nextState);
      saveState(nextState);
    },
    [saveState],
  );

  const patchState = useCallback(
    (patch: Partial<AsyncGuestSessionState>) => {
      commit({ ...state, ...patch, updatedAt: Date.now() });
    },
    [commit, state],
  );

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setToastOpen(true);
  }, []);

  useEffect(() => {
    if (!toastOpen) {
      return;
    }
    const timer = window.setTimeout(() => setToastOpen(false), 2200);
    return () => window.clearTimeout(timer);
  }, [toastOpen, toastMessage]);

  function updateAnswer(questionIndex: number, answerId: string) {
    patchState({
      guestAnswers: setQuizAnswer(
        state.guestAnswers,
        questionIndex,
        answerId,
        quizQuestions.length,
      ),
    });
  }

  function completeQuiz() {
    if (!hasCompleteQuizAnswers(state.guestAnswers, quizQuestions.length)) {
      return;
    }

    const compatibility = calculateCompatibility(
      invite.hostAnswers,
      state.guestAnswers,
      {
        playerA: invite.hostName.trim() || "邀请你的TA",
        playerB: invite.guestName?.trim() || "你",
      },
    );
    const planResult = generateDatePlan({
      plans: datePlans,
      preferences: invite.preferences,
      playerAAnswers: invite.hostAnswers,
      playerBAnswers: state.guestAnswers,
    });
    const createdAt = Date.now();
    const nextState: AsyncGuestSessionState = {
      ...state,
      step: "handoff",
      compatibility,
      selectedPlanId: planResult.plan.id,
      updatedAt: createdAt,
    };
    commit(nextState);

    const resultPayload: AsyncResultPayload = {
      v: 1,
      invite,
      guestAnswers: state.guestAnswers,
      selectedPlanId: planResult.plan.id,
      createdAt,
    };
    window.history.replaceState(
      null,
      "",
      createResultUrl(window.location.href, resultPayload),
    );
  }

  function openMysteryBox() {
    if (!state.selectedPlanId) {
      return;
    }
    patchState({
      step: "plan",
      seenPlanIds: Array.from(new Set([...state.seenPlanIds, state.selectedPlanId])),
    });
  }

  function changePlan() {
    if (!state.selectedPlanId || state.planChangeCount >= MAX_PLAN_CHANGES) {
      return;
    }
    const result = generateDatePlan({
      plans: datePlans,
      preferences: invite.preferences,
      playerAAnswers: invite.hostAnswers,
      playerBAnswers: state.guestAnswers,
      seenPlanIds: state.seenPlanIds,
      planChangeCount: state.planChangeCount,
      selectedPlanId: state.selectedPlanId,
    });
    const changed = result.plan.id !== state.selectedPlanId;
    setPlanNotice(result.message);
    patchState({
      selectedPlanId: result.plan.id,
      seenPlanIds: Array.from(new Set([...state.seenPlanIds, result.plan.id])),
      planChangeCount: changed ? state.planChangeCount + 1 : state.planChangeCount,
      completedStepIds: changed ? [] : state.completedStepIds,
      skippedStepIds: changed ? [] : state.skippedStepIds,
    });
  }

  function resolveStep(stepId: string, resolution: StepResolution) {
    const plan = datePlans.find((candidate) => candidate.id === state.selectedPlanId);
    if (!plan?.steps.some((step) => step.id === stepId)) {
      return;
    }
    patchState(resolveDateStep(state, stepId, resolution));
  }

  function updateMemoryField(
    field: "favoriteMoment" | "messageToPartner",
    value: string,
    maxLength: number,
  ) {
    patchState({ [field]: value.slice(0, maxLength) });
  }

  function confirmReset() {
    clearState();
    setResetDialogOpen(false);
    window.location.assign(window.location.href.split("#")[0]);
  }

  return {
    state,
    gameState: toAsyncDateGameState(state, invite),
    planNotice,
    toastMessage,
    toastOpen,
    resetDialogOpen,
    setToastOpen,
    setResetDialogOpen,
    patchState,
    updateAnswer,
    completeQuiz,
    openMysteryBox,
    changePlan,
    resolveStep,
    updateFavoriteMoment: (value: string) =>
      updateMemoryField("favoriteMoment", value, 120),
    updateMessage: (value: string) =>
      updateMemoryField("messageToPartner", value, 160),
    savePlan: () => {
      saveState(state);
      showToast("已保存你们的共同计划");
    },
    saveMemory: () => {
      saveState(state);
      showToast("今晚的回忆已经收好");
    },
    handleCopyResult: (success: boolean) =>
      showToast(success ? "纪念文字已经复制" : "请手动选择纪念文字"),
    confirmReset,
  };
}
