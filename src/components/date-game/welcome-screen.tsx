"use client";

import { ArrowRight, Clock3, Send, Smartphone, Sparkles } from "lucide-react";

import { HeartbeatTrail } from "@/components/date-game/heartbeat-trail";

interface WelcomeScreenProps {
  onInvite: () => void;
  onStart: () => void;
}

export function WelcomeScreen({ onInvite, onStart }: WelcomeScreenProps) {
  return (
    <section
      className="flex min-h-[calc(100dvh-6.5rem-var(--safe-top)-var(--safe-bottom))] flex-col justify-center lg:min-h-[650px]"
      aria-labelledby="welcome-title"
    >
      <div className="grid items-center gap-4 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,1.08fr)] lg:gap-14 xl:gap-20">
        <div>
          <p className="hidden items-center gap-2 text-xs font-semibold tracking-[0.18em] text-pink-600 sm:inline-flex sm:text-sm">
            <Sparkles aria-hidden="true" className="size-4" />
            心动计划局 · DATE BOX
          </p>
          <h1
            id="welcome-title"
            className="mt-1 text-[clamp(2.15rem,9vw,4.35rem)] font-semibold leading-[1.08] tracking-[-0.045em] text-text-primary sm:mt-5"
          >
            今晚，想和TA怎么度过？
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-text-secondary sm:mt-5 sm:text-base sm:leading-8">
            选一种舒服的方式，把各自的小期待拼成今晚的心动计划。
          </p>
        </div>

        <div className="mt-1 lg:mt-0">
          <HeartbeatTrail />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:mt-7 lg:grid-cols-2 lg:gap-4">
        <button
          type="button"
          onClick={onInvite}
          className="group relative min-h-[172px] overflow-hidden rounded-[1.75rem] border border-pink-300/75 bg-[linear-gradient(135deg,rgba(255,250,252,0.96),rgba(244,231,248,0.88))] p-5 text-left shadow-[var(--shadow-pink)] transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-pink-400 hover:shadow-[0_24px_60px_rgba(105,62,84,0.16)] active:translate-y-0 active:scale-[0.995] sm:p-6"
        >
          <span className="grid size-11 place-items-center rounded-2xl bg-text-primary text-white shadow-[0_12px_28px_rgba(73,47,64,0.18)]">
            <Send aria-hidden="true" className="size-5" />
          </span>
          <span className="mt-4 flex items-center justify-between gap-4">
            <span className="text-xl font-semibold tracking-[-0.02em] text-text-primary sm:text-2xl">
              邀请TA一起计划
            </span>
            <ArrowRight aria-hidden="true" className="size-5 shrink-0 text-pink-600 transition-transform group-hover:translate-x-1" />
          </span>
          <span className="mt-2 block text-sm leading-6 text-text-secondary">
            分别在自己的手机上完成选择，最后一起揭晓今晚的计划。
          </span>
          <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-pink-600">
            <Clock3 aria-hidden="true" className="size-3.5" />
            约2分钟 · 不需要登录
          </span>
        </button>

        <button
          type="button"
          onClick={onStart}
          className="group min-h-[154px] rounded-[1.75rem] border border-white/90 bg-surface p-5 text-left shadow-[var(--shadow-soft)] backdrop-blur-xl transition-[transform,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-border-pink hover:bg-surface-strong active:translate-y-0 active:scale-[0.995] sm:min-h-[172px] sm:p-6"
        >
          <span className="grid size-11 place-items-center rounded-2xl border border-border-pink bg-white/70 text-purple-500">
            <Smartphone aria-hidden="true" className="size-5" />
          </span>
          <span className="mt-4 flex items-center justify-between gap-4">
            <span className="text-lg font-semibold tracking-[-0.015em] text-text-primary sm:text-xl">
              一起用这部手机
            </span>
            <ArrowRight aria-hidden="true" className="size-5 shrink-0 text-text-muted transition-transform group-hover:translate-x-1" />
          </span>
          <span className="mt-2 block text-sm leading-6 text-text-secondary">
            轮流回答，适合现在就在彼此身边。
          </span>
        </button>
      </div>
    </section>
  );
}
