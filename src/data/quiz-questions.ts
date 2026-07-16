import type { QuizQuestion } from "@/types/date-game";

export const quizQuestions: QuizQuestion[] = [
  {
    id: "preferred-activity",
    question: "今天更想把时间花在哪里？",
    options: [
      { id: "good-food", label: "吃点好吃的" },
      { id: "casual-walk", label: "随便走走" },
      { id: "new-experience", label: "一起体验新鲜事" },
      { id: "sit-and-talk", label: "找地方坐下聊天" },
    ],
  },
  {
    id: "desired-memory",
    question: "今晚更想留下什么？",
    options: [
      { id: "beautiful-photo", label: "一张好看的照片" },
      { id: "deep-conversation", label: "一段认真聊天的时间" },
      { id: "funny-moment", label: "一个很好笑的瞬间" },
      { id: "small-souvenir", label: "一件小小纪念品" },
    ],
  },
  {
    id: "surprise-style",
    question: "你更期待哪一种惊喜？",
    options: [
      { id: "small-gift", label: "对方准备的小礼物" },
      { id: "hidden-place", label: "突然出现的隐藏地点" },
      { id: "unsaid-words", label: "一句没有说过的话" },
      { id: "random-plan", label: "完全随机的安排" },
    ],
  },
  {
    id: "evening-pace",
    question: "你希望今晚是什么节奏？",
    options: [
      { id: "slow-and-easy", label: "慢慢来" },
      { id: "full-and-brisk", label: "紧凑一点更充实" },
      { id: "planned-and-free", label: "一半计划一半随缘" },
      { id: "follow-the-feeling", label: "完全跟着感觉走" },
    ],
  },
  {
    id: "desired-response",
    question: "今天最想从对方那里得到什么？",
    options: [
      { id: "companionship", label: "陪伴" },
      { id: "understanding", label: "理解" },
      { id: "freshness", label: "新鲜感" },
      { id: "romantic-response", label: "浪漫回应" },
    ],
  },
];
