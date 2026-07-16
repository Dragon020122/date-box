"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MapPin, MoonStar, Route, Sparkles, Ticket } from "lucide-react";

export function HeartbeatTrail() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="relative mx-auto h-[196px] w-full max-w-[620px] min-[390px]:h-[214px] sm:h-[320px] lg:h-[500px]"
      aria-label="两条选择轨迹汇合成一张今晚的约会票据"
      role="img"
    >
      <div className="absolute left-[8%] top-[8%] size-24 rounded-full border border-pink-200/65 bg-pink-100/28 sm:left-[5%] sm:top-[9%] sm:size-48 lg:size-64" aria-hidden="true" />
      <div className="absolute bottom-[5%] right-[7%] size-24 rounded-full border border-purple-200/70 bg-purple-100/34 sm:right-[3%] sm:size-44 lg:size-60" aria-hidden="true" />
      <div className="absolute left-[18%] top-[26%] h-px w-[35%] rotate-[18deg] bg-[linear-gradient(90deg,var(--pink-300),rgba(221,169,188,0.15))]" aria-hidden="true" />
      <div className="absolute right-[18%] top-[31%] h-px w-[34%] -rotate-[20deg] bg-[linear-gradient(90deg,rgba(195,174,208,0.15),var(--purple-300))]" aria-hidden="true" />

      <motion.span
        className="absolute left-[12%] top-[14%] grid size-9 place-items-center rounded-[0.8rem] border border-pink-200 bg-[#fff8f5] text-pink-600 shadow-[0_12px_30px_rgba(92,58,76,0.1)] sm:top-[18%] sm:size-11 lg:size-13"
        animate={shouldReduceMotion ? undefined : { y: [0, -5, 0] }}
        transition={{ duration: 5.5, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
        aria-hidden="true"
      >
        <MoonStar className="size-5" strokeWidth={1.7} />
      </motion.span>

      <motion.span
        className="absolute right-[13%] top-[16%] grid size-9 place-items-center rounded-full border border-purple-200 bg-[#faf7fb] text-purple-500 shadow-[0_12px_30px_rgba(92,58,76,0.1)] sm:top-[21%] sm:size-11 lg:size-13"
        animate={shouldReduceMotion ? undefined : { y: [0, 5, 0] }}
        transition={{ duration: 6.2, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
        aria-hidden="true"
      >
        <Sparkles className="size-5" strokeWidth={1.7} />
      </motion.span>

      <div className="absolute left-1/2 top-[28%] h-[64%] w-[82%] -translate-x-1/2 rotate-[-2deg] rounded-[1.5rem_1.5rem_1.5rem_0.55rem] border border-border-pink bg-[#fffdfb]/92 shadow-[0_22px_54px_rgba(76,49,65,0.13)] backdrop-blur-md sm:top-[34%] sm:h-[52%] sm:w-[64%] sm:rounded-[2rem_2rem_2rem_0.65rem] lg:top-[31%] lg:h-[56%]">
        <div className="absolute -left-3 top-1/2 size-6 -translate-y-1/2 rounded-full border-r border-border-pink bg-[#faf5f4]" aria-hidden="true" />
        <div className="absolute -right-3 top-1/2 size-6 -translate-y-1/2 rounded-full border-l border-border-pink bg-[#f8f3f7]" aria-hidden="true" />

        <div className="flex h-full flex-col justify-between p-4 sm:p-7 lg:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] text-text-muted sm:text-xs">DATE BOX · TONIGHT</p>
              <p className="mt-1 text-base font-semibold tracking-[-0.03em] text-text-primary min-[390px]:text-lg sm:mt-2 sm:text-2xl lg:text-3xl">一张只属于你们的约会票</p>
            </div>
            <Ticket aria-hidden="true" className="size-5 shrink-0 text-pink-600 sm:size-6" strokeWidth={1.6} />
          </div>

          <div className="flex items-center gap-2 border-y border-dashed border-border-pink py-2 text-[11px] font-medium text-text-secondary sm:gap-4 sm:py-3 sm:text-sm">
            <span className="inline-flex items-center gap-1.5"><MapPin aria-hidden="true" className="size-3.5 text-pink-600" />从此刻出发</span>
            <span className="h-4 w-px bg-border-pink" aria-hidden="true" />
            <span>目的地 · 一份惊喜</span>
          </div>

          <div className="flex items-end justify-between gap-4">
            <p className="max-w-52 text-[11px] leading-4 text-text-muted sm:text-sm sm:leading-6">两份选择在这里汇合，变成今晚能照着走的路线。</p>
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-text-primary text-white sm:size-12">
              <Route aria-hidden="true" className="size-4.5 sm:size-5" strokeWidth={1.7} />
            </span>
          </div>
        </div>
      </div>

      <span className="absolute bottom-0 left-[7%] hidden text-[10px] font-semibold tracking-[0.18em] text-text-muted sm:block sm:text-xs">TWO CHOICES</span>
      <span className="absolute bottom-0 right-[6%] hidden text-[10px] font-semibold tracking-[0.18em] text-text-muted sm:block sm:text-xs">ONE ROUTE</span>
    </div>
  );
}
