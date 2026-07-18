"use client";

import { useCallback, useEffect, useState } from "react";
import { LoaderCircle, RotateCcw } from "lucide-react";

import { CreateInviteIntroScreen } from "@/components/async-invite/create-invite-intro-screen";
import { SharePlaceholderScreen } from "@/components/async-invite/share-placeholder-screen";
import { MoodScreen } from "@/components/date-game/mood-screen";
import { PreferencesScreen } from "@/components/date-game/preferences-screen";
import { QuizScreen } from "@/components/date-game/quiz-screen";
import { AppShell } from "@/components/layout/app-shell";
import { BrandHeader } from "@/components/layout/brand-header";
import { PrimaryButton } from "@/components/ui/primary-button";
import { createInviteUrl } from "@/lib/async-invite-codec";
import { createInitialAsyncHostSessionState } from "@/lib/async-host-session";
import { createClientInviteId } from "@/lib/client-invite-id";
import {
  DEFAULT_ASYNC_INVITE_DURATION_MS,
  type AsyncHostSessionState,
  type AsyncHostStep,
  type AsyncInvitePayload,
} from "@/types/async-invite";
import type { DatePreferences, MoodId } from "@/types/date-game";

interface AsyncHostFlowProps {
  initialState: AsyncHostSessionState;
  saveState: (state: AsyncHostSessionState) => boolean;
  clearState: () => boolean;
  onBackHome: () => void;
}

const stepLabels: Record<AsyncHostStep, string> = {
  "create-intro": "写下你们的称呼",
  mood: "选择你的心情",
  preferences: "补充今晚的条件",
  "host-quiz": "写下你的期待",
  generating: "生成心动邀请",
  "share-placeholder": "邀请已经生成",
};

const stepProgress: Record<AsyncHostStep, number> = {
  "create-intro": 0.08,
  mood: 0.24,
  preferences: 0.45,
  "host-quiz": 0.68,
  generating: 0.9,
  "share-placeholder": 1,
};

