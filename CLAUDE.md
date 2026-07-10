# Legend Project Guide

## Project Overview

Legend is a synthetic EHR-style training simulator for medical students and early clinical trainees.

Its purpose is to help users practice:
- chart review
- clinical documentation
- ward round notes
- handover-style synthesis
- recognizing unsafe omissions
- linking clinical cases to physiology and revision topics


Copy Epic, NHS systems, WinPath, or other proprietary systems loosely.

The UI may be inspired by common EHR patterns:
- patient sidebar
- chart tabs
- encounter table
- bloods/microbiology sections
- right context rail
- sticky notes
- alerts
- note editor

Use generic terms:
- Chart Review
- Notes
- Bloods
- Microbiology
- Imaging
- Medications
- Orders
- Synthetic Case ID

Preserve disclaimers:
"All patient data are synthetic. For education and simulation only. Not for clinical use."

## Commands

```bash
npm install
npm run dev      # SPA + API worker + local D1 in ONE process (Cloudflare vite plugin), pinned to http://localhost:5173 (strictPort; it's the registered Google OAuth origin)
npm run build    # tsc -b && vite build (type-check + production build; emits dist/client + dist/legend)
npm run lint     # eslint .
npm test         # vitest run, node pool (pure lib/ logic; excludes *.workers.test.ts)
npm run test:workers  # real-D1 auth tests (vitest-pool-workers/miniflare, migrations auto-applied)
npm run deploy   # build + wrangler deploy — the ONLY safe deploy; a bare `wrangler deploy` ships the worker with NO assets and takes the live SPA down
npm run cf-typegen    # regenerate worker-configuration.d.ts after changing wrangler.jsonc bindings or .dev.vars keys
```

Type-check only (fast verify loop): `npx tsc -b`

## Tech Stack

Frontend:
- Vite
- React
- TypeScript
- CSS

Installed packages:
- react / react-dom (v19)
- lucide-react (icons)
- react-resizable-panels (resizable layout; see import note below)
- recharts (Vitals trend chart)
- clsx (conditional classNames)
- vitest (dev; unit-test runner for the pure `src/lib/` logic)

Backend (Cloudflare Worker, same repo):
- hono (API router, basePath /api)
- better-auth v1.6 (accounts: anonymous guests + Google-only; native D1, no ORM)
- wrangler + @cloudflare/vite-plugin (single-process dev, deploy)
- @cloudflare/vitest-pool-workers (dev; real-D1 test pool)
- D1 database `legend-db` (binding DB), migrations in `migrations/`

Important package note:
The installed `react-resizable-panels` version exports:
- Group
- Panel
- Separator

Use this import style:

```tsx
import {
  Group as PanelGroup,
  Panel,
  Separator as PanelResizeHandle,
} from "react-resizable-panels";
```

## Architecture

