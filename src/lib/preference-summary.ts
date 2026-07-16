import type { DatePreferences } from "@/types/date-game";

import { hasCompletePreferences } from "@/lib/game-validation";

export function getPreferenceSummary(
  preferences: DatePreferences,
): string | null {
  if (!hasCompletePreferences(preferences)) {
    return null;
  }

  const { mood, time, budget, distance, relationship } = preferences;

  if (relationship === "first-date") {
    if (distance === "nearby" || time === "two-hours") {
      return "第一次见面更适合留一点从容，在熟悉的范围里慢慢认识彼此。";
    }

    return "这次见面可以有一点新鲜感，也要留出舒服结束和轻松返程的余地。";
  }

  if (mood === "adventure" || mood === "random") {
    if (distance === "farther") {
      return "看起来你们准备好去远一点的地方，完成一次小小冒险。";
    }

    return "今晚适合保留一点未知，在不赶路的范围里遇见新的小惊喜。";
  }

  if (
    (mood === "healing" || mood === "conversation") &&
    distance === "nearby"
  ) {
    return "你们今天更适合把节奏放慢，在附近找到一段舒服的相处时间。";
  }

  if (
    mood === "romantic" &&
    (budget === "refined" || budget === "special")
  ) {
    const timePhrase = time === "whole-evening" ? "不赶时间" : "从容一点";
    return `今晚适合一场${timePhrase}、稍微精致，又有一点浪漫的约会。`;
  }

  if (mood === "playful") {
    return time === "afternoon"
      ? "这个下午适合多一点笑声和互动，让计划轻松地跟着快乐走。"
      : "今晚不用安排得太满，一起做点好玩的事就会很有能量。";
  }

  if (budget === "simple") {
    return "不需要复杂安排，一段轻松路线和一次认真陪伴就已经刚刚好。";
  }

  if (relationship === "long-term") {
    return "熟悉的你们，适合用一点不同于日常的小安排重新发现彼此。";
  }

  return "今晚适合留一点计划，也留一点随缘，让舒服和惊喜自然发生。";
}
