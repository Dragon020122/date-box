import { Check, ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/cn";

export interface PreferenceOption<T extends string> {
  id: T;
  label: string;
}

interface PreferenceGroupProps<T extends string> {
  icon: LucideIcon;
  legend: string;
  options: readonly PreferenceOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  expanded: boolean;
  summary?: string;
  onToggle: () => void;
}

export function PreferenceGroup<T extends string>({
  icon: Icon,
  legend,
  options,
  value,
  onChange,
  expanded,
  summary,
  onToggle,
}: PreferenceGroupProps<T>) {
  if (!expanded) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className="flex min-h-16 w-full items-center gap-3 rounded-[1.15rem] border border-white/80 bg-white/38 px-4 py-3 text-left transition-colors hover:bg-white/58 active:bg-pink-50/70"
        aria-label={`编辑${legend}，当前选择${summary ?? "未选择"}`}
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/80 bg-white/60 text-pink-600">
          <Icon aria-hidden="true" className="size-4" strokeWidth={1.8} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-medium text-text-muted">{legend}</span>
          <span className="mt-0.5 block truncate text-sm font-semibold text-text-primary">
            {summary ?? "待选择"}
          </span>
        </span>
        {summary ? (
          <span className="grid size-6 place-items-center rounded-full bg-pink-600 text-white">
            <Check aria-hidden="true" className="size-3.5" />
          </span>
        ) : (
          <ChevronDown aria-hidden="true" className="size-4 text-text-muted" />
        )}
      </button>
    );
  }

  return (
    <fieldset className="rounded-[1.35rem] border border-pink-200/60 bg-white/48 p-4 shadow-[0_14px_36px_rgba(105,62,84,0.08)] sm:p-5">
      <legend className="sr-only">{legend}</legend>
      <div className="mb-3.5 flex items-center gap-2.5">
        <span className="grid size-9 place-items-center rounded-xl border border-white/80 bg-white/55 text-pink-600 shadow-[0_8px_22px_rgba(211,99,153,0.1)]">
          <Icon aria-hidden="true" className="size-4" strokeWidth={1.8} />
        </span>
        <p className="text-[15px] font-semibold text-text-primary sm:text-base">
          {legend}
        </p>
      </div>

      <div
        className={cn(
          "grid grid-cols-2 gap-2.5 sm:gap-3",
          options.length === 3 && "min-[520px]:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3",
        )}
      >
        {options.map((option) => {
          const selected = value === option.id;

          return (
            <button
              key={option.id}
              type="button"
              className={cn(
                "relative flex min-h-12 items-center justify-center rounded-2xl border px-3 py-2.5 text-center text-sm font-medium leading-5",
                "border-white/80 bg-white/42 text-text-secondary transition-[transform,border-color,background-color,color,box-shadow] duration-200",
                "hover:border-pink-200 hover:bg-white/64 active:scale-[0.98] active:bg-pink-50/70",
                selected &&
                  "border-pink-300 bg-pink-50/85 pr-8 text-text-primary shadow-[0_10px_28px_rgba(218,101,157,0.13)]",
              )}
              onClick={() => onChange(option.id)}
              aria-pressed={selected}
            >
              <span>{option.label}</span>
              {selected ? (
                <span
                  className="absolute right-2 top-2 grid size-5 place-items-center rounded-full bg-pink-600 text-white"
                  aria-hidden="true"
                >
                  <Check className="size-3" strokeWidth={2.6} />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
