import { createHash } from "crypto";

export const FREE_GENERATION_COOKIE = "teg_free_generation";

export function hashGateInput(input: string) {
  return createHash("sha256").update(input).digest("hex");
}

export function freeGenerationDay(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function canUseAnonymousFreeGeneration(
  cookieValue?: string | null,
  date = new Date(),
) {
  return cookieValue !== freeGenerationDay(date);
}
