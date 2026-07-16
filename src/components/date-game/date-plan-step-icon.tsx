import {
  CakeSlice,
  Camera,
  CircleCheck,
  Clapperboard,
  Coffee,
  Coins,
  Compass,
  CupSoda,
  Footprints,
  Gamepad2,
  Gift,
  LampDesk,
  MapPinned,
  MessagesSquare,
  MoonStar,
  Sparkles,
  Store,
  Timer,
  Trophy,
  Utensils,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/cn";

const icons: Record<string, LucideIcon> = {
  CakeSlice,
  Camera,
  CircleCheck,
  Clapperboard,
  Coffee,
  Coins,
  Compass,
  CupSoda,
  Footprints,
  Gamepad2,
  Gift,
  LampDesk,
  MapPinned,
  MessagesSquare,
  MoonStar,
  Sparkles,
  Store,
  Timer,
  Trophy,
  Utensils,
};

interface DatePlanStepIconProps {
  name: string;
  className?: string;
}

export function DatePlanStepIcon({ name, className }: DatePlanStepIconProps) {
  const Icon = icons[name] ?? Sparkles;

  return (
    <Icon
      aria-hidden="true"
      className={cn("size-5", className)}
      strokeWidth={1.8}
    />
  );
}
