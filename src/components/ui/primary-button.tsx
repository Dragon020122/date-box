import { LoaderCircle } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
  loading?: boolean;
  loadingLabel?: string;
}

export function PrimaryButton({
  children,
  className,
  disabled,
  fullWidth = false,
  loading = false,
  loadingLabel = "正在准备",
  type = "button",
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-13 items-center justify-center gap-2 rounded-[1rem] px-7 py-3 text-base font-semibold text-white shadow-[var(--shadow-pink)] transition-[transform,filter,box-shadow,opacity] duration-200",
        "[background:var(--gradient-primary)] hover:brightness-[1.04] hover:shadow-[0_22px_52px_rgba(105,62,84,0.18)] active:scale-[0.98] active:brightness-95",
        "disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none",
        fullWidth && "w-full",
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <>
          <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
          <span>{loadingLabel}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
