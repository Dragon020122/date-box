"use client";

import { Blend, LockKeyhole, Route, RotateCcw, Sparkles } from "lucide-react";

import { AsyncResultCard } from "@/components/async-invite/async-result-card";
import { PrimaryButton } from "@/components/ui/primary-button";
import { datePlans } from "@/data/date-plans";
import { calculateCompatibility } from "@/lib/compatibility";
import { generateDatePlan } from "@/lib/plan-generator";
import type { AsyncResultPayload } from "@/types/async-invite";

interface AsyncResultViewerScreenProps {
  result: AsyncResultPayload;
  onRestart: () => void;
}

export function AsyncResultViewerScreen({
  result,
  onRestart,
}: AsyncResultViewerScreenProps) {
  const hostName = result.invite.hostName.trim() || "邀请人";
  const guestName = result.invite.guestName?.trim() || "TA";
  const compatibility = calculateCompatibility(
    result.invite.hostAnswers,
    result.guestAnswers,
    { playerA: hostName, playerB: guestName },
  );
  const plan = generateDatePlan({
    plans: datePlans,
    preferences: result.invite.preferences,
    playerAAnswers: result.invite.hostAnswers,
    playerBAnswers: result.guestAnswers,
  }).plan;

  return (
    <section className="mx-auto w-full max-w-5xl" aria-labelledby="async-result-viewer-title">
      <header className="mx-auto max-w-3xl text-center">
        <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-pink-600">
          <Sparkles aria-hidden="true" className="size-4" />
          THE ANSWER CAME BACK
        </p>
        <h1 id="async-result-viewer-title" className="mt-3 text-[clamp(2.25rem,9vw,4.5rem)] font-semibold leading-[1.06] tracking-[-0.055em] text-text-primary">
          你们的答案已经一起揭晓
        </h1>
        <p className="mt-4 text-sm font-semibold tracking-[0.1em] text-purple-500 sm:text-base">
          {hostName} <span className="mx-1 text-text-muted">×</span> {guestName}
        </p>
      </header>

      <div className="mt-8 grid gap-7 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start lg:gap-10">
        <div className="flex justify-center lg:sticky lg:top-28">
          <AsyncResultCard result={result} compatibility={compatibility} plan={plan} />
        </div>

        <div className="space-y-5">
          <article className="rounded-[2rem_2rem_2rem_0.7rem] border border-white/90 bg-[#fffdfb] p-6 shadow-[0_24px_70px_rgba(76,49,65,0.1)] sm:p-8">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.17em] text-pink-600">HEARTBEAT SCORE</p>
                <h2 className="mt-2 text-2xl font-semibold leading-9 tracking-[-0.03em] text-text-primary">{compatibility.title}</h2>
              </div>
              <p className="shrink-0 font-mono text-4xl font-semibold tracking-[-0.06em] text-text-primary">
                {compatibility.displayScore}<span className="ml-1 text-xs font-sans text-text-muted">/100</span>
              </p>
            </div>
            <p className="mt-3 text-sm leading-7 text-text-secondary">{compatibility.description}</p>
          </article>

          <div className="grid gap-4 sm:grid-cols-2">
            <section className="rounded-[1.5rem_1.5rem_1.5rem_0.55rem] border border-pink-200/75 bg-pink-50/68 p-5" aria-labelledby="viewer-shared-title">
              <h2 id="viewer-shared-title" className="text-sm font-semibold text-text-primary">共同期待</h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-text-secondary">
                {compatibility.sharedInsights.map((insight) => <li key={insight}>{insight}</li>)}
              </ul>
            </section>
            <section className="rounded-[0.7rem_1.5rem_1.5rem_1.5rem] border border-purple-200/80 bg-purple-100/45 p-5" aria-labelledby="viewer-complementary-title">
              <h2 id="viewer-complementary-title" className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                <Blend aria-hidden="true" className="size-4 text-purple-500" />互补期待
              </h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-text-secondary">
                {compatibility.complementaryInsights.map((insight) => <li key={insight}>{insight}</li>)}
              </ul>
            </section>
          </div>

          <section className="rounded-[1.75rem] border border-border-soft bg-surface-strong p-6 sm:p-8" aria-labelledby="viewer-plan-title">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-[0.95rem] bg-text-primary text-white"><Route aria-hidden="true" className="size-5" /></span>
              <div>
                <p className="text-[10px] font-semibold tracking-[0.17em] text-pink-600">RECOMMENDED PLAN</p>
                <h2 id="viewer-plan-title" className="mt-0.5 text-2xl font-semibold text-text-primary">{plan.title}</h2>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-text-secondary">{compatibility.planSuggestion}</p>
            <ol className="mt-5 space-y-3 border-t border-dashed border-border-pink pt-5">
              {plan.steps.map((step) => (
                <li key={step.id} className="grid grid-cols-[66px_minmax(0,1fr)] gap-3 text-sm">
                  <span className="font-mono text-xs font-semibold text-pink-600">{step.time}</span>
                  <span className="font-medium text-text-primary">{step.title}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-[0.7rem_1.5rem_1.5rem_1.5rem] border border-pink-200/80 bg-[#f8e8ed] p-6" aria-labelledby="viewer-secret-title">
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-pink-600">
              <LockKeyhole aria-hidden="true" className="size-4" />共同计划的隐藏任务
            </p>
            <h2 id="viewer-secret-title" className="sr-only">隐藏任务</h2>
            <p className="mt-3 text-[15px] font-medium leading-7 text-text-primary">{plan.secretTask}</p>
          </section>

          <div className="flex justify-center pt-2 sm:justify-end">
            <PrimaryButton onClick={onRestart}>
              <RotateCcw aria-hidden="true" className="size-4.5" />
              重新开始一份计划
            </PrimaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}
