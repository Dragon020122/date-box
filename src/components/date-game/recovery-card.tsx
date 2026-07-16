import { History, RotateCcw, Sparkles } from "lucide-react";

import { GlassPanel } from "@/components/ui/glass-panel";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";

interface RecoveryCardProps {
  isMemory: boolean;
  planTitle: string | null;
  onContinue: () => void;
  onRestart: () => void;
}

export function RecoveryCard({
  isMemory,
  planTitle,
  onContinue,
  onRestart,
}: RecoveryCardProps) {
  return (
    <section className="mx-auto flex min-h-[62dvh] w-full max-w-2xl items-center justify-center">
      <GlassPanel intensity="strong" className="relative w-full overflow-hidden p-6 text-center sm:p-10">
        <div className="pointer-events-none absolute -right-16 -top-20 size-48 rounded-full bg-purple-200/30 blur-2xl sm:size-56 sm:blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 hidden size-56 rounded-full bg-pink-200/38 blur-3xl sm:block" />
        <span className="relative mx-auto grid size-18 place-items-center rounded-[1.5rem] border border-white/90 bg-[linear-gradient(145deg,var(--pink-100),var(--purple-100))] text-pink-600 shadow-[var(--shadow-pink)]">
          <History aria-hidden="true" className="size-7" />
        </span>
        <p className="relative mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] text-pink-600">
          <Sparkles aria-hidden="true" className="size-3.5" />
          WELCOME BACK
        </p>
        <h1 className="relative mx-auto mt-3 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.04em] text-text-primary sm:text-4xl">
          {isMemory
            ? "找到一份已经收藏好的心动回忆。"
            : "找到一份还没有完成的心动计划。"}
        </h1>
        {planTitle ? (
          <p className="relative mt-4 text-[15px] leading-7 text-text-secondary">
            上次停在「{planTitle}」，所有选择和进度都还在。
          </p>
        ) : (
          <p className="relative mt-4 text-[15px] leading-7 text-text-secondary">
            上次的选择已经找回，可以从停下来的地方继续。
          </p>
        )}
        <div className="relative mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
          <PrimaryButton onClick={onContinue} className="w-full sm:w-auto">
            继续计划
          </PrimaryButton>
          <SecondaryButton onClick={onRestart} className="w-full sm:w-auto">
            <RotateCcw aria-hidden="true" className="size-4" />
            重新开始
          </SecondaryButton>
        </div>
      </GlassPanel>
    </section>
  );
}
