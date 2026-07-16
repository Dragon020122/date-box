import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
}

export function SecondaryButton({
  children,
  className,
  fullWidth = false,
  type = "button",
  ...props
}: SecondaryButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-[1rem] border border-border-pink bg-surface px-6 py-3 text-[15px] font-semibold text-text-primary backdrop-blur-[4px] sm:backdrop-blur-lg",
        "transition-[transform,background-color,border-color,opacity] duration-200 hover:border-pink-300 hover:bg-surface-strong active:scale-[0.98] active:bg-pink-50",
        "disabled:cursor-not-allowed disabled:opacity-45",
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
