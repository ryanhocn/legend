import { authClient } from "./authClient";

/** localStorage keys for the demo session (trainee identity + their work). */

export const USER_KEY = "legend-user";

export const userNotesKey = (caseId: string) => `legend-user-notes-${caseId}`;

export const addendaKey = (caseId: string) => `legend-addenda-${caseId}`;

/** "Always ignore this message" for the delete-note confirm. Device-level
 * preference, deliberately NOT cleared by signOut. */
export const SKIP_DELETE_CONFIRM_KEY = "legend-skip-delete-confirm";

/**
 * End the better-auth session, then clear the trainee's work on every case
 * (notes, feedback attempts, sticky notes) and reload so the sign-in gate
 * shows again. Everything besides the session lives in localStorage — sweeps
 * by prefix so new per-case keys never need registering here; the one
 * deliberate survivor is the device-level delete-confirm preference.
 */
export async function signOut() {
  await authClient.signOut();
  const doomed = Object.keys(window.localStorage).filter(
    (key) => key.startsWith("legend") && key !== SKIP_DELETE_CONFIRM_KEY,
  );
  doomed.forEach((key) => window.localStorage.removeItem(key));
  window.location.reload();
}
