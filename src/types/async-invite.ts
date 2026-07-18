import type { DatePreferences } from "@/types/date-game";

export type EntryMode = "normal" | "async-invite" | "async-result";

export type AsyncHostStep =
  | "create-intro"
  | "mood"
  | "preferences"
  | "host-quiz"
  | "generating"
  | "share-placeholder";

export interface AsyncHostSessionState {
  step: AsyncHostStep;
  hostName: string;
  guestName: string;
  preferences: DatePreferences;
  hostAnswers: string[];
  inviteUrl: string | null;
  inviteCreatedAt: number | null;
  hasPreviousInvite: boolean;
}

export interface AsyncInvitePayload {
  v: 1;
  id: string;
  createdAt: number;
  expiresAt: number;
  hostName: string;
  guestName?: string;
  preferences: DatePreferences;
  hostAnswers: string[];
}

export interface AsyncResultPayload {
  v: 1;
  invite: AsyncInvitePayload;
  guestAnswers: string[];
  selectedPlanId: string;
  createdAt: number;
}

export type InviteParseResult =
  | { status: "valid"; payload: AsyncInvitePayload }
  | { status: "expired"; payload: AsyncInvitePayload }
  | { status: "invalid"; reason: string }
  | { status: "none" };

export type ResultParseResult =
  | { status: "valid"; payload: AsyncResultPayload }
  | { status: "expired"; payload: AsyncResultPayload }
  | { status: "invalid"; reason: string }
  | { status: "none" };

export const ASYNC_INVITE_STORAGE_KEY = "date-box-async-session-v1";
export const DEFAULT_ASYNC_INVITE_DURATION_MS = 48 * 60 * 60 * 1000;
