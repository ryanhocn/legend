# Pre-Multiplayer Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Land four contained singleplayer fixes (guest-link identity, alias note-edit realism gate, page-reload resume, next-job hint banner) on `main` before the multiplayer branch.

**Architecture:** Three new pure `src/lib/` helpers (unit-tested, node pool) plus thin wiring. Fix A is a one-file worker change. Fix B adds a client ownership helper and a one-line server ownership check. Fix C persists the App-level nav blob to localStorage and lifts the Notes preview tabs into `CaseUiState`. Fix D renders a banner from a pure helper. No D1 schema change.

**Tech Stack:** React 19, TypeScript, Vite, Hono, better-auth 1.6 (native D1), Cloudflare D1, vitest (node pool for `src/lib/`, vitest-pool-workers for real-D1 worker tests).

Spec: `docs/superpowers/specs/2026-07-11-premultiplayer-fixes-design.md`.

## Global Constraints

- Server work ownership is ALWAYS the better-auth `user.id`, never `hcpId`. The alias distinction (Fix B) is a CLIENT-only realism gate; the server boundary stays the account.
- No new D1 migration. None of these fixes touches `case_session` or the `scope` column.
- Test-file discipline: any change to an EXISTING test file must Edit-append (add a new `test`/`describe`), NEVER Write over it. New helpers get NEW test files.
- Verify commands: `npx tsc -b`, `npm test` (node pool), `npm run test:workers` (real local D1), `npm run lint`, `npm run build`. All must stay green.
- localStorage keys are prefixed `legend`; `signOut()` sweeps every `legend*` key except registered device preferences (`src/lib/session.ts`).
- After code changes, run `graphify update .` to keep the graph current. Any subagent that explores code must be told: run `graphify query "..."` before reading source (repo hook).
- Commit style: conventional commits, no em dashes in messages.

---

## Task A1: Guest link writes the guest persona onto the linked account

**Files:**
- Modify: `src/worker/rekey.ts:1` (import), `src/worker/rekey.ts:30-31` (the snapshot call)
- Test: `src/worker/work.workers.test.ts` (Edit-append inside the existing `describe("rekeyUserWork", ...)`)

**Interfaces:**
- Consumes: `currentPersona(db, userId)` from `./persona` (returns `{forename, surname, grade, hcpId} | null`).
- Produces: no new exports; `rekeyUserWork` keeps its signature.

- [ ] **Step 1: Write the failing test** (append inside the existing `describe("rekeyUserWork", () => { ... })` block in `src/worker/work.workers.test.ts`)

```ts
  test("guest link makes the guest persona the account default, not a new alias", async () => {
    const auth = createAuth(env as unknown as Env, "http://localhost");
    const anon = (await auth.api.signInAnonymous())!.user.id;
    const google = (await auth.api.signInAnonymous())!.user.id; // stand-in linked row

    // Guest has a full chosen persona; the freshly-created Google row has none
    // (mirrors better-auth: Google create sets name/email only, plus a new hcpId).
    await env.DB.prepare(
      `UPDATE user SET forename='Alice', surname='Smith', grade='st3', hcpId='d9-AAA' WHERE id=?1`,
    ).bind(anon).run();
    await env.DB.prepare(
      `UPDATE user SET forename=NULL, surname=NULL, grade=NULL, hcpId='d9-BBB' WHERE id=?1`,
    ).bind(google).run();

    await rekeyUserWork(env.DB, anon, google);

    const row = await env.DB.prepare(
      `SELECT forename, surname, grade, hcpId FROM user WHERE id=?1`,
    ).bind(google).first<{ forename: string; surname: string; grade: string; hcpId: string }>();
    expect(row).toEqual({ forename: "Alice", surname: "Smith", grade: "st3", hcpId: "d9-AAA" });

    const alias = await env.DB.prepare(
      `SELECT COUNT(*) AS n FROM user_alias WHERE userId=?1 AND hcpId='d9-AAA'`,
    ).bind(google).first<{ n: number }>();
    expect(alias?.n).toBe(0);
  });
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:workers`
Expected: FAIL — the current code snapshots the guest persona into `user_alias` (so `alias.n` is 1) and never writes the Google `user` row (so `forename` stays NULL).

- [ ] **Step 3: Replace the snapshot with a direct persona write**

In `src/worker/rekey.ts`, change the import on line 1 from:

```ts
import { currentPersona, ensureSnapshot } from "./persona";
```

to:

```ts
import { currentPersona } from "./persona";
```

Then replace lines 30-31:

```ts
  // After the move, so the dedupe check sees the transferred rows.
  await ensureSnapshot(db, toUserId, outgoing);
```

with:

```ts
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
```

- [ ] **Step 4: Run the test to verify it passes, and the whole workers suite**

Run: `npm run test:workers`
Expected: PASS (the new test plus all existing rekey/work tests; the earlier "moves all three tables" rekey test is unaffected because it never asserted on the snapshot).

- [ ] **Step 5: Commit**

