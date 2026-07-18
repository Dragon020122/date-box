"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Camera, Copy, PencilLine, Send, ShieldCheck } from "lucide-react";

import { InviteShareCard } from "@/components/async-invite/invite-share-card";
import { GlassPanel } from "@/components/ui/glass-panel";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { Toast } from "@/components/ui/toast";
import { tryWriteClipboard } from "@/lib/clipboard";
import {
  getInviteDisplayDomain,
  isWeChatUserAgent,
  tryShareInvite,
} from "@/lib/invite-sharing";

interface InviteShareScreenProps {
  inviteUrl: string;
  hostName: string;
  expiresAt: number;
  hasPreviousInvite: boolean;
  screenshotMode: boolean;
  onScreenshotModeChange: (enabled: boolean) => void;
  onModify: () => void;
}

const subscribeToStaticBrowserValue = () => () => undefined;

export function InviteShareScreen({
  inviteUrl,
  hostName,
  expiresAt,
  hasPreviousInvite,
  screenshotMode,
  onScreenshotModeChange,
  onModify,
}: InviteShareScreenProps) {
  const [manualCopyVisible, setManualCopyVisible] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", tone: "info" as "info" | "success" });
  const isWeChat = useSyncExternalStore(
    subscribeToStaticBrowserValue,
    () => isWeChatUserAgent(navigator.userAgent),
    () => false,
  );
  const displayDomain = getInviteDisplayDomain(inviteUrl);

  useEffect(() => {
    if (!toast.open) {
      return;
    }
    const timer = window.setTimeout(() => {
      setToast((current) => ({ ...current, open: false }));
    }, 2600);
    return () => window.clearTimeout(timer);
  }, [toast.open]);

  function showToast(message: string, tone: "info" | "success" = "info") {
    setToast({ open: true, message, tone });
  }

  async function copyInviteLink(successMessage = "邀请链接已经复制，可以发给TA了") {
    const copied = await tryWriteClipboard(navigator.clipboard, inviteUrl);
    if (copied) {
      setManualCopyVisible(false);
      showToast(successMessage, "success");
      return true;
    }

    setManualCopyVisible(true);
    showToast("自动复制失败，请长按链接手动复制。");
    return false;
  }

  async function shareInvite() {
    const share = typeof navigator.share === "function"
      ? navigator.share.bind(navigator)
      : undefined;
    const shared = await tryShareInvite(share, inviteUrl);
    if (shared) {
      showToast("系统分享已完成，可以等待TA回应了", "success");
      return;
    }

    const copied = await copyInviteLink(
      "系统分享不可用，邀请链接已经复制，可以发给TA了",
    );
    if (!copied) {
      showToast("系统分享不可用，请长按链接手动复制。");
    }
  }

  const card = (
    <InviteShareCard
      inviteUrl={inviteUrl}
      hostName={hostName}
      expiresAt={expiresAt}
      displayDomain={displayDomain}
    />
  );

  if (screenshotMode) {
    return (
      <section className="fixed inset-0 z-[100] flex min-h-[100svh] min-h-dvh flex-col overflow-hidden bg-[#fffaf7] px-[18px] pb-[max(0.5rem,var(--safe-bottom))] pt-[max(0.75rem,var(--safe-top))]">
        <p className="shrink-0 text-center text-xs font-medium tracking-[0.08em] text-text-muted">
          截图后发给TA
        </p>
        <div className="flex min-h-0 flex-1 items-center justify-center py-2">
          {card}
        </div>
        <button
          type="button"
          onClick={() => onScreenshotModeChange(false)}
          className="min-h-12 shrink-0 rounded-2xl text-sm font-medium text-text-muted transition-colors active:bg-pink-50 active:text-pink-600"
        >
          轻触这里退出截图模式
        </button>
      </section>
    );
  }

  return (
    <>
      <section className="mx-auto w-full max-w-[900px]" aria-labelledby="invite-share-title">
        <div className="text-center lg:text-left">
          <p className="text-xs font-semibold tracking-[0.18em] text-pink-600 sm:text-sm">
            SHARE THE INVITATION
          </p>
          <h1
            id="invite-share-title"
            className="mt-2 text-[clamp(1.9rem,8vw,3rem)] font-semibold leading-[1.15] tracking-[-0.035em] text-text-primary sm:mt-3"
          >
            邀请已经准备好了
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-text-secondary lg:mx-0 sm:text-base sm:leading-7">
            把链接或这张卡发给TA，答案完成后会一起揭晓。
          </p>
        </div>

        {isWeChat ? (
          <div className="mx-auto mt-4 flex max-w-xl items-start gap-2.5 rounded-2xl border border-border-pink bg-pink-50/60 px-4 py-3 text-sm leading-6 text-text-secondary lg:mx-0">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-4.5 shrink-0 text-pink-600" />
            <p>推荐复制邀请链接发送给TA，或截图这张邀请卡。</p>
          </div>
        ) : null}

        <div className="mt-5 grid items-center gap-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-10">
          <div className="flex justify-center lg:justify-start">{card}</div>

          <GlassPanel intensity="default" className="p-5 sm:p-6">
            <div className="grid gap-3">
              <PrimaryButton fullWidth onClick={() => void copyInviteLink()}>
                <Copy aria-hidden="true" className="size-4.5" />
                复制邀请链接
              </PrimaryButton>
              <SecondaryButton fullWidth onClick={() => void shareInvite()}>
                <Send aria-hidden="true" className="size-4.5" />
                发送给TA
              </SecondaryButton>
              <SecondaryButton
                fullWidth
                onClick={() => onScreenshotModeChange(true)}
              >
                <Camera aria-hidden="true" className="size-4.5" />
                进入截图模式
              </SecondaryButton>
            </div>

            {manualCopyVisible ? (
              <div className="mt-4" role="status">
                <label className="text-sm font-medium text-text-secondary" htmlFor="manual-invite-link">
                  自动复制失败，请长按链接手动复制。
                </label>
                <input
                  id="manual-invite-link"
                  type="text"
                  readOnly
                  value={inviteUrl}
                  onFocus={(event) => event.currentTarget.select()}
                  onClick={(event) => event.currentTarget.select()}
                  className="mt-2 min-h-12 w-full rounded-2xl border border-border-pink bg-white/75 px-4 py-3 text-base text-text-secondary"
                />
              </div>
            ) : null}

            {hasPreviousInvite ? (
              <p className="mt-4 rounded-2xl bg-purple-100/55 px-4 py-3 text-sm leading-6 text-text-secondary">
                新邀请已经生成；之前发出的旧链接可能仍可访问。
              </p>
            ) : null}

            <button
              type="button"
              onClick={onModify}
              className="mx-auto mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium text-text-muted transition-colors hover:text-pink-600"
            >
              <PencilLine aria-hidden="true" className="size-4" />
              修改我的选择
            </button>
          </GlassPanel>
        </div>
      </section>

      <Toast
        open={toast.open}
        message={toast.message}
        tone={toast.tone}
      />
    </>
  );
}
