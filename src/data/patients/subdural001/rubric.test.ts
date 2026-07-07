import { describe, expect, test } from "vitest";
import { scoreNote } from "../../../lib/rubric";
import { wordCount } from "../../../lib/noteText";
import { caseSubdural001Rubric as rubric } from "./rubric";

describe("subdural001 rubric content", () => {
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

  test("a dangerous note missing all three safety catches is flagged", () => {
    const dangerous = `Impression
Hypoactive delirium secondary to UTI, on a background of deconditioning. Improving.
Plan
Continue nitrofurantoin and all regular medications including apixaban. Encourage mobilisation, physio and OT review, discharge planning for home.`;
    const result = scoreNote(dangerous, rubric);
    const criticalIds = result.criticalMisses.map((item) => item.id);
    expect(criticalIds).toContain("safety-ct-head");
    expect(criticalIds).toContain("safety-hold-apixaban");
    expect(criticalIds).toContain("safety-escalate-gcs");
  });

  test("withholding the DOAC satisfies the apixaban catch", () => {
    const note = "Plan: withhold the DOAC pending imaging; urgent CT head requested.";
    const result = scoreNote(note, rubric);
    expect(result.criticalMisses.map((i) => i.id)).not.toContain(
      "safety-hold-apixaban",
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
