import { describe, expect, test } from "vitest";
import { scoreNote } from "../../../lib/rubric";
import { wordCount } from "../../../lib/noteText";
import { casePe001Rubric as rubric } from "./rubric";

describe("pe001 rubric content", () => {
  test("the model note matches every rubric item", () => {
    const result = scoreNote(rubric.modelNote, rubric);
    const missed = result.items.filter((r) => !r.matched).map((r) => r.item.id);
    expect(missed).toEqual([]);
    expect(result.criticalMisses).toEqual([]);
  });

  test("the model note stays inside its own conciseness band", () => {
    expect(wordCount(rubric.modelNote)).toBeLessThanOrEqual(rubric.wordBand.max);
    expect(scoreNote(rubric.modelNote, rubric).wordPenalty).toBe(0);
  });

  test("the model note contains every expected section header", () => {
    const result = scoreNote(rubric.modelNote, rubric);
    expect(result.sectionsFound.length).toBe(result.sectionsExpected);
  });

  test("a dangerous note missing all three safety catches is flagged each time", () => {
    const dangerous = `Impression
IECOPD day 2, slow to settle.
Plan
Continue nebulisers, prednisolone and doxycycline. Maintain target sats 88-92% given COPD. Chest physio. Home once sats stable on air.`;
    const result = scoreNote(dangerous, rubric);
    const criticalIds = result.criticalMisses.map((item) => item.id);
    expect(criticalIds).toContain("safety-chase-ctpa");
    expect(criticalIds).toContain("safety-anticoagulation");
    expect(criticalIds).toContain("safety-oxygen-target");
  });

  test("starting treatment-dose dalteparin satisfies the anticoagulation catch", () => {
    const note = "Plan: start treatment-dose dalteparin, chase CTPA today.";
    const result = scoreNote(note, rubric);
    expect(result.criticalMisses.map((i) => i.id)).not.toContain(
      "safety-anticoagulation",
    );
  });

  test("every item has a label, an explanation and at least one trigger", () => {
    for (const item of rubric.items) {
      expect(item.label.length, item.id).toBeGreaterThan(0);
      expect(item.explanation.length, item.id).toBeGreaterThan(0);
      expect(item.triggers.length, item.id).toBeGreaterThan(0);
      expect(item.pdqi.length, item.id).toBeGreaterThan(0);
    }
  });
});
