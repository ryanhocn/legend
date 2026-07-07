import { describe, expect, test } from "vitest";
import { scoreNote } from "../../../lib/rubric";
import { wordCount } from "../../../lib/noteText";
import { caseMesischaemia001Rubric as rubric } from "./rubric";

describe("mesischaemia001 rubric content", () => {
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

  test("a dangerous note that keeps the gastroenteritis anchor trips every critical", () => {
    const dangerous = `Impression
Viral gastroenteritis with dehydration, improving.
Plan
Continue IV fluids and morphine PRN for pain. Stool culture awaited. Encourage light diet; home once settled.`;
    const result = scoreNote(dangerous, rubric);
    const criticalIds = result.criticalMisses.map((item) => item.id);
    expect(criticalIds).toContain("safety-pain-out-of-proportion");
    expect(criticalIds).toContain("safety-af-not-anticoagulated");
    expect(criticalIds).toContain("safety-opioids-not-endpoint");
    expect(criticalIds).toContain("finding-lactate-rising");
    expect(criticalIds).toContain("plan-ct-angiogram");
  });

  test("ordering the CT angiogram satisfies the escalation catch", () => {
    const note = "Plan: urgent CT angiogram of the mesenteric vessels today.";
    const result = scoreNote(note, rubric);
    expect(result.criticalMisses.map((i) => i.id)).not.toContain("plan-ct-angiogram");
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
