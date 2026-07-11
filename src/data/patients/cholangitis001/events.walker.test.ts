import { describe, expect, test } from "vitest";
import { getCase } from "../index";
import { applyEvents } from "../../../lib/applyEvents";
import { revealEvents } from "../../../lib/reveal";

const bundle = getCase("cholangitis001");
const events = bundle.events ?? [];
const rounds = bundle.rounds ?? [];
const chronos = bundle.chronos ?? [];

/** All distinct sim states the case can reach. */
const states = [
  ...new Set<number>([
    0,
    ...events.map((e) => e.at),
    ...rounds.map((r) => r.at),
    ...chronos.map((c) => c.targetAt),
  ]),
].sort((a, b) => a - b);

describe("cholangitis001 timeline walker", () => {
  test("the case is dynamic (events, rounds and chronos are authored)", () => {
    expect(events.length).toBeGreaterThan(0);
    expect(rounds.length).toBeGreaterThan(0);
    expect(chronos.length).toBeGreaterThan(0);
  });

  test("seq is strictly monotonic and consistent with at", () => {
    const seqs = events.map((e) => e.seq);
    expect(new Set(seqs).size).toBe(seqs.length); // unique
    const byAt = [...events].sort((a, b) => a.at - b.at || a.seq - b.seq);
    expect(byAt.map((e) => e.seq)).toEqual([...seqs].sort((a, b) => a - b));
  });

  test("every authored document and NPC note is reachable at the final state", () => {
    const finalNow = states[states.length - 1];
    const live = applyEvents(bundle, revealEvents(events, finalNow));
    const docIds = new Set(live.documents.map((d) => d.id));
    for (const e of events) {
      if (e.event.kind === "result.release") expect(docIds.has(e.event.document.id)).toBe(true);
      if (e.event.kind === "note.create") expect(docIds.has(e.event.note.id)).toBe(true);
    }
  });

  test("no released result references a missing encounter at any reachable state", () => {
    for (const simNow of states) {
      const live = applyEvents(bundle, revealEvents(events, simNow));
      const encIds = new Set(live.encounters.map((enc) => enc.id));
      for (const doc of live.documents) {
        expect(encIds.has(doc.encounterId), `doc ${doc.id} @ ${simNow}`).toBe(true);
      }
    }
  });

  test("simNow only ever moves forward across the reachable states", () => {
    for (let i = 1; i < states.length; i += 1) expect(states[i]).toBeGreaterThan(states[i - 1]);
  });

  test("a trainee note covering a round suppresses that round's NPC note", () => {
    // Skip day 2 (no user note for enc-ward-round-d2): its NPC note appears once past it.
    const skipped = revealEvents(events, 208800, new Set(["enc-admission"]));
    const skippedIds = skipped
      .filter((e) => e.kind === "note.create")
      .map((e) => (e.kind === "note.create" ? e.note.id : ""));
    expect(skippedIds).toContain("npc-prog-d2");

    // Cover day 2 with a trainee note: the NPC day-2 note is suppressed.
    const covered = revealEvents(events, 208800, new Set(["enc-ward-round-d2"]));
    const coveredIds = covered
      .filter((e) => e.kind === "note.create")
      .map((e) => (e.kind === "note.create" ? e.note.id : ""));
    expect(coveredIds).not.toContain("npc-prog-d2");
    expect(coveredIds).toContain("npc-prog-d3");
  });

  test("every chronos target lands on an authored event `at`", () => {
    const eventAts = new Set(events.map((e) => e.at));
    for (const intent of chronos) expect(eventAts.has(intent.targetAt)).toBe(true);
  });

  test("every round encounter is present in the folded chart at the final state (except round 0's static admission)", () => {
    const finalNow = states[states.length - 1];
    const live = applyEvents(bundle, revealEvents(events, finalNow, new Set(["enc-admission"])));
    const encIds = new Set(live.encounters.map((enc) => enc.id));
    for (const round of rounds) {
      // Rounds with an NPC note reveal a note whose encounter matches; round 0 reuses enc-admission.
      if (round.npcNoteId) {
        const npc = live.documents.find((d) => d.id === round.npcNoteId);
        expect(npc, `NPC note ${round.npcNoteId}`).toBeTruthy();
        expect(npc?.encounterId).toBe(round.encounterId);
      } else {
        expect(encIds.has(round.encounterId)).toBe(true);
      }
    }
  });
});
