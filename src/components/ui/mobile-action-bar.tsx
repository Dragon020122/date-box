import type { HTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/lib/cn";

interface MobileActionBarProps extends HTMLAttributes<HTMLDivElement> {
  contentClassName?: string;
}

export function MobileActionBar({
  children,
  className,
  contentClassName,
  ...props
}: PropsWithChildren<MobileActionBarProps>) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-30 -mx-[18px] mt-6 bg-[linear-gradient(0deg,rgba(255,250,247,0.98)_0%,rgba(255,250,247,0.9)_72%,transparent_100%)] px-[18px] pb-[calc(0.75rem+var(--safe-bottom))] pt-5 backdrop-blur-md",
        "sm:static sm:mx-0 sm:mt-8 sm:bg-none sm:p-0 sm:backdrop-blur-none",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between",
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
