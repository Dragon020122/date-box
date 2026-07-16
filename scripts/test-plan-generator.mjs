import assert from "node:assert/strict";

import { datePlans } from "../src/data/date-plans.ts";
import {
  generateDatePlan,
  MAX_PLAN_CHANGES,
  scoreDatePlan,
} from "../src/lib/plan-generator.ts";

const chatAnswers = [
  "sit-and-talk",
  "deep-conversation",
  "unsaid-words",
  "slow-and-easy",
  "understanding",
];
const adventureAnswers = [
  "new-experience",
  "funny-moment",
  "hidden-place",
  "follow-the-feeling",
  "freshness",
];
const neutralPreferences = {
  mood: null,
  time: null,
  budget: null,
  distance: null,
  relationship: null,
};
const plansById = new Map(datePlans.map((plan) => [plan.id, plan]));

function select(overrides = {}) {
  return generateDatePlan({
    plans: datePlans,
    preferences: {
      mood: "healing",
      time: "two-hours",
      budget: "simple",
      distance: "nearby",
      relationship: "ambiguous",
    },
    playerAAnswers: chatAnswers,
    playerBAnswers: chatAnswers,
    ...overrides,
  });
}

const healingPlan = select();
assert.equal(healingPlan.plan.id, "evening-breeze-walk");

const firstDatePlan = select({
  preferences: {
    mood: "romantic",
    time: "two-hours",
    budget: "refined",
    distance: "nearby",
    relationship: "first-date",
  },
});
assert.equal(firstDatePlan.plan.id, "first-step-closer");

const simpleRomance = select({
  preferences: {
    mood: "romantic",
    time: "whole-evening",
    budget: "simple",
    distance: "nearby",
    relationship: "ambiguous",
  },
});
assert.notEqual(simpleRomance.plan.id, "pink-movie-night");

const deterministicRepeat = select();
assert.equal(deterministicRepeat.plan.id, healingPlan.plan.id);
assert.deepEqual(deterministicRepeat.rankedPlanIds, healingPlan.rankedPlanIds);

const seenPlanIds = [healingPlan.plan.id];
for (let changeCount = 0; changeCount < MAX_PLAN_CHANGES; changeCount += 1) {
  const nextPlan = select({
    playerBAnswers: adventureAnswers,
    seenPlanIds: [...seenPlanIds],
    planChangeCount: changeCount,
    selectedPlanId: seenPlanIds.at(-1),
  });
  assert.equal(seenPlanIds.includes(nextPlan.plan.id), false);
  seenPlanIds.push(nextPlan.plan.id);
}
assert.equal(new Set(seenPlanIds).size, seenPlanIds.length);

const limitResult = select({
  seenPlanIds,
  planChangeCount: MAX_PLAN_CHANGES,
  selectedPlanId: seenPlanIds.at(-1),
});
assert.equal(limitResult.changeLimitReached, true);
assert.equal(limitResult.plan.id, seenPlanIds.at(-1));

const allSeenResult = select({ seenPlanIds: datePlans.map((plan) => plan.id) });
assert.equal(allSeenResult.allPlansSeen, true);
assert.equal(allSeenResult.plan.id, allSeenResult.rankedPlanIds[0]);

assert.throws(
  () => select({ plans: [] }),
  /requires at least one date plan/,
);

assert.equal(
  scoreDatePlan(
    plansById.get("evening-breeze-walk"),
    neutralPreferences,
    chatAnswers,
    chatAnswers,
  ),
  2,
);
assert.equal(
  scoreDatePlan(
    plansById.get("unknown-neighborhood"),
    neutralPreferences,
    adventureAnswers,
    adventureAnswers,
  ),
  2,
);
assert.equal(
  scoreDatePlan(
    plansById.get("pink-movie-night"),
    neutralPreferences,
    ["", "beautiful-photo"],
    ["", "beautiful-photo"],
  ),
  1,
);
assert.equal(
  scoreDatePlan(
    plansById.get("twenty-yuan-romance"),
    neutralPreferences,
    ["", "small-souvenir", "small-gift"],
    ["", "small-souvenir", "small-gift"],
  ),
  2,
);
assert.equal(
  scoreDatePlan(
    plansById.get("happy-energy-station"),
    neutralPreferences,
    chatAnswers,
    adventureAnswers,
  ),
  2,
);

console.log("plan-generator: 13 deterministic and empty-source checks passed");
