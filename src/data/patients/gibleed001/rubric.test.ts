import { describe, expect, test } from "vitest";
import { scoreNote } from "../../../lib/rubric";
import { wordCount } from "../../../lib/noteText";
import { caseGibleed001Rubric as rubric } from "./rubric";

describe("gibleed001 rubric content", () => {
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

  test("a dangerous note that keeps the vasovagal label misses every safety catch", () => {
    const dangerous = `Impression
Postural collapse secondary to dehydration, improving. Dark stools — on ferrous sulfate.
Plan
Continue IV fluids and all regular medications including apixaban and naproxen. Mobilise, home tomorrow if steady.`;
    const result = scoreNote(dangerous, rubric);
    const criticalIds = result.criticalMisses.map((item) => item.id);
    expect(criticalIds).toContain("safety-hold-apixaban");
    expect(criticalIds).toContain("safety-hold-naproxen");
    expect(criticalIds).toContain("safety-melaena-not-iron");
    expect(criticalIds).toContain("safety-group-save");
    expect(criticalIds).toContain("plan-endoscopy");
  });

  test("holding both culprit drugs satisfies both medication catches", () => {
    const note = "Plan: hold apixaban, stop naproxen, urgent OGD and G&S.";
    const result = scoreNote(note, rubric);
    const criticalIds = result.criticalMisses.map((i) => i.id);
    expect(criticalIds).not.toContain("safety-hold-apixaban");
    expect(criticalIds).not.toContain("safety-hold-naproxen");
    expect(criticalIds).not.toContain("safety-group-save");
    expect(criticalIds).not.toContain("plan-endoscopy");
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
