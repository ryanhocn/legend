import { currentPersona } from "./persona";

/**
 * Move a guest's work to the account they just linked. Runs inside
 * onLinkAccount, BEFORE the anonymous plugin deletes the anonymous user
 * (whose deletion would cascade the rows away). UPDATE OR REPLACE on
 * wrapup_attempt: if the target account already has an attempt for the same
 * case, the guest's (their live session's) attempt wins. Alias history moves
 * too, and the outgoing guest persona becomes the linked account's DEFAULT
 * identity (forename/surname/grade/hcpId written onto the user row), not a
 * snapshotted "previous alias".
 */
export async function rekeyUserWork(
  db: D1Database,
  fromUserId: string,
  toUserId: string,
): Promise<void> {
  // Read the guest persona while its user row still exists.
  const outgoing = await currentPersona(db, fromUserId);
  await db.batch([
    db.prepare(`UPDATE user_note SET userId = ?2 WHERE userId = ?1`).bind(fromUserId, toUserId),
    db.prepare(`UPDATE note_addendum SET userId = ?2 WHERE userId = ?1`).bind(fromUserId, toUserId),
    db
      .prepare(`UPDATE OR REPLACE wrapup_attempt SET userId = ?2 WHERE userId = ?1`)
      .bind(fromUserId, toUserId),
    db
      .prepare(`UPDATE OR REPLACE case_session SET scope = ?2 WHERE scope = ?1`)
      .bind(fromUserId, toUserId),
    db.prepare(`UPDATE user_alias SET userId = ?2 WHERE userId = ?1`).bind(fromUserId, toUserId),
  ]);
  // The guest already chose a full persona at "Start training", so make it the
  // linked account's DEFAULT identity rather than demoting it to a "previous
  // alias". hcpId has no UNIQUE constraint (migration 0001), so copying it while
  // the guest row still exists is safe. If the guest somehow has no hcpId, leave
  // the row untouched and let the normal persona-setup screen run.
  if (outgoing && outgoing.hcpId) {
    await db
      .prepare(`UPDATE user SET forename = ?2, surname = ?3, grade = ?4, hcpId = ?5 WHERE id = ?1`)
      .bind(toUserId, outgoing.forename, outgoing.surname, outgoing.grade, outgoing.hcpId)
      .run();
  }
}
