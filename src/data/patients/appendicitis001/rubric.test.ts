import { describe, expect, test } from "vitest";
import { scoreNote } from "../../../lib/rubric";
import { wordCount } from "../../../lib/noteText";
import { caseAppendicitis001Rubric as rubric } from "./rubric";

describe("appendicitis001 rubric content", () => {
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

  test("a dangerous note trusting the label misses every critical catch", () => {
    const dangerous = `Impression
Constipation with faecal loading, awaiting laxative effect. Comfortable on codeine.
Plan
Continue senna and macrogol and all regular medications including metformin. Encourage oral fluids and diet. Home when bowels open.`;
    const result = scoreNote(dangerous, rubric);
    const criticalIds = result.criticalMisses.map((item) => item.id);
    expect(criticalIds).toContain("plan-senior-review");
    expect(criticalIds).toContain("plan-urgent-ct");
    expect(criticalIds).toContain("safety-metformin-aki");
    expect(criticalIds).toContain("safety-analgesia-masking");
  });

  test("an explicit registrar escalation satisfies the senior-review catch", () => {
    const note = "Plan: discussed with the surgical registrar, urgent CT abdomen requested.";
    const result = scoreNote(note, rubric);
    expect(result.criticalMisses.map((i) => i.id)).not.toContain("plan-senior-review");
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
