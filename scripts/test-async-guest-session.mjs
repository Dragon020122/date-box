import assert from "node:assert/strict";

import {
  createInitialAsyncGuestSession,
  parseAsyncGuestSession,
  serializeAsyncGuestSession,
  toAsyncDateGameState,
} from "../src/lib/async-guest-session.ts";
import { getAsyncGuestStorageKey } from "../src/types/async-invite.ts";

const invite = {
  v: 1,
  id: "invite-one",
  createdAt: 2_000_000_000_000,
  expiresAt: 2_000_172_800_000,
  hostName: "小雨",
  guestName: "阿岚",
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
};

const initial = createInitialAsyncGuestSession(invite);
assert.equal(initial.step, "welcome");
assert.equal(initial.inviteId, invite.id);
assert.equal(getAsyncGuestStorageKey(invite.id), "date-box-async-session-v1:guest:invite-one");
assert.notEqual(getAsyncGuestStorageKey("invite-one"), getAsyncGuestStorageKey("invite-two"));

const answered = {
  ...initial,
  step: "player-b-quiz",
  guestAnswers: ["casual-walk", "deep-conversation"],
};
const restored = parseAsyncGuestSession(serializeAsyncGuestSession(answered), invite);
assert.equal(restored.ok, true);
assert.deepEqual(restored.value.guestAnswers, answered.guestAnswers);
assert.deepEqual(toAsyncDateGameState(restored.value, invite).playerAAnswers, invite.hostAnswers);

assert.equal(parseAsyncGuestSession("not-json", invite).ok, false);
assert.equal(
  parseAsyncGuestSession(
    serializeAsyncGuestSession({ ...answered, inviteId: "invite-two" }),
    invite,
  ).ok,
  false,
);
assert.equal(
  parseAsyncGuestSession(
    serializeAsyncGuestSession({ ...answered, guestAnswers: ["not-allowed"] }),
    invite,
  ).ok,
  false,
);

const result = {
  v: 1,
  invite,
  guestAnswers: [
    "casual-walk",
    "deep-conversation",
    "hidden-place",
    "slow-and-easy",
    "understanding",
  ],
  selectedPlanId: "pink-movie-night",
  createdAt: invite.createdAt + 1_000,
};
const resultState = createInitialAsyncGuestSession(invite, result);
assert.equal(resultState.step, "compatibility");
assert.equal(resultState.selectedPlanId, result.selectedPlanId);
assert.deepEqual(resultState.guestAnswers, result.guestAnswers);

console.log("async-guest-session: 12 invite-bound restore, validation and result checks passed");
