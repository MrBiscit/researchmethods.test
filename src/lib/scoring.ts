import type { OptionKey } from "./study-content";

/** Submissions faster than this are treated as skips (texts can't be read that fast). */
export const MIN_READING_MS = 5000;

export interface ResponseOutcome {
  score: 0 | 1;
  is_skipped: boolean;
  time_taken_seconds: number;
}

export function scoreResponse(input: {
  action: "submit" | "skip";
  selected: OptionKey | null;
  correct: OptionKey;
  elapsedMs: number;
}): ResponseOutcome {
  const elapsed = Math.max(0, input.elapsedMs);
  const is_skipped =
    input.action === "skip" || input.selected === null || elapsed < MIN_READING_MS;
  const score: 0 | 1 = !is_skipped && input.selected === input.correct ? 1 : 0;
  return { score, is_skipped, time_taken_seconds: Math.floor(elapsed / 1000) };
}
