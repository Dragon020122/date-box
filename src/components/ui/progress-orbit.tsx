import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/cn";

interface ProgressOrbitProps {
  progress: number;
  children?: ReactNode;
  label?: string;
  size?: number;
  className?: string;
}

export function ProgressOrbit({
  progress,
  children,
  label = "当前流程进度",
  size = 132,
  className,
}: ProgressOrbitProps) {
  const normalizedProgress = Math.min(1, Math.max(0, progress));
  const percentage = Math.round(normalizedProgress * 100);
  const orbitStyle = {
    width: size,
    height: size,
    background: `conic-gradient(var(--pink-500) 0deg, var(--purple-400) ${normalizedProgress * 360}deg, rgba(255, 255, 255, 0.44) ${normalizedProgress * 360}deg 360deg)`,
  } satisfies CSSProperties;

  return (
    <div
      className={cn(
        "relative grid shrink-0 place-items-center rounded-full p-[2px] shadow-[0_18px_50px_rgba(189,102,157,0.15)]",
        className,
      )}
      style={orbitStyle}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percentage}
    >
      <div className="grid size-full place-items-center rounded-full border border-white/80 bg-surface-strong p-3 text-center backdrop-blur-[6px] sm:backdrop-blur-xl">
        {children ?? (
          <span className="text-lg font-semibold text-text-primary">
            {percentage}%
          </span>
        )}
      </div>
    </div>
  );
}
