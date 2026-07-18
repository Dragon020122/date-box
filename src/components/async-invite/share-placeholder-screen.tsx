import { ArrowLeft, Link2, Sparkles } from "lucide-react";

import { GlassPanel } from "@/components/ui/glass-panel";
import { SecondaryButton } from "@/components/ui/secondary-button";

interface SharePlaceholderScreenProps {
  inviteUrl: string;
  onBackHome: () => void;
}

export function SharePlaceholderScreen({
  inviteUrl,
  onBackHome,
}: SharePlaceholderScreenProps) {
  return (
    <section className="mx-auto flex min-h-[62dvh] w-full max-w-[720px] items-center justify-center text-center">
      <GlassPanel intensity="strong" className="w-full px-5 py-9 sm:px-10 sm:py-12">
        <span className="mx-auto grid size-16 place-items-center rounded-full border border-border-pink bg-pink-50 text-pink-600 shadow-[var(--shadow-pink)]">
          <Sparkles aria-hidden="true" className="size-6" />
        </span>
        <p className="mt-6 text-xs font-semibold tracking-[0.18em] text-pink-600">
          INVITE READY
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-[-0.025em] text-text-primary sm:text-3xl">
          你的心动邀请已经生成
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-text-secondary sm:text-base">
          链接已安全写入本机异步会话。正式邀请分享卡将在后续阶段接入。
        </p>

        <div className="mt-6 rounded-2xl border border-white/90 bg-white/55 p-4 text-left">
          <p className="flex items-center gap-2 text-xs font-semibold text-text-muted">
            <Link2 aria-hidden="true" className="size-3.5 text-pink-600" />
            邀请链接占位
          </p>
          <p className="mt-2 break-all font-mono text-xs leading-6 text-text-secondary">
            {inviteUrl}
          </p>
        </div>

        <SecondaryButton onClick={onBackHome} className="mt-7 w-full sm:w-auto">
          <ArrowLeft aria-hidden="true" className="size-4.5" />
          返回首页
        </SecondaryButton>
      </GlassPanel>
    </section>
  );
}
