import { Hono } from "hono";
import { createAuth } from "./auth";

/**
 * Session-gated per-case sim clock (Model B). Stores only the clock
 * (`case_session.simNow`, a sim-offset in seconds from the case anchor); the
 * client reveals its own authored events by this cursor. Scope is the
 * better-auth user id today (fork D: the column is named `scope` so multiplayer
 * becomes a value change, not a migration).
 */
type SessionEnv = { Bindings: Env; Variables: { userId: string } };

export const session = new Hono<SessionEnv>();

session.use("*", async (c, next) => {
  const auth = createAuth(c.env, new URL(c.req.url).origin);
  const s = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!s) return c.json({ error: "unauthorized" }, 401);
  c.set("userId", s.user.id);
  await next();
});

session.get("/cases/:caseId/session", async (c) => {
  const scope = c.get("userId");
  const caseId = c.req.param("caseId");
  const row = await c.env.DB.prepare(
    `SELECT simNow FROM case_session WHERE scope = ?1 AND caseId = ?2`,
  )
    .bind(scope, caseId)
    .first<{ simNow: number }>();
  if (row) return c.json({ simNow: row.simNow });
  // Lazily create the clock at simNow = 0 on first read, then re-read. The
  // INSERT no-ops on conflict, so after it the row always exists; the re-SELECT
  // returns whatever value actually landed (ours, or a concurrent create/write),
  // never a stale hardcoded 0.
  await c.env.DB.prepare(
    `INSERT INTO case_session (scope, caseId, simNow, updatedAt) VALUES (?1, ?2, 0, ?3)
     ON CONFLICT (scope, caseId) DO NOTHING`,
  )
    .bind(scope, caseId, Date.now())
    .run();
  const created = await c.env.DB.prepare(
    `SELECT simNow FROM case_session WHERE scope = ?1 AND caseId = ?2`,
  )
    .bind(scope, caseId)
    .first<{ simNow: number }>();
  return c.json({ simNow: created?.simNow ?? 0 });
});

session.put("/cases/:caseId/session", async (c) => {
  const raw = (await c.req.json().catch(() => null)) as { simNow?: unknown } | null;
  if (!raw || typeof raw.simNow !== "number" || !Number.isFinite(raw.simNow) || raw.simNow < 0)
    return c.json({ error: "bad request" }, 400);
  const simNow = Math.floor(raw.simNow);
  await c.env.DB.prepare(
    `INSERT INTO case_session (scope, caseId, simNow, updatedAt) VALUES (?1, ?2, ?3, ?4)
     ON CONFLICT (scope, caseId) DO UPDATE SET simNow = ?3, updatedAt = ?4`,
  )
    .bind(c.get("userId"), c.req.param("caseId"), simNow, Date.now())
    .run();
  return c.json({ simNow });
});
