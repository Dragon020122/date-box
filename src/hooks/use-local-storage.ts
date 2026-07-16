"use client";

import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";

import {
  readStorageValue,
  removeStorageValue,
  writeStorageValue,
} from "@/lib/safe-storage";

type StorageReadStatus =
  | "loading"
  | "empty"
  | "restored"
  | "invalid"
  | "unavailable";

type ParseResult<T> = { ok: true; value: T } | { ok: false };

interface UseLocalStorageOptions<T> {
  key: string;
  parse: (rawValue: string) => ParseResult<T>;
  serialize: (value: T) => string;
}

interface UseLocalStorageResult<T> {
  isHydrated: boolean;
  status: StorageReadStatus;
  storedValue: T | null;
  save: (value: T) => boolean;
  clear: () => boolean;
}

const HYDRATING_SNAPSHOT = "__DATE_BOX_HYDRATING__";
const EMPTY_SNAPSHOT = "__DATE_BOX_EMPTY__";
const UNAVAILABLE_SNAPSHOT = "__DATE_BOX_UNAVAILABLE__";
const STORAGE_EVENT = "date-box-local-storage";

function readStorageSnapshot(key: string): string {
  const result = readStorageValue(() => window.localStorage, key);
  return result.ok ? result.value ?? EMPTY_SNAPSHOT : UNAVAILABLE_SNAPSHOT;
}

export function useLocalStorage<T>({
  key,
  parse,
  serialize,
}: UseLocalStorageOptions<T>): UseLocalStorageResult<T> {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      function handleStorage(event: StorageEvent) {
        if (event.key === key) {
          onStoreChange();
        }
      }
      function handleLocalStorage(event: Event) {
        if ((event as CustomEvent<string>).detail === key) {
          onStoreChange();
        }
      }

      window.addEventListener("storage", handleStorage);
      window.addEventListener(STORAGE_EVENT, handleLocalStorage);
      return () => {
        window.removeEventListener("storage", handleStorage);
        window.removeEventListener(STORAGE_EVENT, handleLocalStorage);
      };
    },
    [key],
  );
  const getSnapshot = useCallback(() => readStorageSnapshot(key), [key]);
  const getServerSnapshot = useCallback(() => HYDRATING_SNAPSHOT, []);
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const parsedSnapshot = useMemo(() => {
    if (
      snapshot === HYDRATING_SNAPSHOT ||
      snapshot === EMPTY_SNAPSHOT ||
      snapshot === UNAVAILABLE_SNAPSHOT
    ) {
      return null;
    }
    return parse(snapshot);
  }, [parse, snapshot]);

  const status: StorageReadStatus =
    snapshot === HYDRATING_SNAPSHOT
      ? "loading"
      : snapshot === EMPTY_SNAPSHOT
        ? "empty"
        : snapshot === UNAVAILABLE_SNAPSHOT
          ? "unavailable"
          : parsedSnapshot?.ok
            ? "restored"
            : "invalid";

  useEffect(() => {
    if (status !== "invalid") {
      return;
    }

    if (removeStorageValue(() => window.localStorage, key)) {
      window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: key }));
    }
  }, [key, status]);

  const save = useCallback(
    (value: T) => {
      const didWrite = writeStorageValue(
        () => window.localStorage,
        key,
        serialize(value),
      );
      if (!didWrite) {
        return false;
      }
      window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: key }));
      return true;
    },
    [key, serialize],
  );

  const clear = useCallback(() => {
    if (!removeStorageValue(() => window.localStorage, key)) {
      return false;
    }
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: key }));
    return true;
  }, [key]);

  return {
    isHydrated: status !== "loading",
    status,
    storedValue: parsedSnapshot?.ok ? parsedSnapshot.value : null,
    save,
    clear,
  };
}
