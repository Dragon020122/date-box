import type { DatePreferences } from "@/types/date-game";

export function hasSelectedMood(preferences: DatePreferences): boolean {
  return preferences.mood !== null;
}

export function hasCompletePreferences(preferences: DatePreferences): boolean {
  return (
    preferences.mood !== null &&
    preferences.time !== null &&
    preferences.budget !== null &&
    preferences.distance !== null &&
    preferences.relationship !== null
  );
}
