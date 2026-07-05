import { attemptKey } from "./wrapupAttempt";

/** localStorage keys for the demo session (trainee identity + their work). */

export const USER_KEY = "legend-user";

export const userNotesKey = (caseId: string) => `legend-user-notes-${caseId}`;

/** "Always ignore this message" for the delete-note confirm. Device-level
 * preference, deliberately NOT cleared by signOut. */
export const SKIP_DELETE_CONFIRM_KEY = "legend-skip-delete-confirm";

/**
 * Clear the trainee's identity, notes and last feedback attempt, then reload
 * so the sign-in gate shows again. Everything lives in localStorage (not
 * cookies — nothing leaves the browser).
 */
export function signOut(caseId: string) {
  window.localStorage.removeItem(USER_KEY);
  window.localStorage.removeItem(userNotesKey(caseId));
  window.localStorage.removeItem(attemptKey(caseId));
  window.location.reload();
}
