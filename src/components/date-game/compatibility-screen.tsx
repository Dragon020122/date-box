"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Blend, Route, Sparkles } from "lucide-react";

import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { PrimaryButton } from "@/components/ui/primary-button";
import { ProgressOrbit } from "@/components/ui/progress-orbit";
import { SecondaryButton } from "@/components/ui/secondary-button";
import type { CompatibilityResult } from "@/types/date-game";

const analysisMessages = [
  "正在收集你们的小期待",
  "正在寻找重合的心动",
  "正在拼出今晚的路线",
] as const;

interface CompatibilityScreenProps {
  result: CompatibilityResult;
  onBack: () => void;
  onContinue: () => void;
}

export function CompatibilityScreen({
  result,
  onBack,
  onContinue,
}: CompatibilityScreenProps) {
  const [analysisIndex, setAnalysisIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showBackDialog, setShowBackDialog] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const trajectoryLabel =
    result.matchedCount > 0
      ? `你们有 ${result.matchedCount} 个选择走向同一条轨迹`
      : "不同的选择，正在拼成同一条今晚路线";

  useEffect(() => {
    const messageDelay = shouldReduceMotion ? 420 : 620;
    const timers = [
      window.setTimeout(() => setAnalysisIndex(1), messageDelay),
      window.setTimeout(() => setAnalysisIndex(2), messageDelay * 2),
      window.setTimeout(() => setShowResult(true), messageDelay * 3 + 80),
    ];

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [shouldReduceMotion]);

  return (
    <section className="mx-auto min-h-[700px] w-full max-w-4xl" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        {!showResult ? (
          <motion.div
            key="analysis"
            className="flex min-h-[62dvh] flex-col items-center justify-center text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
          >
            <ProgressOrbit
              progress={(analysisIndex + 1) / analysisMessages.length}
              size={174}
              label="正在分析两个人的答案"
            >
              <motion.span
                animate={shouldReduceMotion ? undefined : { scale: [1, 1.08, 1] }}
                transition={{ duration: 2.8, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
                className="grid size-20 place-items-center rounded-full bg-[linear-gradient(145deg,var(--pink-50),var(--purple-100))] text-pink-600"
              >
                <Sparkles aria-hidden="true" className="size-8" strokeWidth={1.6} />
              </motion.span>
            </ProgressOrbit>
            <p className="mt-8 text-xs font-semibold tracking-[0.17em] text-pink-600">
              HEARTBEAT ANALYSIS
            </p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.h1
                key={analysisMessages[analysisIndex]}
                className="mt-3 min-h-12 text-2xl font-semibold tracking-[-0.025em] text-text-primary sm:text-3xl"
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: shouldReduceMotion ? 0.1 : 0.24 }}
              >
                {analysisMessages[analysisIndex]}
              </motion.h1>
            </AnimatePresence>
            <p className="mt-3 text-sm text-text-muted">只需要一点点时间</p>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.12 : 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <article className="relative overflow-hidden rounded-[2rem_2rem_2rem_0.75rem] border border-border-pink bg-[#fffdfb] p-5 shadow-[0_28px_80px_rgba(76,49,65,0.12)] sm:p-9 lg:grid lg:grid-cols-[250px_minmax(0,1fr)] lg:items-center lg:gap-12 lg:p-11">
              <div className="border-b border-dashed border-border-pink pb-5 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-9">
                <div className="flex items-center justify-center gap-3" aria-hidden="true">
                  <span className="size-3 rounded-full border-2 border-pink-400 bg-pink-50" />
                  <span className="h-px w-10 bg-gradient-to-r from-pink-300 to-text-primary" />
                  <span className="grid size-10 place-items-center rounded-full bg-text-primary text-white">
                    <Blend className="size-4.5" />
                  </span>
                  <span className="h-px w-10 bg-gradient-to-r from-text-primary to-purple-300" />
                  <span className="size-3 rounded-full border-2 border-purple-400 bg-purple-100" />
                </div>
                <p className="mt-3 text-center text-xs font-medium leading-5 text-pink-600">{trajectoryLabel}</p>
                <p className="mt-3 text-center text-[10px] font-semibold tracking-[0.14em] text-text-muted">今晚的默契温度</p>
                <p className="mt-1 text-center font-mono text-5xl font-semibold tracking-[-0.06em] text-text-primary">
                  {result.displayScore}<span className="ml-1 text-base font-sans font-medium text-text-muted">/ 100</span>
                </p>
              </div>

              <div className="pt-5 lg:pt-0">
                <h1 className="mt-3 text-[clamp(2.25rem,6vw,3.75rem)] font-semibold leading-[1.06] tracking-[-0.05em] text-text-primary">
                  {result.title}
                </h1>
                <p className="mt-4 max-w-2xl text-[15px] leading-7 text-text-secondary sm:text-base sm:leading-8">
                  {result.description}
                </p>
              </div>

            </article>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1.12fr_0.88fr]">
              <section className="rounded-[1.5rem_1.5rem_1.5rem_0.55rem] border border-pink-200/75 bg-pink-50/68 p-5 sm:p-7" aria-labelledby="shared-title">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-[0.8rem] bg-pink-100 text-pink-600">
                    <Sparkles aria-hidden="true" className="size-4" />
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.16em] text-pink-600">YOU BOTH WANT</p>
                    <h2 id="shared-title" className="font-semibold text-text-primary">共同期待</h2>
                  </div>
                </div>
                <ul className="mt-4 space-y-2.5 text-[15px] leading-7 text-text-secondary">
                  {result.sharedInsights.map((insight) => (
                    <li key={insight} className="border-l-2 border-pink-200 pl-3">{insight}</li>
                  ))}
                </ul>
              </section>

              <section className="rounded-[0.7rem_1.5rem_1.5rem_1.5rem] border border-border-soft bg-transparent p-5 sm:p-7" aria-labelledby="complementary-title">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-purple-100 text-purple-500">
                    <Blend aria-hidden="true" className="size-4" />
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.16em] text-purple-500">DIFFERENT, IN A GOOD WAY</p>
                    <h2 id="complementary-title" className="font-semibold text-text-primary">互补期待</h2>
                  </div>
                </div>
                <ul className="mt-4 space-y-2.5 text-sm leading-6 text-text-secondary">
                  {result.complementaryInsights.map((insight) => (
                    <li key={insight}>{insight}</li>
                  ))}
                </ul>
              </section>
            </div>

            <section className="mt-4 flex flex-col gap-4 rounded-[1.25rem] border border-border-soft bg-surface-soft p-5 sm:flex-row sm:items-center sm:p-6" aria-labelledby="suggestion-title">
              <span className="grid size-10 shrink-0 place-items-center rounded-[0.9rem] bg-text-primary text-white">
                <Route aria-hidden="true" className="size-4.5" />
              </span>
              <div>
                <h2 id="suggestion-title" className="text-xs font-semibold tracking-[0.14em] text-text-muted">今晚建议</h2>
                <p className="mt-1 text-[15px] font-medium leading-7 text-text-primary sm:text-base">
                  {result.planSuggestion}
                </p>
              </div>
            </section>

            <div className="sticky bottom-0 z-20 -mx-[18px] mt-5 flex flex-col-reverse gap-2 bg-[linear-gradient(0deg,rgba(255,250,247,0.98)_0%,rgba(255,250,247,0.9)_72%,transparent_100%)] px-[18px] pb-[calc(0.75rem+var(--safe-bottom))] pt-5 backdrop-blur-md sm:static sm:mx-0 sm:mt-7 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:bg-none sm:p-0 sm:backdrop-blur-none">
              <SecondaryButton onClick={() => setShowBackDialog(true)} className="w-full sm:w-auto">
                <ArrowLeft aria-hidden="true" className="size-4.5" />
                返回看看最后一题
              </SecondaryButton>
              <PrimaryButton onClick={onContinue} className="w-full sm:w-auto">
                开启今晚的约会盲盒
                <ArrowRight aria-hidden="true" className="size-4.5" />
              </PrimaryButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmationDialog
        open={showBackDialog}
        title="要回到 TA 的最后一题吗？"
        description="你们的答案都会保留。再次提交后，默契结果会根据最新选择重新生成。"
        confirmLabel="返回最后一题"
        onCancel={() => setShowBackDialog(false)}
        onConfirm={onBack}
      />
    </section>
  );
}
