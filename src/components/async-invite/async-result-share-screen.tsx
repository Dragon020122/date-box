"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { ArrowLeft, Camera, Copy, Send, ShieldCheck } from "lucide-react";

import { AsyncResultCard } from "@/components/async-invite/async-result-card";
import { GlassPanel } from "@/components/ui/glass-panel";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { Toast } from "@/components/ui/toast";
import { tryWriteClipboard } from "@/lib/clipboard";
import { isWeChatUserAgent } from "@/lib/invite-sharing";
import { tryShareResult } from "@/lib/result-sharing";
import type { AsyncResultPayload } from "@/types/async-invite";
import type { CompatibilityResult, DatePlan } from "@/types/date-game";

interface AsyncResultShareScreenProps {
  resultUrl: string;
  result: AsyncResultPayload;
  compatibility: CompatibilityResult;
  plan: DatePlan;
  onBack: () => void;
}

const subscribeToStaticBrowserValue = () => () => undefined;

export function AsyncResultShareScreen({
  resultUrl,
  result,
  compatibility,
  plan,
  onBack,
}: AsyncResultShareScreenProps) {
  const [screenshotMode, setScreenshotMode] = useState(false);
  const [manualCopyVisible, setManualCopyVisible] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", tone: "info" as "info" | "success" });
  const isWeChat = useSyncExternalStore(
    subscribeToStaticBrowserValue,
    () => isWeChatUserAgent(navigator.userAgent),
    () => false,
  );

  useEffect(() => {
    if (!toast.open) {
      return;
    }
    const timer = window.setTimeout(
      () => setToast((current) => ({ ...current, open: false })),
      2600,
    );
    return () => window.clearTimeout(timer);
  }, [toast.open]);

  function showToast(message: string, tone: "info" | "success" = "info") {
    setToast({ open: true, message, tone });
  }

  async function copyResultLink(successMessage = "结果链接已经复制，可以发给TA了") {
    const copied = await tryWriteClipboard(navigator.clipboard, resultUrl);
    if (copied) {
      setManualCopyVisible(false);
      showToast(successMessage, "success");
      return true;
    }
    setManualCopyVisible(true);
    showToast("自动复制失败，请长按链接手动复制。");
    return false;
  }

  async function shareResult() {
    const share = typeof navigator.share === "function"
      ? navigator.share.bind(navigator)
      : undefined;
    if (await tryShareResult(share, resultUrl)) {
      showToast("系统分享已完成，TA可以打开结果了", "success");
      return;
    }
    const copied = await copyResultLink("系统分享不可用，结果链接已经复制");
    if (!copied) {
      showToast("系统分享不可用，请长按链接手动复制。");
    }
  }

  const card = (
    <AsyncResultCard result={result} compatibility={compatibility} plan={plan} />
  );

  if (screenshotMode) {
    return (
      <section className="fixed inset-0 z-[100] flex min-h-[100svh] min-h-dvh flex-col overflow-hidden bg-[#fffaf7] px-[18px] pb-[max(0.5rem,var(--safe-bottom))] pt-[max(0.75rem,var(--safe-top))]">
        <p className="shrink-0 text-center text-xs font-medium tracking-[0.08em] text-text-muted">截图后把结果发给TA</p>
        <div className="flex min-h-0 flex-1 items-center justify-center py-2">{card}</div>
        <button
          type="button"
          onClick={() => setScreenshotMode(false)}
          className="min-h-12 shrink-0 rounded-2xl text-sm font-medium text-text-muted transition-colors active:bg-pink-50 active:text-pink-600"
        >
          轻触这里退出截图模式
        </button>
      </section>
    );
  }

  return (
    <>
      <section className="mx-auto w-full max-w-[900px]" aria-labelledby="result-share-title">
        <header className="text-center lg:text-left">
          <p className="text-xs font-semibold tracking-[0.18em] text-pink-600">SEND THE ANSWER BACK</p>
          <h1 id="result-share-title" className="mt-2 text-[clamp(2rem,8vw,3.25rem)] font-semibold leading-[1.12] tracking-[-0.04em] text-text-primary">
            把结果发回给TA
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-text-secondary lg:mx-0 sm:text-base">
            链接里装着你们的两份答案和共同计划；结果页会重新计算，不保存到服务器。
          </p>
        </header>

        {isWeChat ? (
          <div className="mx-auto mt-4 flex max-w-xl items-start gap-2.5 rounded-2xl border border-border-pink bg-pink-50/60 px-4 py-3 text-sm leading-6 text-text-secondary lg:mx-0">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-4.5 shrink-0 text-pink-600" />
            <p>微信内推荐复制结果链接发送，或直接截图这张结果卡。</p>
          </div>
        ) : null}

        <div className="mt-5 grid items-center gap-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-10">
          <div className="flex justify-center lg:justify-start">{card}</div>
          <GlassPanel intensity="default" className="p-5 sm:p-6">
            <div className="grid gap-3">
              <PrimaryButton fullWidth onClick={() => void copyResultLink()}>
                <Copy aria-hidden="true" className="size-4.5" />
                复制结果链接
              </PrimaryButton>
              <SecondaryButton fullWidth onClick={() => void shareResult()}>
                <Send aria-hidden="true" className="size-4.5" />
                系统分享
              </SecondaryButton>
              <SecondaryButton fullWidth onClick={() => setScreenshotMode(true)}>
                <Camera aria-hidden="true" className="size-4.5" />
                进入结果截图卡
              </SecondaryButton>
            </div>

            {manualCopyVisible ? (
              <div className="mt-4" role="status">
                <label htmlFor="manual-result-link" className="text-sm font-medium text-text-secondary">
                  自动复制失败，请长按链接手动复制。
                </label>
                <input
                  id="manual-result-link"
                  type="text"
                  readOnly
                  value={resultUrl}
                  onFocus={(event) => event.currentTarget.select()}
                  onClick={(event) => event.currentTarget.select()}
                  className="mt-2 min-h-12 w-full rounded-2xl border border-border-pink bg-white/75 px-4 py-3 text-base text-text-secondary"
                />
              </div>
            ) : null}

            <button
              type="button"
              onClick={onBack}
              className="mx-auto mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium text-text-muted transition-colors hover:text-pink-600"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              返回共同计划
            </button>
          </GlassPanel>
        </div>
      </section>

      <Toast open={toast.open} message={toast.message} tone={toast.tone} />
    </>
  );
}
