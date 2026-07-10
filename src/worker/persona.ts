/**
 * Persona (alias) helpers shared by the profile router and the guest-link
 * re-key. Lives in its own module because profile.ts imports auth.ts and
 * auth.ts imports rekey.ts — rekey importing profile would close a cycle.
 */

export type Persona = {
  forename: string | null;
  surname: string | null;
  grade: string | null;
  hcpId: string;
};

/** Read the authoritative current persona straight off the user row. */
export function currentPersona(db: Env["DB"], userId: string) {
  return db
    .prepare(`SELECT forename, surname, grade, hcpId FROM user WHERE id = ?1`)
    .bind(userId)
    .first<Persona>();
}

function samePersona(a: Persona, b: Persona): boolean {
  return (
    a.forename === b.forename &&
    a.surname === b.surname &&
    a.grade === b.grade &&
    a.hcpId === b.hcpId
  );
}

/**
 * Ensure the given persona is recorded in the alias set. Deduped against the
 * whole set (not just the newest row) so toggling between two aliases never
 * grows duplicate rows. No-ops when the persona has no hcpId (unreachable for a
 * real user: the create hook always assigns one).
 */
export async function ensureSnapshot(
  db: Env["DB"],
  userId: string,
  persona: Persona | null,
): Promise<void> {
  if (!persona || !persona.hcpId) return;
  const existing = await db
    .prepare(`SELECT forename, surname, grade, hcpId FROM user_alias WHERE userId = ?1`)
    .bind(userId)
    .all<Persona>();
  if (existing.results.some((row) => samePersona(row, persona))) return;
  await db
    .prepare(
      `INSERT INTO user_alias (id, userId, forename, surname, grade, hcpId, createdAt)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)`,
    )
    .bind(crypto.randomUUID(), userId, persona.forename, persona.surname, persona.grade, persona.hcpId, Date.now())
    .run();
}
