import { describe, expect, test } from "vitest";
import type { NoteDraft, UserProfile } from "../types";
import { buildUserNote, formatStamp } from "./userNotes";

const draft: NoteDraft = {
  id: "draft-1",
  noteType: "Progress Note",
  service: "(A) General Surgery — AMU",
  body: "<div>unused here</div>",
};

const user: UserProfile = { forename: "Ryan", surname: "Ho" };
const now = new Date(2026, 6, 4, 9, 5); // 04/07/2026 09:05 local

describe("formatStamp", () => {
  test("formats DD/MM HH:MM with zero padding", () => {
    expect(formatStamp(now)).toBe("04/07 09:05");
  });
});

describe("buildUserNote", () => {
  test("builds a signed note attributed to the user", () => {
    const note = buildUserNote(draft, user, "Plan: ERCP.", "signed", now);
    expect(note.kind).toBe("note");
    expect(note.author).toBe("Ho, Ryan");
    expect(note.credential).toBe("MS");
    expect(note.authorRole).toBe("*MEDICAL STUDENT");
    expect(note.status).toBe("signed");
    expect(note.body).toBe("Plan: ERCP.");
    expect(note.admission).toBe(true);
    expect(note.encounterId).toBe("enc-admission");
    expect(note.dateOfService).toBe("04/07 09:05");
    expect(note.fileTime).toBe("04/07 09:05");
    expect(note.timestamp).toBe(Math.floor(now.getTime() / 1000));
  });

  test("maps each editor note type to its browser category", () => {
    const cases: [string, string][] = [
      ["Progress Note", "Progress"],
      ["H&P", "H&P"],
      ["Consult Note", "Consults"],
      ["Procedure Note", "Procedures"],
      ["Nursing Note", "Nursing"],
      ["Discharge Summary", "Discharge"],
    ];
    for (const [noteType, category] of cases) {
      const note = buildUserNote({ ...draft, noteType }, user, "x", "signed", now);
      expect(note.category, noteType).toBe(category);
    }
  });

  test("pended drafts become incomplete notes with a dash file time", () => {
    const note = buildUserNote(draft, user, "wip", "incomplete", now);
    expect(note.status).toBe("incomplete");
    expect(note.fileTime).toBe("—");
  });

  test("ids are unique per draft and time", () => {
    const a = buildUserNote(draft, user, "x", "signed", now);
    const b = buildUserNote({ ...draft, id: "draft-2" }, user, "x", "signed", now);
    expect(a.id).not.toBe(b.id);
  });
});
