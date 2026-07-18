"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  MapPinned,
  Sparkles,
  UsersRound,
  WalletCards,
} from "lucide-react";

import { PreferenceGroup } from "@/components/date-game/preference-group";
import { GlassPanel } from "@/components/ui/glass-panel";
import { MobileActionBar } from "@/components/ui/mobile-action-bar";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { getPreferenceSummary } from "@/lib/preference-summary";
import type {
  BudgetId,
  DatePreferences,
  DistanceId,
  MoodId,
  RelationshipId,
  TimeId,
} from "@/types/date-game";

const timeOptions = [
  { id: "two-hours", label: "两小时刚刚好" },
  { id: "afternoon", label: "整个下午" },
  { id: "whole-evening", label: "今晚都可以" },
] satisfies Array<{ id: TimeId; label: string }>;

const budgetOptions = [
  { id: "simple", label: "简单走走" },
  { id: "refined", label: "稍微精致一点" },
  { id: "special", label: "今天值得认真安排" },
] satisfies Array<{ id: BudgetId; label: string }>;

const distanceOptions = [
  { id: "nearby", label: "附近就好" },
  { id: "thirty-minutes", label: "半小时以内" },
  { id: "farther", label: "远一点也值得" },
] satisfies Array<{ id: DistanceId; label: string }>;

const relationshipOptions = [
  { id: "first-date", label: "第一次约会" },
  { id: "ambiguous", label: "正在暧昧" },
  { id: "stable", label: "稳定恋爱" },
  { id: "long-term", label: "很熟悉的我们" },
] satisfies Array<{ id: RelationshipId; label: string }>;

const moodLabels: Record<MoodId, string> = {
  healing: "松弛治愈",
  romantic: "浪漫心动",
  playful: "热闹好玩",
  conversation: "安静聊天",
  adventure: "新鲜刺激",
  random: "交给命运",
};

interface PreferencesScreenProps {
  preferences: DatePreferences;
  onTimeChange: (value: TimeId) => void;
  onBudgetChange: (value: BudgetId) => void;
  onDistanceChange: (value: DistanceId) => void;
  onRelationshipChange: (value: RelationshipId) => void;
  onBack: () => void;
  onContinue: () => void;
  copy?: Partial<{
    eyebrow: string;
    title: string;
    description: string;
    backLabel: string;
    continueLabel: string;
  }>;
}

