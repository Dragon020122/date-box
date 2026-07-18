import assert from "node:assert/strict";

import {
  createInviteUrl,
  createResultUrl,
  decodeInvitePayload,
  decodeResultPayload,
  encodeInvitePayload,
  encodeResultPayload,
  parseInviteFromHash,
  parseResultFromHash,
  removeInviteHash,
  validateInvitePayload,
  validateResultPayload,
} from "../src/lib/async-invite-codec.ts";

const now = 2_000_000_000_000;
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

const chineseInvite = {
  v: 1,
  id: "invite_chinese",
  createdAt: now,
  expiresAt: now + 48 * 60 * 60 * 1000,
  hostName: "小雨",
  guestName: "阿岚",
  preferences,
  hostAnswers,
};
const englishInvite = {
  ...chineseInvite,
  id: "invite_english",
  hostName: "Alex",
  guestName: "Taylor",
};

const encodedChinese = encodeInvitePayload(chineseInvite);
assert.match(encodedChinese, /^[A-Za-z0-9_-]+$/);
assert.deepEqual(decodeInvitePayload(encodedChinese, now), {
  status: "valid",
  payload: chineseInvite,
});
assert.deepEqual(decodeInvitePayload(encodeInvitePayload(englishInvite), now), {
  status: "valid",
  payload: englishInvite,
});

assert.equal(validateInvitePayload({ ...chineseInvite, hostName: "" }, now).status, "valid");
assert.equal(parseInviteFromHash("#invite=v1.%%%", now).status, "invalid");
assert.equal(parseInviteFromHash("#invite=v1.bm90LWpzb24", now).status, "invalid");
assert.equal(
  validateInvitePayload({ ...chineseInvite, expiresAt: now - 1 }, now).status,
  "invalid",
);
const expiredInvite = {
  ...chineseInvite,
  createdAt: now - 49 * 60 * 60 * 1000,
  expiresAt: now - 60 * 60 * 1000,
};
assert.equal(parseInviteFromHash(`#invite=v1.${encodeInvitePayload(expiredInvite)}`, now).status, "expired");
assert.equal(parseInviteFromHash("#invite=v2.abc", now).status, "invalid");
assert.equal(
  validateInvitePayload({ ...chineseInvite, hostAnswers: [...hostAnswers.slice(0, 4), "not-allowed"] }, now).status,
  "invalid",
);
assert.equal(validateInvitePayload({ ...chineseInvite, hostAnswers: hostAnswers.slice(0, 4) }, now).status, "invalid");
assert.equal(validateInvitePayload({ ...chineseInvite, hostName: "超过十二个字符的昵称不允许进入" }, now).status, "invalid");
assert.equal(parseInviteFromHash("", now).status, "none");

const resultPayload = {
  v: 1,
  invite: chineseInvite,
  guestAnswers,
  selectedPlanId: "pink-movie-night",
  createdAt: now + 1_000,
};
const encodedResult = encodeResultPayload(resultPayload);
assert.deepEqual(decodeResultPayload(encodedResult, now), {
  status: "valid",
  payload: resultPayload,
});
assert.equal(
  validateResultPayload({ ...resultPayload, selectedPlanId: "missing-plan" }, now).status,
  "invalid",
);

const inviteUrl = createInviteUrl("https://date-box.example/path?from=test#old", chineseInvite);
assert.equal(inviteUrl.includes("#old"), false);
assert.deepEqual(parseInviteFromHash(new URL(inviteUrl).hash, now), {
  status: "valid",
  payload: chineseInvite,
});
const resultUrl = createResultUrl("https://date-box.example/#invite=old", resultPayload);
assert.deepEqual(parseResultFromHash(new URL(resultUrl).hash, now), {
  status: "valid",
  payload: resultPayload,
});
assert.equal(removeInviteHash("https://date-box.example/#invite=old"), "https://date-box.example/");

console.log("async-invite: 19 protocol, validation, URL and Unicode checks passed");
