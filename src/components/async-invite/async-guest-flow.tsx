"use client";

import { useCallback, useEffect, useMemo } from "react";

import { AsyncRevealScreen } from "@/components/async-invite/async-reveal-screen";
import { InviteLandingScreen } from "@/components/async-invite/invite-landing-screen";
import { ActiveDateScreen } from "@/components/date-game/active-date-screen";
import { CompatibilityScreen } from "@/components/date-game/compatibility-screen";
import { DatePlanScreen } from "@/components/date-game/date-plan-screen";
import { GameLoadingScreen } from "@/components/date-game/game-loading-screen";
import { MemoryCardScreen } from "@/components/date-game/memory-card-screen";
import { MysteryBoxScreen } from "@/components/date-game/mystery-box-screen";
import { QuizScreen } from "@/components/date-game/quiz-screen";
import { AppShell } from "@/components/layout/app-shell";
import { BrandHeader } from "@/components/layout/brand-header";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Toast } from "@/components/ui/toast";
import { datePlans } from "@/data/date-plans";
import { quizQuestions } from "@/data/quiz-questions";
import { useAsyncGuestController } from "@/hooks/use-async-guest-controller";
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  createInitialAsyncGuestSession,
  parseAsyncGuestSession,
  serializeAsyncGuestSession,
} from "@/lib/async-guest-session";
import { calculateCompatibility } from "@/lib/compatibility";
import {
  getAsyncGuestStorageKey,
  type AsyncGuestSessionState,
  type AsyncGuestStep,
  type AsyncInvitePayload,
  type AsyncResultPayload,
} from "@/types/async-invite";

interface AsyncGuestFlowProps {
  invite: AsyncInvitePayload;
  result?: AsyncResultPayload;
}

const stepLabels: Record<AsyncGuestStep, string> = {
  welcome: "一份心动邀请",
  "player-b-quiz": "轮到你写下期待",
  handoff: "正在合起两份期待",
  compatibility: "你们的默契结果",
  "mystery-box": "开启约会盲盒",
  plan: "你们的共同计划",
  "active-date": "今晚正在发生",
  memory: "收藏今晚的回忆",
};

const stepProgress: Record<AsyncGuestStep, number> = {
  welcome: 0.08,
  "player-b-quiz": 0.3,
  handoff: 0.52,
  compatibility: 0.62,
  "mystery-box": 0.72,
  plan: 0.82,
  "active-date": 0.92,
  memory: 1,
};

function createResultInitialState(
  invite: AsyncInvitePayload,
  result: AsyncResultPayload,
): AsyncGuestSessionState {
  return {
    ...createInitialAsyncGuestSession(invite, result),
    compatibility: calculateCompatibility(
      invite.hostAnswers,
      result.guestAnswers,
      {
        playerA: invite.hostName.trim() || "邀请你的TA",
        playerB: invite.guestName?.trim() || "你",
      },
    ),
  };
}

