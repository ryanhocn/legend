import { describe, expect, test } from "vitest";
import { scoreNote } from "../../../lib/rubric";
import { wordCount } from "../../../lib/noteText";
import { caseDelirium001Rubric as rubric } from "./rubric";

describe("delirium001 rubric content", () => {
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
Known dementia, now progressing, with a UTI on the dip. Settled after
haloperidol overnight.
Plan
Continue cefalexin and all regular medications including oxybutynin.
Haloperidol PRN as charted for agitation. Encourage oral fluids. OT and
physio; social work re placement.`;
    const result = scoreNote(dangerous, rubric);
    const criticalIds = result.criticalMisses.map((item) => item.id);
    expect(criticalIds).toContain("safety-exclude-retention");
    expect(criticalIds).toContain("safety-anticholinergic-burden");
    expect(criticalIds).toContain("safety-haloperidol-parkinsons");
  });

  test("ordering the bladder scan satisfies the retention catch", () => {
    const note =
      "Plan: bladder scan on the ward this morning, catheterise if significant residual.";
    const result = scoreNote(note, rubric);
    expect(result.criticalMisses.map((i) => i.id)).not.toContain(
      "safety-exclude-retention",
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
