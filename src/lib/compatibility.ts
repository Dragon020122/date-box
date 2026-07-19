import type { CompatibilityResult } from "@/types/date-game";

export const COMPATIBILITY_QUESTION_COUNT = 5;
export const COMPATIBILITY_MATCH_POINTS = 20;
export const COMPATIBILITY_DISPLAY_FLOOR = 52;

const optionLabels: Record<string, string> = {
  "good-food": "吃点好吃的",
  "casual-walk": "随便走走",
  "new-experience": "一起体验新鲜事",
  "sit-and-talk": "找地方坐下聊天",
  "beautiful-photo": "一张好看的照片",
  "deep-conversation": "一段认真聊天的时间",
  "funny-moment": "一个很好笑的瞬间",
  "small-souvenir": "一件小小纪念品",
  "small-gift": "对方准备的小礼物",
  "hidden-place": "突然出现的隐藏地点",
  "unsaid-words": "一句没有说过的话",
  "random-plan": "完全随机的安排",
  "slow-and-easy": "慢慢来",
  "full-and-brisk": "紧凑一点更充实",
  "planned-and-free": "一半计划一半随缘",
  "follow-the-feeling": "完全跟着感觉走",
  companionship: "陪伴",
  understanding: "理解",
  freshness: "新鲜感",
  "romantic-response": "浪漫回应",
};

const sharedInsightByOption: Record<string, string> = {
  "good-food": "你们都想让喜欢的味道成为今晚的开场。",
  "casual-walk": "你们都期待一段可以并肩慢慢走的时间。",
  "new-experience": "你们都想一起体验一件从未做过的小事。",
  "sit-and-talk": "你们都愿意把认真聊天留在今晚。",
  "beautiful-photo": "你们都想为今晚留下一张好看的照片。",
  "deep-conversation": "你们都希望今晚能够说一些平时没说完的话。",
  "funny-moment": "你们都期待今晚有一个想起来就会笑的瞬间。",
  "small-souvenir": "你们都想带走一件能记住今晚的小纪念。",
  "small-gift": "你们都喜欢被一份认真准备的小心意回应。",
  "hidden-place": "你们都对藏在路线之外的小地点感到心动。",
  "unsaid-words": "你们都期待听见一句还没有说出口的话。",
  "random-plan": "你们都愿意把一点选择权交给今晚的惊喜。",
  "slow-and-easy": "你们都希望今晚能够慢一点，不用赶时间。",
  "full-and-brisk": "你们都喜欢把今晚过得充实而有节奏。",
  "planned-and-free": "你们都想在计划与随缘之间保留舒服的余地。",
  "follow-the-feeling": "你们都愿意跟着当下的感觉决定下一站。",
  companionship: "你们都把彼此的陪伴放在今晚最重要的位置。",
  understanding: "你们都希望被对方认真听见和理解。",
  freshness: "你们都想从今晚得到一点不同于日常的新鲜感。",
  "romantic-response": "你们都期待收到一份明确而温柔的浪漫回应。",
};

const displayScoresByMatch = [52, 56, 62, 74, 88, 96] as const;

function getOptionLabel(optionId: string): string {
  return optionLabels[optionId] ?? "一个真实的期待";
}

function getComplementaryInsight(
  questionIndex: number,
  playerAAnswer: string,
  playerBAnswer: string,
  playerAName: string,
  playerBName: string,
): string {
  const playerAChoice = getOptionLabel(playerAAnswer);
  const playerBChoice = getOptionLabel(playerBAnswer);

  const templates = [
    `${playerAName}更想把时间留给「${playerAChoice}」，${playerBName}更期待「${playerBChoice}」，两个片段可以自然接成今晚的路线。`,
    `${playerAName}想留下「${playerAChoice}」，${playerBName}想记住「${playerBChoice}」，一份回忆可以同时拥有两种形状。`,
    `${playerAName}期待的惊喜是「${playerAChoice}」，${playerBName}更心动于「${playerBChoice}」，可以把一个写进计划，另一个留作隐藏彩蛋。`,
    `${playerAName}偏向「${playerAChoice}」的节奏，${playerBName}更喜欢「${playerBChoice}」，先顺着一个人开始，再把选择权交给对方。`,
    `${playerAName}更想收到「${playerAChoice}」，${playerBName}更期待「${playerBChoice}」，今晚可以用两个小动作互相回应。`,
  ];

  return templates[questionIndex] ?? templates[0];
}