```bash
git add src/worker/rekey.ts src/worker/work.workers.test.ts
git commit -m "fix(auth): guest-to-Google link keeps the guest persona as the account default"
```

- [ ] **Step 6: Browser verification (controller step, record the result)**

Run the app (`npm run dev`), sign in as a guest, set persona "Alice Smith", write and sign a note, then use ProfileMenu > "Link Google account". After the redirect: confirm NO persona-setup screen appears, the active persona reads "Alice Smith" (guest hcpId), ProfileMenu shows no new "previous alias", and Alice's note is intact. This proves the `onLinkAccount` write lands before the client re-reads the session (the one thing the spec says to verify, not assume). Record PASS/FAIL in the SDD ledger.

---

## Task B1: Pure `noteOwnership` helper

**Files:**
- Create: `src/lib/noteOwnership.ts`
- Test: `src/lib/noteOwnership.test.ts`

**Interfaces:**
- Produces: `noteOwnership(note: Note, args: { userNotes: Note[]; myHcpId: string; playerHcpId?: string }): { canEdit: boolean; canDelete: boolean; canAddend: boolean }`. Consumed by Task B3.

- [ ] **Step 1: Write the failing test** (`src/lib/noteOwnership.test.ts`)

```ts
import { describe, expect, test } from "vitest";
import type { Note } from "../types";
import { noteOwnership } from "./noteOwnership";

function note(id: string, authorId?: string): Note {
  return {
    kind: "note", id, encounterId: "enc-admission", category: "Progress",
    noteType: "Progress Note", author: "X, Y", credential: "MD", authorRole: "*PHYSICIAN",
    service: "(A) General Surgery", dateOfService: "16/06 17:00", fileTime: "16/06 17:00",
    timestamp: 1, status: "signed", authorId, body: "b",
  };
}

describe("noteOwnership", () => {
  const mine = note("n1", "d9-ME");
  const otherAlias = note("n2", "d9-OTHER");
  const legacy = note("n3"); // account note, no authorId stamped
  const userNotes = [mine, otherAlias, legacy];
  const args = { userNotes, myHcpId: "d9-ME", playerHcpId: "d0-PLAYER" };

  test("current persona's note: full control", () => {
    expect(noteOwnership(mine, args)).toEqual({ canEdit: true, canDelete: true, canAddend: true });
  });
  test("another alias's account note: addend only", () => {
    expect(noteOwnership(otherAlias, args)).toEqual({ canEdit: false, canDelete: false, canAddend: true });
  });
  test("legacy account note with no authorId: grandfathered to current persona", () => {
    expect(noteOwnership(legacy, args)).toEqual({ canEdit: true, canDelete: true, canAddend: true });
  });
  test("static case-persona note (not an account note): addend only", () => {
    expect(noteOwnership(note("n4", "d0-PLAYER"), args)).toEqual({ canEdit: false, canDelete: false, canAddend: true });
  });
  test("a note owned by no one here: no actions", () => {
    expect(noteOwnership(note("zzz", "d9-STRANGER"), args)).toEqual({ canEdit: false, canDelete: false, canAddend: false });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- noteOwnership`
Expected: FAIL — `noteOwnership` is not defined.

- [ ] **Step 3: Write the implementation** (`src/lib/noteOwnership.ts`)

```ts
import type { Note } from "../types";

/**
 * Who may act on a note, from the CURRENT persona's point of view. Server-side,
 * ownership of work is the account (better-auth user.id); this adds a
 * client-only realism layer so switching persona behaves like a real chart: you
 * edit/delete only what your current persona authored, but you may addend any
 * note your account owns (cross-clinician addenda are normal). Pure; no React.
 *
 * - userNotes:   every note the server returned for this account + case.
 * - myHcpId:     the live persona's doctor id (UserProfile.hcpId).
 * - playerHcpId: the static case-persona the trainee plays (CaseBundle.playerHcpId).
 */
export function noteOwnership(
  note: Note,
  args: { userNotes: Note[]; myHcpId: string; playerHcpId?: string },
): { canEdit: boolean; canDelete: boolean; canAddend: boolean } {
  const { userNotes, myHcpId, playerHcpId } = args;
  const isAccountNote = userNotes.some((n) => n.id === note.id);
  // Authored by the persona currently signed in. A legacy account note with no
  // stamped authorId is grandfathered to the current persona (all notes from
  // buildUserNote do stamp authorId, so this only covers pre-existing rows).
  const mine = isAccountNote && (note.authorId == null || note.authorId === myHcpId);
  const canAddend = isAccountNote || (!!note.authorId && note.authorId === playerHcpId);
  return { canEdit: mine, canDelete: mine, canAddend };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- noteOwnership`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/noteOwnership.ts src/lib/noteOwnership.test.ts