- `src/App.tsx`: top-level shell and multi-case state machine. Gated behind the sign-in screen; holds `openCaseIds` + `activeCaseId` (chart tabs) and a per-case `CaseUiState` map, and renders `TopSystemBar` + `PatientTabBar` + either `PatientListPage` (no chart focused) or `PatientWorkspace` (the active chart, wrapped in `CaseContext.Provider` keyed by case id).
- `src/components/PatientWorkspace.tsx`: one patient's chart (fixed sidebar + resizable workspace + sticky note + Performance dock). Controlled by App's per-case ui map so drafts/tabs survive switching; remounted per case (key) so per-case localStorage hooks never see a key change. Merges runtime user notes into the case data (see Gotchas).
- `src/components/`: grouped by area (`chart/`, `notes/`, `summary/`, `results/` (`ResultsModule`/`ResultsTree`/`ResultsFlowsheet`), `panels/`, `layout/` (incl. `PatientTabBar`), `patients/` (`PatientListPage`), `wrapup/` (`WrapUpDock` floating panel + `WrapUpModule` (embeddable body) + `FeedbackReport`)), plus top-level `SignInPage.tsx`, `PatientWorkspace.tsx`, `RotateGate.tsx`. `panels/LetterPage.tsx` is the shared Epic-style letter-page chrome used by both `NotePreview` and `ReportPreview`.
- `src/data/patients/<caseId>/`: ALL of a case's content: `patient.json` (demographics, `CasePatient`), `summary.ts` (`CaseSummary`), `bloods.ts`, `documents.ts` (the *static* source of truth for clinical documents, a `ClinicalDocument[]` discriminated on `kind`), `encounters.ts` (timeline), `rubric.ts` + `rubric.test.ts` (scoring rubric + model note). See CASE_AUTHORING.md for the full authoring contract.
- `src/data/patients/index.ts`: the case registry (`caseRegistry: CaseBundle[]`, `getCase`, `listSpecialties`). Adding a case = folder + one entry here.
- `src/context/CaseContext.ts`: `useCase()` delivers the active `CaseBundle` to workspace components (sidebar, banners, summary, wrap-up); only valid under the provider.
- `src/data/`: shared UI config (`tabs.ts`).
- `src/types.ts`: shared types (`MainTab`, `ChartTab`, `Encounter`, `ClinicalDocument` = `ClinicalNote` | `ClinicalReport` | `ClinicalLab` | `ClinicalMicro`, `Note`/`Report` aliases, `NoteDraft`, `NoteStatus`, `NoteCategory`, `CaseBundle`/`CasePatient`/`CaseSummary`/`CaseUiState`; note-feedback + session types `RubricItem`, `CaseRubric`, `RubricTrigger`, `PdqiDimension`, `UserProfile`; hierarchy types `Grade`, `CaseTask` (`CaseRubric.task` carries `minGrade`); ownership/edit fields `ClinicalNote.authorId`/`addendum`, `NoteDraft.mode`/`targetNoteId`, `CaseBundle.playerHcpId`, `UserProfile.grade`/`hcpId`, ...).
- `src/lib/`: pure, React-free, unit-tested logic. `clinician.ts` (name formatting), `rubric.ts` + `noteText.ts` (deterministic note scoring), `reflow.ts` (display-time line-break reflow for note rendering), `grades.ts` (seniority tiers + `isOverreach`; see Hierarchy Gotcha), `smarttext.ts` (SmartText phrase templates + wildcard/fuzzy matching), `userNotes.ts` (builds signed/pended trainee notes, addendum/refile helpers, doctor-ID ownership via `isOwnNote`), `session.ts` (sign-in/out + localStorage keys), `wrapupAttempt.ts` (persisted feedback attempt; carries a `signed` flag so only signed notes can trigger the overreach penalty).
- `src/App.css`: single global stylesheet for the whole app.
- `src/worker/`: the API worker. `index.ts` (Hono, `.basePath("/api")`, GET /health with D1 probe, better-auth mounted at `/auth/*` -> external `/api/auth/*`); `auth.ts` (`createAuth(env, baseURL)` factory: anonymous plugin for guests, Google social login, persona `additionalFields` forename/surname/grade/hcpId with hcpId server-generated via `databaseHooks.user.create.before` and forge-proof via `input: false` — test-pinned in `auth.workers.test.ts`). `worker-configuration.d.ts` is the generated Env type (committed, eslint-ignored; regen via `npm run cf-typegen`). `tsconfig.worker.json` keeps workerd and DOM type worlds in separate programs: NEVER import `src/worker/**` into SPA code (`src/lib/authClient.ts` uses an explicit field schema instead of `inferAdditionalFields<typeof auth>` for exactly this reason).
- `src/lib/authClient.ts`: better-auth React client (`useSession` gates App; anonymousClient + inferAdditionalFields plugins).
- `migrations/` + `auth.cli.ts`: D1 schema migrations (`npx wrangler d1 migrations apply legend-db --local`; `--remote` touches PROD and is always Ryan-gated). `auth.cli.ts` exists only so the better-auth CLI can generate schema (in-memory node:sqlite stub) — its options MUST stay identical to `createAuth`'s in `src/worker/auth.ts`.
- Secrets: `.dev.vars` at the repo root (gitignored — NEVER print or commit it; template in `.dev.vars.example`), prod via `wrangler secret put`. Keys: BETTER_AUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET.

## Gotchas

