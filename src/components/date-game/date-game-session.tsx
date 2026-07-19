"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { DateGameScreen } from "@/components/date-game/date-game-screen";
import { RecoveryCard } from "@/components/date-game/recovery-card";
import { AppShell } from "@/components/layout/app-shell";
import { BrandHeader } from "@/components/layout/brand-header";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Toast } from "@/components/ui/toast";
import { datePlans } from "@/data/date-plans";
import { useDateGameController } from "@/hooks/use-date-game-controller";
import { gameStepOrder, stepLabels } from "@/lib/date-game-state";
import type { DateGameState } from "@/types/date-game";

interface DateGameSessionProps {
  initialState: DateGameState;
  startWithRecovery: boolean;
  initialNotice: string | null;
  saveState: (state: DateGameState) => boolean;
  clearStorage: () => boolean;
  onCreateInvite: () => void;
}

export function DateGameSession({
  initialState,
  startWithRecovery,
  initialNotice,
  saveState,
  clearStorage,
  onCreateInvite,
}: DateGameSessionProps) {
  const controller = useDateGameController({
    initialState,
    startWithRecovery,
    initialNotice,
    saveState,
    clearStorage,
  });
  const shouldReduceMotion = useReducedMotion();
  const selectedPlan = datePlans.find(
    (plan) => plan.id === controller.gameState.selectedPlanId,
  );
  const {
    gameState,
    recoveryOpen,
    toastMessage,
    toastOpen,
    setToastOpen,
  } = controller;
  const currentStepIndex = gameStepOrder.indexOf(gameState.step);
  const headerProgress =
    currentStepIndex < 0 ? 0 : currentStepIndex / (gameStepOrder.length - 1);
  const headerBackAction = (() => {
    switch (gameState.step) {
      case "mood":
        return () => controller.updateStep("welcome");
      case "preferences":
        return () => controller.updateStep("mood");
      case "player-a-quiz":
        return () => controller.updateStep("preferences");
      case "player-b-quiz":
        return () => controller.updateStep("handoff");
      case "compatibility":
        return controller.handleCompatibilityBack;
      case "mystery-box":
        return () => controller.updateStep("compatibility");
      default:
        return undefined;
    }
  })();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [gameState.step, recoveryOpen]);

  useEffect(() => {
    if (!toastOpen) {
      return;
    }

    const timeoutId = window.setTimeout(() => setToastOpen(false), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [setToastOpen, toastMessage, toastOpen]);

  const screenMotion = shouldReduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.12 },
      }
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
      };

  const screen = recoveryOpen ? (
    <RecoveryCard
      isMemory={gameState.step === "memory"}
      planTitle={selectedPlan?.title ?? null}
      onContinue={controller.continueRecovery}
      onRestart={controller.requestReset}
    />
  ) : (
    <DateGameScreen
      gameState={gameState}
      playerBInitialQuestion={controller.playerBInitialQuestion}
      planNotice={controller.planNotice}
      onStepChange={controller.updateStep}
      onPreferencesChange={controller.updatePreferences}
      onMoodChange={controller.handleMoodChange}
      onMoodContinue={controller.handleMoodContinue}
      onPreferencesContinue={controller.handlePreferencesContinue}
      onPlayerAAnswer={controller.handlePlayerAAnswer}
      onPlayerBAnswer={controller.handlePlayerBAnswer}
      onPlayerAComplete={controller.handlePlayerAComplete}
      onPlayerBComplete={controller.handlePlayerBComplete}
      onHandoffContinue={controller.handleHandoffContinue}
      onCompatibilityBack={controller.handleCompatibilityBack}
      onMysteryBoxOpen={controller.handleMysteryBoxOpen}
      onChangePlan={controller.handleChangePlan}
      onSavePlan={controller.handleSavePlan}
      onResolveDateStep={controller.handleResolveDateStep}
      onActiveDateFinish={controller.handleActiveDateFinish}
      onFavoriteMomentChange={controller.handleFavoriteMomentChange}
      onMessageChange={controller.handleMessageChange}
      onSaveMemory={controller.handleSaveMemory}
      onCopyResult={controller.handleCopyResult}
      onRequestReset={controller.requestReset}
      onCreateInvite={onCreateInvite}
    />
  );

  return (
    <>
      <AppShell
        header={
          <BrandHeader
            currentLabel={stepLabels[gameState.step]}
            isWelcome={gameState.step === "welcome" && !recoveryOpen}
            progress={headerProgress}
            onBack={recoveryOpen ? undefined : headerBackAction}
            onReset={controller.requestReset}
          />
        }
        stickyHeader={gameState.step !== "welcome" || recoveryOpen}
        contentWidth={
          gameState.step === "player-a-quiz" ||
          gameState.step === "player-b-quiz" ||
          gameState.step === "handoff"
            ? "quiz"
            : "standard"
        }
        className={gameState.step === "welcome" ? "pt-5 sm:pt-8 lg:py-8" : undefined}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={recoveryOpen ? "recovery" : gameState.step} {...screenMotion}>
            {screen}
          </motion.div>
        </AnimatePresence>
      </AppShell>

      <ConfirmationDialog
        open={controller.resetDialogOpen}
        title="要重新开始一份计划吗？"
        description="当前选择和约会进度会被清空。"
        confirmLabel="重新开始"
        cancelLabel="继续保留"
        onConfirm={controller.confirmReset}
        onCancel={controller.cancelReset}
      />
      <Toast open={toastOpen} message={toastMessage} tone={controller.toastTone} />
    </>
  );
}
