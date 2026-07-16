import { Sparkles } from "lucide-react";

export function GameLoadingScreen() {
  return (
    <section className="mx-auto flex min-h-[62dvh] w-full max-w-md items-center justify-center text-center">
      <div>
        <span className="mx-auto grid size-16 place-items-center rounded-full border border-white/90 bg-surface text-pink-600 shadow-[var(--shadow-pink)] backdrop-blur-xl">
          <Sparkles aria-hidden="true" className="size-6 animate-pulse" />
        </span>
        <p className="mt-5 text-sm font-medium text-text-secondary" role="status">
          正在找回今晚的小线索…
        </p>
      </div>
    </section>
  );
}
