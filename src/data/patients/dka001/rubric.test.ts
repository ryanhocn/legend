import { describe, expect, test } from "vitest";
import { scoreNote } from "../../../lib/rubric";
import { wordCount } from "../../../lib/noteText";
import { caseDka001Rubric as rubric } from "./rubric";

describe("dka001 rubric content", () => {
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

  test("a note echoing the gastroenteritis discharge plan trips all three critical catches", () => {
    const dangerous = `Impression
Viral gastroenteritis — same bug as the flatmates. Young and otherwise well, should settle.
Plan
Ondansetron given, encourage oral fluids. Home when tolerating fluids, GP follow-up and gastroenteritis advice sheet.`;
    const result = scoreNote(dangerous, rubric);
    const criticalIds = result.criticalMisses.map((item) => item.id);
    expect(criticalIds).toContain("safety-fixed-rate-insulin");
    expect(criticalIds).toContain("safety-potassium-replacement");
    expect(criticalIds).toContain("safety-reject-gastroenteritis-label");
  });

  test("naming the running FRIII with KCl and the revised label satisfies the critical catches", () => {
    const note =
      "Plan: FRIII running with 40 mmol/L KCl in each bag; recheck potassium in an hour. Not gastroenteritis — this is DKA.";
    const result = scoreNote(note, rubric);
    expect(result.criticalMisses.map((i) => i.id)).toEqual([]);
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
