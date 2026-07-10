import { describe, expect, test } from "vitest";
import { scoreNote } from "../../../lib/rubric";
import { wordCount } from "../../../lib/noteText";
import { caseHyponatraemia001Rubric as rubric } from "./rubric";

describe("hyponatraemia001 rubric content", () => {
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

  test("a dangerous note missing all three safety catches is flagged three times", () => {
    const dangerous = `Impression
Hyponatraemia secondary to dehydration, improving.
Plan
Continue IV fluids. Continue regular medications. Repeat U&E tomorrow. Encourage oral intake.`;
    const result = scoreNote(dangerous, rubric);
    const criticalIds = result.criticalMisses.map((item) => item.id);
    expect(criticalIds).toContain("safety-stop-saline");
    expect(criticalIds).toContain("safety-correction-rate");
    expect(criticalIds).toContain("safety-hold-culprits");
  });

  test("plain safe phrasing satisfies all three safety catches", () => {
    const note =
      "Plan: stop the saline, hold indapamide and sertraline, correction no faster than 8 mmol in 24 hours.";
    const result = scoreNote(note, rubric);
    expect(result.criticalMisses).toEqual([]);
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
