import assert from "node:assert/strict";

import {
  chooseUnseenItem,
  getCurrentDateStep,
  getDateProgress,
  resolveDateStep,
} from "../src/lib/active-date-state.ts";

const steps = [
  { id: "one", time: "18:00", title: "One", description: "", icon: "Sparkles" },
  { id: "two", time: "19:00", title: "Two", description: "", icon: "Sparkles" },
  { id: "three", time: "20:00", title: "Three", description: "", icon: "Sparkles" },
  { id: "four", time: "21:00", title: "Four", description: "", icon: "Sparkles" },
];

let resolution = resolveDateStep(
  { completedStepIds: [], skippedStepIds: [] },
  "one",
  "completed",
);
assert.deepEqual(resolution.completedStepIds, ["one"]);
assert.deepEqual(resolution.skippedStepIds, []);

resolution = resolveDateStep(resolution, "two", "skipped");
assert.deepEqual(resolution.completedStepIds, ["one"]);
assert.deepEqual(resolution.skippedStepIds, ["two"]);

resolution = resolveDateStep(resolution, "two", "completed");
assert.deepEqual(resolution.completedStepIds, ["one", "two"]);
assert.deepEqual(resolution.skippedStepIds, []);

resolution = resolveDateStep(resolution, "two", "completed");
assert.deepEqual(resolution.completedStepIds, ["one", "two"]);

assert.equal(
  getCurrentDateStep(steps, resolution.completedStepIds, resolution.skippedStepIds)?.id,
  "three",
);
assert.equal(getDateProgress(steps, resolution.completedStepIds, ["four"]), 0.75);
assert.equal(getDateProgress([], [], []), 1);

const tasks = [
  { id: "a", label: "A" },
  { id: "b", label: "B" },
  { id: "c", label: "C" },
];
const unseen = chooseUnseenItem(tasks, ["a"], 0);
assert.equal(unseen.item?.id, "b");
assert.equal(unseen.allSeen, false);

const allSeen = chooseUnseenItem(tasks, ["a", "b", "c"], 0.99);
assert.equal(allSeen.item?.id, "c");
assert.equal(allSeen.allSeen, true);

console.log("active-date: 10 state and surprise checks passed");
