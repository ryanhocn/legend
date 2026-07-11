import { describe, expect, test } from "vitest";
import type { Note } from "../types";
import { noteOwnership } from "./noteOwnership";

function note(id: string, authorId?: string): Note {
  return {
    kind: "note", id, encounterId: "enc-admission", category: "Progress",
    noteType: "Progress Note", author: "X, Y", credential: "MD", authorRole: "*PHYSICIAN",
    service: "(A) General Surgery", dateOfService: "16/06 17:00", fileTime: "16/06 17:00",
    timestamp: 1, status: "signed", authorId, body: "b",
  };
}

describe("noteOwnership", () => {
  const mine = note("n1", "d9-ME");
  const otherAlias = note("n2", "d9-OTHER");
  const legacy = note("n3"); // account note, no authorId stamped
  const userNotes = [mine, otherAlias, legacy];
  const args = { userNotes, myHcpId: "d9-ME", playerHcpId: "d0-PLAYER" };

  test("current persona's note: full control", () => {
    expect(noteOwnership(mine, args)).toEqual({ canEdit: true, canDelete: true, canAddend: true });
  });
  test("another alias's account note: addend only", () => {
    expect(noteOwnership(otherAlias, args)).toEqual({ canEdit: false, canDelete: false, canAddend: true });
  });
  test("legacy account note with no authorId: grandfathered to current persona", () => {
    expect(noteOwnership(legacy, args)).toEqual({ canEdit: true, canDelete: true, canAddend: true });
  });
  test("static case-persona note (not an account note): addend only", () => {
    expect(noteOwnership(note("n4", "d0-PLAYER"), args)).toEqual({ canEdit: false, canDelete: false, canAddend: true });
  });
  test("a note owned by no one here: no actions", () => {
    expect(noteOwnership(note("zzz", "d9-STRANGER"), args)).toEqual({ canEdit: false, canDelete: false, canAddend: false });
  });
});