export function PreferencesScreen({
  preferences,
  onTimeChange,
  onBudgetChange,
  onDistanceChange,
  onRelationshipChange,
  onBack,
  onContinue,
  copy,
}: PreferencesScreenProps) {
  type GroupKey = "time" | "budget" | "distance" | "relationship";
  const groupOrder: GroupKey[] = ["time", "budget", "distance", "relationship"];
  const firstIncomplete = groupOrder.find((key) => preferences[key] === null) ?? "relationship";
  const [activeGroup, setActiveGroup] = useState<GroupKey>(firstIncomplete);
  const shouldReduceMotion = useReducedMotion();
  const summary = getPreferenceSummary(preferences);
  const completedCount = [
    preferences.time,
    preferences.budget,
    preferences.distance,
    preferences.relationship,
  ].filter(Boolean).length;

  function advanceAfter(key: GroupKey) {
    const currentIndex = groupOrder.indexOf(key);
    const nextIncomplete = groupOrder
      .slice(currentIndex + 1)
      .find((groupKey) => preferences[groupKey] === null);
    if (nextIncomplete) {
      setActiveGroup(nextIncomplete);
    }
  }

  return (
    <section aria-labelledby="preferences-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-pink-600 sm:text-sm">
            {copy?.eyebrow ?? "02 · LITTLE DETAILS"}
          </p>
          <h1
            id="preferences-title"
            className="mt-2 max-w-3xl text-[clamp(1.8rem,8vw,3rem)] font-semibold leading-[1.15] tracking-[-0.035em] text-text-primary sm:mt-4"
          >
            {copy?.title ?? "给今晚加一点小小设定"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-text-secondary sm:mt-3 sm:text-base sm:leading-7">
            {copy?.description ?? "不必想得太复杂，只选最接近你们今晚的答案。"}
          </p>
        </div>

        {preferences.mood ? (
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/80 bg-surface px-3.5 py-2 text-xs font-medium text-text-secondary backdrop-blur-xl">
            <Sparkles aria-hidden="true" className="size-3.5 text-pink-600" />
            今晚感觉 · {moodLabels[preferences.mood]}
          </span>
        ) : null}
      </div>

      <GlassPanel intensity="default" className="mt-5 p-3 sm:mt-9 sm:p-4 lg:p-5">
        <div className="grid gap-2.5 lg:grid-cols-2 lg:gap-3">
          <PreferenceGroup
            icon={Clock3}
            legend="时间"
            options={timeOptions}
            value={preferences.time}
            onChange={(value) => { onTimeChange(value); advanceAfter("time"); }}
            expanded={activeGroup === "time"}
            summary={timeOptions.find((option) => option.id === preferences.time)?.label}
            onToggle={() => setActiveGroup("time")}
          />
          <PreferenceGroup
            icon={WalletCards}
            legend="预算"
            options={budgetOptions}
            value={preferences.budget}
            onChange={(value) => { onBudgetChange(value); advanceAfter("budget"); }}
            expanded={activeGroup === "budget"}
            summary={budgetOptions.find((option) => option.id === preferences.budget)?.label}
            onToggle={() => setActiveGroup("budget")}
          />
          <PreferenceGroup
            icon={MapPinned}
            legend="行动范围"
            options={distanceOptions}
            value={preferences.distance}
            onChange={(value) => { onDistanceChange(value); advanceAfter("distance"); }}
            expanded={activeGroup === "distance"}
            summary={distanceOptions.find((option) => option.id === preferences.distance)?.label}
            onToggle={() => setActiveGroup("distance")}
          />
          <PreferenceGroup
            icon={UsersRound}
            legend="关系阶段"
            options={relationshipOptions}
            value={preferences.relationship}
            onChange={(value) => { onRelationshipChange(value); advanceAfter("relationship"); }}
            expanded={activeGroup === "relationship"}
            summary={relationshipOptions.find((option) => option.id === preferences.relationship)?.label}
            onToggle={() => setActiveGroup("relationship")}
          />
        </div>
      </GlassPanel>

      <div className="mt-3 min-h-20 sm:mt-5 sm:min-h-24" aria-live="polite" aria-atomic="true">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={summary ?? completedCount}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            {summary ? (
              <GlassPanel
                intensity="soft"
                className="border-pink-200/75 bg-[linear-gradient(115deg,rgba(255,239,246,0.66),rgba(237,226,255,0.48))] px-5 py-4 sm:px-6"
              >
                <p className="text-xs font-semibold tracking-[0.14em] text-pink-600">
                  今晚的小小预告
                </p>
                <p className="mt-1.5 text-[15px] font-medium leading-7 text-text-primary sm:text-base">
                  {summary}
                </p>
              </GlassPanel>
            ) : (
              <p className="px-1 py-3 text-sm text-text-muted">
                已完成 {completedCount} / 4 项，再选一点，今晚的轮廓就会出现。
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <MobileActionBar className="mt-4 sm:mt-4">
        <SecondaryButton onClick={onBack} className="w-full sm:w-auto">
          <ArrowLeft aria-hidden="true" className="size-4.5" />
          {copy?.backLabel ?? "返回心情选择"}
        </SecondaryButton>
        <PrimaryButton
          onClick={onContinue}
          disabled={summary === null}
          className="w-full sm:w-auto"
        >
          {copy?.continueLabel ?? "进入默契测试"}
          <ArrowRight aria-hidden="true" className="size-4.5" />
        </PrimaryButton>
      </MobileActionBar>
    </section>
  );
}
