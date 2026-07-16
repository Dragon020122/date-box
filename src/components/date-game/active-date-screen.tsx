"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CheckCircle2,
  Clock3,
  Forward,
  Gift,
  Sparkles,
} from "lucide-react";

import { ActiveDateCompletion } from "@/components/date-game/active-date-completion";
import { ActiveDateRoute } from "@/components/date-game/active-date-route";
import { DatePlanStepIcon } from "@/components/date-game/date-plan-step-icon";
import { SurpriseTaskSheet } from "@/components/date-game/surprise-task-sheet";
import { GlassPanel } from "@/components/ui/glass-panel";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { surpriseTasks } from "@/data/surprise-tasks";
import {
  chooseUnseenItem,
  getCurrentDateStep,
  getDateProgress,
  type StepResolution,
} from "@/lib/active-date-state";
import type { DatePlan } from "@/types/date-game";

interface ActiveDateScreenProps {
  plan: DatePlan;
  completedStepIds: string[];
  skippedStepIds: string[];
  onResolveStep: (stepId: string, resolution: StepResolution) => void;
  onFinish: () => void;
}

export function ActiveDateScreen({
  plan,
  completedStepIds,
  skippedStepIds,
  onResolveStep,
  onFinish,
}: ActiveDateScreenProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [seenSurpriseTaskIds, setSeenSurpriseTaskIds] = useState<string[]>([]);
  const [surpriseTask, setSurpriseTask] = useState<string | null>(null);
  const transitionTimerRef = useRef<number | null>(null);
  const transitioningRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  const currentStep = getCurrentDateStep(
    plan.steps,
    completedStepIds,
    skippedStepIds,
  );
  const progress = getDateProgress(
    plan.steps,
    completedStepIds,
    skippedStepIds,
  );
  const currentIndex = currentStep
    ? plan.steps.findIndex((step) => step.id === currentStep.id)
    : plan.steps.length;

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
      }
      transitioningRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (currentStep || progress < 1) {
      return;
    }

    const finishTimerId = window.setTimeout(onFinish, shouldReduceMotion ? 500 : 1100);
    return () => window.clearTimeout(finishTimerId);
  }, [currentStep, onFinish, progress, shouldReduceMotion]);

  function handleResolve(resolution: StepResolution) {
    if (!currentStep || transitioningRef.current) {
      return;
    }

    transitioningRef.current = true;
    setIsTransitioning(true);
    setCelebrating(resolution === "completed");
    const delay = shouldReduceMotion ? 80 : resolution === "completed" ? 520 : 280;

    transitionTimerRef.current = window.setTimeout(() => {
      onResolveStep(currentStep.id, resolution);
      setIsTransitioning(false);
      setCelebrating(false);
      transitioningRef.current = false;
      transitionTimerRef.current = null;
    }, delay);
  }

  function handleSurprise() {
    if (isTransitioning) {
      return;
    }

    const result = chooseUnseenItem(surpriseTasks, seenSurpriseTaskIds);
    const selectedTask = result.item;
    if (!selectedTask) {
      return;
    }

    setSeenSurpriseTaskIds((currentIds) =>
      currentIds.includes(selectedTask.id)
        ? currentIds
        : [...currentIds, selectedTask.id],
    );
    setSurpriseTask(selectedTask.label);
  }

  if (!currentStep && progress >= 1) {
    return <ActiveDateCompletion />;
  }

  if (!currentStep) {
    return null;
  }

  return (
    <>
      <section className="mx-auto w-full max-w-5xl" aria-labelledby="active-date-title">
        <header className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-pink-600">
            <Sparkles aria-hidden="true" className="size-4" />
            DATE IN PROGRESS
          </p>
          <h1
            id="active-date-title"
            className="mt-2 text-[clamp(1.9rem,8vw,4rem)] font-semibold leading-[1.08] tracking-[-0.05em] text-text-primary sm:mt-3"
          >
            让今晚，一站一站发生
          </h1>
          <div className="mx-auto mt-4 max-w-xl sm:mt-6">
            <div className="flex items-center justify-between text-xs font-medium text-text-secondary">
              <span>总进度</span>
              <span>{Math.round(progress * 100)}%</span>
            </div>
            <div
              className="mt-2 h-2 overflow-hidden rounded-full bg-white/55 shadow-inner"
              role="progressbar"
              aria-label="今晚路线总进度"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress * 100)}
            >
              <motion.div
                className="h-full rounded-full [background:var(--gradient-primary)]"
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: shouldReduceMotion ? 0.1 : 0.45, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        </header>

        <div className="mt-5 grid gap-5 sm:mt-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <GlassPanel intensity="strong" className="relative overflow-hidden p-5 sm:p-7 lg:p-8">
            <div className="pointer-events-none absolute -right-20 -top-24 size-56 rounded-full bg-purple-200/30 blur-2xl sm:size-64 sm:blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -left-24 hidden size-64 rounded-full bg-pink-200/35 blur-3xl sm:block" />

            <AnimatePresence>
              {celebrating ? (
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {[18, 34, 52, 70, 84].map((left, index) => (
                    <motion.span
                      key={left}
                      className="absolute bottom-[28%] size-2 rounded-full bg-pink-300 shadow-[0_0_16px_rgba(233,94,155,0.55)]"
                      style={{ left: `${left}%` }}
                      animate={
                        shouldReduceMotion
                          ? { opacity: [0, 1, 0] }
                          : { y: [8, -80 - index * 7], opacity: [0, 1, 0], scale: [0.6, 1, 0.4] }
                      }
                      transition={{ duration: 0.52, delay: index * 0.035 }}
                    />
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>

            <motion.div
              key={currentStep.id}
              className="relative"
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.1 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs font-semibold tracking-[0.12em] text-pink-600">
                    第 0{currentIndex + 1} 个任务
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-text-secondary">
                    <Clock3 aria-hidden="true" className="size-4 text-purple-400" />
                    当前时间 · {currentStep.time}
                  </p>
                </div>
                <span className="grid size-14 shrink-0 place-items-center rounded-[1.25rem] border border-white/90 bg-[linear-gradient(145deg,var(--pink-100),var(--purple-100))] text-pink-600 shadow-[var(--shadow-pink)]">
                  <DatePlanStepIcon name={currentStep.icon} className="size-6" />
                </span>
              </div>

              <h2 className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.04em] text-text-primary sm:mt-8 sm:text-4xl">
                {currentStep.title}
              </h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-text-secondary sm:text-base sm:leading-8">
                {currentStep.description}
              </p>

              <div className="mt-7 rounded-[1.5rem] border border-white/90 bg-[linear-gradient(135deg,rgba(255,226,238,0.55),rgba(221,197,255,0.42))] p-5">
                <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.13em] text-pink-600">
                  <Gift aria-hidden="true" className="size-4" />
                  当前小任务
                </p>
                <p className="mt-2 text-[15px] font-medium leading-7 text-text-primary">
                  {currentStep.task ?? plan.secretTask}
                </p>
              </div>

              <button
                type="button"
                onClick={handleSurprise}
                disabled={isTransitioning}
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-dashed border-pink-200/80 bg-white/32 px-4 text-sm font-semibold text-text-secondary transition-colors hover:bg-pink-50/70 hover:text-pink-600 disabled:cursor-not-allowed disabled:opacity-45 sm:mt-6"
              >
                <Sparkles aria-hidden="true" className="size-4" />
                给我一个临时彩蛋
              </button>

              <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2">
                <PrimaryButton
                  onClick={() => handleResolve("completed")}
                  disabled={isTransitioning}
                  loading={isTransitioning && celebrating}
                  loadingLabel="正在点亮这一站"
                  className="w-full"
                >
                  <CheckCircle2 aria-hidden="true" className="size-5" />
                  已完成
                </PrimaryButton>
                <SecondaryButton
                  onClick={() => handleResolve("skipped")}
                  disabled={isTransitioning}
                  className="w-full"
                >
                  <Forward aria-hidden="true" className="size-4.5" />
                  暂时跳过
                </SecondaryButton>
              </div>
            </motion.div>
          </GlassPanel>

          <div className="hidden lg:block">
            <ActiveDateRoute
              plan={plan}
              currentStepId={currentStep.id}
              completedStepIds={completedStepIds}
              skippedStepIds={skippedStepIds}
            />
          </div>
        </div>
      </section>

      <SurpriseTaskSheet
        open={surpriseTask !== null}
        task={surpriseTask}
        onClose={() => setSurpriseTask(null)}
      />
    </>
  );
}
