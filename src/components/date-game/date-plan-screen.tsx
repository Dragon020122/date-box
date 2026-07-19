import {
  ArrowRight,
  Bookmark,
  Clock3,
  LockKeyhole,
  Mail,
  RefreshCw,
  Route,
  Send,
  Sparkles,
} from "lucide-react";

import { DatePlanStepIcon } from "@/components/date-game/date-plan-step-icon";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { MAX_PLAN_CHANGES } from "@/lib/plan-generator";
import type { DatePlan } from "@/types/date-game";

interface DatePlanScreenProps {
  plan: DatePlan;
  planChangeCount: number;
  notice: string | null;
  onChangePlan: () => void;
  onSavePlan: () => void;
  onStart: () => void;
  onShareResult?: () => void;
}

export function DatePlanScreen({
  plan,
  planChangeCount,
  notice,
  onChangePlan,
  onSavePlan,
  onStart,
  onShareResult,
}: DatePlanScreenProps) {
  const remainingChanges = Math.max(0, MAX_PLAN_CHANGES - planChangeCount);

  return (
    <section className="mx-auto w-full max-w-5xl" aria-labelledby="plan-title">
      <header className="mx-auto max-w-3xl text-center">
        <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] text-pink-600 sm:text-sm">
          <Sparkles aria-hidden="true" className="size-4" />
          今晚属于你们的计划是
        </p>
        <h1
          id="plan-title"
          className="mt-4 text-[clamp(2.5rem,9vw,4.75rem)] font-semibold leading-[1.04] tracking-[-0.055em] text-text-primary"
        >
          {plan.title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg font-medium leading-8 text-pink-600 sm:text-xl">
          {plan.subtitle}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/85 bg-surface px-3.5 py-2 text-xs font-medium text-text-secondary backdrop-blur-xl">
            <Clock3 aria-hidden="true" className="size-3.5 text-pink-600" />
            {plan.duration}
          </span>
          {plan.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/80 bg-surface-soft px-3.5 py-2 text-xs font-medium text-text-secondary backdrop-blur-md"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-7 text-text-secondary sm:text-base sm:leading-8">
          {plan.summary}
        </p>
      </header>

      <section className="mt-7 rounded-[1.75rem_1.75rem_1.75rem_0.75rem] border border-border-soft bg-[#fffdfb] px-4 py-5 shadow-[0_24px_70px_rgba(76,49,65,0.09)] sm:mt-10 sm:px-7 sm:py-8 lg:px-10" aria-labelledby="route-title">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-[0.95rem] bg-text-primary text-white">
            <Route aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-text-muted">
              FOUR LITTLE STOPS
            </p>
            <h2 id="route-title" className="mt-0.5 text-xl font-semibold text-text-primary">
              今晚路线
            </h2>
          </div>
        </div>

        <div className="relative mt-7">
          <div className="absolute bottom-5 left-[19px] top-5 w-px bg-gradient-to-b from-pink-300 via-pink-200 to-purple-300 md:left-[151px]" aria-hidden="true" />
          <ol className="relative space-y-2">
            {plan.steps.map((step, index) => {
              return (
                <li
                  key={step.id}
                className="relative grid min-h-24 grid-cols-[40px_minmax(0,1fr)] gap-4 border-b border-dashed border-border-soft py-4 last:border-b-0 sm:min-h-28 sm:py-5 md:grid-cols-[118px_42px_minmax(0,1fr)] md:gap-4"
                >
                  <p className="hidden self-center text-right font-mono text-xs font-semibold tracking-[0.08em] text-pink-600 md:block">
                    {step.time}
                  </p>

                  <span className="z-10 grid size-10 place-items-center rounded-full border-4 border-[#fffdfb] bg-[linear-gradient(145deg,var(--pink-100),var(--purple-100))] text-pink-600 md:size-11">
                    <DatePlanStepIcon name={step.icon} />
                  </span>

                  <article className="min-w-0 self-center">
                    <p className="font-mono text-[11px] font-semibold tracking-[0.12em] text-pink-600 md:hidden">
                      {step.time} · STOP 0{index + 1}
                    </p>
                    <p className="hidden text-[10px] font-semibold tracking-[0.16em] text-text-muted md:block">STOP 0{index + 1}</p>
                    <h3 className="mt-1 font-semibold leading-6 text-text-primary sm:text-lg">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 max-w-2xl text-sm leading-6 text-text-secondary">
                      {step.description}
                    </p>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <div className="mx-auto mt-7 grid max-w-4xl gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative overflow-hidden rounded-[0.75rem_1.65rem_1.65rem_1.65rem] border border-pink-200/80 bg-[#f8e8ed] p-6 sm:p-7">
          <div className="pointer-events-none absolute inset-y-0 left-[4.15rem] border-l border-dashed border-pink-300/70" />
          <div className="relative flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-[0.9rem] bg-text-primary text-white">
              <Mail aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.14em] text-pink-600">
                <LockKeyhole aria-hidden="true" className="size-3.5" />
                密封的隐藏任务
              </p>
              <p className="mt-2 text-[15px] font-medium leading-7 text-text-primary">
                {plan.secretTask}
              </p>
            </div>
          </div>
        </div>

        <blockquote className="flex items-center border-l-2 border-purple-300 bg-transparent p-6 text-[15px] font-medium leading-7 text-text-secondary sm:p-7">
          “{plan.endingQuote}”
        </blockquote>
      </div>

      <div className="sticky bottom-0 z-20 -mx-[18px] mt-6 max-w-4xl bg-[linear-gradient(0deg,rgba(255,250,247,0.99)_0%,rgba(255,250,247,0.92)_76%,transparent_100%)] px-[18px] pb-[calc(0.75rem+var(--safe-bottom))] pt-5 backdrop-blur-md sm:static sm:mx-auto sm:mt-8 sm:bg-none sm:p-0 sm:backdrop-blur-none" aria-live="polite">
        {notice ? (
          <p className="mb-3 text-center text-sm font-medium text-pink-600">
            {notice}
          </p>
        ) : null}

        <div className="flex flex-col-reverse gap-3 rounded-[1.4rem] border border-border-soft bg-surface p-3 shadow-[var(--shadow-soft)] sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:p-5">
          <div className="text-center sm:text-left">
            <SecondaryButton
              onClick={onChangePlan}
              disabled={remainingChanges === 0}
              className="w-full sm:w-auto"
            >
              <RefreshCw aria-hidden="true" className="size-4" />
              换一个计划
            </SecondaryButton>
            <p className="mt-2 text-xs text-text-muted">
              {remainingChanges > 0
                ? `还可以偷偷换 ${remainingChanges} 次`
                : "今晚的候选计划已经全部看过啦"}
            </p>
          </div>

          <PrimaryButton onClick={onStart} className="w-full sm:w-auto">
            开始今晚的约会
            <ArrowRight aria-hidden="true" className="size-4.5" />
          </PrimaryButton>
        </div>

        <div className="mt-2 flex flex-col items-center justify-center gap-1 sm:mt-3 sm:flex-row">
          <button
            type="button"
            onClick={onSavePlan}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-text-secondary transition-colors hover:bg-white/45 hover:text-pink-600"
          >
            <Bookmark aria-hidden="true" className="size-4" />
            保存这份计划
          </button>
          {onShareResult ? (
            <button
              type="button"
              onClick={onShareResult}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-text-secondary transition-colors hover:bg-white/45 hover:text-pink-600"
            >
              <Send aria-hidden="true" className="size-4" />
              把结果发回给TA
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
