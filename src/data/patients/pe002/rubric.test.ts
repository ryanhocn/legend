import { describe, expect, test } from "vitest";
import { scoreNote } from "../../../lib/rubric";
import { wordCount } from "../../../lib/noteText";
import { casePe002Rubric as rubric } from "./rubric";

describe("pe002 rubric content", () => {
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

  test("a dangerous note missing all four safety catches is flagged each time", () => {
    const dangerous = `Impression
?First seizure, awaiting neurology review. CT head normal, post-ictal recovery.
Plan
Continue neuro obs, keep nil by mouth, chase the neurology registrar for review, repeat observations and reassure.`;
    const result = scoreNote(dangerous, rubric);
    const criticalIds = result.criticalMisses.map((item) => item.id);
    expect(criticalIds).toContain("safety-highrisk-pe");
    expect(criticalIds).toContain("safety-anticoagulation");
    expect(criticalIds).toContain("safety-reperfusion");
    expect(criticalIds).toContain("safety-escalate");
  });

  test("starting empirical unfractionated heparin satisfies the anticoagulation catch", () => {
    const note = "Plan: start empirical unfractionated heparin infusion, chase CTPA.";
    const result = scoreNote(note, rubric);
    expect(result.criticalMisses.map((i) => i.id)).not.toContain(
      "safety-anticoagulation",
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
