import assert from "node:assert/strict";

import {
  createInitialAsyncHostSessionState,
  hasMeaningfulAsyncHostSession,
  parseAsyncHostSession,
  serializeAsyncHostSession,
} from "../src/lib/async-host-session.ts";
import { createClientInviteId } from "../src/lib/client-invite-id.ts";
import {
  createInviteUrl,
  parseInviteFromHash,
} from "../src/lib/async-invite-codec.ts";
import {
  ASYNC_INVITE_STORAGE_KEY,
  DEFAULT_ASYNC_INVITE_DURATION_MS,
} from "../src/types/async-invite.ts";
import { DATE_GAME_STORAGE_KEY } from "../src/types/date-game.ts";

const initialState = createInitialAsyncHostSessionState();
assert.equal(initialState.step, "create-intro");
assert.equal(hasMeaningfulAsyncHostSession(initialState), false);

const completedState = {
  ...initialState,
  step: "share-placeholder",
  hostName: " 小雨 ",
  guestName: " 阿岚 ",
  preferences: {
    mood: "romantic",
    time: "whole-evening",
    budget: "refined",
    distance: "nearby",
    relationship: "stable",
  },
  hostAnswers: [
    "good-food",
    "beautiful-photo",
    "small-gift",
    "planned-and-free",
    "romantic-response",
  ],
  inviteUrl: "https://date-box.example/#invite=v1.payload",
  inviteCreatedAt: 2_000_000_000_000,
};
const restored = parseAsyncHostSession(serializeAsyncHostSession(completedState));
assert.equal(restored.ok, true);
assert.equal(restored.value.hostName, "小雨");
assert.equal(restored.value.guestName, "阿岚");
assert.equal(restored.value.step, "share-placeholder");
assert.equal(restored.value.hasPreviousInvite, false);
assert.equal(hasMeaningfulAsyncHostSession(restored.value), true);

assert.equal(parseAsyncHostSession("not-json").ok, false);
assert.equal(parseAsyncHostSession(JSON.stringify({ version: 2, state: completedState })).ok, false);
assert.equal(
  parseAsyncHostSession(serializeAsyncHostSession({ ...completedState, hostName: "超过十二个字符的称呼不能保存" })).ok,
  false,
);
assert.equal(
  parseAsyncHostSession(serializeAsyncHostSession({ ...completedState, hostAnswers: ["not-allowed"] })).ok,
  false,
);

const incompleteShare = parseAsyncHostSession(
  serializeAsyncHostSession({ ...completedState, inviteUrl: null }),
);
assert.equal(incompleteShare.ok, true);
assert.equal(incompleteShare.value.step, "generating");

const fallbackCrypto = {
  getRandomValues(array) {
    array.forEach((_, index) => { array[index] = index; });
    return array;
  },
};
assert.equal(
  createClientInviteId(fallbackCrypto),
  "00010203-0405-4607-8809-0a0b0c0d0e0f",
);
assert.equal(
  createClientInviteId({ randomUUID: () => "native-uuid" }),
  "native-uuid",
);

const invitePayload = {
  v: 1,
  id: "invite-host-flow",
  createdAt: 2_000_000_000_000,
  expiresAt: 2_000_000_000_000 + DEFAULT_ASYNC_INVITE_DURATION_MS,
  hostName: "小雨",
  guestName: "阿岚",
  preferences: completedState.preferences,
  hostAnswers: completedState.hostAnswers,
};
const inviteUrl = createInviteUrl("https://date-box.example/#old", invitePayload);
assert.deepEqual(
  parseInviteFromHash(new URL(inviteUrl).hash, invitePayload.createdAt),
  { status: "valid", payload: invitePayload },
);
assert.equal(
  invitePayload.expiresAt - invitePayload.createdAt,
  48 * 60 * 60 * 1000,
);
assert.equal(ASYNC_INVITE_STORAGE_KEY, "date-box-async-session-v1");
assert.equal(DATE_GAME_STORAGE_KEY, "date-box-game-state-v1");
assert.notEqual(ASYNC_INVITE_STORAGE_KEY, DATE_GAME_STORAGE_KEY);

const modifiedState = parseAsyncHostSession(
  serializeAsyncHostSession({ ...completedState, hasPreviousInvite: true }),
);
assert.equal(modifiedState.ok, true);
assert.equal(modifiedState.value.hasPreviousInvite, true);

console.log("async-host-session: 20 restore, payload, modification, isolation and secure ID checks passed");
