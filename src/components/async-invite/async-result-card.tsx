import { Blend, CalendarHeart, Sparkles } from "lucide-react";

import { getMemoryKeywords } from "@/lib/memory-card";
import type { AsyncResultPayload } from "@/types/async-invite";
import type { CompatibilityResult, DatePlan } from "@/types/date-game";

interface AsyncResultCardProps {
  result: AsyncResultPayload;
  compatibility: CompatibilityResult;
  plan: DatePlan;
}

export function AsyncResultCard({
  result,
  compatibility,
  plan,
}: AsyncResultCardProps) {
  const hostName = result.invite.hostName.trim() || "有人";
  const guestName = result.invite.guestName?.trim() || "TA";
  const keywords = getMemoryKeywords({
    mood: result.invite.preferences.mood,
    plan,
    playerAAnswers: result.invite.hostAnswers,
    playerBAnswers: result.guestAnswers,
  }).slice(0, 3);
  const dateLabel = new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric",
  }).format(new Date(result.createdAt));

  return (
    <article className="relative aspect-[3/4] w-full max-w-[340px] overflow-hidden rounded-[1.8rem_1.8rem_1.8rem_0.65rem] border border-white/90 bg-[#fffdfb] p-6 shadow-[0_26px_74px_rgba(76,49,65,0.15)]" aria-label={`${hostName}和${guestName}的Date Box结果卡`}>
      <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-pink-100/80 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 size-56 rounded-full bg-purple-100/80 blur-3xl" aria-hidden="true" />

      <div className="relative flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-[0.75rem_0.75rem_0.75rem_0.28rem] bg-text-primary text-[10px] font-semibold tracking-[0.14em] text-white">DB</span>
          <div className="leading-tight">
            <p className="text-xs font-semibold tracking-[0.13em] text-text-primary">DATE BOX</p>
            <p className="mt-0.5 text-[10px] text-text-muted">心动计划局</p>
          </div>
        </div>
        <p className="font-mono text-[10px] font-medium text-text-muted">{dateLabel}</p>
      </div>

      <div className="relative mt-7 text-center">
        <p className="text-xs font-semibold tracking-[0.13em] text-pink-600">
          {hostName} <span className="mx-1 text-text-muted">×</span> {guestName}
        </p>
        <div className="mx-auto mt-4 grid size-28 place-items-center rounded-full border border-pink-200 bg-[linear-gradient(145deg,rgba(255,245,247,0.96),rgba(240,234,244,0.9))] shadow-[0_18px_46px_rgba(128,73,101,0.13)]">
          <div>
            <p className="font-mono text-4xl font-semibold tracking-[-0.06em] text-text-primary">{compatibility.displayScore}</p>
            <p className="mt-1 text-[9px] font-semibold tracking-[0.16em] text-pink-600">默契度</p>
          </div>
        </div>
      </div>

      <section className="relative mt-6 border-y border-dashed border-border-pink py-4 text-center" aria-label="今日关键词">
        <p className="inline-flex items-center gap-1.5 text-[9px] font-semibold tracking-[0.17em] text-text-muted">
          <Sparkles aria-hidden="true" className="size-3" /> TODAY&apos;S KEYWORDS
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-1.5">
          {keywords.map((keyword) => (
            <span key={keyword} className="rounded-full bg-pink-50 px-2.5 py-1 text-[11px] font-medium text-text-secondary">{keyword}</span>
          ))}
        </div>
      </section>

      <div className="relative mt-5">
        <p className="flex items-center justify-center gap-1.5 text-[9px] font-semibold tracking-[0.16em] text-purple-500">
          <CalendarHeart aria-hidden="true" className="size-3" /> OUR LITTLE PLAN
        </p>
        <h2 className="mt-1.5 text-center text-xl font-semibold leading-7 tracking-[-0.03em] text-text-primary">{plan.title}</h2>
        <p className="mx-auto mt-2 line-clamp-2 max-w-[260px] text-center text-xs leading-5 text-text-secondary">
          {plan.endingQuote}
        </p>
      </div>

      <div className="absolute bottom-4 left-6 right-6 flex items-center justify-center gap-2 text-[9px] font-medium tracking-[0.08em] text-text-muted">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-pink-200" />
        <Blend aria-hidden="true" className="size-3.5 text-pink-500" />
        两份期待，一份今晚
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-purple-200" />
      </div>
    </article>
  );
}
