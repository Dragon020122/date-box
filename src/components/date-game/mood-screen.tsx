import {
  ArrowLeft,
  ArrowRight,
  CloudSun,
  Dices,
  Heart,
  MessagesSquare,
  PartyPopper,
  Sparkles,
} from "lucide-react";

import { OptionCard } from "@/components/ui/option-card";
import { MobileActionBar } from "@/components/ui/mobile-action-bar";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import type { MoodId } from "@/types/date-game";

const moodOptions = [
  {
    id: "healing",
    title: "松弛治愈",
    description: "慢一点，吹吹风，好好说话",
    icon: CloudSun,
    accent:
      "bg-[linear-gradient(145deg,rgba(255,253,249,0.78),rgba(248,235,224,0.58))]",
    iconAccent: "bg-[#f6e7da] text-[#9d684d]",
  },
  {
    id: "romantic",
    title: "浪漫心动",
    description: "灯光、晚餐和一点小惊喜",
    icon: Heart,
    accent:
      "bg-[linear-gradient(145deg,rgba(255,252,251,0.78),rgba(249,226,234,0.6))]",
    iconAccent: "bg-[#f6e0e8] text-[#a74f72]",
  },
  {
    id: "playful",
    title: "热闹好玩",
    description: "把笑声放在计划前面",
    icon: PartyPopper,
    accent:
      "bg-[linear-gradient(145deg,rgba(255,253,249,0.78),rgba(249,237,211,0.58))]",
    iconAccent: "bg-[#f5e8c8] text-[#96713b]",
  },
  {
    id: "conversation",
    title: "安静聊天",
    description: "找个角落，认真听彼此说话",
    icon: MessagesSquare,
    accent:
      "bg-[linear-gradient(145deg,rgba(252,253,252,0.78),rgba(228,239,237,0.58))]",
    iconAccent: "bg-[#dfeeea] text-[#527e75]",
  },
  {
    id: "adventure",
    title: "新鲜刺激",
    description: "试一件你们都没做过的事",
    icon: Sparkles,
    accent:
      "bg-[linear-gradient(145deg,rgba(253,252,254,0.78),rgba(234,226,240,0.6))]",
    iconAccent: "bg-[#e9e0ee] text-[#80658f]",
  },
  {
    id: "random",
    title: "交给命运",
    description: "不做选择，今晚交给偶然",
    icon: Dices,
    accent:
      "bg-[linear-gradient(145deg,rgba(253,252,251,0.78),rgba(237,230,235,0.62))]",
    iconAccent: "bg-[#eee5ea] text-[#75596c]",
  },
] satisfies Array<{
  id: MoodId;
  title: string;
  description: string;
  icon: typeof CloudSun;
  accent: string;
  iconAccent: string;
}>;

interface MoodScreenProps {
  selectedMood: MoodId | null;
  onSelect: (mood: MoodId) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function MoodScreen({
  selectedMood,
  onSelect,
  onBack,
  onContinue,
}: MoodScreenProps) {
  const selectedLabel = moodOptions.find((option) => option.id === selectedMood)?.title;

  return (
    <section aria-labelledby="mood-title">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-pink-600 sm:text-sm">
            01 · TONIGHT&apos;S MOOD
          </p>
          <h1
            id="mood-title"
            className="mt-2 max-w-3xl text-[clamp(1.8rem,8vw,3rem)] font-semibold leading-[1.15] tracking-[-0.035em] text-text-primary sm:mt-4"
          >
            今天，你们想要哪一种心动？
          </h1>
          <p className="mt-1.5 text-sm leading-6 text-text-secondary sm:mt-3 sm:text-base sm:leading-7">
            先选一种今晚最想靠近的感觉。
          </p>
        </div>

        <p
          className="min-h-5 text-xs font-medium text-text-muted sm:min-h-7 sm:text-right sm:text-sm"
          aria-live="polite"
        >
          {selectedLabel ? `已选择 · ${selectedLabel}` : "等待你们的第一条线索"}
        </p>
      </div>

      <div className="mt-4 grid gap-2 sm:mt-7 sm:gap-3 min-[520px]:grid-cols-2 lg:mt-9 lg:grid-cols-3 lg:gap-4">
        {moodOptions.map((option) => (
          <OptionCard
            key={option.id}
            icon={option.icon}
            title={option.title}
            description={option.description}
            selected={selectedMood === option.id}
            onClick={() => onSelect(option.id)}
            className={option.accent}
            iconClassName={option.iconAccent}
            compact
          />
        ))}
      </div>

      <MobileActionBar>
        <SecondaryButton onClick={onBack} className="w-full sm:w-auto">
          <ArrowLeft aria-hidden="true" className="size-4.5" />
          返回欢迎页
        </SecondaryButton>
        <PrimaryButton
          onClick={onContinue}
          disabled={selectedMood === null}
          className="w-full sm:w-auto"
        >
          就选这个
          <ArrowRight aria-hidden="true" className="size-4.5" />
        </PrimaryButton>
      </MobileActionBar>
    </section>
  );
}
