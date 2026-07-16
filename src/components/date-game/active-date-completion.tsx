"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function ActiveDateCompletion() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="mx-auto flex min-h-[58dvh] w-full max-w-2xl items-center justify-center text-center">
      <motion.div
        className="relative w-full overflow-hidden rounded-[2.2rem] border border-white/90 bg-surface p-8 shadow-[var(--shadow-pink)] backdrop-blur-[8px] sm:p-12 sm:backdrop-blur-2xl"
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(255,198,220,0.55),transparent_38%)]" />
        <motion.span
          className="relative mx-auto grid size-20 place-items-center rounded-full border border-white/90 bg-[linear-gradient(145deg,var(--pink-100),var(--purple-100))] text-pink-600 shadow-[var(--shadow-pink)]"
          animate={shouldReduceMotion ? undefined : { scale: [1, 1.06, 1] }}
          transition={{ duration: 1.1, repeat: Infinity }}
        >
          <Sparkles aria-hidden="true" className="size-8" />
        </motion.span>
        <p className="relative mt-7 text-xs font-semibold tracking-[0.16em] text-pink-600">
          ROUTE COMPLETE
        </p>
        <h1 className="relative mx-auto mt-3 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.04em] text-text-primary sm:text-4xl">
          今晚的路线已经被你们慢慢走完
        </h1>
        <p className="relative mt-4 text-[15px] leading-7 text-text-secondary">
          正在把沿途的小小光点，收进今晚的回忆卡。
        </p>
      </motion.div>
    </section>
  );
}
