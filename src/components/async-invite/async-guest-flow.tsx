"use client";

import { useCallback } from "react";

import { AsyncGuestSession } from "@/components/async-invite/async-guest-session";
import { AsyncResultViewerScreen } from "@/components/async-invite/async-result-viewer-screen";
import { GameLoadingScreen } from "@/components/date-game/game-loading-screen";
import { AppShell } from "@/components/layout/app-shell";
import { BrandHeader } from "@/components/layout/brand-header";
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  createInitialAsyncGuestSession,
  parseAsyncGuestSession,
  serializeAsyncGuestSession,
} from "@/lib/async-guest-session";
import {
  getAsyncGuestStorageKey,
  type AsyncGuestSessionState,
  type AsyncInvitePayload,
  type AsyncResultPayload,
} from "@/types/async-invite";

interface AsyncGuestFlowProps {
  invite: AsyncInvitePayload;
  result?: AsyncResultPayload;
  onResultRestart?: () => void;
}

export function AsyncGuestFlow({
  invite,
  result,
  onResultRestart,
}: AsyncGuestFlowProps) {
  const parse = useCallback(
    (rawValue: string) => parseAsyncGuestSession(rawValue, invite),
    [invite],
  );
  const storage = useLocalStorage<AsyncGuestSessionState>({
    key: getAsyncGuestStorageKey(invite.id),
    parse,
    serialize: serializeAsyncGuestSession,
  });

  if (!storage.isHydrated) {
    return (
      <AppShell>
        <GameLoadingScreen />
      </AppShell>
    );
  }

  const restoredState = storage.status === "restored" ? storage.storedValue : null;
  const hasLocalGuestResult = Boolean(
    restoredState?.resultCreatedAt &&
    restoredState.guestAnswers.length === 5 &&
    restoredState.compatibility,
  );

  if (result && !hasLocalGuestResult) {
    return (
      <AppShell
        header={<BrandHeader currentLabel="双方结果与共同计划" progress={1} />}
        stickyHeader
      >
        <AsyncResultViewerScreen
          result={result}
          onRestart={onResultRestart ?? (() => window.location.assign(window.location.href.split("#")[0]))}
        />
      </AppShell>
    );
  }

  const initialState = restoredState ?? createInitialAsyncGuestSession(invite, result);
  return (
    <AsyncGuestSession
      key={invite.id}
      invite={invite}
      initialState={initialState}
      saveState={storage.save}
      clearState={storage.clear}
    />
  );
}
