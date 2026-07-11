import type { AuthoredEvent, CaseEvent } from "../types";

const NO_COVERAGE: ReadonlySet<string> = new Set();

/**
 * The client reveal rail (Model B): given a case's authored sim-events and the
 * current sim-clock, return the CaseEvents whose reveal time has arrived, in
 * deterministic fold order (by seq). An authored `note.create` (an NPC round
 * note) is suppressed when the round's encounterId is already covered by the
 * trainee's own work (spec §9: exactly one note per round). Pure: no wall-clock,
 * no server, no mutation of the input. `revealEvents([], n)` is `[]`, so a static
 * case (no events.ts) folds to nothing and renders exactly as today.
 */
export function revealEvents(
  authored: AuthoredEvent[],
  simNow: number,
  coveredEncounterIds: ReadonlySet<string> = NO_COVERAGE,
): CaseEvent[] {
  return authored
    .filter((entry) => entry.at <= simNow)
    .sort((a, b) => a.seq - b.seq)
    .map((entry) => entry.event)
    .filter(
      (event) =>
        !(event.kind === "note.create" && coveredEncounterIds.has(event.note.encounterId)),
    );
}
