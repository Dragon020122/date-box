"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, Info, Sparkles, TicketCheck } from "lucide-react";

import { HeartbeatTrail } from "@/components/date-game/heartbeat-trail";
import { GlassPanel } from "@/components/ui/glass-panel";
import { PrimaryButton } from "@/components/ui/primary-button";

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="grid min-h-[calc(100dvh-6.5rem-var(--safe-top)-var(--safe-bottom))] content-between items-center gap-x-14 gap-y-3 lg:min-h-[620px] lg:grid-cols-[minmax(0,0.88fr)_minmax(460px,1.12fr)] lg:grid-rows-[auto_1fr] lg:gap-y-7 xl:gap-x-20"
      aria-labelledby="welcome-title"
    >
      <div className="order-1 self-end lg:col-start-1 lg:row-start-1">
        <p className="hidden items-center gap-2 text-xs font-semibold tracking-[0.18em] text-pink-600 sm:inline-flex sm:text-sm">
          <Sparkles aria-hidden="true" className="size-4" />
          心动计划局 · DATE BOX
        </p>
        <h1
          id="welcome-title"
          className="mt-1 text-[clamp(2.15rem,10vw,4rem)] font-semibold leading-[1.08] tracking-[-0.045em] text-text-primary sm:mt-5"
        >
          <span className="block">把今晚，</span>
          <span className="block">变成一场约会计划。</span>
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-6 text-text-secondary sm:mt-5 sm:text-base sm:leading-8">
          两个人分别选出期待，默契盲盒会生成一条今晚就能出发的约会路线。
        </p>
      </div>

      <div className="order-2 lg:col-start-2 lg:row-span-2 lg:row-start-1">
        <HeartbeatTrail />
      </div>

      <div className="order-3 self-start lg:col-start-1 lg:row-start-2">
        <div className="flex flex-col gap-1.5 sm:flex-row sm:gap-3 lg:mt-7">
          <PrimaryButton onClick={onStart} className="w-full sm:w-auto">
            生成今晚的计划
            <ArrowRight aria-hidden="true" className="size-4.5" />
          </PrimaryButton>
          <button
            type="button"
            onClick={() => setShowHowItWorks((isOpen) => !isOpen)}
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full px-4 text-sm font-medium text-text-muted transition-colors hover:text-pink-600 sm:min-h-13 sm:w-auto"
            aria-expanded={showHowItWorks}
            aria-controls="how-it-works"
          >
            <Info aria-hidden="true" className="size-4" />
            看看怎么玩
            <ChevronDown
              aria-hidden="true"
              className={`size-4 transition-transform duration-200 ${showHowItWorks ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <div className="mt-1.5 hidden flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-text-muted min-[390px]:flex sm:mt-5">
          <span className="inline-flex items-center gap-1.5">
            <TicketCheck aria-hidden="true" className="size-3.5 text-pink-600" />
            约 3 分钟
          </span>
          <span>双人选择</span>
          <span>即刻生成路线</span>
        </div>

        <AnimatePresence initial={false}>
          {showHowItWorks ? (
            <motion.div
              id="how-it-works"
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, height: 0, y: -6 }
              }
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, height: 0, y: -4 }
              }
              transition={{ duration: shouldReduceMotion ? 0.1 : 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <GlassPanel intensity="soft" className="mt-4 max-w-lg p-4 sm:p-5">
                <p className="text-sm leading-6 text-text-secondary sm:text-[15px] sm:leading-7">
                  先分别选择你们期待的约会方式，
                  <br />
                  再由心动盲盒生成今晚的路线与小任务。
                  <br />
                  整个过程只需要几分钟。
                </p>
              </GlassPanel>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
