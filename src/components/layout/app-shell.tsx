import type { PropsWithChildren, ReactNode } from "react";

import { FloatingOrbs } from "@/components/ui/floating-orbs";
import { cn } from "@/lib/cn";

type ContentWidth = "standard" | "quiz";

interface AppShellProps {
  header?: ReactNode;
  contentWidth?: ContentWidth;
  className?: string;
  stickyHeader?: boolean;
}

const widthClasses: Record<ContentWidth, string> = {
  standard: "max-w-[1180px]",
  quiz: "max-w-[720px]",
};

export function AppShell({
  children,
  header,
  contentWidth = "standard",
  className,
  stickyHeader = false,
}: PropsWithChildren<AppShellProps>) {
  return (
    <div className="relative isolate flex min-h-[100svh] min-h-dvh w-full flex-col overflow-x-clip">
      <FloatingOrbs />
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),transparent_28%,rgba(255,255,255,0.16))]"
        aria-hidden="true"
      />

      {header ? (
        <div
          className={cn(
            "z-40 mx-auto w-full max-w-[1180px] px-[18px] pt-[max(0.5rem,var(--safe-top))] sm:px-8 sm:pt-6",
            stickyHeader
              ? "sticky top-0 bg-[linear-gradient(180deg,rgba(255,250,247,0.96),rgba(255,250,247,0.82)_76%,transparent)] pb-2 backdrop-blur-md sm:relative sm:bg-none sm:pb-0 sm:backdrop-blur-none"
              : "relative",
          )}
        >
          {header}
        </div>
      ) : null}

      <main
        className={cn(
          "relative z-10 mx-auto flex w-full flex-1 flex-col px-[18px] pb-[calc(1.5rem+var(--safe-bottom))] pt-6 sm:px-8 sm:pb-10 sm:pt-10 lg:justify-center lg:py-12",
          widthClasses[contentWidth],
          className,
        )}
      >
        {children}
      </main>
    </div>
  );
}
