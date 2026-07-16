import type { HTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/lib/cn";

type GlassIntensity = "soft" | "default" | "strong";

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  intensity?: GlassIntensity;
}

const intensityClasses: Record<GlassIntensity, string> = {
  soft: "border-border-soft bg-surface-soft backdrop-blur-[3px] sm:backdrop-blur-md",
  default:
    "border-border-soft bg-surface shadow-[var(--shadow-soft)] backdrop-blur-[5px] sm:backdrop-blur-lg",
  strong:
    "border-border-pink bg-surface-strong shadow-[var(--shadow-pink)] backdrop-blur-[8px] sm:backdrop-blur-xl",
};

export function GlassPanel({
  children,
  className,
  intensity = "default",
  ...props
}: PropsWithChildren<GlassPanelProps>) {
  return (
    <div
      className={cn(
        "rounded-[1.5rem] border",
        intensityClasses[intensity],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
