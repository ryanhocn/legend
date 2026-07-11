import { describe, expect, test } from "vitest";
import { caseRegistry } from "./index";
import { SMART_PHRASES } from "../../lib/smarttext";
import { htmlToPlainText } from "../../lib/noteText";
import { scoreNote } from "../../lib/rubric";
import { applyEvents } from "../../lib/applyEvents";
import { revealEvents } from "../../lib/reveal";
import type { CaseBundle } from "../../types";

const progress = SMART_PHRASES.find((p) => p.id === "PROGRESS")!;

/** The rubric items the PROGRESS autofill scores for `bundle`, as `id: label`. */
function autofillMatches(bundle: CaseBundle): string[] {
  const text = htmlToPlainText(progress.build(bundle, "01/01/2026")).replace(/\*\*\*/g, "");
  return scoreNote(text, bundle.rubric)
    .items.filter((r) => r.matched)
    .map((r) => `${r.item.id}: ${r.item.label}`);
}

/** Every distinct simNow the case can reach: 0, each event `at`, each round `at`, each chronos target. */
function reachableStates(bundle: CaseBundle): number[] {
  const points = new Set<number>([0]);
  for (const e of bundle.events ?? []) points.add(e.at);
  for (const r of bundle.rounds ?? []) points.add(r.at);
  for (const c of bundle.chronos ?? []) points.add(c.targetAt);
  return [...points].sort((a, b) => a - b);
}

/**
 * Scoring-integrity guard for every registered case: the PROGRESS SmartText
 * template auto-embeds real vitals and lab lines, and that text alone must
 * never satisfy a rubric item, at ANY chart state the case can evolve into.
 * If this fails for a new case, tighten the offending trigger with an
 * interpretive word (see the trigger-hygiene note in CASE_AUTHORING.md) rather
 * than weakening this test.
 */
describe("PROGRESS auto-text scores zero rubric items (static bundle)", () => {
  for (const bundle of caseRegistry) {
    test(bundle.id, () => {
      expect(autofillMatches(bundle)).toEqual([]);
    });
  }
});

describe("PROGRESS auto-text stays leak-safe at every reachable dynamic state", () => {
  for (const bundle of caseRegistry.filter((b) => (b.events?.length ?? 0) > 0)) {
    for (const simNow of reachableStates(bundle)) {
      test(`${bundle.id} @ simNow=${simNow}`, () => {
        const live = applyEvents(bundle, revealEvents(bundle.events ?? [], simNow));
        expect(autofillMatches(live)).toEqual([]);
      });
    }
  }
});

describe("authored NPC notes carry none of the case's own rubric answers", () => {
  for (const bundle of caseRegistry.filter((b) => (b.events?.length ?? 0) > 0)) {
    const npcNotes = (bundle.events ?? [])
      .map((e) => e.event)
      .filter((ev): ev is Extract<typeof ev, { kind: "note.create" }> => ev.kind === "note.create")
      .map((ev) => ev.note);
    for (const note of npcNotes) {
      test(`${bundle.id}: ${note.id} scores zero`, () => {
        const matched = scoreNote(note.body, bundle.rubric)
          .items.filter((r) => r.matched)
          .map((r) => r.item.id);
        expect(matched).toEqual([]);
      });
    }
  }
});
