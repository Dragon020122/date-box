"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { datePlans } from "@/data/date-plans";
import { quizQuestions } from "@/data/quiz-questions";
import { resolveDateStep, type StepResolution } from "@/lib/active-date-state";
import { calculateCompatibility } from "@/lib/compatibility";
import { moveToStep, updatePreferenceState } from "@/lib/date-game-state";
import { changeDatePlan, revealDatePlan } from "@/lib/date-plan-state";
import { hasCompletePreferences, hasSelectedMood } from "@/lib/game-validation";
import { hasMeaningfulDateGameState } from "@/lib/game-state-schema";
import { hasCompleteQuizAnswers, setQuizAnswer } from "@/lib/quiz-state";
import {
  createInitialDateGameState,
  type DateGameState,
  type DatePreferences,
  type GameStep,
  type MoodId,
} from "@/types/date-game";

type ToastTone = "success" | "info";
type AnswerKey = "playerAAnswers" | "playerBAnswers";

interface DateGameControllerOptions {
  initialState: DateGameState;
  startWithRecovery: boolean;
  initialNotice: string | null;
  saveState: (state: DateGameState) => boolean;
  clearStorage: () => boolean;
}

export function useDateGameController({
  initialState,
  startWithRecovery,
  initialNotice,
  saveState,
  clearStorage,
}: DateGameControllerOptions) {
  const [gameState, setGameState] = useState(() => initialState);
  const [toastOpen, setToastOpen] = useState(() => initialNotice !== null);
  const [toastMessage, setToastMessage] = useState(
    () => initialNotice ?? "心动计划已重新开始",
  );
  const [toastTone, setToastTone] = useState<ToastTone>("info");
  const [playerBInitialQuestion, setPlayerBInitialQuestion] = useState(() => {
    const firstMissingAnswer = initialState.playerBAnswers.findIndex((answer) => !answer);
    return firstMissingAnswer >= 0 ? firstMissingAnswer : 0;
  });
  const [planNotice, setPlanNotice] = useState<string | null>(null);
  const [recoveryOpen, setRecoveryOpen] = useState(startWithRecovery);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const storageFailureNotifiedRef = useRef(false);
  const saveLockedRef = useRef(false);

  const showToast = useCallback((message: string, tone: ToastTone = "success") => {
    setToastMessage(message);
    setToastTone(tone);
    setToastOpen(true);
  }, []);

  useEffect(() => {
    if (
      recoveryOpen ||
      !hasMeaningfulDateGameState(gameState)
    ) {
      return;
    }

    const didSave = saveState(gameState);
    if (!didSave && !storageFailureNotifiedRef.current) {
      storageFailureNotifiedRef.current = true;
      showToast("这次无法自动保存，但当前计划仍然可以继续。", "info");
    }
  }, [gameState, recoveryOpen, saveState, showToast]);

  useEffect(() => {
    saveLockedRef.current = false;
  }, [gameState.updatedAt]);

  function updateStep(step: GameStep) {
    setGameState((currentState) => moveToStep(currentState, step));
  }

  function updatePreferences(patch: Partial<DatePreferences>) {
    setGameState((currentState) => updatePreferenceState(currentState, patch));
  }

  function handleMoodChange(mood: MoodId) {
    updatePreferences({ mood });
  }

  function handleMoodContinue() {
    if (hasSelectedMood(gameState.preferences)) {
      updateStep("preferences");
    }
  }

  function handlePreferencesContinue() {
    if (hasCompletePreferences(gameState.preferences)) {
      updateStep("player-a-quiz");
    }
  }

  function handlePlayerAnswer(key: AnswerKey, questionIndex: number, answerId: string) {
    setGameState((currentState) => ({
      ...currentState,
      [key]: setQuizAnswer(
        currentState[key],
        questionIndex,
        answerId,
        quizQuestions.length,
      ),
      updatedAt: Date.now(),
    }));
  }

  function handlePlayerAComplete() {
    if (hasCompleteQuizAnswers(gameState.playerAAnswers, quizQuestions.length)) {
      updateStep("handoff");
    }
  }

  function handleHandoffContinue() {
    if (hasCompleteQuizAnswers(gameState.playerAAnswers, quizQuestions.length)) {
      setPlayerBInitialQuestion(0);
      updateStep("player-b-quiz");
    }
  }

  function handlePlayerBComplete() {
    setGameState((currentState) => {
      if (
        !hasCompleteQuizAnswers(currentState.playerAAnswers, quizQuestions.length) ||
        !hasCompleteQuizAnswers(currentState.playerBAnswers, quizQuestions.length)
      ) {
        return currentState;
      }

      return {
        ...currentState,
        step: "compatibility",
        compatibility: calculateCompatibility(
          currentState.playerAAnswers,
          currentState.playerBAnswers,
        ),
        updatedAt: Date.now(),
      };
    });
  }

  function handleCompatibilityBack() {
    setPlayerBInitialQuestion(quizQuestions.length - 1);
    updateStep("player-b-quiz");
  }

  function handleMysteryBoxOpen() {
    if (
      !hasCompletePreferences(gameState.preferences) ||
      !hasCompleteQuizAnswers(gameState.playerAAnswers, quizQuestions.length) ||
      !hasCompleteQuizAnswers(gameState.playerBAnswers, quizQuestions.length) ||
      !gameState.compatibility
    ) {
      return;
    }

    const result = revealDatePlan(gameState, datePlans);
    setPlanNotice(result.notice);
    setGameState(result.state);
  }

  function handleChangePlan() {
    const result = changeDatePlan(gameState, datePlans);
    setPlanNotice(result.notice);
    setGameState(result.state);
  }

  function saveCurrentState(successMessage: string) {
    if (saveLockedRef.current) {
      return;
    }
    saveLockedRef.current = true;

    const savedState = {
      ...gameState,
      updatedAt: Math.max(Date.now(), gameState.updatedAt + 1),
    };
    const didSave = saveState(savedState);
    setGameState(savedState);
    showToast(
      didSave ? successMessage : "这次没能保存，但当前内容仍留在页面上。",
      didSave ? "success" : "info",
    );
  }

  function handleResolveDateStep(stepId: string, resolution: StepResolution) {
    setGameState((currentState) => {
      const selectedPlan = datePlans.find(
        (plan) => plan.id === currentState.selectedPlanId,
      );
      if (!selectedPlan?.steps.some((step) => step.id === stepId)) {
        return currentState;
      }

      return {
        ...currentState,
        ...resolveDateStep(currentState, stepId, resolution),
        updatedAt: Date.now(),
      };
    });
  }

  function updateMemoryField(
    field: "favoriteMoment" | "messageToPartner",
    value: string,
    maxLength: number,
  ) {
    setGameState((currentState) => ({
      ...currentState,
      [field]: value.slice(0, maxLength),
      updatedAt: Date.now(),
    }));
  }

  function requestReset() {
    setResetDialogOpen(true);
  }

  function confirmReset() {
    const didClear = clearStorage();
    setGameState(createInitialDateGameState());
    setPlayerBInitialQuestion(0);
    setPlanNotice(null);
    setRecoveryOpen(false);
    setResetDialogOpen(false);
    storageFailureNotifiedRef.current = !didClear;
    showToast(
      didClear
        ? "心动计划已重新开始"
        : "计划已经重新开始，但这次无法清除设备记录。",
      didClear ? "success" : "info",
    );
  }

  function continueRecovery() {
    setRecoveryOpen(false);
    showToast(
      gameState.step === "memory" ? "已经找回今晚的回忆" : "已经接上上次的心动计划",
    );
  }

  return {
    gameState,
    playerBInitialQuestion,
    planNotice,
    toastOpen,
    toastMessage,
    toastTone,
    recoveryOpen,
    resetDialogOpen,
    setToastOpen,
    updateStep,
    updatePreferences,
    handleMoodChange,
    handleMoodContinue,
    handlePreferencesContinue,
    handlePlayerAAnswer: (questionIndex: number, answerId: string) =>
      handlePlayerAnswer("playerAAnswers", questionIndex, answerId),
    handlePlayerBAnswer: (questionIndex: number, answerId: string) =>
      handlePlayerAnswer("playerBAnswers", questionIndex, answerId),
    handlePlayerAComplete,
    handlePlayerBComplete,
    handleHandoffContinue,
    handleCompatibilityBack,
    handleMysteryBoxOpen,
    handleChangePlan,
    handleSavePlan: () => saveCurrentState("已保存今晚的心动计划"),
    handleResolveDateStep,
    handleActiveDateFinish: () => updateStep("memory"),
    handleFavoriteMomentChange: (value: string) =>
      updateMemoryField("favoriteMoment", value, 120),
    handleMessageChange: (value: string) =>
      updateMemoryField("messageToPartner", value, 160),
    handleSaveMemory: () => saveCurrentState("今晚的回忆已经收好"),
    handleCopyResult: (success: boolean) =>
      showToast(
        success ? "纪念文字已经复制" : "暂时无法自动复制，请手动选择文字",
        success ? "success" : "info",
      ),
    requestReset,
    confirmReset,
    cancelReset: () => setResetDialogOpen(false),
    continueRecovery,
  };
}
