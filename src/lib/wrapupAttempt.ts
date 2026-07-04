import { formatStamp } from "./userNotes";

/** Persistence for the last Wrap-Up submission, shared by App's Sign flow. */

export type StoredAttempt = { text: string; at: string };

export const attemptKey = (caseId: string) => `legend-wrapup-${caseId}`;

/**
 * Store a submission directly (used by Sign, which navigates to Wrap-Up right
 * after). Safe because WrapUpModule remounts on every tab switch and reads
 * localStorage on mount.
 */
export function saveWrapupAttempt(caseId: string, text: string) {
  const attempt: StoredAttempt = { text, at: formatStamp(new Date()) };
  window.localStorage.setItem(attemptKey(caseId), JSON.stringify(attempt));
}

export function parseAttempt(raw: string): StoredAttempt | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredAttempt;
    return typeof parsed.text === "string" && typeof parsed.at === "string"
      ? parsed
      : null;
  } catch {
    return null;
  }
}
