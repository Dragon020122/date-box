import type {
  AsyncInvitePayload,
  AsyncResultPayload,
  InviteParseResult,
  ResultParseResult,
} from "@/types/async-invite";

const INVITE_HASH_KEY = "invite";
const RESULT_HASH_KEY = "result";
const PROTOCOL_VERSION = "v1";
const MAX_NAME_LENGTH = 12;
const MAX_INVITE_ID_LENGTH = 64;
const REQUIRED_ANSWER_COUNT = 5;

const allowedPreferenceIds = {
  mood: new Set(["healing", "romantic", "playful", "conversation", "adventure", "random"]),
  time: new Set(["two-hours", "afternoon", "whole-evening"]),
  budget: new Set(["simple", "refined", "special"]),
  distance: new Set(["nearby", "thirty-minutes", "farther"]),
  relationship: new Set(["first-date", "ambiguous", "stable", "long-term"]),
} as const;

const allowedAnswersByQuestion = [
  new Set(["good-food", "casual-walk", "new-experience", "sit-and-talk"]),
  new Set(["beautiful-photo", "deep-conversation", "funny-moment", "small-souvenir"]),
  new Set(["small-gift", "hidden-place", "unsaid-words", "random-plan"]),
  new Set(["slow-and-easy", "full-and-brisk", "planned-and-free", "follow-the-feeling"]),
  new Set(["companionship", "understanding", "freshness", "romantic-response"]),
] as const;

const allowedPlanIds = new Set([
  "evening-breeze-walk",
  "pink-movie-night",
  "unknown-neighborhood",
  "happy-energy-station",
  "first-step-closer",
  "twenty-yuan-romance",
]);

interface ValidationSuccess<T> {
  ok: true;
  payload: T;
}

interface ValidationFailure {
  ok: false;
  reason: string;
}

type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isTimestamp(value: unknown): value is number {
  return Number.isSafeInteger(value) && typeof value === "number" && value >= 0;
}

function validateName(value: unknown, label: string, optional = false): string | null {
  if (optional && value === undefined) {
    return null;
  }

  if (typeof value !== "string" || value.trim().length === 0) {
    return `${label}不能为空`;
  }

  if (Array.from(value).length > MAX_NAME_LENGTH) {
    return `${label}不能超过 ${MAX_NAME_LENGTH} 个字符`;
  }

  return null;
}

function validateAnswers(value: unknown, label: string): string | null {
  if (!Array.isArray(value) || value.length !== REQUIRED_ANSWER_COUNT) {
    return `${label}必须刚好包含 ${REQUIRED_ANSWER_COUNT} 项`;
  }

  const invalidIndex = value.findIndex(
    (answer, index) => typeof answer !== "string" || !allowedAnswersByQuestion[index].has(answer),
  );

  return invalidIndex === -1 ? null : `${label}中包含不允许的选项 ID`;
}

function validateInviteStructure(value: unknown): ValidationResult<AsyncInvitePayload> {
  if (!isRecord(value)) {
    return { ok: false, reason: "邀请数据结构不完整" };
  }

  if (value.v !== 1) {
    return { ok: false, reason: "邀请版本不受支持" };
  }

  if (
    typeof value.id !== "string" ||
    value.id.length === 0 ||
    value.id.length > MAX_INVITE_ID_LENGTH ||
    !/^[A-Za-z0-9_-]+$/.test(value.id)
  ) {
    return { ok: false, reason: "邀请 ID 无效" };
  }

  if (!isTimestamp(value.createdAt) || !isTimestamp(value.expiresAt)) {
    return { ok: false, reason: "邀请时间无效" };
  }

  if (value.expiresAt <= value.createdAt) {
    return { ok: false, reason: "邀请失效时间无效" };
  }

  const hostNameError = validateName(value.hostName, "邀请人昵称");
  if (hostNameError) {
    return { ok: false, reason: hostNameError };
  }

  const guestNameError = validateName(value.guestName, "对方昵称", true);
  if (guestNameError) {
    return { ok: false, reason: guestNameError };
  }

  if (!isRecord(value.preferences)) {
    return { ok: false, reason: "约会偏好不完整" };
  }

  for (const key of Object.keys(allowedPreferenceIds) as Array<keyof typeof allowedPreferenceIds>) {
    const preference = value.preferences[key];
    if (typeof preference !== "string" || !allowedPreferenceIds[key].has(preference)) {
      return { ok: false, reason: "约会偏好中包含不允许的选项 ID" };
    }
  }

  const answersError = validateAnswers(value.hostAnswers, "邀请人答案");
  if (answersError) {
    return { ok: false, reason: answersError };
  }

  return { ok: true, payload: value as unknown as AsyncInvitePayload };
}

