import assert from "node:assert/strict";

import { tryWriteClipboard } from "../src/lib/clipboard.ts";
import {
  readStorageValue,
  removeStorageValue,
  writeStorageValue,
} from "../src/lib/safe-storage.ts";

const values = new Map();
const storage = {
  getItem: (key) => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, value),
  removeItem: (key) => values.delete(key),
};

assert.equal(writeStorageValue(() => storage, "state", "saved"), true);
assert.deepEqual(readStorageValue(() => storage, "state"), {
  ok: true,
  value: "saved",
});
assert.equal(removeStorageValue(() => storage, "state"), true);
assert.deepEqual(readStorageValue(() => storage, "state"), {
  ok: true,
  value: null,
});

const unavailableStorage = () => {
  throw new Error("Storage unavailable");
};
assert.deepEqual(readStorageValue(unavailableStorage, "state"), { ok: false });
assert.equal(writeStorageValue(unavailableStorage, "state", "value"), false);
assert.equal(removeStorageValue(unavailableStorage, "state"), false);

const throwingStorage = {
  getItem: () => {
    throw new Error("Read blocked");
  },
  setItem: () => {
    throw new Error("Quota exceeded");
  },
  removeItem: () => {
    throw new Error("Removal blocked");
  },
};
assert.deepEqual(readStorageValue(() => throwingStorage, "state"), { ok: false });
assert.equal(writeStorageValue(() => throwingStorage, "state", "value"), false);
assert.equal(removeStorageValue(() => throwingStorage, "state"), false);

assert.equal(await tryWriteClipboard(undefined, "memory"), false);
assert.equal(
  await tryWriteClipboard({ writeText: async () => Promise.reject(new Error("Denied")) }, "memory"),
  false,
);
let copiedText = "";
assert.equal(
  await tryWriteClipboard({ writeText: async (text) => { copiedText = text; } }, "memory"),
  true,
);
assert.equal(copiedText, "memory");

console.log("browser-boundaries: 15 storage and clipboard checks passed");
