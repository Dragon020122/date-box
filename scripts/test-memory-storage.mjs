import assert from "node:assert/strict";

import { datePlans } from "../src/data/date-plans.ts";
import {
  parseStoredDateGameState,
  serializeStoredDateGameState,
} from "../src/lib/game-state-schema.ts";
import {
  formatMemoryCopy,
  getAutomaticMemoryText,
  getMemoryKeywords,
} from "../src/lib/memory-card.ts";
import { createInitialDateGameState } from "../src/types/date-game.ts";

const plan = datePlans[0];
const state = {
  ...createInitialDateGameState(),
  step: "memory",
  preferences: {
    mood: "healing",
    time: "two-hours",
    budget: "simple",
    distance: "nearby",
    relationship: "stable",
  },
  compatibility: {
    rawScore: 80,
    displayScore: 88,
    matchedCount: 4,
    sharedInsights: ["shared"],
    complementaryInsights: ["complementary"],
    planSuggestion: "suggestion",
    title: "title",
    description: "description",
  },
  selectedPlanId: plan.id,
  seenPlanIds: [plan.id],
  completedStepIds: plan.steps.map((step) => step.id),
  playerAAnswers: ["casual-walk", "deep-conversation"],
  playerBAnswers: ["casual-walk", "deep-conversation"],
  favoriteMoment: "晚风里的散步",
  messageToPartner: "下次还想一起走走",
};

const restored = parseStoredDateGameState(serializeStoredDateGameState(state), datePlans);
assert.equal(restored.ok, true);
assert.equal(restored.ok && restored.value.step, "memory");
assert.equal(restored.ok && restored.value.favoriteMoment, "晚风里的散步");

assert.equal(parseStoredDateGameState("not-json", datePlans).ok, false);
assert.equal(
  parseStoredDateGameState(JSON.stringify({ version: 99, state }), datePlans).ok,
  false,
);
assert.equal(
  parseStoredDateGameState(JSON.stringify({ version: 1, state: { step: "memory" } }), datePlans).ok,
  false,
);

const repaired = parseStoredDateGameState(
  serializeStoredDateGameState({ ...state, selectedPlanId: "missing-plan" }),
  datePlans,
);
assert.equal(repaired.ok && repaired.value.step, "mystery-box");
assert.equal(repaired.ok && repaired.value.selectedPlanId, null);

const repairedIncompleteMemory = parseStoredDateGameState(
  serializeStoredDateGameState({ ...state, completedStepIds: [plan.steps[0].id] }),
  datePlans,
);
assert.equal(repairedIncompleteMemory.ok && repairedIncompleteMemory.value.step, "active-date");

const keywords = getMemoryKeywords({
  mood: state.preferences.mood,
  plan,
  playerAAnswers: state.playerAAnswers,
  playerBAnswers: state.playerBAnswers,
});
assert.deepEqual(keywords, ["松弛", "晚风", "慢慢走", "认真聊天"]);

const memoryText = getAutomaticMemoryText({
  mood: state.preferences.mood,
  plan,
  playerAAnswers: state.playerAAnswers,
  playerBAnswers: state.playerBAnswers,
});
assert.match(memoryText, /认真说出口/);

const romanticMemoryText = getAutomaticMemoryText({
  mood: "romantic",
  plan,
  playerAAnswers: [],
  playerBAnswers: [],
});
assert.notEqual(romanticMemoryText, memoryText);

const copiedText = formatMemoryCopy({
  planTitle: plan.title,
  compatibilityScore: 88,
  favoriteMoment: state.favoriteMoment,
  messageToPartner: state.messageToPartner,
});
assert.match(copiedText, /Date Box｜心动计划局/);
assert.match(copiedText, /默契度：88%/);
assert.match(copiedText, /晚风里的散步/);

console.log("memory-storage: 15 schema, recovery and memory checks passed");
