import assert from "node:assert/strict";

import { datePlans } from "../src/data/date-plans.ts";
import { decodeResultPayload, encodeResultPayload } from "../src/lib/async-invite-codec.ts";
import { calculateCompatibility } from "../src/lib/compatibility.ts";
import { generateDatePlan } from "../src/lib/plan-generator.ts";

const now = 2_000_000_000_000;
const invite = {
  v: 1,
  id: "stage-five-result",
  createdAt: now,
  expiresAt: now + 48 * 60 * 60 * 1000,
  hostName: "小雨",
  guestName: "阿岚",
  preferences: {
    mood: "romantic",
    time: "whole-evening",
    budget: "simple",
    distance: "nearby",
    relationship: "ambiguous",
  },
  hostAnswers: [
    "good-food",
    "beautiful-photo",
    "small-gift",
    "planned-and-free",
    "romantic-response",
  ],
};
const guestAnswers = [
  "casual-walk",
  "deep-conversation",
  "hidden-place",
  "slow-and-easy",
  "understanding",
];
const payload = {
  v: 1,
  invite,
  guestAnswers,
  selectedPlanId: "pink-movie-night",
  createdAt: now + 1_000,
};

assert.deepEqual(decodeResultPayload(encodeResultPayload(payload), now), {
  status: "valid",
  payload,
});

const compatibility = calculateCompatibility(
  invite.hostAnswers,
  guestAnswers,
  { playerA: invite.hostName, playerB: invite.guestName },
);
assert.equal(compatibility.displayScore, 52);
assert.equal(compatibility.sharedInsights.length > 0, true);
assert.equal(compatibility.complementaryInsights.length > 0, true);
assert.match(compatibility.complementaryInsights[0], /小雨|阿岚/);

const recomputedPlan = generateDatePlan({
  plans: datePlans,
  preferences: invite.preferences,
  playerAAnswers: invite.hostAnswers,
  playerBAnswers: guestAnswers,
}).plan;
assert.notEqual(recomputedPlan.id, payload.selectedPlanId);
assert.notEqual(recomputedPlan.id, "pink-movie-night");
assert.equal(typeof recomputedPlan.secretTask, "string");
assert.equal(recomputedPlan.secretTask.length > 0, true);

console.log("async-result: 10 round-trip, recomputation and payload-distrust checks passed");