function getPlanSuggestion(allAnswers: string[]): string {
  const selected = new Set(allAnswers);
  const wantsAdventure = [
    "new-experience",
    "hidden-place",
    "random-plan",
    "freshness",
  ].some((optionId) => selected.has(optionId));
  const wantsQuiet = [
    "casual-walk",
    "sit-and-talk",
    "deep-conversation",
    "slow-and-easy",
    "understanding",
    "companionship",
  ].some((optionId) => selected.has(optionId));
  const wantsKeepsake = [
    "beautiful-photo",
    "small-souvenir",
    "small-gift",
    "romantic-response",
  ].some((optionId) => selected.has(optionId));

  if (wantsAdventure && wantsQuiet) {
    return "今晚适合先安排一个共同体验，再用安静散步或坐下聊天收尾。";
  }

  if (wantsQuiet) {
    return "从一段不赶时间的散步或小食开始，把最完整的时间留给彼此说话。";
  }

  if (selected.has("good-food") && selected.has("funny-moment")) {
    return "先用喜欢的食物热场，再安排一个轻松互动，把笑声留进今晚的路线。";
  }

  if (wantsKeepsake) {
    return "给今晚留一个小小仪式：共同完成一件事，再带走照片、礼物或手写纪念。";
  }

  if (wantsAdventure) {
    return "只确定一个舒服的出发点，把中间一段路线留给现场决定和小惊喜。";
  }

  return "今晚适合把一个确定的安排和一段自由时间放在一起，让两个人轮流决定下一站。";
}

function getResultCopy(displayScore: number): Pick<CompatibilityResult, "title" | "description"> {
  if (displayScore >= 80) {
    return {
      title: "你们对今晚，有着几乎一样的期待",
      description: "很多选择不用说出口，你们也已经走向了同一个方向。",
    };
  }

  if (displayScore >= 60) {
    return {
      title: "你们相似，也刚好保留了一点惊喜",
      description: "相同的期待让约会舒服，不同的选择让今晚更有故事。",
    };
  }

  return {
    title: "你们期待的不同，刚好可以拼成完整的一晚",
    description: "一个人想要浪漫，一个人想要轻松，这并不冲突。",
  };
}

export function calculateCompatibility(
  playerAAnswers: string[],
  playerBAnswers: string[],
  labels: { playerA?: string; playerB?: string } = {},
): CompatibilityResult {
  const playerALabel = labels.playerA?.trim() || "你";
  const playerBLabel = labels.playerB?.trim() || "TA";
  const answerPairs = Array.from(
    { length: COMPATIBILITY_QUESTION_COUNT },
    (_, index) => [playerAAnswers[index] ?? "", playerBAnswers[index] ?? ""] as const,
  );
  const matchedPairs = answerPairs.filter(
    ([playerAAnswer, playerBAnswer]) =>
      playerAAnswer !== "" && playerAAnswer === playerBAnswer,
  );
  const mismatchedPairs = answerPairs
    .map(([playerAAnswer, playerBAnswer], questionIndex) => ({
      playerAAnswer,
      playerBAnswer,
      questionIndex,
    }))
    .filter(
      ({ playerAAnswer, playerBAnswer }) =>
        playerAAnswer !== "" &&
        playerBAnswer !== "" &&
        playerAAnswer !== playerBAnswer,
    );
  const matchedCount = matchedPairs.length;
  const rawScore = Math.round(
    (matchedCount / COMPATIBILITY_QUESTION_COUNT) * 100,
  );
  const displayScore = Math.max(
    COMPATIBILITY_DISPLAY_FLOOR,
    displayScoresByMatch[matchedCount],
  );

  const sharedInsights = matchedPairs
    .map(([answer]) => sharedInsightByOption[answer])
    .filter((insight): insight is string => Boolean(insight))
    .slice(0, 2);

  if (sharedInsights.length === 0) {
    const [playerAMemory, playerBMemory] = answerPairs[1];
    sharedInsights.push(
      `你们都想让今晚留下具体的记忆：${playerALabel}更靠近「${getOptionLabel(playerAMemory)}」，${playerBLabel}更靠近「${getOptionLabel(playerBMemory)}」。`,
    );
  }

  const complementaryInsights = mismatchedPairs
    .slice(0, 2)
    .map(({ questionIndex, playerAAnswer, playerBAnswer }) =>
      getComplementaryInsight(
        questionIndex,
        playerAAnswer,
        playerBAnswer,
        playerALabel,
        playerBLabel,
      ),
    );

  if (complementaryInsights.length === 0) {
    const sharedAnswer = answerPairs[4][0] || answerPairs[0][0];
    complementaryInsights.push(
      `你们都选择了「${getOptionLabel(sharedAnswer)}」，也可以一个人负责把它写进路线，另一个人负责保留现场惊喜。`,
    );
  }

  return {
    rawScore,
    displayScore,
    matchedCount,
    sharedInsights,
    complementaryInsights,
    planSuggestion: getPlanSuggestion([...playerAAnswers, ...playerBAnswers]),
    ...getResultCopy(displayScore),
  };
}
