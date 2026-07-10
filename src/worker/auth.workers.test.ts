import { env } from "cloudflare:test";
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
});
