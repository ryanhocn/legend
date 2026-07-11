import { describe, expect, test } from "vitest";
import type { AuthoredEvent, ClinicalNote } from "../types";
import { revealEvents } from "./reveal";

function authored(at: number, seq: number, id: string): AuthoredEvent {
  return { at, seq, event: { kind: "flag.set", key: id, value: true } };
}

describe("revealEvents", () => {
  test("empty authored list yields no events", () => {
    expect(revealEvents([], 10_000)).toEqual([]);
  });

  test("reveals only events whose at <= simNow", () => {
    const list = [authored(3600, 1, "a"), authored(7200, 2, "b"), authored(10_800, 3, "c")];
    const out = revealEvents(list, 7200);
    expect(out.map((e) => (e.kind === "flag.set" ? e.key : ""))).toEqual(["a", "b"]);
  });

  test("at 0 reveals only events scheduled at or before 0", () => {
    const list = [authored(0, 1, "now"), authored(1, 2, "later")];
    expect(revealEvents(list, 0).map((e) => (e.kind === "flag.set" ? e.key : ""))).toEqual(["now"]);
  });

  test("orders revealed events by seq regardless of input order", () => {
    const list = [authored(100, 3, "third"), authored(100, 1, "first"), authored(100, 2, "second")];
    expect(revealEvents(list, 100).map((e) => (e.kind === "flag.set" ? e.key : ""))).toEqual([
      "first",
      "second",
      "third",
    ]);
  });

  test("does not mutate the input array", () => {
    const list = [authored(100, 2, "b"), authored(100, 1, "a")];
    const snapshot = list.map((e) => e.seq);
    revealEvents(list, 100);
    expect(list.map((e) => e.seq)).toEqual(snapshot);
  });
});

function npcNote(id: string, encounterId: string): ClinicalNote {
  return {
    kind: "note",
    id,
    encounterId,
    category: "Progress",
    noteType: "Progress Note",
    author: "Team, NPC",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "(A) General Surgery",
    dateOfService: "17/06/26 0800",
    fileTime: "17/06/26 0800",
    timestamp: 1781683200,
    status: "signed",
    body: "Day 2 progress.",
  };
}

function authoredNote(at: number, seq: number, id: string, encounterId: string): AuthoredEvent {
  return { at, seq, event: { kind: "note.create", note: npcNote(id, encounterId) } };
}

describe("revealEvents NPC suppression", () => {
  test("suppresses a note.create whose encounterId is already covered", () => {
    const list = [authoredNote(100, 1, "npc-d2", "enc-ward-round-d2")];
    const out = revealEvents(list, 100, new Set(["enc-ward-round-d2"]));
    expect(out).toEqual([]);
  });

  test("reveals the NPC note when the round is not covered", () => {
    const list = [authoredNote(100, 1, "npc-d2", "enc-ward-round-d2")];
    const out = revealEvents(list, 100, new Set(["enc-admission"]));
    expect(out.map((e) => (e.kind === "note.create" ? e.note.id : ""))).toEqual(["npc-d2"]);
  });

  test("suppression never drops non-note events", () => {
    const list = [authored(100, 1, "flag-a"), authoredNote(100, 2, "npc-d2", "enc-ward-round-d2")];
    const out = revealEvents(list, 100, new Set(["enc-ward-round-d2"]));
    expect(out.map((e) => e.kind)).toEqual(["flag.set"]);
  });

  test("omitting coveredEncounterIds reveals everything (back-compat)", () => {
    const list = [authoredNote(100, 1, "npc-d2", "enc-ward-round-d2")];
    expect(revealEvents(list, 100).length).toBe(1);
  });
});
