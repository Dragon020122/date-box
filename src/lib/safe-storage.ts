interface StorageAdapter {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

type StorageProvider = () => StorageAdapter;

export type StorageReadResult =
  | { ok: true; value: string | null }
  | { ok: false };

export function readStorageValue(
  getStorage: StorageProvider,
  key: string,
): StorageReadResult {
  try {
    return { ok: true, value: getStorage().getItem(key) };
  } catch {
    return { ok: false };
  }
}

export function writeStorageValue(
  getStorage: StorageProvider,
  key: string,
  value: string,
): boolean {
  try {
    getStorage().setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeStorageValue(
  getStorage: StorageProvider,
  key: string,
): boolean {
  try {
    getStorage().removeItem(key);
    return true;
  } catch {
    return false;
  }
}
