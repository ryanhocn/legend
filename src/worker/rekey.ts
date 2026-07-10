/**
 * Move a guest's work to the account they just linked. Runs inside
 * onLinkAccount, BEFORE the anonymous plugin deletes the anonymous user
 * (whose deletion would cascade the rows away). UPDATE OR REPLACE on
 * wrapup_attempt: if the target account already has an attempt for the same
 * case, the guest's (their live session's) attempt wins.
 */
export async function rekeyUserWork(
  db: D1Database,
  fromUserId: string,
  toUserId: string,
): Promise<void> {
  await db.batch([
    db.prepare(`UPDATE user_note SET userId = ?2 WHERE userId = ?1`).bind(fromUserId, toUserId),
    db.prepare(`UPDATE note_addendum SET userId = ?2 WHERE userId = ?1`).bind(fromUserId, toUserId),
    db
      .prepare(`UPDATE OR REPLACE wrapup_attempt SET userId = ?2 WHERE userId = ?1`)
      .bind(fromUserId, toUserId),
  ]);
}
