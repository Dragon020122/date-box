"use client";

import { CircleAlert, Clock3 } from "lucide-react";
import { useEffect, useState, type ComponentType } from "react";

import { AsyncHostFlow } from "@/components/async-invite/async-host-flow";
import { AsyncGuestFlow } from "@/components/async-invite/async-guest-flow";
import { DateGame } from "@/components/date-game/date-game";
import { GameLoadingScreen } from "@/components/date-game/game-loading-screen";
import { AppShell } from "@/components/layout/app-shell";
import { PrimaryButton } from "@/components/ui/primary-button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { parseInviteFromHash, parseResultFromHash } from "@/lib/async-invite-codec";
import {
  createInitialAsyncHostSessionState,
  hasMeaningfulAsyncHostSession,
  parseAsyncHostSession,
  serializeAsyncHostSession,
} from "@/lib/async-host-session";
import {
  ASYNC_INVITE_STORAGE_KEY,
  type AsyncInvitePayload,
  type AsyncResultPayload,
  type AsyncHostSessionState,
  type EntryMode,
} from "@/types/async-invite";

type EntryState =
  | { status: "loading" }
  | { status: "normal"; mode: Extract<EntryMode, "normal"> }
  | { status: "invite"; mode: Extract<EntryMode, "async-invite">; payload: AsyncInvitePayload }
  | { status: "result"; mode: Extract<EntryMode, "async-result">; payload: AsyncResultPayload }
  | { status: "expired" }
  | { status: "invalid"; reason: string };

interface EntryPlaceholderProps {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  eyebrow: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

function EntryPlaceholder({
  icon: Icon,
  eyebrow,
  title,
  description,
  actionLabel,
  onAction,
}: EntryPlaceholderProps) {
  return (
    <AppShell contentWidth="quiz">
      <section className="mx-auto flex min-h-[62dvh] w-full items-center justify-center text-center">
        <div className="w-full rounded-[2rem] border border-white/90 bg-surface-strong px-6 py-10 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:px-10 sm:py-12">
          <span className="mx-auto grid size-16 place-items-center rounded-full border border-border-pink bg-pink-50 text-pink-600">
            <Icon aria-hidden className="size-6" />
          </span>
          <p className="mt-6 text-xs font-semibold tracking-[0.18em] text-pink-600 uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-text-primary sm:text-3xl">
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-text-secondary sm:text-base">
            {description}
          </p>
          {actionLabel && onAction ? (
            <PrimaryButton onClick={onAction} className="mt-7">
              {actionLabel}
            </PrimaryButton>
          ) : null}
        </div>
      </section>
    </AppShell>
  );
}

function resolveEntry(hash: string): EntryState {
  if (hash.length === 0 || hash === "#") {
    return { status: "normal", mode: "normal" };
  }

  if (hash.startsWith("#invite")) {
    const parsed = parseInviteFromHash(hash);
    if (parsed.status === "valid") {
      return { status: "invite", mode: "async-invite", payload: parsed.payload };
    }
    if (parsed.status === "expired") {
      return { status: "expired" };
    }
    return {
      status: "invalid",
      reason: parsed.status === "invalid" ? parsed.reason : "邀请链接格式不完整",
    };
  }

  if (hash.startsWith("#result")) {
    const parsed = parseResultFromHash(hash);
    if (parsed.status === "valid") {
      return { status: "result", mode: "async-result", payload: parsed.payload };
    }
    if (parsed.status === "expired") {
      return { status: "expired" };
    }
    return {
      status: "invalid",
      reason: parsed.status === "invalid" ? parsed.reason : "结果链接格式不完整",
    };
  }

  return { status: "normal", mode: "normal" };
}

export function AppEntry() {
  const [entry, setEntry] = useState<EntryState>({ status: "loading" });
  const [selectedMode, setSelectedMode] = useState<"normal" | "async-host" | null>(null);
  const asyncStorage = useLocalStorage<AsyncHostSessionState>({
    key: ASYNC_INVITE_STORAGE_KEY,
    parse: parseAsyncHostSession,
    serialize: serializeAsyncHostSession,
  });

  useEffect(() => {
    const readHashTimer = window.setTimeout(() => {
      setEntry(resolveEntry(window.location.hash));
    }, 0);

    return () => window.clearTimeout(readHashTimer);
  }, []);

  if (entry.status === "loading" || !asyncStorage.isHydrated) {
    return (
      <AppShell>
        <GameLoadingScreen />
      </AppShell>
    );
  }

  if (entry.status === "normal") {
    const restoredAsyncState =
      asyncStorage.status === "restored" &&
      asyncStorage.storedValue &&
      hasMeaningfulAsyncHostSession(asyncStorage.storedValue)
        ? asyncStorage.storedValue
        : null;
    const showAsyncHost =
      selectedMode === "async-host" ||
      (selectedMode === null && restoredAsyncState !== null);

    if (showAsyncHost) {
      return (
        <AsyncHostFlow
          initialState={restoredAsyncState ?? createInitialAsyncHostSessionState()}
          saveState={asyncStorage.save}
          clearState={asyncStorage.clear}
          onBackHome={() => setSelectedMode("normal")}
        />
      );
    }

    return <DateGame onCreateInvite={() => setSelectedMode("async-host")} />;
  }

  if (entry.status === "invite") {
    return <AsyncGuestFlow invite={entry.payload} />;
  }

  if (entry.status === "result") {
    return <AsyncGuestFlow invite={entry.payload.invite} result={entry.payload} />;
  }

  if (entry.status === "expired") {
    return (
      <EntryPlaceholder
        icon={Clock3}
        eyebrow="Invite Expired"
        title="这份心动邀请已经错过了有效时间"
        description="为了保护你们的选择，这份链接已经不能再进入答题流程。"
        actionLabel="重新创建一份计划"
        onAction={() => window.location.assign(window.location.href.split("#")[0])}
      />
    );
  }

  return (
    <EntryPlaceholder
      icon={CircleAlert}
      eyebrow="Link Error"
      title="这份邀请似乎没有完整抵达"
      description={`${entry.reason}。请确认链接完整，或请对方重新发送。`}
      actionLabel="返回Date Box首页"
      onAction={() => window.location.assign(window.location.href.split("#")[0])}
    />
  );
}
