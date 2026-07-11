import type { CaseTask, ClinicalNote, RoundSpec } from "../types";
import { currentRound } from "./rounds";

/**
 * The singleplayer "what should I write now" hint. A dynamic case shows the
 * current round's job, marked done once a trainee note covers that round's
 * encounter (so the banner can hide/advance). A static case (no rounds) shows
 * the case's standing task, never auto-done. Pure; no React.
 */
export function nextJob(args: {
  rounds: RoundSpec[];
  simNow: number;
  userNotes: ClinicalNote[];
  task: CaseTask;
}): { label: string; done: boolean } {
  const { rounds, simNow, userNotes, task } = args;
  const round = currentRound(rounds, simNow);
  if (round) {
    const done = userNotes.some((n) => n.encounterId === round.encounterId);
    return { label: round.label, done };
  }
  // No round reached yet, or a static case: fall back to the standing task.
  return { label: task.label, done: false };
}
