import assert from "node:assert/strict";

import { datePlans } from "../src/data/date-plans.ts";
import {
  createInviteUrl,
  createResultUrl,
  parseInviteFromHash,
  parseResultFromHash,
} from "../src/lib/async-invite-codec.ts";
import {
  createInitialAsyncGuestSession,
  parseAsyncGuestSession,
  serializeAsyncGuestSession,
} from "../src/lib/async-guest-session.ts";
import { calculateCompatibility } from "../src/lib/compatibility.ts";
import { generateDatePlan } from "../src/lib/plan-generator.ts";
import { getAsyncGuestStorageKey } from "../src/types/async-invite.ts";

const now = 2_000_000_000_000;
const baseUrl = "https://date-box.example/";
const preferences = {
  mood: "romantic",
  time: "whole-evening",
  budget: "refined",
  distance: "nearby",
  relationship: "stable",
};
const hostAnswers = [
  "good-food",
  "beautiful-photo",
  "small-gift",
  "planned-and-free",
  "romantic-response",
];
const guestAnswers = [
  "casual-walk",
  "deep-conversation",
  "hidden-place",
  "slow-and-easy",
  "understanding",
];

function makeInvite(id, hostName = "小雨", guestName = "阿岚") {
  return {
    v: 1,
    id,
    createdAt: now,
    expiresAt: now + 48 * 60 * 60 * 1000,
    hostName,
    ...(guestName ? { guestName } : {}),
    preferences,
    hostAnswers,
  };
}

const deviceAStorage = new Map();
const deviceBStorage = new Map();
const invite = makeInvite("roundtrip-zh");
const inviteUrl = createInviteUrl(baseUrl, invite);
deviceAStorage.set("created-invite", inviteUrl);

const parsedInvite = parseInviteFromHash(new URL(inviteUrl).hash, now);
assert.equal(parsedInvite.status, "valid");
assert.equal(parsedInvite.payload.hostName, "小雨");

const guestState = {
  ...createInitialAsyncGuestSession(invite),
  step: "compatibility",
  guestAnswers,
  compatibility: calculateCompatibility(hostAnswers, guestAnswers),
  selectedPlanId: generateDatePlan({
    plans: datePlans,
    preferences,
    playerAAnswers: hostAnswers,
    playerBAnswers: guestAnswers,
  }).plan.id,
  resultCreatedAt: now + 1_000,
  updatedAt: now + 1_000,
};
const guestKey = getAsyncGuestStorageKey(invite.id);
deviceBStorage.set(guestKey, serializeAsyncGuestSession(guestState));
const restoredGuest = parseAsyncGuestSession(deviceBStorage.get(guestKey), invite);
assert.equal(restoredGuest.ok, true);
assert.deepEqual(restoredGuest.value.guestAnswers, guestAnswers);
assert.equal(restoredGuest.value.step, "compatibility");

const resultPayload = {
  v: 1,
  invite,
  guestAnswers,
  selectedPlanId: guestState.selectedPlanId,
  createdAt: guestState.resultCreatedAt,
};
const resultUrl = createResultUrl(baseUrl, resultPayload);
const parsedResult = parseResultFromHash(new URL(resultUrl).hash, now);
assert.equal(parsedResult.status, "valid");
assert.deepEqual(parsedResult.payload.guestAnswers, guestAnswers);

const deviceACompatibility = calculateCompatibility(
  parsedResult.payload.invite.hostAnswers,
  parsedResult.payload.guestAnswers,
  { playerA: "小雨", playerB: "阿岚" },
);
const deviceAPlan = generateDatePlan({
  plans: datePlans,
  preferences: parsedResult.payload.invite.preferences,
  playerAAnswers: parsedResult.payload.invite.hostAnswers,
  playerBAnswers: parsedResult.payload.guestAnswers,
}).plan;
assert.equal(deviceACompatibility.displayScore, guestState.compatibility.displayScore);
assert.equal(deviceAPlan.id, guestState.selectedPlanId);
assert.equal(deviceAPlan.secretTask.length > 0, true);

const emptyNameInvite = makeInvite("roundtrip-empty", "", "");
assert.equal(
  parseInviteFromHash(new URL(createInviteUrl(baseUrl, emptyNameInvite)).hash, now).status,
  "valid",
);

const secondInvite = makeInvite("roundtrip-second", "云", "岚");
const secondKey = getAsyncGuestStorageKey(secondInvite.id);
deviceBStorage.set(secondKey, serializeAsyncGuestSession(createInitialAsyncGuestSession(secondInvite)));
assert.notEqual(guestKey, secondKey);
assert.equal(deviceBStorage.size, 2);
assert.equal(parseAsyncGuestSession(deviceBStorage.get(guestKey), invite).ok, true);
assert.equal(parseAsyncGuestSession(deviceBStorage.get(secondKey), secondInvite).ok, true);

assert.equal(parseInviteFromHash(new URL(inviteUrl).hash, now).status, "valid");
assert.equal(parseInviteFromHash(new URL(inviteUrl).hash, now).status, "valid");
assert.equal(parseInviteFromHash("#invite=v1.broken", now).status, "invalid");
const expiredInvite = {
  ...makeInvite("roundtrip-expired"),
  createdAt: now - 50 * 60 * 60 * 1000,
  expiresAt: now - 2 * 60 * 60 * 1000,
};
assert.equal(
  parseInviteFromHash(new URL(createInviteUrl(baseUrl, expiredInvite)).hash, now).status,
  "expired",
);
assert.equal(deviceAStorage.has("created-invite"), true);

console.log("async-roundtrip: 22 two-device, refresh, multi-invite and boundary checks passed");
