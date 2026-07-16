import { Check, Circle, Forward } from "lucide-react";

import { GlassPanel } from "@/components/ui/glass-panel";
import { cn } from "@/lib/cn";
import type { DatePlan } from "@/types/date-game";

interface ActiveDateRouteProps {
  plan: DatePlan;
  currentStepId: string;
  completedStepIds: string[];
  skippedStepIds: string[];
}

export function ActiveDateRoute({
  plan,
  currentStepId,
  completedStepIds,
  skippedStepIds,
}: ActiveDateRouteProps) {
  return (
    <GlassPanel intensity="soft" className="p-5 sm:p-6">
      <p className="text-xs font-semibold tracking-[0.14em] text-text-muted">
        TONIGHT&apos;S ROUTE
      </p>
      <h2 className="mt-1 text-lg font-semibold text-text-primary">
        {plan.title}
      </h2>
      <ol className="relative mt-5 space-y-1">
        {plan.steps.map((step, index) => {
          const isCompleted = completedStepIds.includes(step.id);
          const isSkipped = skippedStepIds.includes(step.id);
          const isCurrent = step.id === currentStepId;

          return (
            <li key={step.id} className="relative flex gap-3 pb-4 last:pb-0">
              {index < plan.steps.length - 1 ? (
                <span className="absolute left-[15px] top-8 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-pink-200 to-purple-200" />
              ) : null}
              <span
                className={cn(
                  "relative z-10 grid size-8 shrink-0 place-items-center rounded-full border bg-white/72",
                  isCompleted && "border-pink-300 text-pink-600",
                  isSkipped && "border-purple-200 text-purple-400",
                  isCurrent &&
                    "border-pink-400 bg-pink-50 text-pink-600 shadow-[0_8px_20px_rgba(223,93,155,0.16)]",
                  !isCompleted &&
                    !isSkipped &&
                    !isCurrent &&
                    "border-white text-text-muted",
                )}
              >
                {isCompleted ? (
                  <Check aria-hidden="true" className="size-4" />
                ) : isSkipped ? (
                  <Forward aria-hidden="true" className="size-3.5" />
                ) : (
                  <Circle aria-hidden="true" className="size-2.5 fill-current" />
                )}
              </span>
              <div className="min-w-0 pt-0.5">
                <p
                  className={cn(
                    "text-sm font-semibold leading-5",
                    isCurrent ? "text-pink-600" : "text-text-primary",
                  )}
                >
                  {step.title}
                </p>
                <p className="mt-0.5 text-xs text-text-muted">
                  {isCompleted
                    ? "已完成"
                    : isSkipped
                      ? "已跳过"
                      : isCurrent
                        ? `${step.time} · 正在进行`
                        : step.time}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="mt-5 grid grid-cols-2 gap-2 border-t border-white/65 pt-4 text-center">
        <div className="rounded-2xl bg-white/35 px-2 py-3">
          <p className="font-mono text-lg font-semibold text-pink-600">
            {completedStepIds.length}
          </p>
          <p className="mt-0.5 text-xs text-text-muted">已完成节点</p>
        </div>
        <div className="rounded-2xl bg-white/35 px-2 py-3">
          <p className="font-mono text-lg font-semibold text-purple-500">
            {skippedStepIds.length}
          </p>
          <p className="mt-0.5 text-xs text-text-muted">跳过节点</p>
        </div>
      </div>
    </GlassPanel>
  );
}
