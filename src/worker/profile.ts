import { Hono } from "hono";
import { createAuth } from "./auth";
import { currentPersona, ensureSnapshot, type Persona } from "./persona";

/**
 * Session-gated persona (alias) history. A trainee can occupy several personas
 * over time (forename/surname/grade/hcpId); `user_alias` is the set of every
 * persona they have held, newest first. Switching back to a previous alias is a
 * dedicated route rather than better-auth updateUser, because hcpId is
 * server-owned (additionalFields input:false) and better-auth 400-rejects any
 * updateUser that carries it. Ownership is always the better-auth user id.
 */
type ProfileEnv = { Bindings: Env; Variables: { userId: string } };

export const profile = new Hono<ProfileEnv>();

profile.use("*", async (c, next) => {
  const auth = createAuth(c.env, new URL(c.req.url).origin);
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return c.json({ error: "unauthorized" }, 401);
  c.set("userId", session.user.id);
  await next();
});

profile.get("/profile/aliases", async (c) => {
  const userId = c.get("userId");
  // Seed/record the current persona so it always appears in the list.
  await ensureSnapshot(c.env.DB, userId, await currentPersona(c.env.DB, userId));
  const rows = await c.env.DB.prepare(
    `SELECT id, forename, surname, grade, hcpId, createdAt
     FROM user_alias WHERE userId = ?1 ORDER BY createdAt DESC`,
  )
    .bind(userId)
    .all();
  return c.json({ aliases: rows.results });
});

profile.post("/profile/aliases/switch", async (c) => {
  const raw = (await c.req.json().catch(() => null)) as { aliasId?: unknown } | null;
  if (!raw || typeof raw.aliasId !== "string" || raw.aliasId.length === 0)
    return c.json({ error: "bad request" }, 400);
  const userId = c.get("userId");

  const target = await c.env.DB.prepare(
    `SELECT forename, surname, grade, hcpId FROM user_alias WHERE id = ?1 AND userId = ?2`,
  )
    .bind(raw.aliasId, userId)
    .first<Persona>();
  if (!target) return c.json({ error: "not found" }, 404);

  // Preserve the outgoing persona in history before overwriting the user row,
  // so a switch never loses the alias the trainee is leaving.
  await ensureSnapshot(c.env.DB, userId, await currentPersona(c.env.DB, userId));

  await c.env.DB.prepare(
    `UPDATE user SET forename = ?1, surname = ?2, grade = ?3, hcpId = ?4, updatedAt = ?5 WHERE id = ?6`,
  )
    .bind(target.forename, target.surname, target.grade, target.hcpId, new Date().toISOString(), userId)
    .run();

  return c.json(target);
});
