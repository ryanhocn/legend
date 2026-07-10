import { env } from "cloudflare:test";
import { applySetCookies } from "better-auth/cookies";
import { describe, expect, test } from "vitest";
import { createAuth } from "./auth";

describe("anonymous sign-in", () => {
  test("creates a user with a server-generated hcpId and isAnonymous", async () => {
    const auth = createAuth(env as unknown as Env, "http://localhost");
    const res = await auth.api.signInAnonymous();
    expect(res?.user).toBeTruthy();
    const row = await env.DB.prepare("SELECT hcpId, isAnonymous FROM user WHERE id = ?")
      .bind(res!.user.id)
      .first<{ hcpId: string; isAnonymous: number }>();
    expect(row?.hcpId).toMatch(/^d9\d+$/);
    expect(row?.isAnonymous).toBe(1);
  });

  test("updateUser cannot overwrite the server-generated hcpId", async () => {
    const auth = createAuth(env as unknown as Env, "http://localhost");

    // Sign in and keep the response headers so we can replay the session
    // cookie on the follow-up request (an authenticated call needs the
    // session cookie, not just a bare function call).
    const signIn = await auth.api.signInAnonymous({ returnHeaders: true });
    const userId = signIn.response.user.id;

    const before = await env.DB.prepare("SELECT hcpId FROM user WHERE id = ?")
      .bind(userId)
      .first<{ hcpId: string }>();
    const originalHcpId = before?.hcpId;
    expect(originalHcpId).toMatch(/^d9\d{5}$/);

    const cookieHeaders = new Headers();
    applySetCookies(cookieHeaders, signIn.headers.getSetCookie());
    const cookie = cookieHeaders.get("cookie");
    expect(cookie).toBeTruthy();

    // Drive the raw HTTP surface rather than auth.api.updateUser: hcpId is
    // declared `input: false` in createAuth's additionalFields, so
    // TypeScript already excludes it from the typed updateUser body — the
    // HTTP surface is what an attacker who ignores our types would actually
    // hit. better-auth's parseInputData (db/schema.mjs) rejects the whole
    // request with BAD_REQUEST when a input:false field is present and truthy,
    // rather than silently stripping it.
    const res = await auth.handler(
      new Request("http://localhost/api/auth/update-user", {
        method: "POST",
        headers: { "content-type": "application/json", origin: "http://localhost", cookie: cookie! },
        body: JSON.stringify({
          forename: "Mallory",
          surname: "Attacker",
          grade: "consultant",
          hcpId: "d900001",
        }),
      }),
    );
    expect(res.status).toBe(400);

    const after = await env.DB.prepare("SELECT hcpId, forename FROM user WHERE id = ?")
      .bind(userId)
      .first<{ hcpId: string; forename: string | null }>();
    expect(after?.hcpId).toBe(originalHcpId);
    expect(after?.hcpId).toMatch(/^d9\d{5}$/);
    // The whole request was rejected, so the legitimate fields never applied either.
    expect(after?.forename).not.toBe("Mallory");
  });
});
