import {
  DATE_GAME_STORAGE_KEY,
  type DateGameState,
} from "@/types/date-game";
import { datePlans } from "@/data/date-plans";
import {
  parseStoredDateGameState,
  serializeStoredDateGameState,
  type StoredStateParseResult,
} from "@/lib/game-state-schema";

export { DATE_GAME_STORAGE_KEY };

export function parseDateGameStorage(rawValue: string): StoredStateParseResult {
  return parseStoredDateGameState(rawValue, datePlans);
}

export function serializeDateGameStorage(state: DateGameState): string {
  return serializeStoredDateGameState(state);
}
