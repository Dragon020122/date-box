"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Gift, Sparkles } from "lucide-react";

import { ProgressOrbit } from "@/components/ui/progress-orbit";
import { useLongPress } from "@/hooks/use-long-press";

interface MysteryBoxScreenProps {
  onOpen: () => void;
}

export function MysteryBoxScreen({ onOpen }: MysteryBoxScreenProps) {
  const [isOpening, setIsOpening] = useState(false);
  const openingRef = useRef(false);
  const revealTimerRef = useRef<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const beginReveal = useCallback(() => {
    if (openingRef.current) {
      return;
    }

    openingRef.current = true;
    setIsOpening(true);
    revealTimerRef.current = window.setTimeout(
      onOpen,
      shouldReduceMotion ? 240 : 760,
    );
  }, [onOpen, shouldReduceMotion]);

  const { progress, isPressing, longPressHandlers } = useLongPress({
    duration: 1100,
    disabled: isOpening,
    reduceMotion: Boolean(shouldReduceMotion),
    onComplete: beginReveal,
  });

  useEffect(
    () => () => {
      if (revealTimerRef.current !== null) {
        window.clearTimeout(revealTimerRef.current);
      }
    },
    [],
  );

  const visualProgress = isOpening ? 1 : progress;
  const progressPercent = Math.round(visualProgress * 100);
  const instruction = isOpening
    ? "盲盒已开启，正在铺开路线"
    : progress > 0.03
      ? "保持长按，惊喜快出现了"
      : "长按中央印记开启";

  return (
    <section
      className="mx-auto flex min-h-[calc(100dvh-8.5rem-var(--safe-top)-var(--safe-bottom))] w-full max-w-3xl flex-col items-center justify-start pt-[4dvh] text-center sm:justify-center sm:pt-0"
      aria-labelledby="mystery-box-title"
    >
      <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-pink-600 sm:text-sm">
        <Sparkles aria-hidden="true" className="size-4" />
        ONE LITTLE SURPRISE
      </p>
      <h1
        id="mystery-box-title"
        className="mt-4 max-w-2xl text-[clamp(2.25rem,9vw,3.8rem)] font-semibold leading-[1.08] tracking-[-0.05em] text-text-primary"
      >
        两份选择，正在汇成今晚
      </h1>
      <p className="mt-4 max-w-md text-[15px] leading-7 text-text-secondary sm:text-base">
        计划已经密封好。长按开启，看看你们会去哪里。
      </p>

      <div className="relative mt-auto grid max-h-[45dvh] w-full max-w-[340px] place-items-center py-2 sm:mt-9 sm:max-h-none">
        <div className="pointer-events-none absolute inset-[6%] rounded-full border border-pink-200/70" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-[13%] rounded-full border border-dashed border-purple-200/80" aria-hidden="true" />
        <span className="pointer-events-none absolute left-[6%] top-1/2 -translate-y-1/2 text-[9px] font-semibold tracking-[0.2em] text-text-muted" aria-hidden="true">CHOICE A</span>
        <span className="pointer-events-none absolute right-[5%] top-1/2 -translate-y-1/2 text-[9px] font-semibold tracking-[0.2em] text-text-muted" aria-hidden="true">CHOICE B</span>

        <ProgressOrbit
          progress={visualProgress}
          size={252}
          label="长按开启约会盲盒的进度"
          className="z-10 shadow-[0_22px_64px_rgba(90,57,76,0.12)]"
        >
          <motion.button
            type="button"
            className="relative grid size-[166px] touch-manipulation select-none place-items-center rounded-[2.25rem_2.25rem_2.25rem_0.8rem] border border-border-pink bg-[linear-gradient(145deg,#fffdfb,#f5e8ed)] text-text-primary shadow-[0_20px_52px_rgba(90,57,76,0.14)] [-webkit-touch-callout:none] [-webkit-user-select:none] disabled:cursor-default"
            aria-label="长按开启今晚的约会盲盒"
            aria-describedby="mystery-box-instruction"
            disabled={isOpening}
            {...longPressHandlers}
            animate={
              isOpening
                ? { scale: shouldReduceMotion ? 0.98 : [1, 0.96, 1.03], opacity: [1, 0.88] }
                : isPressing && !shouldReduceMotion
                  ? { scale: 0.98 }
                  : { scale: 1 }
            }
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.44, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="absolute inset-x-6 top-6 border-t border-dashed border-border-pink" aria-hidden="true" />
            <span className="absolute inset-x-6 bottom-6 border-t border-dashed border-border-pink" aria-hidden="true" />
            <motion.span
              className="grid size-16 place-items-center rounded-full bg-text-primary text-white"
              animate={isOpening && !shouldReduceMotion ? { y: [0, -10], rotate: [0, -6, 4, 0] } : undefined}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <Gift aria-hidden="true" className="size-7" strokeWidth={1.6} />
            </motion.span>
            <span className="absolute bottom-8 text-[10px] font-semibold tracking-[0.18em] text-text-muted">
              SEALED FOR TONIGHT
            </span>
          </motion.button>
        </ProgressOrbit>
      </div>

      <div className="mt-1 w-full max-w-[252px]" aria-live="polite">
        <div className="flex items-center justify-between gap-4 text-xs font-semibold text-text-muted">
          <span id="mystery-box-instruction">{instruction}</span>
          <span className="font-mono text-text-primary">{progressPercent}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-purple-100/70">
          <motion.div
            className="h-full origin-left rounded-full bg-[var(--gradient-primary)]"
            style={{ scaleX: visualProgress }}
          />
        </div>
      </div>

      <button
        type="button"
        className="mt-5 min-h-11 rounded-[0.9rem] px-5 text-sm font-medium text-text-muted underline decoration-pink-300/70 underline-offset-4 transition-colors duration-200 hover:text-pink-600 disabled:cursor-default disabled:opacity-40"
        onClick={beginReveal}
        disabled={isOpening}
      >
        直接开启
      </button>
    </section>
  );
}
