"use client";

import { useState } from "react";
import { ChevronDown, Clock3, LogIn, ShieldCheck, Sparkles } from "lucide-react";

import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import type { AsyncInvitePayload } from "@/types/async-invite";

interface InviteLandingScreenProps {
  invite: AsyncInvitePayload;
  onJoin: () => void;
}

function formatExpiry(expiresAt: number): string {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(expiresAt));
}

export function InviteLandingScreen({ invite, onJoin }: InviteLandingScreenProps) {
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const hostName = invite.hostName.trim() || "有人";

  return (
    <section className="mx-auto flex min-h-[calc(100dvh-8.5rem-var(--safe-top)-var(--safe-bottom))] w-full max-w-4xl items-center" aria-labelledby="invite-landing-title">
      <div className="grid w-full gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(300px,0.72fr)] lg:items-stretch">
        <article className="relative overflow-hidden rounded-[2rem_2rem_2rem_0.75rem] border border-white/90 bg-surface-strong px-6 py-8 shadow-[0_28px_80px_rgba(76,49,65,0.12)] backdrop-blur-xl sm:px-9 sm:py-11">
          <div className="pointer-events-none absolute -right-16 -top-16 size-52 rounded-full bg-pink-100/65 blur-3xl" aria-hidden="true" />
          <p className="relative inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-pink-600">
            <Sparkles aria-hidden="true" className="size-4" />
            A LITTLE INVITATION
          </p>
          <h1 id="invite-landing-title" className="relative mt-4 text-[clamp(2.5rem,10vw,4.75rem)] font-semibold leading-[1.03] tracking-[-0.055em] text-text-primary">
            你收到了一份<br />心动邀请
          </h1>
          <p className="relative mt-6 max-w-xl text-[15px] leading-8 text-text-secondary sm:text-lg">
            <span className="font-semibold text-text-primary">{hostName}</span>已经先写下了今晚的期待，<br className="hidden sm:block" />
            现在只差你的答案。
          </p>

          <div className="relative mt-8 flex flex-col gap-3 sm:flex-row">
            <PrimaryButton onClick={onJoin} className="w-full sm:w-auto">
              加入这份心动计划
              <LogIn aria-hidden="true" className="size-4.5" />
            </PrimaryButton>
            <SecondaryButton
              onClick={() => setShowHowItWorks((visible) => !visible)}
              aria-expanded={showHowItWorks}
              className="w-full sm:w-auto"
            >
              看看怎么玩
              <ChevronDown aria-hidden="true" className={`size-4 transition-transform ${showHowItWorks ? "rotate-180" : ""}`} />
            </SecondaryButton>
          </div>

          {showHowItWorks ? (
            <div className="relative mt-5 rounded-[1.2rem] border border-border-soft bg-white/45 p-4 text-sm leading-7 text-text-secondary">
              你只需要完成五道小问题。提交前看不到对方的选择；完成后，两份期待会一起生成默契总结和今晚的约会计划。
            </div>
          ) : null}
        </article>

        <aside className="rounded-[0.75rem_2rem_2rem_2rem] border border-border-pink bg-[#f8e8ed]/72 p-6 sm:p-8" aria-label="邀请说明">
          <p className="text-[10px] font-semibold tracking-[0.18em] text-pink-600">BEFORE YOU START</p>
          <h2 className="mt-2 text-xl font-semibold text-text-primary">放心写下真实的期待</h2>
          <ul className="mt-6 space-y-5 text-sm leading-6 text-text-secondary">
            <li className="flex gap-3">
              <Clock3 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-pink-600" />
              <span><strong className="block font-semibold text-text-primary">约 2 分钟</strong>五道选择题，不需要登录</span>
            </li>
            <li className="flex gap-3">
              <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-purple-500" />
              <span><strong className="block font-semibold text-text-primary">答案暂时密封</strong>完成前不会展示{hostName}的选择</span>
            </li>
          </ul>
          <div className="mt-7 border-t border-dashed border-pink-300/70 pt-5">
            <p className="text-xs font-medium text-text-muted">邀请有效时间</p>
            <p className="mt-1 font-mono text-sm font-semibold text-text-primary">
              至 {formatExpiry(invite.expiresAt)}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
