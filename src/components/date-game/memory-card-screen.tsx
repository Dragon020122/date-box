"use client";

import { useEffect, useRef, useState, type FocusEvent } from "react";
import { useReducedMotion } from "framer-motion";
import { Copy, RotateCcw, Save, Sparkles } from "lucide-react";

import { MemoryCardPreview } from "@/components/date-game/memory-card-preview";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import {
  formatMemoryCopy,
  formatMemoryDate,
  getAutomaticMemoryText,
  getMemoryKeywords,
} from "@/lib/memory-card";
import { tryWriteClipboard } from "@/lib/clipboard";
import type { DateGameState, DatePlan } from "@/types/date-game";

interface MemoryCardScreenProps {
  gameState: DateGameState;
  plan: DatePlan;
  onFavoriteMomentChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onSave: () => void;
  onCopyResult: (success: boolean) => void;
  onRequestReset: () => void;
}

export function MemoryCardScreen({
  gameState,
  plan,
  onFavoriteMomentChange,
  onMessageChange,
  onSave,
  onCopyResult,
  onRequestReset,
}: MemoryCardScreenProps) {
  const [isCopying, setIsCopying] = useState(false);
  const [showCopyFallback, setShowCopyFallback] = useState(false);
  const copyInProgressRef = useRef(false);
  const focusTimerRef = useRef<number | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const compatibilityScore = gameState.compatibility?.displayScore ?? 0;
  const memoryInput = {
    mood: gameState.preferences.mood,
    plan,
    playerAAnswers: gameState.playerAAnswers,
    playerBAnswers: gameState.playerBAnswers,
  };
  const keywords = getMemoryKeywords(memoryInput);
  const automaticMemory = getAutomaticMemoryText(memoryInput);
  const dateLabel = formatMemoryDate(new Date());
  const copiedText = formatMemoryCopy({
    planTitle: plan.title,
    compatibilityScore,
    favoriteMoment: gameState.favoriteMoment,
    messageToPartner: gameState.messageToPartner,
  });

  useEffect(
    () => () => {
      if (focusTimerRef.current !== null) {
        window.clearTimeout(focusTimerRef.current);
      }
    },
    [],
  );

  function handleTextareaFocus(event: FocusEvent<HTMLTextAreaElement>) {
    const textarea = event.currentTarget;
    if (focusTimerRef.current !== null) {
      window.clearTimeout(focusTimerRef.current);
    }
    focusTimerRef.current = window.setTimeout(() => {
      textarea.scrollIntoView({
        block: "center",
        behavior: shouldReduceMotion ? "auto" : "smooth",
      });
      focusTimerRef.current = null;
    }, 180);
  }

  async function handleCopy() {
    if (copyInProgressRef.current) {
      return;
    }

    copyInProgressRef.current = true;
    setIsCopying(true);
    try {
      const didCopy = await tryWriteClipboard(navigator.clipboard, copiedText);
      setShowCopyFallback(!didCopy);
      onCopyResult(didCopy);
    } finally {
      copyInProgressRef.current = false;
      setIsCopying(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-5xl focus-within:pb-[32vh] sm:focus-within:pb-0" aria-labelledby="memory-title">
      <header className="mx-auto max-w-2xl text-center">
        <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-pink-600">
          <Sparkles aria-hidden="true" className="size-4" />
          TONIGHT&apos;S MEMORY
        </p>
        <h1
          id="memory-title"
          className="mt-2 text-[clamp(2rem,8vw,4.25rem)] font-semibold leading-[1.06] tracking-[-0.055em] text-text-primary sm:mt-3"
        >
          今晚，被你们好好收藏了
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-text-secondary sm:text-base">
          把最喜欢的瞬间和想说的话写下来，这张卡会跟着你们的文字一起变化。
        </p>
      </header>

      <div className="mt-7 grid gap-7 sm:mt-9 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:items-start">
        <div aria-labelledby="memory-preview-title">
          <p id="memory-preview-title" className="mb-3 text-xs font-semibold tracking-[0.14em] text-text-muted lg:sr-only">
            第一部分 · 可截图回忆卡
          </p>
          <MemoryCardPreview
            dateLabel={dateLabel}
            plan={plan}
            compatibilityScore={compatibilityScore}
            completedCount={gameState.completedStepIds.length}
            skippedCount={gameState.skippedStepIds.length}
            keywords={keywords}
            automaticMemory={automaticMemory}
            favoriteMoment={gameState.favoriteMoment}
            messageToPartner={gameState.messageToPartner}
          />
        </div>

        <aside className="rounded-[1.25rem] border border-dashed border-border-pink bg-[#fffdfb]/88 p-5 shadow-[var(--shadow-soft)] sm:p-7" aria-labelledby="memory-input-title">
          <p className="text-[10px] font-semibold tracking-[0.18em] text-pink-600">第二部分 · ADD YOUR WORDS</p>
          <h2 id="memory-input-title" className="mt-1 text-xl font-semibold tracking-[-0.02em] text-text-primary">
            再为今晚写两句话
          </h2>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            内容会实时融入回忆卡，并自动保存在当前设备。
          </p>

          <div className="mt-6">
            <div className="flex items-end justify-between gap-3">
              <label htmlFor="favorite-moment" className="text-sm font-semibold text-text-primary">
                今晚最喜欢的瞬间
              </label>
              <span className="text-xs text-text-muted">
                {gameState.favoriteMoment.length}/120
              </span>
            </div>
            <textarea
              id="favorite-moment"
              value={gameState.favoriteMoment}
              onChange={(event) => onFavoriteMomentChange(event.target.value)}
              onFocus={handleTextareaFocus}
              maxLength={120}
              rows={3}
              placeholder="比如，晚风吹过来的那一刻"
              className="mt-2 min-h-28 max-h-44 w-full scroll-mb-[40vh] resize-y rounded-[0.9rem] border border-border-soft bg-[#fffaf7] px-4 py-3 text-base leading-7 text-text-primary outline-none transition-[border-color,background-color,box-shadow] placeholder:text-text-muted hover:bg-white focus:border-pink-300 focus:bg-white"
            />
          </div>

          <div className="mt-5">
            <div className="flex items-end justify-between gap-3">
              <label htmlFor="message-to-partner" className="text-sm font-semibold text-text-primary">
                想对 TA 说的一句话
              </label>
              <span className="text-xs text-text-muted">
                {gameState.messageToPartner.length}/160
              </span>
            </div>
            <textarea
              id="message-to-partner"
              value={gameState.messageToPartner}
              onChange={(event) => onMessageChange(event.target.value)}
              onFocus={handleTextareaFocus}
              maxLength={160}
              rows={3}
              placeholder="把此刻想说的话留在这里"
              className="mt-2 min-h-28 max-h-44 w-full scroll-mb-[40vh] resize-y rounded-[0.9rem] border border-border-soft bg-[#fffaf7] px-4 py-3 text-base leading-7 text-text-primary outline-none transition-[border-color,background-color,box-shadow] placeholder:text-text-muted hover:bg-white focus:border-pink-300 focus:bg-white"
            />
          </div>

          <div className="mt-7 space-y-3">
            <PrimaryButton onClick={onSave} className="w-full">
              <Save aria-hidden="true" className="size-4.5" />
              保存回忆
            </PrimaryButton>
            <SecondaryButton
              onClick={handleCopy}
              disabled={isCopying}
              className="w-full"
            >
              <Copy aria-hidden="true" className="size-4.5" />
              {isCopying ? "正在复制" : "复制纪念文字"}
            </SecondaryButton>
            {showCopyFallback ? (
              <div className="rounded-[0.9rem] border border-pink-200/70 bg-pink-50/55 p-3 text-left">
                <label
                  htmlFor="manual-memory-copy"
                  className="text-xs font-semibold text-text-secondary"
                >
                  可手动选择的纪念文字
                </label>
                <textarea
                  id="manual-memory-copy"
                  value={copiedText}
                  readOnly
                  rows={6}
                  onFocus={(event) => {
                    event.currentTarget.select();
                    handleTextareaFocus(event);
                  }}
                  className="mt-2 w-full scroll-mb-[40vh] resize-none rounded-xl border border-white/90 bg-white/70 p-3 text-base leading-6 text-text-primary sm:text-xs"
                />
              </div>
            ) : null}
            <button
              type="button"
              onClick={onRequestReset}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-text-secondary transition-colors hover:bg-white/45 hover:text-pink-600"
            >
              <RotateCcw aria-hidden="true" className="size-4" />
              重新开始
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