git commit -m "feat(notes): add pure noteOwnership helper (per-persona edit/delete, account addend)"
```

---

## Task B2: Server addendum ownership check

**Files:**
- Modify: `src/worker/work.ts:92-108` (the `POST /notes/:id/addenda` handler)
- Test: `src/worker/work.workers.test.ts` (Edit-append a new `describe`)

**Interfaces:**
- Consumes: existing `callWorker`, `anonCookie`, `createNote(cookie, body, status)` helpers already defined at the top of `work.workers.test.ts`.

- [ ] **Step 1: Write the failing test** (append a new `describe` block at the end of `src/worker/work.workers.test.ts`)

```ts
describe("POST /api/notes/:id/addenda ownership", () => {
  test("404 when the target note is not the caller's", async () => {
    const owner = await anonCookie();
    const created = await createNote(owner, "owner note", "signed");
    const stranger = await anonCookie();
    const res = await callWorker(`/api/notes/${created.id}/addenda`, {
      method: "POST",
      headers: { cookie: stranger, "content-type": "application/json" },
      body: JSON.stringify({ caseId: "cholangitis001", body: "sneaky addendum" }),
    });
    expect(res.status).toBe(404);
  });

  test("201 when addending your own note", async () => {
    const cookie = await anonCookie();
    const created = await createNote(cookie, "mine", "signed");
    const res = await callWorker(`/api/notes/${created.id}/addenda`, {
      method: "POST",
      headers: { cookie, "content-type": "application/json" },
      body: JSON.stringify({ caseId: "cholangitis001", body: "clarify" }),
    });
    expect(res.status).toBe(201);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:workers`
Expected: FAIL — the first case currently returns 201 (the route never checks target-note ownership).

- [ ] **Step 3: Add the ownership check**

In `src/worker/work.ts`, in the `work.post("/notes/:id/addenda", ...)` handler, insert this immediately AFTER the bad-request guard (the `if (!raw || ...) return c.json({ error: "bad request" }, 400);` line) and BEFORE `const row = { ... }`:

```ts
  const owns = await c.env.DB.prepare(
    `SELECT 1 FROM user_note WHERE id = ?1 AND userId = ?2`,
  )
    .bind(c.req.param("id"), c.get("userId"))
    .first();
  if (!owns) return c.json({ error: "not found" }, 404);
```

- [ ] **Step 4: Run the test to verify it passes, and the whole workers suite**

Run: `npm run test:workers`
Expected: PASS. Confirm no existing addendum test regressed (existing addendum tests create the note first, so they still own their target).

- [ ] **Step 5: Commit**

```bash
git add src/worker/work.ts src/worker/work.workers.test.ts
git commit -m "fix(work): reject addenda to a note the caller does not own (404)"
```

---

## Task B3: Wire `noteOwnership` into the client

**Files:**
- Modify: `src/components/PatientWorkspace.tsx:130-132` (predicate definitions), `:346-347` and `:360-361` (props to ChartReview + NotesBrowser), plus a new import
- Modify: `src/components/chart/ChartReview.tsx:40-55` (props type), `:145-146` (forward)
- Modify: `src/components/chart/NotesBrowser.tsx:63-79` (props type), `:274-298` (NotePreview wiring)

**Interfaces:**
- Consumes: `noteOwnership` from Task B1; `user: UserProfile` (already a `PatientWorkspace` prop); `activeCase.playerHcpId`.
- Produces: three predicate props `canEdit`, `canDelete`, `canAddend` (each `(note: Note) => boolean`) replacing `ownNote` + `isUserNote` on ChartReview and NotesBrowser.

- [ ] **Step 1: Replace the predicates in PatientWorkspace**

Add the import near the other `../lib` imports at the top of `src/components/PatientWorkspace.tsx`:

```ts
import { noteOwnership } from "../lib/noteOwnership";
```

Replace lines 130-132:

```ts
  const isUserNote = (note: Note) => userNotes.some((n) => n.id === note.id);
  const ownNote = (note: Note) =>
    isUserNote(note) || (!!note.authorId && note.authorId === activeCase.playerHcpId);
```

with:

```ts
  const ownership = (note: Note) =>
    noteOwnership(note, {
      userNotes,
      myHcpId: user.hcpId,
      playerHcpId: activeCase.playerHcpId,
    });
  const canEdit = (note: Note) => ownership(note).canEdit;
  const canDelete = (note: Note) => ownership(note).canDelete;
  const canAddend = (note: Note) => ownership(note).canAddend;
```

Then update the two callsites. At `:346-347` (the ChartReview props) replace:

```tsx
                    ownNote={ownNote}
                    isUserNote={isUserNote}
```

with:

```tsx
                    canEdit={canEdit}
                    canDelete={canDelete}
                    canAddend={canAddend}
```

And at `:360-361` (the NotesBrowser props) make the identical replacement.

- [ ] **Step 2: Update ChartReview props + forward**

In `src/components/chart/ChartReview.tsx`, in the props destructure (around line 40) and the props type (around line 54), replace the `ownNote` / `isUserNote` entries with `canEdit`, `canDelete`, `canAddend`:

Destructure:

```tsx
  canEdit,
  canDelete,
  canAddend,
```

Type:

```tsx
  canEdit: (note: Note) => boolean;
  canDelete: (note: Note) => boolean;
  canAddend: (note: Note) => boolean;
```

And forward to the embedded NotesBrowser (replace lines 145-146):

```tsx
            canEdit={canEdit}
            canDelete={canDelete}
            canAddend={canAddend}
```

- [ ] **Step 3: Update NotesBrowser props + the NotePreview gating**

In `src/components/chart/NotesBrowser.tsx`, in the props destructure (around line 63) and the props type (around line 71), replace `ownNote` / `isUserNote` with `canEdit`, `canDelete`, `canAddend` (same three lines and types as ChartReview above).

Then in the NotePreview wiring (lines 278-297), change the three gates:

```tsx
                onDelete={
                  activeNote && canDelete(activeNote)
                    ? () => {
                        closePreview(activeNote.id);
                        onDeleteNote(activeNote.id);
                      }
                    : undefined
                }
                onEdit={
                  activeNote &&
                  activeNote.status === "incomplete" &&
                  canEdit(activeNote)
                    ? () => onEditNote(activeNote)
                    : undefined
                }
                onAddendum={
                  activeNote && activeNote.status !== "incomplete" && canAddend(activeNote)
                    ? () => onAddendumNote(activeNote)
                    : undefined
                }
```

- [ ] **Step 4: Type-check, lint, build**

Run: `npx tsc -b && npm run lint && npm run build`
Expected: clean. tsc will flag any lingering `ownNote`/`isUserNote` reference (there should be none; the grep-confirmed uses were only these callsites).

- [ ] **Step 5: Commit**

```bash
git add src/components/PatientWorkspace.tsx src/components/chart/ChartReview.tsx src/components/chart/NotesBrowser.tsx
git commit -m "feat(notes): gate edit/delete to the authoring persona, addend to the account"
```

- [ ] **Step 6: Browser verification (controller step)**

As a guest, write and sign a note as persona A; switch to a second persona via ProfileMenu (Link is not needed — a fresh guest cannot switch, so test this on an account that has two aliases, or seed a second alias). Confirm persona A's note shows a disabled Edit and Delete but an enabled Addendum. Record PASS/FAIL. (If you cannot easily create two aliases in dev, verify the predicate behavior via the unit tests from B1 and confirm the single-persona case is unchanged: your own notes stay Edit/Delete/Addendum-able.)

---

## Task C1: Pure `hydrateSession` helper

**Files:**
- Create: `src/lib/sessionState.ts`
- Test: `src/lib/sessionState.test.ts`

**Interfaces:**
- Produces: `type PersistedSession = { openCaseIds: string[]; activeCaseId: string | null; caseUi: Record<string, CaseUiState> }` and `hydrateSession(raw: string | null, isKnownCase: (id: string) => boolean): PersistedSession`. Consumed by Task C3.

- [ ] **Step 1: Write the failing test** (`src/lib/sessionState.test.ts`)

```ts
import { describe, expect, test } from "vitest";
import { hydrateSession } from "./sessionState";

const known = (id: string) => id === "a" || id === "b";
const EMPTY = { openCaseIds: [], activeCaseId: null, caseUi: {} };

describe("hydrateSession", () => {
  test("null or malformed JSON returns empty state", () => {
    expect(hydrateSession(null, known)).toEqual(EMPTY);
    expect(hydrateSession("{not json", known)).toEqual(EMPTY);
    expect(hydrateSession("42", known)).toEqual(EMPTY);
  });

  test("drops unknown case ids and their ui entries", () => {
    const raw = JSON.stringify({
      openCaseIds: ["a", "gone"],
      activeCaseId: "a",
      caseUi: { a: { mainTab: "notes" }, gone: { mainTab: "chart" } },
    });
    const out = hydrateSession(raw, known);
    expect(out.openCaseIds).toEqual(["a"]);
    expect(Object.keys(out.caseUi)).toEqual(["a"]);
  });

  test("resets a dangling activeCaseId to null", () => {
    const raw = JSON.stringify({ openCaseIds: ["b"], activeCaseId: "gone", caseUi: {} });
    expect(hydrateSession(raw, known).activeCaseId).toBe(null);
  });

  test("keeps a valid active id", () => {
    const raw = JSON.stringify({ openCaseIds: ["a", "b"], activeCaseId: "b", caseUi: {} });
    expect(hydrateSession(raw, known).activeCaseId).toBe("b");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- sessionState`
Expected: FAIL — `hydrateSession` is not defined.

- [ ] **Step 3: Write the implementation** (`src/lib/sessionState.ts`)

```ts
import type { CaseUiState } from "../types";

/** The top-level workspace state persisted across a page reload. */
export type PersistedSession = {
  openCaseIds: string[];
  activeCaseId: string | null;
  caseUi: Record<string, CaseUiState>;
};

const EMPTY: PersistedSession = { openCaseIds: [], activeCaseId: null, caseUi: {} };

/**
 * Sanitize a raw localStorage blob back into resumable state. Drops case ids no
 * longer in the registry (getCase throws on unknown ids, which would white-screen
 * the app on load), prunes per-case UI to the surviving open cases, and resets a
 * dangling active id. Tolerates malformed or absent JSON by returning empty
 * state. Pure; no React, no localStorage access (the caller reads the string).
 */
export function hydrateSession(
  raw: string | null,
  isKnownCase: (id: string) => boolean,
): PersistedSession {
  if (!raw) return EMPTY;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return EMPTY;
  }
  if (typeof parsed !== "object" || parsed === null) return EMPTY;
  const p = parsed as Partial<PersistedSession>;

  const openCaseIds = Array.isArray(p.openCaseIds)
    ? p.openCaseIds.filter((id): id is string => typeof id === "string" && isKnownCase(id))
    : [];

  const caseUi: Record<string, CaseUiState> = {};
  const rawUi = (p.caseUi ?? {}) as Record<string, CaseUiState>;
  for (const id of openCaseIds) {
    if (rawUi[id]) caseUi[id] = rawUi[id];
  }

  const activeCaseId =
    typeof p.activeCaseId === "string" && openCaseIds.includes(p.activeCaseId)
      ? p.activeCaseId
      : null;

  return { openCaseIds, activeCaseId, caseUi };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- sessionState`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/sessionState.ts src/lib/sessionState.test.ts
git commit -m "feat(app): add pure hydrateSession helper for reload resume"
```

---

## Task C2: Lift the Notes preview tabs into CaseUiState

**Files:**
- Modify: `src/types.ts:241-248` (`CaseUiState`)
- Modify: `src/App.tsx:22-29` (`DEFAULT_UI`)
- Modify: `src/components/chart/NotesBrowser.tsx` (props + replace local preview-tab `useState` with controlled props; lines 63-79 and 97-102, plus every `setOpenIds` / `setActivePreviewId` call site)
- Modify: `src/components/PatientWorkspace.tsx` (destructure the two new ui fields at :61; pass them + an `onPreviewChange` to NotesBrowser :353-363 and ChartReview :333-349)
- Modify: `src/components/chart/ChartReview.tsx` (add the three props, forward to NotesBrowser :138-148)

**Interfaces:**
- Produces: `CaseUiState` gains `openNoteIds: string[]` and `activePreviewId: string | null`. NotesBrowser gains props `openNoteIds`, `activePreviewId`, and `onPreviewChange: (patch: { openNoteIds?: string[]; activePreviewId?: string | null }) => void`.
- Note: this task assumes Task B3 already changed NotesBrowser/ChartReview to the `canEdit`/`canDelete`/`canAddend` props.

- [ ] **Step 1: Add the fields to CaseUiState + DEFAULT_UI**

In `src/types.ts`, inside `CaseUiState` (after `wrapupOpen: boolean;`), add:

```ts
  /** Notes-activity preview tabs kept open, lifted from NotesBrowser so they
   * survive main-tab switches AND page reload. */
  openNoteIds: string[];
  activePreviewId: string | null;
```

In `src/App.tsx`, in `DEFAULT_UI`, add the two fields:

```ts
  openNoteIds: [],
  activePreviewId: null,
```

- [ ] **Step 2: Make NotesBrowser controlled**

In `src/components/chart/NotesBrowser.tsx`, add the three props to the destructure and the props type (alongside the B3 predicate props):

```tsx
  openNoteIds,
  activePreviewId,
  onPreviewChange,
```

```tsx
  openNoteIds: string[];
  activePreviewId: string | null;
  onPreviewChange: (patch: { openNoteIds?: string[]; activePreviewId?: string | null }) => void;
```

Replace the two local `useState` declarations (lines 97-102) with derived values from props, keeping the "newest note is shown by default" behavior as a display fallback:

```tsx
  // Preview tabs live in CaseUiState now (controlled), so they survive main-tab
  // switches and reload. An empty persisted set falls back to the newest note.
  const openIds = openNoteIds.length ? openNoteIds : filtered[0] ? [filtered[0].id] : [];
  const previewId = activePreviewId ?? openIds[0] ?? null;
```

Then rename the local usages so the rest of the component reads `openIds` / `previewId` (the render already uses `openIds` and `activePreviewId`; update `activePreviewId` reads in the `openNotes`/`activeNote` derivation at lines 104-107 to use `previewId`). Convert EVERY setter call using this mechanical rule (there is no other place these are stored):
- `setOpenIds(next)` where `next` is an array becomes `onPreviewChange({ openNoteIds: next })`.
- `setOpenIds((prev) => f(prev))` becomes `onPreviewChange({ openNoteIds: f(openIds) })` (use the derived `openIds` as the current value).
- `setActivePreviewId(x)` becomes `onPreviewChange({ activePreviewId: x })`.

If a single handler both opens a tab and focuses it, batch into one call: `onPreviewChange({ openNoteIds: nextIds, activePreviewId: id })`.

- [ ] **Step 3: Thread the props from PatientWorkspace + ChartReview**

In `src/components/PatientWorkspace.tsx`, add `openNoteIds` and `activePreviewId` to the `ui` destructure at line 61:

```tsx
  const { mainTab, chartTab, selectedDocId, editors, activeEditorId, wrapupOpen, openNoteIds, activePreviewId } = ui;
```

Pass them plus an `onPreviewChange` to the NotesBrowser in the `notes` main tab (around :353-363) and to ChartReview (around :333-349):

```tsx
                    openNoteIds={openNoteIds}
                    activePreviewId={activePreviewId}
                    onPreviewChange={(patch) => onPatch(patch)}
```

In `src/components/chart/ChartReview.tsx`, add the three props to its destructure + type, and forward them to the embedded NotesBrowser (the `chartTab === "notes"` branch, :138-148):

```tsx
            openNoteIds={openNoteIds}
            activePreviewId={activePreviewId}
            onPreviewChange={onPreviewChange}
```

- [ ] **Step 4: Type-check, lint, build**

Run: `npx tsc -b && npm run lint && npm run build`
Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add src/types.ts src/App.tsx src/components/chart/NotesBrowser.tsx src/components/PatientWorkspace.tsx src/components/chart/ChartReview.tsx
git commit -m "feat(notes): lift preview tabs into CaseUiState (survive tab switch + reload)"
```

- [ ] **Step 6: Browser verification (controller step)**

Open the Notes activity, open several note preview tabs, switch to Chart Review and back. Confirm the preview tabs are still open (they previously reset on the switch). Record PASS/FAIL.

---

## Task C3: Persist and hydrate the workspace in App

**Files:**
- Modify: `src/App.tsx` (add hydration + persistence effects; import `hydrateSession` and `caseRegistry`)

**Interfaces:**
- Consumes: `hydrateSession` + `PersistedSession` (Task C1); `caseRegistry` from `./data/patients` for a non-throwing registry check.

- [ ] **Step 1: Add imports**

In `src/App.tsx`, add:

```ts
import { hydrateSession, type PersistedSession } from "./lib/sessionState";
```

Ensure `caseRegistry` is imported from the patients index (it may already import `getCase`; add `caseRegistry` to that import). If the existing import is `import { getCase } from "./data/patients";`, change it to `import { caseRegistry, getCase } from "./data/patients";`.

- [ ] **Step 2: Add the hydration + persistence effects**

Immediately after the `useState` declarations (after `const [stickyOpen, setStickyOpen] = useState(false);`, line 50), add:

```tsx
  // Resume the open workspace across a page reload. Keyed by the better-auth
  // user id so a shared device never leaks one trainee's tabs to the next;
  // signOut()'s legend* sweep clears it. hydratedRef guards a single restore;
  // the `hydrated` state gates writes so the first render after restore does not
  // clobber the stored blob with the initial empty state.
  const sessionKey = session?.user?.id ? `legend.session.${session.user.id}` : null;
  const hydratedRef = useRef(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (hydratedRef.current || !sessionKey) return;
    hydratedRef.current = true;
    const restored = hydrateSession(
      window.localStorage.getItem(sessionKey),
      (id) => caseRegistry.some((b) => b.id === id),
    );
    setOpenCaseIds(restored.openCaseIds);
    setActiveCaseId(restored.activeCaseId);
    setCaseUi(restored.caseUi);
    setHydrated(true);
  }, [sessionKey]);

  useEffect(() => {
    if (!hydrated || !sessionKey) return;
    const blob: PersistedSession = { openCaseIds, activeCaseId, caseUi };
    const timer = setTimeout(() => {
      window.localStorage.setItem(sessionKey, JSON.stringify(blob));
    }, 250);
    return () => clearTimeout(timer);
  }, [hydrated, sessionKey, openCaseIds, activeCaseId, caseUi]);
```

Ensure `useEffect` and `useRef` are in the React import at the top of the file (add them if missing).

- [ ] **Step 3: Type-check, lint, build**

Run: `npx tsc -b && npm run lint && npm run build`
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat(app): persist open tabs, active tab, and drafts across reload (localStorage, per user)"
```

- [ ] **Step 5: Browser verification (controller step)**

Sign in, open two patient tabs, pick a main tab and a right-rail document, open a couple of note preview tabs, and start an unsigned draft with some body text. Reload (F5). Confirm all of the above are restored, including the draft body. Then sign out and sign in as a different guest on the same device; confirm the previous user's tabs do NOT appear. Record PASS/FAIL for each.

---

## Task D1: Pure `nextJob` helper

**Files:**
- Create: `src/lib/nextJob.ts`
- Test: `src/lib/nextJob.test.ts`

**Interfaces:**
- Consumes: `currentRound` from `./rounds`.
- Produces: `nextJob(args: { rounds: RoundSpec[]; simNow: number; userNotes: ClinicalNote[]; task: CaseTask }): { label: string; done: boolean }`. Consumed by Task D2.

- [ ] **Step 1: Write the failing test** (`src/lib/nextJob.test.ts`)

```ts
import { describe, expect, test } from "vitest";
import type { CaseTask, ClinicalNote, RoundSpec } from "../types";
import { nextJob } from "./nextJob";

const task: CaseTask = { code: "ptwr", label: "POST-TAKE WARD ROUND", minGrade: "st3" };
const rounds: RoundSpec[] = [
  { at: 0, encounterId: "enc-admission", label: "Post-take ward round (day 1)" },
  { at: 54000, encounterId: "enc-ward-round-d2", label: "Progress note (day 2)", npcNoteId: "npc-d2" },
];

function note(encounterId: string): ClinicalNote {
  return {
    kind: "note", id: "n", encounterId, category: "Progress", noteType: "Progress Note",
    author: "A, B", credential: "MD", authorRole: "*P", service: "s",
    dateOfService: "d", fileTime: "f", timestamp: 1, status: "signed", body: "b",
  };
}

describe("nextJob", () => {
  test("dynamic: current round label, not done until a covering note exists", () => {
    expect(nextJob({ rounds, simNow: 0, userNotes: [], task })).toEqual({
      label: "Post-take ward round (day 1)", done: false,
    });
  });
  test("dynamic: done once the round's encounter has a note", () => {
    expect(nextJob({ rounds, simNow: 0, userNotes: [note("enc-admission")], task })).toEqual({
      label: "Post-take ward round (day 1)", done: true,
    });
  });
  test("dynamic: advances to the next round as the clock moves", () => {
    expect(nextJob({ rounds, simNow: 54000, userNotes: [], task }).label).toBe("Progress note (day 2)");
  });
  test("static (no rounds): standing task, never auto-done", () => {
    expect(nextJob({ rounds: [], simNow: 999, userNotes: [], task })).toEqual({
      label: "POST-TAKE WARD ROUND", done: false,
    });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- nextJob`
Expected: FAIL — `nextJob` is not defined.

- [ ] **Step 3: Write the implementation** (`src/lib/nextJob.ts`)

```ts
import type { CaseTask, ClinicalNote, RoundSpec } from "../types";
import { currentRound } from "./rounds";

/**
 * The singleplayer "what should I write now" hint. A dynamic case shows the
 * current round's job, marked done once a trainee note covers that round's
 * encounter (so the banner can hide/advance). A static case (no rounds) shows
 * the case's standing task, never auto-done. Pure; no React.
 */
export function nextJob(args: {
  rounds: RoundSpec[];
  simNow: number;
  userNotes: ClinicalNote[];
  task: CaseTask;
}): { label: string; done: boolean } {
  const { rounds, simNow, userNotes, task } = args;
  const round = currentRound(rounds, simNow);
  if (round) {
    const done = userNotes.some((n) => n.encounterId === round.encounterId);
    return { label: round.label, done };
  }
  // No round reached yet, or a static case: fall back to the standing task.
  return { label: task.label, done: false };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- nextJob`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/nextJob.ts src/lib/nextJob.test.ts
git commit -m "feat(rounds): add pure nextJob helper for the singleplayer hint banner"
```

---

## Task D2: NextJobBanner component + mount + dismiss

**Files:**
- Create: `src/components/NextJobBanner.tsx`
- Modify: `src/lib/session.ts` (register the hide key as a sweep-exempt device pref)
- Modify: `src/components/PatientWorkspace.tsx` (compute `nextJob`, mount the banner in `.module-body`)
- Modify: `src/App.css` (banner styles)

**Interfaces:**
- Consumes: `nextJob` (Task D1); `NEXT_JOB_HIDE_KEY` exported from `src/lib/session.ts`.

- [ ] **Step 1: Register the device pref so it survives sign-out**

In `src/lib/session.ts`, add a second exported key next to `SKIP_DELETE_CONFIRM_KEY`:

```ts
/** "Hide the next-job hint" global device toggle; like the delete-confirm pref,
 * a UI preference deliberately NOT cleared by signOut. */
export const NEXT_JOB_HIDE_KEY = "legend.hideNextJob";
```

Then update the sweep filter in `signOut()` to except both device prefs:

```ts
  const doomed = Object.keys(window.localStorage).filter(
    (key) =>
      key.startsWith("legend") &&
      key !== SKIP_DELETE_CONFIRM_KEY &&
      key !== NEXT_JOB_HIDE_KEY,
  );
```

- [ ] **Step 2: Create the banner** (`src/components/NextJobBanner.tsx`)

```tsx
import { useState } from "react";
import { X } from "lucide-react";
import { NEXT_JOB_HIDE_KEY } from "../lib/session";

// No multiplayer yet; the banner is a singleplayer aid (there is no single
// "your job" when a team shares the patient). Flip this when a shared-session
// concept lands.
const isMultiplayer = false;

/** A small strip under the tab bar telling a solo trainee what to write next. */
export function NextJobBanner({ label, done }: { label: string; done: boolean }) {
  const [hidden, setHidden] = useState(
    () => window.localStorage.getItem(NEXT_JOB_HIDE_KEY) === "1",
  );
  if (isMultiplayer || done || hidden) return null;
  return (
    <div className="next-job-banner">
      <span className="next-job-label">Next: {label}</span>
      <button
        className="next-job-dismiss"
        title="Hide this hint"
        onClick={() => {
          window.localStorage.setItem(NEXT_JOB_HIDE_KEY, "1");
          setHidden(true);
        }}
      >
        <X size={13} />
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Compute nextJob + mount the banner in PatientWorkspace**

In `src/components/PatientWorkspace.tsx`, add the import:

```ts
import { NextJobBanner } from "./NextJobBanner";
import { nextJob } from "../lib/nextJob";
```

Compute the hint near `activeRound` (after line 97), reusing values already in scope (`activeCase.rounds`, `work.simNow`, `userNotes`, `activeCase.rubric.task`):

```tsx
  const job = useMemo(
    () =>
      nextJob({
        rounds: activeCase.rounds ?? [],
        simNow: work.simNow,
        userNotes,
        task: activeCase.rubric.task,
      }),
    [activeCase.rounds, work.simNow, userNotes, activeCase.rubric.task],
  );
```

Mount the banner in `.module-body`, right after the save-error block (after line 329):

```tsx
                <NextJobBanner label={job.label} done={job.done} />
```

- [ ] **Step 4: Add styles** (`src/App.css`, near the other `.module-body` / banner rules)

```css
.next-job-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 0 0 10px;
  padding: 7px 12px;
  border: 1px solid #c7d7ea;
  border-left: 3px solid #2f6fb0;
  border-radius: 4px;
  background: #eef4fb;
  font-size: 13px;
  color: #1f3448;
}
.next-job-label { font-weight: 600; }
.next-job-dismiss {
  display: inline-flex;
  align-items: center;
  border: none;
  background: transparent;
  color: #5a6b7c;
  cursor: pointer;
  padding: 2px;
}
.next-job-dismiss:hover { color: #1f3448; }
```

- [ ] **Step 5: Type-check, lint, build**

Run: `npx tsc -b && npm run lint && npm run build`
Expected: clean.

- [ ] **Step 6: Commit**

```bash
git add src/components/NextJobBanner.tsx src/lib/session.ts src/components/PatientWorkspace.tsx src/App.css
git commit -m "feat(ui): add singleplayer next-job hint banner with a global dismiss toggle"
```

- [ ] **Step 7: Browser verification (controller step)**

On cholangitis001, confirm the banner reads the current round's job ("Next: Post-take ward round (day 1)"), and that after signing that round's note it hides/advances. Click the dismiss X, reload, and confirm it stays hidden. Record PASS/FAIL.

---

## Final: whole-batch verification + doc reconcile (controller steps)

- [ ] Run the full suite: `npx tsc -b && npm test && npm run test:workers && npm run lint && npm run build`. All green.
- [ ] Run `graphify update .` to refresh the knowledge graph.
- [ ] Confirm all six browser verifications above are recorded PASS in the SDD ledger.
- [ ] Reconcile docs (spec §9): update `STATUS.md`; update the CLAUDE.md gotchas this touched (the ownership model in the "Trainee session + note feedback" gotcha now distinguishes current-persona edit/delete vs account addend; `CaseUiState` gained `openNoteIds`/`activePreviewId`; a `legend.session.<userId>` localStorage key now persists the workspace; `NEXT_JOB_HIDE_KEY` is a new sweep-exempt device pref). Fold in the deferred root-clutter archival (move the historical `SPEC.md`, `PLAN.md`, `DYNAMIC_PATIENTS.md`, `DYNAMIC_PATIENTS_SPEC.md`, `PLAN4_KICKOFF.md` into `docs/superpowers/specs/`, updating their references in `STATUS.md`/`CLAUDE.md`).
- [ ] Hand back to Ryan for the push decision (main is still unpushed; do not push without approval).

## Self-review notes (author)

- Spec coverage: A (Task A1), B client gate (B1+B3) and B server hole (B2), C persistence (C1+C3) and preview-tab lift (C2), D banner (D1+D2). All spec §4-7 requirements map to a task.
- Type consistency: the three predicate props `canEdit`/`canDelete`/`canAddend` are introduced in B3 and reused unchanged in C2's NotesBrowser edits; `PersistedSession` and `hydrateSession` names match between C1 and C3; `nextJob`'s return `{ label, done }` matches D2's `NextJobBanner` props.
- Known assumption to validate during C2: NotesBrowser's setter call sites are converted mechanically per the stated rule; the implementer reads the current file to apply it (the interface and the two known operations, open-tab and close-tab, are specified).
