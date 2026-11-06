import { describe, expect, it } from "vitest";
import { scoreResponse } from "./scoring";

describe("scoreResponse", () => {
  it("scores a correct answer after 5+ seconds as 1, not skipped", () => {
    expect(
      scoreResponse({ action: "submit", selected: "B", correct: "B", elapsedMs: 42_300 }),
    ).toEqual({ score: 1, is_skipped: false, time_taken_seconds: 42 });
  });

  it("scores an incorrect answer as 0, not skipped", () => {
    expect(
      scoreResponse({ action: "submit", selected: "A", correct: "B", elapsedMs: 30_000 }),
    ).toEqual({ score: 0, is_skipped: false, time_taken_seconds: 30 });
  });

  it("flags a correct answer submitted in under 5 seconds as a skip with score 0", () => {
    expect(
      scoreResponse({ action: "submit", selected: "B", correct: "B", elapsedMs: 4_999 }),
    ).toEqual({ score: 0, is_skipped: true, time_taken_seconds: 4 });
  });

  it("treats exactly 5 seconds as a real answer", () => {
    expect(
      scoreResponse({ action: "submit", selected: "B", correct: "B", elapsedMs: 5_000 }).is_skipped,
    ).toBe(false);
  });

  it("scores an explicit skip as 0 and skipped, even after a long time", () => {
    expect(
      scoreResponse({ action: "skip", selected: "B", correct: "B", elapsedMs: 120_000 }),
    ).toEqual({ score: 0, is_skipped: true, time_taken_seconds: 120 });
  });
});
