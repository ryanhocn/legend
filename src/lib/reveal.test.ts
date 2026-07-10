import { describe, expect, test } from "vitest";
import type { AuthoredEvent } from "../types";
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
