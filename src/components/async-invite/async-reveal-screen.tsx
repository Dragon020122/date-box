"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";

const revealMessages = [
  "正在找到重合的期待",
  "正在拼起不同的小愿望",
  "今晚的答案已经出现",
] as const;

interface AsyncRevealScreenProps {
  onComplete: () => void;
}

export function AsyncRevealScreen({ onComplete }: AsyncRevealScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const interval = shouldReduceMotion ? 280 : 580;
    const timers = [
      window.setTimeout(() => setMessageIndex(1), interval),
      window.setTimeout(() => setMessageIndex(2), interval * 2),
      window.setTimeout(onComplete, shouldReduceMotion ? 920 : 1980),
    ];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [onComplete, shouldReduceMotion]);

  return (
    <section className="mx-auto flex min-h-[66dvh] w-full max-w-3xl flex-col items-center justify-center text-center" aria-live="polite" aria-labelledby="async-reveal-title">
      <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-pink-600">
        <Sparkles aria-hidden="true" className="size-4" />
        TWO LITTLE TRAILS
      </p>
      <h1 id="async-reveal-title" className="mt-4 max-w-2xl text-[clamp(2rem,8vw,3.75rem)] font-semibold leading-[1.08] tracking-[-0.05em] text-text-primary">
        两份期待已经放进同一个盒子里
      </h1>

      <div className="relative mt-10 h-32 w-full max-w-xl overflow-hidden" aria-hidden="true">
        <motion.span
          className="absolute left-[6%] top-[34%] h-px w-[43%] origin-left bg-gradient-to-r from-pink-300 to-pink-500"
          initial={{ scaleX: 0, rotate: -8 }}
          animate={{ scaleX: 1, rotate: 7 }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 1.35, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.span
          className="absolute right-[6%] top-[64%] h-px w-[43%] origin-right bg-gradient-to-l from-purple-300 to-purple-500"
          initial={{ scaleX: 0, rotate: 8 }}
          animate={{ scaleX: 1, rotate: -7 }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 1.35, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.span
          className="absolute left-[6%] top-[30%] size-3 rounded-full bg-pink-500 shadow-[0_0_22px_rgba(184,95,131,0.42)]"
          initial={{ left: "6%", top: "30%", x: 0, y: 0 }}
          animate={{ left: "50%", top: "50%", x: "-50%", y: "-50%" }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 1.45, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.span
          className="absolute right-[6%] top-[60%] size-3 rounded-full bg-purple-500 shadow-[0_0_22px_rgba(128,101,143,0.38)]"
          initial={{ right: "6%", top: "60%", x: 0, y: 0 }}
          animate={{ right: "50%", top: "50%", x: "50%", y: "-50%" }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 1.45, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.span
          className="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 ring-1 ring-pink-200"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: [0.4, 1.08, 1] }}
          transition={{ delay: shouldReduceMotion ? 0 : 1.15, duration: shouldReduceMotion ? 0.1 : 0.48 }}
        />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={revealMessages[messageIndex]}
          className="mt-2 min-h-7 text-sm font-medium tracking-[0.04em] text-text-secondary sm:text-base"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -5 }}
        >
          {revealMessages[messageIndex]}
        </motion.p>
      </AnimatePresence>
    </section>
  );
}
