import { ArrowLeft, RotateCcw } from "lucide-react";

interface BrandHeaderProps {
  currentLabel?: string;
  isWelcome?: boolean;
  progress?: number;
  onBack?: () => void;
  onReset?: () => void;
}

export function BrandHeader({
  currentLabel,
  isWelcome = false,
  progress = 0,
  onBack,
  onReset,
}: BrandHeaderProps) {
  const normalizedProgress = Math.min(1, Math.max(0, progress));

  return (
    <>
      {!isWelcome ? (
        <header className="flex min-h-12 items-center justify-between gap-2 sm:hidden">
          {onBack ? (
            <button
              type="button"
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl text-text-secondary transition-colors active:bg-pink-50 active:text-pink-600"
              onClick={onBack}
              aria-label="返回上一步"
            >
              <ArrowLeft aria-hidden="true" className="size-5" />
            </button>
          ) : (
            <span className="size-11 shrink-0" aria-hidden="true" />
          )}

          <div className="min-w-0 flex-1 px-2 text-center">
            <p className="truncate text-xs font-medium text-text-secondary">
              {currentLabel}
            </p>
            <div
              className="mx-auto mt-1.5 h-1 w-20 overflow-hidden rounded-full bg-white/70"
              role="progressbar"
              aria-label="完整体验进度"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(normalizedProgress * 100)}
            >
              <span
                className="block h-full origin-left rounded-full [background:var(--gradient-primary)]"
                style={{ transform: `scaleX(${normalizedProgress})` }}
              />
            </div>
          </div>

          {onReset ? (
            <button
              type="button"
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl text-text-secondary transition-colors active:bg-pink-50 active:text-pink-600"
              onClick={onReset}
              aria-label="重新开始计划"
            >
              <RotateCcw aria-hidden="true" className="size-4.5" />
            </button>
          ) : (
            <span className="size-11 shrink-0" aria-hidden="true" />
          )}
        </header>
      ) : null}

      <header className={isWelcome ? "flex min-h-14 items-center justify-between gap-4" : "hidden min-h-14 items-center justify-between gap-4 sm:flex"}>
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-[0.8rem_0.8rem_0.8rem_0.28rem] border border-border-pink bg-text-primary text-[11px] font-semibold tracking-[0.16em] text-white shadow-[0_10px_26px_rgba(73,47,64,0.14)]">
          DB
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-semibold tracking-[0.12em] text-text-primary">
            DATE BOX
          </p>
          <p className="mt-0.5 truncate text-xs text-text-muted">心动计划局</p>
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        {currentLabel ? (
          <span className="hidden max-w-48 truncate rounded-full border border-white/75 bg-surface-soft px-3 py-1.5 text-xs font-medium text-text-secondary backdrop-blur-md min-[420px]:block">
            {currentLabel}
          </span>
        ) : null}
        {onReset ? (
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-[0.9rem] border border-transparent text-text-secondary transition-[background-color,color] duration-200 hover:bg-white/55 hover:text-pink-600 active:bg-pink-50"
            onClick={onReset}
            aria-label="重新开始计划"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
          </button>
        ) : null}
      </div>
      </header>
    </>
  );
}
