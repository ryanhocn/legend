import { describe, expect, test } from "vitest";
import { scoreNote } from "../../../lib/rubric";
import { wordCount } from "../../../lib/noteText";
import { caseNstemi001Rubric as rubric } from "./rubric";

describe("nstemi001 rubric content", () => {
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
Dyspepsia / gastritis, settled with Gaviscon. Comfortable overnight.
Plan
Continue lansoprazole and all regular medications including metformin. If repeat
troponin positive, load aspirin 300 mg and start fondaparinux 2.5 mg per ACS
pathway. Home after bloods reviewed.`;
    const result = scoreNote(dangerous, rubric);
    const criticalIds = result.criticalMisses.map((item) => item.id);
    expect(criticalIds).toContain("safety-troponin-rise");
    expect(criticalIds).toContain("safety-aspirin-allergy");
    expect(criticalIds).toContain("safety-renal-dosing");
  });

  test("naming the substitute antiplatelet satisfies the allergy catch", () => {
    const note = "Plan: load clopidogrel 300 mg, urgent cardiology review.";
    const result = scoreNote(note, rubric);
    expect(result.criticalMisses.map((i) => i.id)).not.toContain(
      "safety-aspirin-allergy",
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