export function AsyncHostFlow({
  initialState,
  saveState,
  clearState,
  onBackHome,
}: AsyncHostFlowProps) {
  const [state, setState] = useState(initialState);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generationAttempt, setGenerationAttempt] = useState(0);

  const commit = useCallback(
    (nextState: AsyncHostSessionState) => {
      setState(nextState);
      saveState(nextState);
    },
    [saveState],
  );

  const patchState = useCallback(
    (patch: Partial<AsyncHostSessionState>) => {
      commit({ ...state, ...patch });
    },
    [commit, state],
  );

  useEffect(() => {
    if (state.step !== "generating") {
      return;
    }

    const generationTimer = window.setTimeout(() => {
      try {
        const createdAt = Date.now();
        const guestName = state.guestName.trim();
        const payload: AsyncInvitePayload = {
          v: 1,
          id: createClientInviteId(),
          createdAt,
          expiresAt: createdAt + DEFAULT_ASYNC_INVITE_DURATION_MS,
          hostName: state.hostName.trim(),
          ...(guestName ? { guestName } : {}),
          preferences: state.preferences,
          hostAnswers: state.hostAnswers,
        };
        const inviteUrl = createInviteUrl(window.location.href, payload);
        commit({
          ...state,
          step: "share-placeholder",
          hostName: payload.hostName,
          guestName,
          inviteUrl,
          inviteCreatedAt: createdAt,
        });
      } catch {
        setGenerationError("这次没能安全生成邀请，请返回检查选择后再试一次。");
      }
    }, 650);

    return () => window.clearTimeout(generationTimer);
  }, [commit, generationAttempt, state]);

  function updatePreferences(patch: Partial<DatePreferences>) {
    patchState({ preferences: { ...state.preferences, ...patch } });
  }

  function updateAnswer(questionIndex: number, answerId: string) {
    const hostAnswers = [...state.hostAnswers];
    hostAnswers[questionIndex] = answerId;
    patchState({ hostAnswers });
  }

  function restartInvite() {
    clearState();
    setGenerationError(null);
    setState(createInitialAsyncHostSessionState());
  }

  let screen;
  switch (state.step) {
    case "create-intro":
      screen = (
        <CreateInviteIntroScreen
          hostName={state.hostName}
          guestName={state.guestName}
          onHostNameChange={(hostName) => patchState({ hostName })}
          onGuestNameChange={(guestName) => patchState({ guestName })}
          onBack={onBackHome}
          onContinue={() => patchState({
            step: "mood",
            hostName: state.hostName.trim(),
            guestName: state.guestName.trim(),
          })}
        />
      );
      break;
    case "mood":
      screen = (
        <MoodScreen
          selectedMood={state.preferences.mood}
          onSelect={(mood: MoodId) => updatePreferences({ mood })}
          onBack={() => patchState({ step: "create-intro" })}
          onContinue={() => patchState({ step: "preferences" })}
          copy={{
            eyebrow: "02 · YOUR MOOD",
            title: "今晚，你最想靠近哪一种感觉？",
            description: "先只替自己选一个最真实的答案。",
            backLabel: "返回邀请信息",
          }}
        />
      );
      break;
    case "preferences":
      screen = (
        <PreferencesScreen
          preferences={state.preferences}
          onTimeChange={(time) => updatePreferences({ time })}
          onBudgetChange={(budget) => updatePreferences({ budget })}
          onDistanceChange={(distance) => updatePreferences({ distance })}
          onRelationshipChange={(relationship) => updatePreferences({ relationship })}
          onBack={() => patchState({ step: "mood" })}
          onContinue={() => patchState({ step: "host-quiz" })}
          copy={{
            eyebrow: "03 · LITTLE DETAILS",
            title: "给你的期待加一点小小设定",
            description: "这些固定选择会和五道答案一起写入邀请链接。",
            continueLabel: "开始写下我的期待",
          }}
        />
      );
      break;
    case "host-quiz":
      screen = (
        <QuizScreen
          player="playerA"
          answers={state.hostAnswers}
          onAnswer={updateAnswer}
          onExit={() => patchState({ step: "preferences" })}
          onComplete={() => patchState({ step: "generating" })}
          copy={{
            label: "邀请人 · 你",
            title: "先偷偷写下你的期待",
            description: "在TA完成之前，你的答案不会显示在页面上。",
            exitLabel: "返回条件设置",
            completeLabel: "生成我的心动邀请",
          }}
        />
      );
      break;
    case "generating":
      screen = (
        <section className="mx-auto flex min-h-[62dvh] w-full max-w-lg items-center justify-center text-center">
          <div>
            {generationError ? (
              <>
                <p className="text-base leading-7 text-text-secondary" role="alert">
                  {generationError}
                </p>
                <PrimaryButton
                  className="mt-6"
                  onClick={() => {
                    setGenerationError(null);
                    setGenerationAttempt((attempt) => attempt + 1);
                  }}
                >
                  再试一次
                  <RotateCcw aria-hidden="true" className="size-4.5" />
                </PrimaryButton>
              </>
            ) : (
              <>
                <span className="mx-auto grid size-16 place-items-center rounded-full border border-border-pink bg-pink-50 text-pink-600 shadow-[var(--shadow-pink)]">
                  <LoaderCircle aria-hidden="true" className="size-6 animate-spin" />
                </span>
                <h1 className="mt-6 text-2xl font-semibold text-text-primary">
                  正在生成你的心动邀请
                </h1>
                <p className="mt-3 text-sm leading-7 text-text-secondary">
                  把称呼、固定选择和五道期待轻轻装进链接里。
                </p>
              </>
            )}
          </div>
        </section>
      );
      break;
    case "share-placeholder":
      screen = state.inviteUrl ? (
        <SharePlaceholderScreen inviteUrl={state.inviteUrl} onBackHome={onBackHome} />
      ) : null;
      break;
  }

  return (
    <AppShell
      header={
        <BrandHeader
          currentLabel={stepLabels[state.step]}
          progress={stepProgress[state.step]}
          onReset={restartInvite}
        />
      }
      stickyHeader
      contentWidth={state.step === "host-quiz" ? "quiz" : "standard"}
    >
      {screen}
    </AppShell>
  );
}
