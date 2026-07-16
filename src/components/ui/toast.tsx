"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";

import { cn } from "@/lib/cn";

type ToastTone = "success" | "info";

interface ToastProps {
  open: boolean;
  message: string;
  tone?: ToastTone;
  className?: string;
}

export function Toast({
  open,
  message,
  tone = "info",
  className,
}: ToastProps) {
  const shouldReduceMotion = useReducedMotion();
  const Icon = tone === "success" ? CheckCircle2 : Sparkles;

  return (
    <div
      className="pointer-events-none fixed inset-x-4 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-50 flex justify-center"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence>
        {open ? (
          <motion.div
            className={cn(
              "flex max-w-sm items-center gap-3 rounded-full border border-white/80 bg-surface-strong px-5 py-3 text-sm font-medium text-text-primary shadow-[var(--shadow-pink)] backdrop-blur-[8px] sm:backdrop-blur-2xl",
              className,
            )}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.24, ease: [0.22, 1, 0.36, 1] }}
            role="status"
          >
            <Icon aria-hidden="true" className="size-4.5 shrink-0 text-pink-600" />
            <span>{message}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
