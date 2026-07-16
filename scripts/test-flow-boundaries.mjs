import assert from "node:assert/strict";

import { datePlans } from "../src/data/date-plans.ts";
import {
  hasCompletePreferences,
  hasSelectedMood,
} from "../src/lib/game-validation.ts";
import {
  parseStoredDateGameState,
  serializeStoredDateGameState,
} from "../src/lib/game-state-schema.ts";
import {
  hasCompleteQuizAnswers,
  setQuizAnswer,
} from "../src/lib/quiz-state.ts";
import { createInitialDateGameState } from "../src/types/date-game.ts";

const initialState = createInitialDateGameState();
assert.equal(hasSelectedMood(initialState.preferences), false);
assert.equal(hasCompletePreferences(initialState.preferences), false);

const moodOnly = { ...initialState.preferences, mood: "romantic" };
assert.equal(hasSelectedMood(moodOnly), true);
assert.equal(hasCompletePreferences(moodOnly), false);

const completePreferences = {
  mood: "romantic",
  time: "whole-evening",
  budget: "refined",
  distance: "thirty-minutes",
  relationship: "stable",
};
assert.equal(hasCompletePreferences(completePreferences), true);

let answers = setQuizAnswer([], 0, "answer-one", 5);
assert.equal(answers.length, 5);
assert.equal(hasCompleteQuizAnswers(answers, 5), false);
answers = ["one", "two", "three", "four", "five"];
assert.equal(hasCompleteQuizAnswers(answers, 5), true);
assert.deepEqual(setQuizAnswer(answers, -1, "invalid", 5), answers);
assert.deepEqual(setQuizAnswer(answers, 5, "invalid", 5), answers);

const partialPlayerBState = {
  ...initialState,
  step: "player-b-quiz",
  preferences: completePreferences,
  playerAAnswers: answers,
  playerBAnswers: ["one", "two", "", "", ""],
};
const restoredPlayerB = parseStoredDateGameState(
  serializeStoredDateGameState(partialPlayerBState),
  datePlans,
);
assert.equal(restoredPlayerB.ok && restoredPlayerB.value.step, "player-b-quiz");
assert.deepEqual(
  restoredPlayerB.ok && restoredPlayerB.value.playerBAnswers,
  partialPlayerBState.playerBAnswers,
);

console.log("flow-boundaries: 12 guard, quiz and player-B recovery checks passed");
