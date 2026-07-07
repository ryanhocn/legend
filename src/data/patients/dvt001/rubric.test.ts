import { describe, expect, test } from "vitest";
import { scoreNote } from "../../../lib/rubric";
import { wordCount } from "../../../lib/noteText";
import { caseDvt001Rubric as rubric } from "./rubric";

describe("dvt001 rubric content", () => {
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

  test("a dangerous note that keeps the cellulitis label misses every safety catch", () => {
    const dangerous = `Impression
Left leg cellulitis, slow to respond, day 3.
Plan
Continue IV flucloxacillin and add oral clindamycin. Elevate the leg, repeat CRP, review on the consultant round tomorrow.`;
    const result = scoreNote(dangerous, rubric);
    const criticalIds = result.criticalMisses.map((item) => item.id);
    expect(criticalIds).toContain("safety-doppler");
    expect(criticalIds).toContain("safety-anticoagulate");
    expect(criticalIds).toContain("safety-stop-abx");
    expect(criticalIds).toContain("assessment-dvt");
  });

  test("recognising the DVT and imaging/anticoagulating clears the critical catches", () => {
    const note =
      "Impression: provoked deep vein thrombosis. Plan: urgent Doppler ultrasound, start treatment-dose anticoagulation with apixaban, stop the flucloxacillin.";
    const result = scoreNote(note, rubric);
    const criticalIds = result.criticalMisses.map((i) => i.id);
    expect(criticalIds).not.toContain("safety-doppler");
    expect(criticalIds).not.toContain("safety-anticoagulate");
    expect(criticalIds).not.toContain("safety-stop-abx");
    expect(criticalIds).not.toContain("assessment-dvt");
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
