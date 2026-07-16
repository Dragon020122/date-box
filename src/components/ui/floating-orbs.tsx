import { memo } from "react";

import { cn } from "@/lib/cn";

interface FloatingOrbsProps {
  className?: string;
}

export const FloatingOrbs = memo(function FloatingOrbs({
  className,
}: FloatingOrbsProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      aria-hidden="true"
    >
      <div className="absolute -left-48 top-[8%] size-[26rem] rounded-full bg-[radial-gradient(circle,rgba(224,186,200,0.22),transparent_66%)] sm:size-[34rem]" />
      <div className="absolute -right-52 top-[4%] hidden size-[36rem] rounded-full bg-[radial-gradient(circle,rgba(196,181,207,0.22),transparent_67%)] sm:block" />
      <div className="absolute inset-x-0 top-[38%] h-px bg-[linear-gradient(90deg,transparent,rgba(118,82,103,0.08),transparent)]" />
      <div className="absolute inset-x-0 bottom-[14%] hidden h-px bg-[linear-gradient(90deg,transparent,rgba(118,82,103,0.06),transparent)] sm:block" />
    </div>
  );
});
