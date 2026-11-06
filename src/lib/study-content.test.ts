import { describe, expect, it } from "vitest";
import { buildStudySteps, LEARNING, shuffledLearningOrder, TEST } from "./study-content";

describe("study order", () => {
  it("runs 1 practice, then 5 main, then 3 final problems", () => {
    const steps = buildStudySteps(shuffledLearningOrder());
    expect(steps.map((s) => s.phase)).toEqual([
      "pretest",
      "learning", "learning", "learning", "learning", "learning",
      "test", "test", "test",
    ]);
  });

  it("shows the main problems in the participant's shuffled order", () => {
    const order = ["main-4", "main-2", "main-5", "main-1", "main-3"];
    const ids = buildStudySteps(order).filter((s) => s.phase === "learning").map((s) => s.problem.id);
    expect(ids).toEqual(order);
  });

  it("shuffles every main problem exactly once", () => {
    const order = shuffledLearningOrder();
    expect([...order].sort()).toEqual(LEARNING.map((p) => p.id).sort());
  });

  it("keeps the final problems in fixed order regardless of the shuffle", () => {
    const ids = buildStudySteps(["main-5", "main-4", "main-3", "main-2", "main-1"])
      .filter((s) => s.phase === "test")
      .map((s) => s.problem.id);
    expect(ids).toEqual(["final-1", "final-2", "final-3"]);
    expect(ids).toEqual(TEST.map((p) => p.id));
  });
});
