import { formatStamp } from "./userNotes";

/** Persistence for the last Wrap-Up submission, shared by App's Sign flow. */

/**
 * `signed` records whether the scored text was a committed clinical act (a
 * signed note) or merely a draft submitted for practice feedback. The overreach
 * -1000 penalty is a consequence of *signing* above your competence, so it only
 * applies when `signed` is true — drafts and reopened-incomplete notes learn
 * from the normal rubric report instead.
 */
export type StoredAttempt = { text: string; at: string; signed: boolean };

export const attemptKey = (caseId: string) => `legend-wrapup-${caseId}`;

/**
 * Store a submission directly (used by Sign, which navigates to Wrap-Up right
 * after). Safe because WrapUpModule remounts on every tab switch and reads
 * localStorage on mount. Only Sign calls this, so the attempt is always signed.
 */
export function saveWrapupAttempt(caseId: string, text: string) {
  const attempt: StoredAttempt = { text, at: formatStamp(new Date()), signed: true };
  window.localStorage.setItem(attemptKey(caseId), JSON.stringify(attempt));
}

export function parseAttempt(raw: string): StoredAttempt | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<StoredAttempt>;
    return typeof parsed.text === "string" && typeof parsed.at === "string"
      ? { text: parsed.text, at: parsed.at, signed: parsed.signed === true }
      : null;
  } catch {
    return null;
  }
}
