import { createHash } from "crypto";

export const FREE_GENERATION_COOKIE = "teg_free_generation";

export function hashGateInput(input: string) {
  return createHash("sha256").update(input).digest("hex");
}

export function canUseAnonymousFreeGeneration(cookieValue?: string | null) {
  return cookieValue !== "claimed";
}