function validateResultStructure(value: unknown): ValidationResult<AsyncResultPayload> {
  if (!isRecord(value)) {
    return { ok: false, reason: "结果数据结构不完整" };
  }

  if (value.v !== 1) {
    return { ok: false, reason: "结果版本不受支持" };
  }

  const inviteValidation = validateInviteStructure(value.invite);
  if (!inviteValidation.ok) {
    return inviteValidation;
  }

  const answersError = validateAnswers(value.guestAnswers, "对方答案");
  if (answersError) {
    return { ok: false, reason: answersError };
  }

  if (typeof value.selectedPlanId !== "string" || !allowedPlanIds.has(value.selectedPlanId)) {
    return { ok: false, reason: "结果中的约会计划 ID 不存在" };
  }

  if (!isTimestamp(value.createdAt)) {
    return { ok: false, reason: "结果创建时间无效" };
  }

  return { ok: true, payload: value as unknown as AsyncResultPayload };
}

function encodeBase64Url(value: unknown): string {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64Url(encoded: string): unknown {
  if (!/^[A-Za-z0-9_-]+$/.test(encoded)) {
    throw new Error("Invalid Base64 URL data");
  }

  const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}

function extractEncodedPayload(hash: string, key: string):
  | { status: "none" }
  | { status: "invalid"; reason: string }
  | { status: "encoded"; encoded: string } {
  const normalizedHash = hash.startsWith("#") ? hash.slice(1) : hash;

  if (normalizedHash.length === 0 || !normalizedHash.startsWith(`${key}=`)) {
    return { status: "none" };
  }

  const protocolValue = normalizedHash.slice(key.length + 1);
  const separatorIndex = protocolValue.indexOf(".");
  if (separatorIndex === -1) {
    return { status: "invalid", reason: "链接格式不完整" };
  }

  const version = protocolValue.slice(0, separatorIndex);
  if (version !== PROTOCOL_VERSION) {
    return { status: "invalid", reason: "链接版本不受支持" };
  }

  const encoded = protocolValue.slice(separatorIndex + 1);
  return encoded.length > 0
    ? { status: "encoded", encoded }
    : { status: "invalid", reason: "链接内容为空" };
}

export function validateInvitePayload(value: unknown, now = Date.now()): InviteParseResult {
  const validation = validateInviteStructure(value);
  if (!validation.ok) {
    return { status: "invalid", reason: validation.reason };
  }

  return validation.payload.expiresAt <= now
    ? { status: "expired", payload: validation.payload }
    : { status: "valid", payload: validation.payload };
}

export function validateResultPayload(value: unknown, now = Date.now()): ResultParseResult {
  const validation = validateResultStructure(value);
  if (!validation.ok) {
    return { status: "invalid", reason: validation.reason };
  }

  return validation.payload.invite.expiresAt <= now
    ? { status: "expired", payload: validation.payload }
    : { status: "valid", payload: validation.payload };
}

export function encodeInvitePayload(payload: AsyncInvitePayload): string {
  const validation = validateInviteStructure(payload);
  if (!validation.ok) {
    throw new Error(validation.reason);
  }
  return encodeBase64Url(payload);
}

export function decodeInvitePayload(encoded: string, now = Date.now()): InviteParseResult {
  try {
    return validateInvitePayload(decodeBase64Url(encoded), now);
  } catch {
    return { status: "invalid", reason: "邀请链接内容无法识别" };
  }
}

export function encodeResultPayload(payload: AsyncResultPayload): string {
  const validation = validateResultStructure(payload);
  if (!validation.ok) {
    throw new Error(validation.reason);
  }
  return encodeBase64Url(payload);
}

export function decodeResultPayload(encoded: string, now = Date.now()): ResultParseResult {
  try {
    return validateResultPayload(decodeBase64Url(encoded), now);
  } catch {
    return { status: "invalid", reason: "结果链接内容无法识别" };
  }
}

export function removeInviteHash(url: string): string {
  const hashIndex = url.indexOf("#");
  return hashIndex === -1 ? url : url.slice(0, hashIndex);
}

export function createInviteUrl(baseUrl: string, payload: AsyncInvitePayload): string {
  return `${removeInviteHash(baseUrl)}#${INVITE_HASH_KEY}=${PROTOCOL_VERSION}.${encodeInvitePayload(payload)}`;
}

export function createResultUrl(baseUrl: string, payload: AsyncResultPayload): string {
  return `${removeInviteHash(baseUrl)}#${RESULT_HASH_KEY}=${PROTOCOL_VERSION}.${encodeResultPayload(payload)}`;
}

export function parseInviteFromHash(hash: string, now = Date.now()): InviteParseResult {
  const extracted = extractEncodedPayload(hash, INVITE_HASH_KEY);
  if (extracted.status !== "encoded") {
    return extracted;
  }
  return decodeInvitePayload(extracted.encoded, now);
}

export function parseResultFromHash(hash: string, now = Date.now()): ResultParseResult {
  const extracted = extractEncodedPayload(hash, RESULT_HASH_KEY);
  if (extracted.status !== "encoded") {
    return extracted;
  }
  return decodeResultPayload(extracted.encoded, now);
}
