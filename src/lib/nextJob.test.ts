import { describe, expect, test } from "vitest";
import type { CaseTask, ClinicalNote, RoundSpec } from "../types";
import { nextJob } from "./nextJob";

const task: CaseTask = { code: "ptwr", label: "POST-TAKE WARD ROUND", minGrade: "st3" };
const rounds: RoundSpec[] = [
  { at: 0, encounterId: "enc-admission", label: "Post-take ward round (day 1)" },
  { at: 54000, encounterId: "enc-ward-round-d2", label: "Progress note (day 2)", npcNoteId: "npc-d2" },
];

function note(encounterId: string): ClinicalNote {
  return {
    kind: "note", id: "n", encounterId, category: "Progress", noteType: "Progress Note",
    author: "A, B", credential: "MD", authorRole: "*P", service: "s",
    dateOfService: "d", fileTime: "f", timestamp: 1, status: "signed", body: "b",
  };
}

describe("nextJob", () => {
  test("dynamic: current round label, not done until a covering note exists", () => {
    expect(nextJob({ rounds, simNow: 0, userNotes: [], task })).toEqual({
      label: "Post-take ward round (day 1)", done: false,
    });
  });
  test("dynamic: done once the round's encounter has a note", () => {
    expect(nextJob({ rounds, simNow: 0, userNotes: [note("enc-admission")], task })).toEqual({
      label: "Post-take ward round (day 1)", done: true,
    });
  });
  test("dynamic: advances to the next round as the clock moves", () => {
    expect(nextJob({ rounds, simNow: 54000, userNotes: [], task }).label).toBe("Progress note (day 2)");
  });
  test("static (no rounds): standing task, never auto-done", () => {
    expect(nextJob({ rounds: [], simNow: 999, userNotes: [], task })).toEqual({
      label: "POST-TAKE WARD ROUND", done: false,
    });
  });
});
