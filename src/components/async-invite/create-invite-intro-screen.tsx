"use client";

import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";

import { GlassPanel } from "@/components/ui/glass-panel";
import { MobileActionBar } from "@/components/ui/mobile-action-bar";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";

interface CreateInviteIntroScreenProps {
  hostName: string;
  guestName: string;
  onHostNameChange: (value: string) => void;
  onGuestNameChange: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

function limitName(value: string): string {
  return Array.from(value).slice(0, 12).join("");
}

export function CreateInviteIntroScreen({
  hostName,
  guestName,
  onHostNameChange,
  onGuestNameChange,
  onBack,
  onContinue,
}: CreateInviteIntroScreenProps) {
  return (
    <section className="mx-auto w-full max-w-[720px]" aria-labelledby="create-invite-title">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-pink-600 sm:text-sm">
          01 · ABOUT YOU TWO
        </p>
        <h1
          id="create-invite-title"
          className="mt-2 text-[clamp(1.9rem,8vw,3rem)] font-semibold leading-[1.15] tracking-[-0.035em] text-text-primary sm:mt-4"
        >
          先写下一点关于你们的信息
        </h1>
        <p className="mt-2 text-sm leading-6 text-text-secondary sm:mt-3 sm:text-base sm:leading-7">
          称呼都是可选的，只用来让这份邀请更像属于你们。
        </p>
      </div>

      <GlassPanel intensity="default" className="mt-6 p-5 sm:mt-9 sm:p-7">
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
          <label className="block">
            <span className="text-sm font-semibold text-text-primary">你的称呼</span>
            <span className="ml-2 text-xs text-text-muted">可选</span>
            <input
              type="text"
              value={hostName}
              onChange={(event) => onHostNameChange(limitName(event.target.value))}
              placeholder="例如：小雨"
              autoComplete="off"
              className="mt-2 min-h-13 w-full rounded-2xl border border-border-pink bg-white/65 px-4 py-3 text-base text-text-primary outline-none transition-[border-color,background-color,box-shadow] placeholder:text-text-muted/70 hover:bg-white/80 focus:border-pink-400 focus:bg-white/90"
            />
            <span className="mt-1.5 block text-right text-xs text-text-muted">
              {Array.from(hostName).length} / 12
            </span>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-text-primary">TA的称呼</span>
            <span className="ml-2 text-xs text-text-muted">可选</span>
            <input
              type="text"
              value={guestName}
              onChange={(event) => onGuestNameChange(limitName(event.target.value))}
              placeholder="例如：阿岚"
              autoComplete="off"
              className="mt-2 min-h-13 w-full rounded-2xl border border-border-pink bg-white/65 px-4 py-3 text-base text-text-primary outline-none transition-[border-color,background-color,box-shadow] placeholder:text-text-muted/70 hover:bg-white/80 focus:border-pink-400 focus:bg-white/90"
            />
            <span className="mt-1.5 block text-right text-xs text-text-muted">
              {Array.from(guestName).length} / 12
            </span>
          </label>
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-white/80 bg-pink-50/55 px-4 py-3.5 text-sm leading-6 text-text-secondary">
          <ShieldCheck aria-hidden="true" className="mt-0.5 size-4.5 shrink-0 text-pink-600" />
          <p>
            称呼和固定选择会被写入邀请链接，请不要填写手机号、微信号或其他敏感信息。
          </p>
        </div>
      </GlassPanel>

      <MobileActionBar>
        <SecondaryButton onClick={onBack} className="w-full sm:w-auto">
          <ArrowLeft aria-hidden="true" className="size-4.5" />
          返回首页
        </SecondaryButton>
        <PrimaryButton onClick={onContinue} className="w-full sm:w-auto">
          开始写下我的期待
          <ArrowRight aria-hidden="true" className="size-4.5" />
        </PrimaryButton>
      </MobileActionBar>
    </section>
  );
}
