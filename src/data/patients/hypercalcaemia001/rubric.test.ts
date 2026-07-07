import { describe, expect, test } from "vitest";
import { scoreNote } from "../../../lib/rubric";
import { wordCount } from "../../../lib/noteText";
import { caseHypercalcaemia001Rubric as rubric } from "./rubric";

describe("hypercalcaemia001 rubric content", () => {
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

  test("a dangerous note missing every safety catch is flagged", () => {
    const dangerous = `Impression
Social admission, elderly lady not coping at home. Possible UTI on the dip.
Plan
Continue trimethoprim and all her usual regular medications. OT and physio for
falls. Social work for placement.`;
    const result = scoreNote(dangerous, rubric);
    const criticalIds = result.criticalMisses.map((item) => item.id);
    expect(criticalIds).toContain("safety-treat-hypercalcaemia");
    expect(criticalIds).toContain("safety-hold-thiazide");
    expect(criticalIds).toContain("safety-hold-calcium-supp");
    expect(criticalIds).toContain("safety-chase-myeloma-screen");
  });

  test("naming the calcium-directed fluids satisfies the treatment catch", () => {
    const note = "Plan: IV saline for hypercalcaemia, hold bendroflumethiazide and stop Adcal.";
    const result = scoreNote(note, rubric);
    expect(result.criticalMisses.map((i) => i.id)).not.toContain(
      "safety-treat-hypercalcaemia",
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
