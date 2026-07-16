import type {
  DateGameState,
  DatePreferences,
  GameStep,
} from "@/types/date-game";

export const stepLabels: Record<GameStep, string> = {
  welcome: "欢迎",
  mood: "选择今晚的心情",
  preferences: "设置约会条件",
  "player-a-quiz": "你的默契问答",
  handoff: "手机交接",
  "player-b-quiz": "TA 的默契问答",
  compatibility: "默契结果",
  "mystery-box": "心动盲盒",
  plan: "今晚的计划",
  "active-date": "约会进行中",
  memory: "今晚的回忆卡",
};

export const gameStepOrder: readonly GameStep[] = [
  "welcome",
  "mood",
  "preferences",
  "player-a-quiz",
  "handoff",
  "player-b-quiz",
  "compatibility",
  "mystery-box",
  "plan",
  "active-date",
  "memory",
];

export function moveToStep(
  state: DateGameState,
  step: GameStep,
): DateGameState {
  return { ...state, step, updatedAt: Date.now() };
}

export function updatePreferenceState(
  state: DateGameState,
  patch: Partial<DatePreferences>,
): DateGameState {
  return {
    ...state,
    preferences: { ...state.preferences, ...patch },
    updatedAt: Date.now(),
  };
}