function AsyncGuestSession({
  invite,
  initialState,
  saveState,
  clearState,
}: {
  invite: AsyncInvitePayload;
  initialState: AsyncGuestSessionState;
  saveState: (state: AsyncGuestSessionState) => boolean;
  clearState: () => boolean;
}) {
  const controller = useAsyncGuestController({ invite, initialState, saveState, clearState });
  const { state, gameState } = controller;
  const selectedPlan = datePlans.find((plan) => plan.id === state.selectedPlanId);
  const firstMissingAnswer = state.guestAnswers.findIndex((answer) => !answer);
  const participantNames: [string, string] = [
    invite.hostName.trim() || "邀请你的TA",
    invite.guestName?.trim() || "你",
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [state.step]);

  let screen;
  switch (state.step) {
    case "welcome":
      screen = (
        <InviteLandingScreen
          invite={invite}
          onJoin={() => controller.patchState({ step: "player-b-quiz" })}
        />
      );
      break;
    case "player-b-quiz":
      screen = (
        <QuizScreen
          player="playerB"
          answers={state.guestAnswers}
          initialQuestionIndex={firstMissingAnswer >= 0 ? firstMissingAnswer : quizQuestions.length - 1}
          onAnswer={controller.updateAnswer}
          onExit={() => controller.patchState({ step: "welcome" })}
          onComplete={controller.completeQuiz}
          copy={{
            label: "邀请回应 · 你",
            title: "轮到你写下期待",
            description: "不要猜TA的答案，只选你真正想要的。",
            exitLabel: "返回邀请说明",
            completeLabel: "一起揭晓答案",
          }}
        />
      );
      break;
    case "handoff":
      screen = (
        <AsyncRevealScreen
          onComplete={() => controller.patchState({ step: "compatibility" })}
        />
      );
      break;
    case "compatibility":
      screen = state.compatibility ? (
        <CompatibilityScreen
          result={state.compatibility}
          participantNames={participantNames}
          skipAnalysis
          continueLabel="开启你们的约会盲盒"
          onContinue={() => controller.patchState({ step: "mystery-box" })}
        />
      ) : null;
      break;
    case "mystery-box":
      screen = <MysteryBoxScreen onOpen={controller.openMysteryBox} />;
      break;
    case "plan":
      screen = selectedPlan ? (
        <DatePlanScreen
          plan={selectedPlan}
          planChangeCount={state.planChangeCount}
          notice={controller.planNotice}
          onChangePlan={controller.changePlan}
          onSavePlan={controller.savePlan}
          onStart={() => controller.patchState({ step: "active-date" })}
        />
      ) : null;
      break;
    case "active-date":
      screen = selectedPlan ? (
        <ActiveDateScreen
          plan={selectedPlan}
          completedStepIds={state.completedStepIds}
          skippedStepIds={state.skippedStepIds}
          onResolveStep={controller.resolveStep}
          onFinish={() => controller.patchState({ step: "memory" })}
        />
      ) : null;
      break;
    case "memory":
      screen = selectedPlan ? (
        <MemoryCardScreen
          gameState={gameState}
          plan={selectedPlan}
          onFavoriteMomentChange={controller.updateFavoriteMoment}
          onMessageChange={controller.updateMessage}
          onSave={controller.saveMemory}
          onCopyResult={controller.handleCopyResult}
          onRequestReset={() => controller.setResetDialogOpen(true)}
        />
      ) : null;
      break;
  }

  return (
    <>
      <AppShell
        header={(
          <BrandHeader
            currentLabel={stepLabels[state.step]}
            isWelcome={state.step === "welcome"}
            progress={stepProgress[state.step]}
            onBack={state.step === "player-b-quiz" ? () => controller.patchState({ step: "welcome" }) : undefined}
            onReset={state.step === "welcome" ? undefined : () => controller.setResetDialogOpen(true)}
          />
        )}
        stickyHeader
        contentWidth={state.step === "player-b-quiz" ? "quiz" : "standard"}
      >
        {screen}
      </AppShell>

      <ConfirmationDialog
        open={controller.resetDialogOpen}
        title="要离开这份邀请吗？"
        description="当前设备里的答题和约会进度会被清空。"
        confirmLabel="离开并返回首页"
        cancelLabel="继续保留"
        onConfirm={controller.confirmReset}
        onCancel={() => controller.setResetDialogOpen(false)}
      />
      <Toast
        open={controller.toastOpen}
        message={controller.toastMessage}
        tone="success"
      />
    </>
  );
}

export function AsyncGuestFlow({ invite, result }: AsyncGuestFlowProps) {
  const parse = useCallback(
    (rawValue: string) => parseAsyncGuestSession(rawValue, invite),
    [invite],
  );
  const storage = useLocalStorage<AsyncGuestSessionState>({
    key: getAsyncGuestStorageKey(invite.id),
    parse,
    serialize: serializeAsyncGuestSession,
  });
  const initialState = useMemo(() => {
    if (storage.status === "restored" && storage.storedValue) {
      const restored = storage.storedValue;
      if (!result || !["welcome", "player-b-quiz"].includes(restored.step)) {
        return restored;
      }
    }
    return result
      ? createResultInitialState(invite, result)
      : createInitialAsyncGuestSession(invite);
  }, [invite, result, storage.status, storage.storedValue]);

  if (!storage.isHydrated) {
    return (
      <AppShell>
        <GameLoadingScreen />
      </AppShell>
    );
  }

  return (
    <AsyncGuestSession
      key={invite.id}
      invite={invite}
      initialState={initialState}
      saveState={storage.save}
      clearState={storage.clear}
    />
  );
}
