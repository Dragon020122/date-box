"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";

import { PrimaryButton } from "@/components/ui/primary-button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface HandoffScreenProps {
  onContinue: () => void;
}

export function HandoffScreen({ onContinue }: HandoffScreenProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="mx-auto flex min-h-[calc(100dvh-8.5rem-var(--safe-top)-var(--safe-bottom))] w-full max-w-2xl flex-col items-center justify-center overflow-hidden text-center"
      aria-labelledby="handoff-title"
    >
      <motion.div
        className="relative grid size-36 place-items-center sm:size-52"
        animate={
          shouldReduceMotion
            ? undefined
            : { scale: [1, 1.025, 1], opacity: [0.96, 1, 0.96] }
        }
        transition={{ duration: 5.5, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
      >
        <div
          className="absolute inset-3 rounded-full bg-[radial-gradient(circle,rgba(251,166,200,0.38),rgba(221,197,255,0.22)_46%,transparent_72%)] blur-xl"
          aria-hidden="true"
        />
        <div className="relative grid h-24 w-32 place-items-center rounded-[1.7rem] border border-white/90 bg-[linear-gradient(145deg,rgba(255,255,255,0.9),rgba(255,226,238,0.76)_52%,rgba(238,227,255,0.8))] text-pink-600 shadow-[0_26px_70px_rgba(194,93,149,0.2)] sm:h-32 sm:w-44 sm:rounded-[2rem]">
          <Mail aria-hidden="true" className="size-14" strokeWidth={1.35} />
          <span className="absolute -bottom-3 -right-2 grid size-11 place-items-center rounded-2xl border border-white/90 bg-surface-strong text-purple-500 shadow-[0_12px_30px_rgba(126,87,170,0.18)]">
            <LockKeyhole aria-hidden="true" className="size-5" strokeWidth={1.8} />
          </span>
        </div>
      </motion.div>

      <p className="mt-2 text-xs font-semibold tracking-[0.18em] text-pink-600">
        ANSWERS SAFELY HIDDEN
      </p>
      <h1
        id="handoff-title"
        className="mt-4 text-[clamp(2.2rem,9vw,3.5rem)] font-semibold leading-[1.12] tracking-[-0.04em] text-text-primary"
      >
        好啦，现在把手机交给 TA。
      </h1>
      <p className="mt-4 max-w-lg text-[15px] leading-7 text-text-secondary sm:text-base sm:leading-8">
        你的答案已经被藏进心动盒子里。
      </p>

      <PrimaryButton onClick={() => setShowConfirmation(true)} className="mt-7 w-full sm:mt-8 sm:w-auto">
        我是 TA，开始回答
        <ArrowRight aria-hidden="true" className="size-4.5" />
      </PrimaryButton>

      <ConfirmationDialog
        open={showConfirmation}
        title="手机已经交给 TA 了吗？"
        description="确认后将进入玩家 B 的问题。玩家 A 的答案仍会保持隐藏。"
        confirmLabel="已经交给 TA"
        cancelLabel="再等一下"
        onCancel={() => setShowConfirmation(false)}
        onConfirm={onContinue}
      />
    </section>
  );
}