- **Tab types must match data.** `MainTab` / `ChartTab` in `src/types.ts` must stay in sync with the tab lists in `src/data/tabs.ts` (a mismatch is a build error under `tsc`).
- **One chart, many lenses.** Every static clinical document lives once in `documents.ts` with a `kind` (`note` | `letter` | `report` | `order` | `encounterSummary` | `lab` | `micro`) and an `encounterId`. The Notes activity (and Chart Review > Notes sub-tab) filter to `kind: "note"` — which now includes both the pre-authored inpatient notes and trainee-authored signed/pended notes (also `kind:"note"`, `encounterId:"enc-admission"`). `EncounterTable` resolves each row's primary document by `encounterId` (prefers a non-note file, else the matching note) and the right-rail `DocumentPanel` switches on `kind` (`NotePreview` / `LabReport` / `MicroReport` / `ReportPreview`). Structured `lab`/`micro` docs carry typed payloads rendered as Epic-style receipts (`ReportBanner` header); the admission `lab` reuses the case's `bloods.ts` to avoid drift. Don't *fork* the static document store, and don't move docs to `.md`/JSON without a loader — the localStorage user-note store (below) is the one sanctioned runtime store.
- **Trainee session + note feedback.** Accounts are real (better-auth): `App.tsx` gates on `useSession()` and derives `UserProfile` (now incl. optional `image`, the Google avatar in the user bubble) from the session user — only when all four persona fields are set. `SignInPage` has three paths: guest ("Start training" = anonymous server user + persona save), first Google sign-in (returns in persona mode, name prefilled, shown once), returning Google (straight in). The `legend-user` localStorage key is dead (exported but never written). Notes/attempts/addenda/sticky stay client-side until phase 3; their localStorage keys live in `lib/session.ts` (`legend-user-notes-<caseId>`, `legend-addenda-<caseId>`, `legend-skip-delete-confirm`) plus the wrap-up attempt key in `lib/wrapupAttempt.ts` (`legend-wrapup-<caseId>`) and sticky keys (`legend.sticky.<mrn>` per note + global `legend.sticky.layout`). Sign publishes the draft as a signed user note (`lib/userNotes.ts`, id prefix `user-note-`) AND auto-opens the floating "Performance" feedback dock (`WrapUpDock`, `wrapupOpen` in the case's `CaseUiState` — not a main tab), which scores it against the per-case rubric (`lib/rubric.ts` + `data/patients/<caseId>/rubric.ts`); Pend files it Incomplete (no auto-score). Only a *signed* attempt can trigger the overreach penalty (see Hierarchy Gotcha) — drafts and reopened-incomplete notes always get the ordinary rubric report. Only user notes (`user-note-` prefix) are deletable. The top-right user bubble signs out: `signOut()` is now **async** — it ends the server session (`authClient.signOut()`) FIRST, then sweeps every `legend*` key EXCEPT the device-level `legend-skip-delete-confirm`, so new per-case keys never need registering.
- **Patient switching.** Sign-in lands on the Patient Lists activity (the rail's "All Patients" pseudo-list is the default, with specialty lists below it, all from the registry; a Hierarchy filter narrows either view by task grade); a row click opens a chart tab (`PatientTabBar`, same equal-width + freeze-on-close ergonomics as the note preview tabs) landing on Notes. The hamburger reopens the list; closing the last tab returns to it. Closing a tab discards that case's in-memory ui state (open drafts included — signed/pended notes persist). Do not put per-case state in components that survive a case switch without either living in the `CaseUiState` map or being under the keyed workspace remount (`usePersistentState` must never see its key change mid-life).
- **Encounters are display-curated.** `Encounter` has `date` (DD/MM/YYYY, never "Today") + optional `time`, a `class` (`inpatient`|`outpatient`|`ed`) for the Chart Review filter bar, an `admission` flag (red Type + Admissions filter), and hardcoded `provider`/`deptAbbrev`/`specialty`. Filters are additive-OR; none checked = show all.
- **Times are Unix timestamps.** Note-kind documents store `timestamp` (epoch seconds) and sort by it; display strings (`dateOfService`, `fileTime`) are separate fields. Report-kind documents have no `timestamp` (reached via their encounter row); the `Encounter` timeline is curated array order, not timestamp-sorted, with a per-row `group` recency bucket.
- **One stylesheet.** All styling lives in `src/App.css`; there are no CSS modules.
- **Note editor is contentEditable.** Rich text (B/I/U, per-run font size) wraps the selection in styled `<span>`s directly (not `execCommand` for sizing), so it survives the toolbar stealing focus. The "Insert SmartText" field (`lib/smarttext.ts`) drops bundle-aware Epic-style shells (H&P, PROGRESS, PTWR); `build()` autofills demographics (and, for PROGRESS, vitals+labs from `summary.vitalsTrend`/`bloods.ts`) and emits `***` wildcard chips (`st-wildcard`) that Tab cycles through.
- **Hierarchy / grades / overreach.** Each case's rubric declares a `task` (`CaseTask` with `code`, `label`, `minGrade`); the trainee picks a `Grade` (`fy` | `st3` | `consultant`) at sign-in (`lib/grades.ts`, `GRADES` in rank order). `PatientListPage` surfaces the task grade in the Hierarchy column and lets the list be filtered by it. `isOverreach(userGrade, minGrade)` is true when the trainee is *below* the case's `minGrade`; when they **sign** such a case, `WrapUpModule` replaces the rubric report with the `-1000` "acting above your competence" panel. Overreach is a consequence of signing only — drafts/pended notes never incur it (`StoredAttempt.signed`).
- **Edit, addendum, and ownership.** A signed note you own can be **addended** (a stamped block appended, `lib/userNotes.ts` `buildAddendumBlock`/`appendAddendum`, stored under `legend-addenda-<caseId>`); an incomplete note you own can be **reopened for edit** and refiled in place (`refileUserNote`); both surface as a `NoteDraft` with `mode: "edit" | "addendum"` + `targetNoteId`. Ownership is by doctor ID, not note prefix: `isOwnNote` matches a note's `authorId` against the user's `hcpId` or the case's `playerHcpId` (the persona the trainee plays). Deletion stays prefix-gated to `user-note-`.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
