import { describe, expect, test } from "vitest";
import { scoreNote } from "../../../lib/rubric";
import { wordCount } from "../../../lib/noteText";
import { caseAspiration001Rubric as rubric } from "./rubric";

describe("aspiration001 rubric content", () => {
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

  test("a note that treats it as an isolated pneumonia misses every ceiling-of-care catch", () => {
    const dangerous = `Impression
Aspiration pneumonia, third episode, septic.
Plan
Continue IV co-amoxiclav and fluids, oxygen, NG feeding for nutrition, chest physio, repeat bloods, full escalation, consultant review this afternoon.`;
    const result = scoreNote(dangerous, rubric);
    const criticalIds = result.criticalMisses.map((item) => item.id);
    expect(criticalIds).toContain("safety-ceiling-of-care");
    expect(criticalIds).toContain("safety-dnacpr");
    expect(criticalIds).toContain("safety-best-interests");
    expect(criticalIds).toContain("safety-feeding-decision");
  });

  test("addressing ceiling, resuscitation, family and feeding clears the critical catches", () => {
    const note =
      "Impression: end-stage dementia with recurrent aspiration. Plan: agree a ceiling of care and DNACPR, best interests discussion with the family, not for tube feeding — risk feeding for comfort.";
    const result = scoreNote(note, rubric);
    const criticalIds = result.criticalMisses.map((i) => i.id);
    expect(criticalIds).not.toContain("safety-ceiling-of-care");
    expect(criticalIds).not.toContain("safety-dnacpr");
    expect(criticalIds).not.toContain("safety-best-interests");
    expect(criticalIds).not.toContain("safety-feeding-decision");
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
