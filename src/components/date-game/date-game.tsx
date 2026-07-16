"use client";

import { DateGameSession } from "@/components/date-game/date-game-session";
import { GameLoadingScreen } from "@/components/date-game/game-loading-screen";
import { AppShell } from "@/components/layout/app-shell";
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  DATE_GAME_STORAGE_KEY,
  parseDateGameStorage,
  serializeDateGameStorage,
} from "@/lib/game-storage";
import { hasMeaningfulDateGameState } from "@/lib/game-state-schema";
import {
  createInitialDateGameState,
  type DateGameState,
} from "@/types/date-game";

export function DateGame() {
  const storage = useLocalStorage<DateGameState>({
    key: DATE_GAME_STORAGE_KEY,
    parse: parseDateGameStorage,
    serialize: serializeDateGameStorage,
  });

  if (!storage.isHydrated) {
    return (
      <AppShell>
        <GameLoadingScreen />
      </AppShell>
    );
  }

  const restoredState =
    storage.status === "restored" &&
    storage.storedValue &&
    hasMeaningfulDateGameState(storage.storedValue)
      ? storage.storedValue
      : null;
  const initialNotice =
    storage.status === "invalid"
      ? "上次保存的小线索有点模糊，已经为你准备了一份新计划。"
      : storage.status === "unavailable"
        ? "这次无法自动保存，但仍然可以继续完成计划。"
        : null;

  return (
    <DateGameSession
      initialState={restoredState ?? createInitialDateGameState()}
      startWithRecovery={restoredState !== null}
      initialNotice={initialNotice}
      saveState={storage.save}
      clearStorage={storage.clear}
    />
  );
}
