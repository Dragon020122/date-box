import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/cn";

interface OptionCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  compact?: boolean;
  className?: string;
  iconClassName?: string;
}

export function OptionCard({
  icon: Icon,
  title,
  description,
  selected = false,
  disabled = false,
  onClick,
  compact = false,
  className,
  iconClassName,
}: OptionCardProps) {
  return (
    <button
      type="button"
      className={cn(
        "group relative flex w-full items-start gap-4 overflow-hidden rounded-[1.35rem] border text-left",
        "border-border-soft bg-surface-soft backdrop-blur-[3px] sm:backdrop-blur-md",
        "transition-[transform,border-color,background-color,box-shadow,opacity] duration-200 hover:border-border-pink hover:bg-surface",
        "active:scale-[0.99] active:bg-surface-strong",
        compact
          ? "min-h-[68px] p-3.5 sm:min-h-24 sm:p-4"
          : "min-h-[76px] p-3.5 sm:min-h-32 sm:p-6",
        selected &&
          "border-pink-400 bg-surface-strong shadow-[0_14px_38px_rgba(105,62,84,0.12)]",
        disabled &&
          "cursor-not-allowed opacity-45 hover:translate-y-0 hover:border-border-soft hover:bg-surface-soft",
        className,
      )}
      disabled={disabled}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-[0.95rem] border border-white/65 bg-white/48 text-pink-500 transition-colors duration-200",
          iconClassName,
          selected && "border-pink-200 bg-pink-50 text-pink-600",
        )}
      >
        <Icon aria-hidden="true" className="size-5" strokeWidth={1.8} />
      </span>

      <span className="min-w-0 flex-1 pr-5">
        <span className="block text-[17px] font-semibold leading-7 text-text-primary">
          {title}
        </span>
        {description ? (
          <span className="mt-0.5 block line-clamp-2 text-sm leading-5 text-text-secondary sm:mt-1 sm:line-clamp-none sm:leading-6">
            {description}
          </span>
        ) : null}
      </span>

      <span
        className={cn(
          "absolute right-4 top-4 flex size-6 scale-75 items-center justify-center rounded-full border border-pink-200 bg-white text-pink-600 opacity-0 transition-[transform,opacity] duration-200",
          selected && "scale-100 opacity-100",
        )}
        aria-hidden="true"
      >
        <Check className="size-3.5" strokeWidth={2.5} />
      </span>
    </button>
  );
}
