import {
  CalendarDays,
  CheckCircle2,
  Forward,
  LockKeyhole,
  MessageCircleHeart,
} from "lucide-react";

import type { DatePlan } from "@/types/date-game";

interface MemoryCardPreviewProps {
  dateLabel: string;
  plan: DatePlan;
  compatibilityScore: number;
  completedCount: number;
  skippedCount: number;
  keywords: string[];
  automaticMemory: string;
  favoriteMoment: string;
  messageToPartner: string;
}

export function MemoryCardPreview({
  dateLabel,
  plan,
  compatibilityScore,
  completedCount,
  skippedCount,
  keywords,
  automaticMemory,
  favoriteMoment,
  messageToPartner,
}: MemoryCardPreviewProps) {
  return (
    <article
      className="relative aspect-[3/4] w-full max-w-full overflow-hidden rounded-[1.6rem_1.6rem_1.6rem_0.65rem] border border-border-pink bg-[#fffaf5] p-4 shadow-[0_24px_60px_rgba(76,49,65,0.14)] sm:aspect-auto sm:min-h-[700px] sm:rounded-[1.9rem_1.9rem_1.9rem_0.7rem] sm:p-8"
      data-memory-card
    >
      <div className="pointer-events-none absolute inset-y-0 left-[4.8rem] hidden border-l border-dashed border-pink-200/80 sm:block" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-3 top-[28%] size-6 rounded-full border-r border-border-pink bg-[#faf5f4]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-3 top-[28%] size-6 rounded-full border-l border-border-pink bg-[#f8f3f7]" aria-hidden="true" />

      <header className="relative grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-dashed border-border-pink pb-3 sm:gap-4 sm:pb-5 sm:pl-16">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-pink-600 sm:text-xs">DATE BOX · MEMORY NO. 01</p>
          <h2 className="mt-1 line-clamp-2 text-xl font-semibold leading-tight tracking-[-0.035em] text-text-primary sm:mt-2 sm:text-3xl">
            {plan.title}
          </h2>
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-text-secondary sm:mt-2 sm:text-sm">
            <CalendarDays aria-hidden="true" className="size-4 text-pink-600" />
            {dateLabel}
          </p>
        </div>
        <div className="self-start border-l border-border-soft pl-4 text-right">
          <p className="text-[10px] font-semibold tracking-[0.12em] text-text-muted">心动默契</p>
          <p className="mt-1 font-mono text-2xl font-semibold leading-none tracking-[-0.06em] text-text-primary sm:text-3xl">
            {compatibilityScore}
          </p>
        </div>
      </header>

      <div className="relative mt-3 sm:mt-5 sm:pl-16">
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs font-medium text-text-secondary">
          {keywords.map((keyword, index) => (
            <span key={keyword} className="inline-flex items-center gap-1.5">
              {index > 0 ? <span className="size-1 rounded-full bg-pink-300" aria-hidden="true" /> : null}
              {keyword}
            </span>
          ))}
        </div>

        <blockquote className="mt-3 line-clamp-2 text-sm font-medium leading-6 text-text-primary sm:mt-5 sm:block sm:text-lg sm:leading-8">
          “{automaticMemory}”
        </blockquote>
      </div>

      <div className="relative mt-3 border-y border-dashed border-border-pink py-3 sm:ml-16 sm:mt-6 sm:py-5">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.15em] text-pink-600">FAVORITE MOMENT</p>
          <p className="mt-1 line-clamp-2 min-h-5 text-xs font-medium leading-5 text-text-primary sm:mt-2 sm:block sm:min-h-7 sm:text-[15px] sm:leading-7">
            {favoriteMoment || "等你们写下今晚最想留住的一刻。"}
          </p>
        </div>
        <div className="mt-2.5 sm:mt-5">
          <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.15em] text-purple-500">
            <MessageCircleHeart aria-hidden="true" className="size-3.5" />
            A NOTE FOR TA
          </p>
          <p className="mt-1 line-clamp-2 min-h-5 text-xs font-medium leading-5 text-text-primary sm:mt-2 sm:block sm:min-h-7 sm:text-[15px] sm:leading-7">
            {messageToPartner || "有些话，可以慢慢写给此刻的 TA。"}
          </p>
        </div>
      </div>

      <div className="relative mt-3 grid gap-2 sm:ml-16 sm:mt-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:gap-4">
        <div className="border-l-2 border-pink-300 pl-4">
          <p className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.14em] text-pink-600">
            <LockKeyhole aria-hidden="true" className="size-3.5" />
            今晚的隐藏任务
          </p>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-text-primary sm:mt-1.5 sm:block sm:text-sm sm:leading-6">{plan.secretTask}</p>
        </div>
        <div className="hidden gap-4 text-xs font-medium text-text-muted min-[390px]:flex sm:flex">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 aria-hidden="true" className="size-3.5 text-pink-500" />
            完成 {completedCount}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Forward aria-hidden="true" className="size-3.5 text-purple-400" />
            跳过 {skippedCount}
          </span>
        </div>
      </div>

      <footer className="relative mt-3 flex items-center justify-between border-t border-border-soft pt-2 text-[9px] font-semibold tracking-[0.14em] text-text-muted sm:ml-16 sm:mt-6 sm:pt-4 sm:text-[10px] sm:tracking-[0.16em]">
        <span>心动计划局</span>
        <span>KEEP THIS NIGHT</span>
      </footer>
    </article>
  );
}
