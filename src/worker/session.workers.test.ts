import { applySetCookies } from "better-auth/cookies";
import { createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { env } from "cloudflare:test";
import { describe, expect, test } from "vitest";
import { createAuth } from "./auth";
import worker from "./index";

async function anonCookie(): Promise<string> {
  const auth = createAuth(env as unknown as Env, "http://localhost");
  const signIn = await auth.api.signInAnonymous({ returnHeaders: true });
  const h = new Headers();
  applySetCookies(h, signIn.headers.getSetCookie());
  const cookie = h.get("cookie");
  if (!cookie) throw new Error("no session cookie");
  return cookie;
}

async function callWorker(path: string, init?: RequestInit): Promise<Response> {
  const ctx = createExecutionContext();
  const res = await worker.fetch(
    new Request(`http://localhost${path}`, init) as Parameters<typeof worker.fetch>[0],
    env as unknown as Env,
    ctx,
  );
  await waitOnExecutionContext(ctx);
  return res as unknown as Response;
}

describe("case_session schema", () => {
  test("deleting a user cascades to their case_session rows", async () => {
    const auth = createAuth(env as unknown as Env, "http://localhost");
    const userId = (await auth.api.signInAnonymous())!.user.id;

    await env.DB.prepare(
      `INSERT INTO case_session (scope, caseId, simNow, updatedAt) VALUES (?1, 'cholangitis001', 3600, 1)`,
    ).bind(userId).run();

    await env.DB.prepare(`DELETE FROM user WHERE id = ?1`).bind(userId).run();

    const row = await env.DB.prepare(
      `SELECT COUNT(*) AS n FROM case_session WHERE scope = ?1`,
    ).bind(userId).first<{ n: number }>();
    expect(row?.n).toBe(0);
  });
});

describe("GET /api/cases/:caseId/session", () => {
  test("401 without a session", async () => {
    const res = await callWorker("/api/cases/cholangitis001/session");
    expect(res.status).toBe(401);
  });

  test("lazily creates the clock at simNow 0 for a fresh user", async () => {
    const cookie = await anonCookie();
    const res = await callWorker("/api/cases/cholangitis001/session", { headers: { cookie } });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ simNow: 0 });
  });
});

describe("PUT /api/cases/:caseId/session", () => {
  test("sets simNow and reads back, last-write-wins", async () => {
    const cookie = await anonCookie();
    const put = (simNow: number) =>
      callWorker("/api/cases/cholangitis001/session", {
        method: "PUT",
        headers: { cookie, "content-type": "application/json" },
        body: JSON.stringify({ simNow }),
      });
    expect((await put(3600)).status).toBe(200);
    expect(await (await put(7200)).json()).toEqual({ simNow: 7200 });

    const res = await callWorker("/api/cases/cholangitis001/session", { headers: { cookie } });
    expect(await res.json()).toEqual({ simNow: 7200 });
  });

  test("400 on a non-numeric or negative simNow", async () => {
    const cookie = await anonCookie();
    const bad = (body: unknown) =>
      callWorker("/api/cases/cholangitis001/session", {
        method: "PUT",
        headers: { cookie, "content-type": "application/json" },
        body: JSON.stringify(body),
      });
    expect((await bad({ simNow: "nope" })).status).toBe(400);
    expect((await bad({ simNow: -1 })).status).toBe(400);
    expect((await bad({})).status).toBe(400);
  });

  test("one user's clock is invisible to another", async () => {
    const cookieA = await anonCookie();
    const cookieB = await anonCookie();
    await callWorker("/api/cases/cholangitis001/session", {
      method: "PUT",
      headers: { cookie: cookieA, "content-type": "application/json" },
      body: JSON.stringify({ simNow: 9000 }),
    });
    const res = await callWorker("/api/cases/cholangitis001/session", { headers: { cookie: cookieB } });
    expect(await res.json()).toEqual({ simNow: 0 });
  });
});
