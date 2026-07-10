import type { AuthoredEvent, CaseEvent } from "../types";

/**
 * The client reveal rail (Model B): given a case's authored sim-events and the
 * current sim-clock, return the CaseEvents whose reveal time has arrived, in
 * deterministic fold order (by seq). Pure: no wall-clock, no server, no
 * mutation of the input. `revealEvents([], n)` is `[]`, so a static case (no
 * events.ts) folds to nothing and renders exactly as today.
 */
export function revealEvents(authored: AuthoredEvent[], simNow: number): CaseEvent[] {
  return authored
    .filter((entry) => entry.at <= simNow)
    .sort((a, b) => a.seq - b.seq)
    .map((entry) => entry.event);
}
