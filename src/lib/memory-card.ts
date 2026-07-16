import type { DatePlan, MoodId } from "@/types/date-game";

interface MemoryContentInput {
  mood: MoodId | null;
  plan: DatePlan;
  playerAAnswers: string[];
  playerBAnswers: string[];
}

interface MemoryCopyInput {
  planTitle: string;
  compatibilityScore: number;
  favoriteMoment: string;
  messageToPartner: string;
}

const moodKeywords: Record<MoodId, string> = {
  healing: "松弛",
  romantic: "浪漫",
  playful: "笑声",
  conversation: "认真聊天",
  adventure: "小冒险",
  random: "小惊喜",
};

const moodMemories: Record<MoodId, string> = {
  healing: "你们把节奏放慢，让陪伴和温柔留在了沿途。",
  romantic: "你们一起度过了一个有点浪漫、又藏着小惊喜的夜晚。",
  playful: "你们让笑声走在计划前面，也把快乐留成了今晚的纪念。",
  conversation: "你们认真听彼此说话，让普通的相处有了更柔软的分量。",
  adventure: "你们一起走进一点未知，把新鲜感变成了共同经历。",
  random: "你们把选择交给当下，让意外也成为今晚可爱的部分。",
};

const planKeywords: Record<string, string[]> = {
  "evening-breeze-walk": ["晚风", "慢慢走"],
  "pink-movie-night": ["电影感", "小仪式"],
  "unknown-neighborhood": ["街区探索", "新发现"],
  "happy-energy-station": ["快乐能量", "一起玩"],
  "first-step-closer": ["慢慢靠近", "舒服相处"],
  "twenty-yuan-romance": ["认真挑选", "小礼物"],
};

const answerKeywordGroups = [
  {
    ids: new Set(["sit-and-talk", "deep-conversation", "understanding", "unsaid-words"]),
    keyword: "认真聊天",
  },
  {
    ids: new Set(["small-gift", "small-souvenir"]),
    keyword: "小惊喜",
  },
  {
    ids: new Set(["beautiful-photo"]),
    keyword: "留下照片",
  },
  {
    ids: new Set(["new-experience", "hidden-place", "freshness"]),
    keyword: "新鲜感",
  },
  {
    ids: new Set(["funny-moment"]),
    keyword: "笑声",
  },
] as const;

function getAnswerKeyword(answers: string[]): string | null {
  return (
    answerKeywordGroups.find(({ ids }) => answers.some((answer) => ids.has(answer)))
      ?.keyword ?? null
  );
}

export function getMemoryKeywords({
  mood,
  plan,
  playerAAnswers,
  playerBAnswers,
}: MemoryContentInput): string[] {
  const candidates = [
    mood ? moodKeywords[mood] : null,
    ...(planKeywords[plan.id] ?? plan.tags.slice(0, 2)),
    getAnswerKeyword([...playerAAnswers, ...playerBAnswers]),
  ].filter((keyword): keyword is string => Boolean(keyword));

  return Array.from(new Set(candidates)).slice(0, 4);
}

export function getAutomaticMemoryText({
  mood,
  plan,
  playerAAnswers,
  playerBAnswers,
}: MemoryContentInput): string {
  const allAnswers = [...playerAAnswers, ...playerBAnswers];
  const moodSentence = mood
    ? moodMemories[mood]
    : `你们一起完成了「${plan.title}」，也给普通的一天留下了新的注解。`;

  if (
    allAnswers.some((answer) =>
      ["sit-and-talk", "deep-conversation", "understanding", "unsaid-words"].includes(answer),
    )
  ) {
    return `${moodSentence} 还有一些认真说出口的话，被今晚好好接住了。`;
  }

  if (
    allAnswers.some((answer) =>
      ["beautiful-photo", "small-gift", "small-souvenir"].includes(answer),
    )
  ) {
    return `${moodSentence} 你们还为这段时间留下了一件可以再次想起的小纪念。`;
  }

  return `${moodSentence} 「${plan.title}」也因此成了只属于你们的一段路线。`;
}

export function formatMemoryDate(date: Date): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatMemoryCopy({
  planTitle,
  compatibilityScore,
  favoriteMoment,
  messageToPartner,
}: MemoryCopyInput): string {
  return [
    "Date Box｜心动计划局",
    "",
    `今天我们完成了「${planTitle}」。`,
    `默契度：${compatibilityScore}%`,
    `最喜欢的瞬间：${favoriteMoment.trim() || "还没写下"}`,
    `想对你说：${messageToPartner.trim() || "还没写下"}`,
    "",
    "把普通的一天，变成了两个人的小小冒险。",
  ].join("\n");
}
