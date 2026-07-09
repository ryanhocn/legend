# PLAN: Phase 1 — Worker + Hono /api foundation

> Implementation plan for the backend pivot's first phase (decision record in STATUS.md, researched 2026-07-09). Written for a fresh implementer with no prior context. Planner is not the implementer.

## Approach

Turn the static-assets-only Cloudflare deploy into the documented "SPA + API Worker" shape without touching any React code: add a `main` Worker script (Hono, `basePath("/api")`), route only `/api/*` through it via `assets.run_worker_first`, provision the D1 database now (phase 2's better-auth needs it, and a `SELECT 1` through the binding proves the whole chain), and adopt `@cloudflare/vite-plugin` so `npm run dev` serves SPA + Worker + local D1 in one process. Dev/prod routing parity matters most in phase 2 (auth cookies), which is why the plugin wins over a two-process `wrangler dev` + Vite proxy setup; rollback is one line in `vite.config.ts` plus restoring `assets.directory`.

Facts the implementer must not re-litigate (verified against installed wrangler 4.107 schema and current npm/docs, 2026-07-09):
- `run_worker_first: ["/api/*"]` array syntax is supported; no `assets.binding` needed when the Worker only serves `/api/*`.
- `@cloudflare/vite-plugin` (1.43.x) supports Vite 8 but requires **wrangler >= 4.109** — the repo has 4.107, so the bump is mandatory (T1).
- `nodejs_compat` goes in now: zero cost unused, needed by better-auth in phase 2, and adding it later means debugging two changes at once.
- Env types come from `wrangler types` (generates `worker-configuration.d.ts`, committed), NOT `@cloudflare/workers-types` — that package is for libraries now.
- Hono's `app.request()` tests routes in plain node vitest (mock bindings as third arg); `@cloudflare/vitest-pool-workers` is deferred to phase 2 when tests need real D1.
- D1 migrations (`wrangler d1 migrations create/apply --local|--remote`) start in phase 2 with the first real table. No placeholder migration in phase 1 (YAGNI).

Global constraints:
- Do not modify any file under `src/` except the new `src/worker/` directory; the SPA is untouched this phase.
- `npm run lint` carries ONE pre-existing error (StickyNotePopup.tsx, react-hooks/immutability). Acceptance is "no NEW errors", not zero.
- Commit after every task (see the hard-reset warning in STATUS.md). Never `git push` or deploy without Ryan's explicit go.
- Windows/PowerShell environment; commands below are shell-neutral npm/npx.

## Tasks (bite-sized, ordered, independently verifiable)

### T1: Dependencies + mandatory wrangler bump
- Files: `package.json`, `package-lock.json`
- Change:
  ```bash
  npm install -D wrangler@latest @cloudflare/vite-plugin @types/node
  npm install hono
  ```
  Then add two scripts to `package.json`:
  ```jsonc
  "deploy": "npm run build && wrangler deploy",
  "cf-typegen": "wrangler types"
  ```
- Verify: `npx wrangler --version` prints >= 4.109.0. `npm ls @cloudflare/vite-plugin hono` shows no peer-dep errors. `npm test` still green (baseline count before any config change; record the number).
- Depends on: none

### T2: Isolate vitest from the upcoming Cloudflare plugin
- Files: create `vitest.config.ts`
- Change: when `vitest.config.ts` exists, vitest ignores `vite.config.ts` entirely — so the Cloudflare plugin added in T4 can never leak into the node test pool.
  ```ts
  import { defineConfig } from "vitest/config";

  // Vitest must not load vite.config.ts once the Cloudflare plugin lives there:
  // the workerd dev server has no business inside the node test pool.
  export default defineConfig({
    test: { environment: "node" },
  });
  ```
- Verify: `npm test` — same test count and all green as the T1 baseline (default include pattern covers all existing `src/**/*.test.ts`).
- Commit: `git commit -m "Test config: pin vitest to its own config ahead of the Cloudflare vite plugin"`
- Depends on: T1

### T3: D1 database + wrangler.jsonc rewrite + Hono worker (TDD)
- Files: `wrangler.jsonc`, create `src/worker/index.ts`, create `src/worker/health.test.ts`, generated `worker-configuration.d.ts` (commit it)
- Interfaces produced: default export = Hono app with `basePath("/api")`; global `Env` type with `DB: D1Database` (ambient via `worker-configuration.d.ts`); route `GET /api/health` -> `200 {"ok": true, "db": boolean}`.
- Change, in order:
  1. Provision the database (needs `npx wrangler login` already done — it is, the site deploys via this account):
     ```bash
     npx wrangler d1 create legend-db
     ```
     Copy the printed `database_id`.
  2. Write the failing test `src/worker/health.test.ts`:
     ```ts
     import { expect, test } from "vitest";
     import app from "./index";

     const liveDb = {
       prepare: () => ({ first: async () => ({ ok: 1 }) }),
     };
     const brokenDb = {
       prepare: () => {
         throw new Error("no db");
       },
     };

     test("GET /api/health reports ok with a live DB binding", async () => {
       const res = await app.request("/api/health", {}, { DB: liveDb } as unknown as Env);
       expect(res.status).toBe(200);
       expect(await res.json()).toEqual({ ok: true, db: true });
     });

     test("GET /api/health degrades db to false when the binding fails", async () => {
       const res = await app.request("/api/health", {}, { DB: brokenDb } as unknown as Env);
       expect(res.status).toBe(200);
       expect(await res.json()).toEqual({ ok: true, db: false });
     });
     ```
     Run `npm test` — the new file FAILS (cannot resolve `./index`). Existing tests stay green.
  3. Implement `src/worker/index.ts`:
     ```ts
     import { Hono } from "hono";

     const app = new Hono<{ Bindings: Env }>().basePath("/api");

     app.get("/health", async (c) => {
       let db = false;
       try {
         const row = await c.env.DB.prepare("SELECT 1 AS ok").first<{ ok: number }>();
         db = row?.ok === 1;
       } catch {
         // Health must answer even when the DB binding is missing or broken.
       }
       return c.json({ ok: true, db });
     });

     export default app;
     ```
  4. Rewrite `wrangler.jsonc` (note: `assets.directory` is REMOVED — the vite plugin manages output; `database_id` is the value from step 1):
     ```jsonc
     {
       "$schema": "./node_modules/wrangler/config-schema.json",
       "name": "legend",
       "main": "./src/worker/index.ts",
       "compatibility_date": "2026-07-01",
       "compatibility_flags": ["nodejs_compat"],
       "assets": {
         "not_found_handling": "single-page-application",
         "run_worker_first": ["/api/*"]
       },
       "d1_databases": [
         {
           "binding": "DB",
           "database_name": "legend-db",
           "database_id": "<uuid from wrangler d1 create>"
         }
       ]
     }
     ```
  5. Generate the Env types: `npm run cf-typegen` -> `worker-configuration.d.ts` at the repo root (contains `interface Env { DB: D1Database }` plus runtime globals). Confirm `.gitignore` does NOT ignore it, and DOES ignore `.wrangler/` (add `.wrangler/` if absent — but `.gitignore` currently carries unrelated uncommitted edits; add the line without staging those edits, i.e. `git add -p .gitignore`).
- Verify: `npm test` — both new tests PASS, all prior tests green.
- Commit: `git commit -m "Worker foundation: Hono /api app, D1 binding, health route with DB probe"`
- Depends on: T1, T2

### T4: Single-process dev — Cloudflare vite plugin
- Files: `vite.config.ts`
- Change:
  ```ts
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'
  import { cloudflare } from '@cloudflare/vite-plugin'

  // https://vite.dev/config/
  export default defineConfig({
    plugins: [react(), cloudflare()],
  })
  ```
  The plugin reads `wrangler.jsonc` (zero config) and runs the Worker in real workerd with local D1 (state shared with wrangler CLI in `.wrangler/state`).
- Verify: `npm run dev`, then in a second terminal:
  - `curl http://localhost:5173/api/health` -> `{"ok":true,"db":true}` (local D1 answers `SELECT 1` with no migrations needed)
  - Open http://localhost:5173 -> sign-in page renders, open a chart, SPA behaves as before (HMR intact).
  - `npm test` still green (vitest ignores this file per T2).
- Commit: `git commit -m "Dev workflow: Cloudflare vite plugin serves SPA + worker + local D1 in one process"`
- Depends on: T3

### T5: TypeScript project wiring + build shape
- Files: create `tsconfig.worker.json`, modify `tsconfig.json`, modify `tsconfig.app.json`
- Change:
  1. `tsconfig.worker.json` — mirrors `tsconfig.app.json` minus DOM, plus node (for `nodejs_compat`) and the generated Env globals:
     ```jsonc
     {
       "compilerOptions": {
         "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.worker.tsbuildinfo",
         "target": "es2023",
         "lib": ["ES2023"],
         "module": "esnext",
         "types": ["node"],
         "skipLibCheck": true,

         /* Bundler mode */
         "moduleResolution": "bundler",
         "verbatimModuleSyntax": true,
         "moduleDetection": "force",
         "noEmit": true,

         /* Linting */
         "strict": true,
         "noUnusedLocals": true,
         "noUnusedParameters": true,
         "erasableSyntaxOnly": true,
         "noFallthroughCasesInSwitch": true
       },
       "include": ["src/worker", "worker-configuration.d.ts"]
     }
     ```
  2. `tsconfig.json` — add the reference:
     ```jsonc
     {
       "files": [],
       "references": [
         { "path": "./tsconfig.app.json" },
         { "path": "./tsconfig.node.json" },
         { "path": "./tsconfig.worker.json" }
       ]
     }
     ```
  3. `tsconfig.app.json` — keep the SPA program DOM-only by excluding the worker (add below `"include": ["src"]`):
     ```jsonc
     "exclude": ["src/worker"]
     ```
- Verify:
  - `npx tsc -b` — clean (proves DOM and workerd globals never share a program).
  - `npm run build` — succeeds; `dist/` now contains `client/` (SPA, with `client/index.html`) and `legend/` (Worker bundle + generated deploy config). This layout change is expected and is why `assets.directory` left wrangler.jsonc.
  - `npm run lint` — no NEW errors (the one StickyNotePopup.tsx error predates this work).
  - `npm test` — green.
- Commit: `git commit -m "TS wiring: worker project reference keeps workerd and DOM type worlds apart"`
- Depends on: T3, T4

### T6: Deploy + live verify — GATED, get Ryan's explicit go first
- Files: none (deploy only; STATUS.md update after)
- Change: `npm run deploy` (= `npm run build && wrangler deploy`; wrangler follows the plugin's generated deploy config automatically).
- Verify:
  - `curl https://legend.ryanho06.workers.dev/api/health` -> `{"ok":true,"db":true}` (remote D1 binding, `SELECT 1`, no migrations required).
  - https://legend.ryanho06.workers.dev loads the SPA; deep link (e.g. a refresh inside a chart) still resolves via `single-page-application` handling.
  - Update STATUS.md (phase 1 done, dist layout note, deploy script) and commit.
- Depends on: T5, and Ryan's approval.

## Verification target (whole feature)

`npm test` (all green incl. 2 new worker tests) && `npx tsc -b` (clean) && `npm run lint` (no new errors) && `npm run dev` serving both http://localhost:5173 (SPA, HMR) and `/api/health` -> `{"ok":true,"db":true}` from local D1 && `npm run build` emitting `dist/client` + `dist/legend`. Live: `/api/health` green on legend.ryanho06.workers.dev after the gated T6 deploy.
