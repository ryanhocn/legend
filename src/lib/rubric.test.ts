import { describe, expect, test } from "vitest";
import type { CaseRubric, RubricItem } from "../types";
import { scoreNote } from "./rubric";

function makeItem(overrides: Partial<RubricItem> & { id: string }): RubricItem {
  return {
    label: overrides.id,
    category: "findings",
    weight: 10,
    triggers: [],
    explanation: "",
    pdqi: ["thorough"],
    ...overrides,
  };
}

function makeRubric(overrides: Partial<CaseRubric>): CaseRubric {
  return {
    caseId: "test001",
    noteType: "Progress Notes",
    items: [],
    wordBand: { target: 150, max: 250 },
    sections: [],
    modelNote: "",
    ...overrides,
  };
}

describe("scoreNote matching", () => {
  test("matches an exact phrase and awards its weight", () => {
    const rubric = makeRubric({
      items: [makeItem({ id: "lft", triggers: [[["obstructive lfts"]]] })],
    });
    const result = scoreNote("Bloods show obstructive LFTs today.", rubric);
    expect(result.items[0].matched).toBe(true);
    expect(result.earned).toBe(10);
    expect(result.possible).toBe(10);
  });

  test("matches any synonym within a group", () => {
    const rubric = makeRubric({
      items: [makeItem({ id: "bili", triggers: [[["bilirubin", "bili"]]] })],
    });
    expect(scoreNote("Bili trending up.", rubric).items[0].matched).toBe(true);
    expect(scoreNote("No mention here.", rubric).items[0].matched).toBe(false);
  });

  test("requires every group of a trigger (AND over groups)", () => {
    const rubric = makeRubric({
      items: [
        makeItem({
          id: "bili-raised",
          triggers: [[["bilirubin"], ["raised", "elevated", "high"]]],
        }),
      ],
    });
    expect(scoreNote("Bilirubin is elevated at 96.", rubric).items[0].matched).toBe(true);
    expect(scoreNote("Bilirubin checked today.", rubric).items[0].matched).toBe(false);
  });

  test("matches via any alternate trigger (OR over triggers)", () => {
    const rubric = makeRubric({
      items: [
        makeItem({
          id: "ercp",
          triggers: [[["ercp"]], [["endoscopic retrograde cholangiopancreatography"]]],
        }),
      ],
    });
    expect(scoreNote("Plan: urgent ERCP.", rubric).items[0].matched).toBe(true);
    expect(
      scoreNote("For endoscopic retrograde cholangiopancreatography.", rubric).items[0].matched,
    ).toBe(true);
  });

  test("ignores punctuation and case", () => {
    const rubric = makeRubric({
      items: [makeItem({ id: "cbd", triggers: [[["dilated cbd"]]] })],
    });
    expect(scoreNote("US: dilated CBD, 10 mm.", rubric).items[0].matched).toBe(true);
  });

  test("tolerates a single-letter typo in words of five or more letters", () => {
    const rubric = makeRubric({
      items: [makeItem({ id: "chole", triggers: [[["cholangitis"]]] })],
    });
    expect(scoreNote("Likely colangitis.", rubric).items[0].matched).toBe(true);
  });

  test("does not fuzzy-match short words", () => {
    const rubric = makeRubric({
      items: [makeItem({ id: "alp", triggers: [[["alp"]]] })],
    });
    expect(scoreNote("ALT 128 only.", rubric).items[0].matched).toBe(false);
  });

  test("requires phrase words to be consecutive", () => {
    const rubric = makeRubric({
      items: [makeItem({ id: "bc", triggers: [[["blood cultures"]]] })],
    });
    expect(scoreNote("Blood sent; cultures pending.", rubric).items[0].matched).toBe(false);
    expect(scoreNote("Blood cultures pending.", rubric).items[0].matched).toBe(true);
  });
});

describe("scoreNote scoring", () => {
  test("collects missed critical items as unsafe omissions", () => {
    const allergy = makeItem({
      id: "allergy",
      category: "safety",
      critical: true,
      triggers: [[["penicillin"]]],
    });
    const rubric = makeRubric({ items: [allergy] });
    const miss = scoreNote("Continue antibiotics.", rubric);
    expect(miss.criticalMisses).toEqual([allergy]);
    const hit = scoreNote("Penicillin allergy noted.", rubric);
    expect(hit.criticalMisses).toEqual([]);
  });

  test("applies no word penalty within the band", () => {
    const rubric = makeRubric({ wordBand: { target: 5, max: 10 } });
    const result = scoreNote("one two three four five six", rubric);
    expect(result.words).toBe(6);
    expect(result.wordPenalty).toBe(0);
  });

  test("penalizes 1 point per 25 words over max, capped at 10", () => {
    const rubric = makeRubric({ wordBand: { target: 5, max: 10 } });
    const words = (n: number) => Array.from({ length: n }, (_, i) => `w${i}`).join(" ");
    expect(scoreNote(words(11), rubric).wordPenalty).toBe(1);
    expect(scoreNote(words(35), rubric).wordPenalty).toBe(1);
    expect(scoreNote(words(36), rubric).wordPenalty).toBe(2);
    expect(scoreNote(words(1000), rubric).wordPenalty).toBe(10);
  });

  test("total is earned minus penalty, floored at zero", () => {
    const rubric = makeRubric({
      items: [makeItem({ id: "x", weight: 2, triggers: [[["w0"]]] })],
      wordBand: { target: 5, max: 10 },
    });
    const words = Array.from({ length: 100 }, (_, i) => `w${i}`).join(" ");
    const result = scoreNote(words, rubric);
    expect(result.earned).toBe(2);
    expect(result.wordPenalty).toBe(4);
    expect(result.total).toBe(0);
  });

  test("detects section headers at line starts, not mid-prose", () => {
    const rubric = makeRubric({
      sections: [
        ["impression", "assessment"],
        ["plan"],
      ],
    });
    const note = "Assessment\nCholangitis.\nWill plan for ERCP.";
    const result = scoreNote(note, rubric);
    expect(result.sectionsFound).toEqual(["assessment"]);
    expect(result.sectionsExpected).toBe(2);
  });

  test("rolls up matched/total counts per PDQI dimension", () => {
    const rubric = makeRubric({
      items: [
        makeItem({ id: "a", pdqi: ["thorough", "accurate"], triggers: [[["fever"]]] }),
        makeItem({ id: "b", pdqi: ["thorough"], triggers: [[["absent"]]] }),
      ],
    });
    const result = scoreNote("Fever overnight.", rubric);
    expect(result.pdqi["thorough"]).toEqual({ matched: 1, total: 2 });
    expect(result.pdqi["accurate"]).toEqual({ matched: 1, total: 1 });
    expect(result.pdqi["organized"]).toBeUndefined();
  });
});
