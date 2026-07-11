import { authClient } from "./authClient";

/** "Always ignore this message" for the delete-note confirm. Device-level
 * preference, deliberately NOT cleared by signOut. */
export const SKIP_DELETE_CONFIRM_KEY = "legend-skip-delete-confirm";

/** "Hide the next-job hint" global device toggle; like the delete-confirm pref,
 * a UI preference deliberately NOT cleared by signOut. */
export const NEXT_JOB_HIDE_KEY = "legend.hideNextJob";

/**
 * End the better-auth session, then sweep every `legend*` localStorage key
 * (sticky notes and other client-side scratch) and reload so the sign-in
 * gate shows again. Notes, feedback attempts, and addenda are server-side
 * now and are untouched by this — sweeps by prefix so new per-case keys
 * never need registering here; the deliberate survivors are the device-level
 * delete-confirm and next-job-hint preferences.
 */
export async function signOut() {
  await authClient.signOut();
  const doomed = Object.keys(window.localStorage).filter(
    (key) =>
      key.startsWith("legend") &&
      key !== SKIP_DELETE_CONFIRM_KEY &&
      key !== NEXT_JOB_HIDE_KEY,
  );
  doomed.forEach((key) => window.localStorage.removeItem(key));
  window.location.reload();
}
