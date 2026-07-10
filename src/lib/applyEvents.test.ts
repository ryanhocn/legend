import { describe, expect, test } from "vitest";
import type { ClinicalNote } from "../types";
import { getCase } from "../data/patients/index";
import { appendAddendum } from "./userNotes";
import { applyEvents, workToEvents } from "./applyEvents";

const bundle = getCase("cholangitis001");

function userNote(id: string, addendum?: string): ClinicalNote {
  return {
    kind: "note",
    id,
    encounterId: "enc-admission",
    category: "Progress",
    noteType: "Progress Note",
    author: "Ho, Ryan",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "(A) General Surgery",
    dateOfService: "16/06/26 1700",
    fileTime: "16/06/26 1700",
    timestamp: 1781629200,
    status: "signed",
    admission: true,
    body: "user note body",
    addendum,
  };
}

describe("applyEvents identity + immutability", () => {
  test("returns the same reference for no events", () => {
    expect(applyEvents(bundle, [])).toBe(bundle);
  });

  test("never mutates the input bundle", () => {
    const beforeLen = bundle.documents.length;
    const live = applyEvents(bundle, [{ kind: "note.create", note: userNote("u1") }]);
    expect(bundle.documents.length).toBe(beforeLen);
    expect(live.documents).not.toBe(bundle.documents);
  });
});

describe("applyEvents note.create", () => {
  test("appends the note to documents and recomputes notes", () => {
    const note = userNote("u1");
    const live = applyEvents(bundle, [{ kind: "note.create", note }]);
    expect(live.documents.at(-1)).toEqual(note);
    expect(live.notes.at(-1)).toEqual(note);
    expect(live.notes).toEqual(live.documents.filter((d) => d.kind === "note"));
  });
});

describe("applyEvents note.addendum", () => {
  test("appends an addendum block to a static note by id", () => {
    const target = bundle.notes[0];
    const live = applyEvents(bundle, [
      { kind: "note.addendum", noteId: target.id, block: "ADDX" },
    ]);
    const patched = live.documents.find((d) => d.id === target.id) as ClinicalNote;
    expect(patched.addendum).toBe(appendAddendum(target.addendum, "ADDX"));
  });

  test("targets a created user note that carried no addendum", () => {
    const note = userNote("u1");
    const live = applyEvents(bundle, [
      { kind: "note.create", note },
      { kind: "note.addendum", noteId: "u1", block: "ADDX" },
    ]);
    const patched = live.notes.find((n) => n.id === "u1") as ClinicalNote;
    expect(patched.addendum).toBe("ADDX");
  });

  test("ignores an addendum whose target id is absent", () => {
    const live = applyEvents(bundle, [
      { kind: "note.addendum", noteId: "nope", block: "X" },
    ]);
    expect(live.documents.map((d) => d.id)).toEqual(bundle.documents.map((d) => d.id));
  });
});

describe("workToEvents", () => {
  test("emits every note.create before any note.addendum", () => {
    const events = workToEvents([userNote("a"), userNote("b")], { a: "AX" });
    expect(events.map((e) => e.kind)).toEqual(["note.create", "note.create", "note.addendum"]);
  });
});

describe("behaviour preservation vs the old hand-merge", () => {
  test("folded documents and notes deep-equal the old formula", () => {
    const notes = [userNote("u1"), userNote("u2", "static addendum")];
    const addenda: Record<string, string> = {
      [bundle.notes[0].id]: "server addendum on a static note",
      u1: "server addendum on a user note",
    };

    // The exact expressions PatientWorkspace used before this refactor.
    const withAddenda = <T extends ClinicalNote>(note: T): T =>
      addenda[note.id]
        ? { ...note, addendum: appendAddendum(note.addendum, addenda[note.id]) }
        : note;
    const oldDocuments = [
      ...bundle.documents.map((doc) => (doc.kind === "note" ? withAddenda(doc) : doc)),
      ...notes.map(withAddenda),
    ];
    const oldNotes = [...bundle.notes.map(withAddenda), ...notes.map(withAddenda)];

    const live = applyEvents(bundle, workToEvents(notes, addenda));
    expect(live.documents).toEqual(oldDocuments);
    expect(live.notes).toEqual(oldNotes);
  });
});
