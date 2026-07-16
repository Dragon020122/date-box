"use client";

import { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Sparkles, X } from "lucide-react";

interface SurpriseTaskSheetProps {
  open: boolean;
  task: string | null;
  onClose: () => void;
}

export function SurpriseTaskSheet({
  open,
  task,
  onClose,
}: SurpriseTaskSheetProps) {
  const titleId = useId();
  const descriptionId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousFocus = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
      } else if (event.key === "Tab") {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && task ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(72,48,69,0.2)] px-3 pb-[calc(0.75rem+var(--safe-bottom))] pt-[calc(0.75rem+var(--safe-top))] backdrop-blur-sm sm:items-center sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/90 bg-[rgba(255,250,253,0.96)] p-6 shadow-[0_28px_90px_rgba(91,54,81,0.22)] sm:p-7"
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 36, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 20, scale: 0.99 }
            }
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="pointer-events-none absolute -right-12 -top-14 size-44 rounded-full bg-purple-200/45 blur-3xl" />
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 grid size-11 place-items-center rounded-full text-text-secondary transition-colors hover:bg-white/70 hover:text-text-primary"
              aria-label="收起临时彩蛋"
            >
              <X aria-hidden="true" className="size-5" />
            </button>

            <span className="relative grid size-14 place-items-center rounded-[1.25rem] border border-white/90 bg-[linear-gradient(145deg,var(--pink-100),var(--purple-100))] text-pink-600 shadow-[var(--shadow-pink)]">
              <Sparkles aria-hidden="true" className="size-6" />
            </span>
            <p className="relative mt-5 text-xs font-semibold tracking-[0.15em] text-pink-600">
              JUST FOR THIS MOMENT
            </p>
            <h2
              id={titleId}
              className="relative mt-2 text-2xl font-semibold tracking-[-0.03em] text-text-primary"
            >
              一颗临时掉落的彩蛋
            </h2>
            <p
              id={descriptionId}
              className="relative mt-4 rounded-[1.4rem] bg-[linear-gradient(135deg,rgba(255,226,238,0.55),rgba(221,197,255,0.44))] p-5 text-lg font-medium leading-8 text-text-primary"
            >
              {task}
            </p>
            <p className="relative mt-4 text-sm leading-6 text-text-secondary">
              想做就现在试试，不用把它变成新的计划。
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
