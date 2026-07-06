# STATUS: Legend

> Living state. Update at the end of every working block so a fresh session can resume from here after `/clear`.

Last updated: 2026-07-06
Branch / worktree: main
Latest session: multi-case foundation (8d694ea registry, dec89c0 patient switching,
CASE_AUTHORING.md). Prior: Cloudflare deploy + README + mobile gate (3b04aeb..70c80ca).
Earlier ranges: 47ee20b..54a1ea1 (tab restructure), cce42a4..dc9f29b (note feedback).

## Done
- Restored the lost Chart Review + Results work from Claude Code file-history after
  an accidental hard reset, committed (71d79a9). Recovery recipe in project memory
  ([[claude-file-history-recovery]]).
- Note-feedback loop, all 3 SPEC phases shipped + browser-verified: scoring engine
  (626be84), cholangitis001 rubric + model note (ca57026), Wrap-Up UI (4a1efe7).
- Usable prototype (713ed9f): sign-in gate, Sign publishes a user note and opens
  Wrap-Up feedback, Pend files Incomplete, notes text search / urgent marks /
  multi-tab preview.
- Reading polish (1306d4f): letter-page note rendering + reflow, pixel-locked notes
  list, slim sidebar, sign-out via the user bubble.
- Demo polish (dc9f29b): removed unused global search, deletable user notes with an
  "always ignore" confirm, "Mount Verdant Hospital" rename, equal-width preview tabs.
- Tab restructure (5efaed9, 54a1ea1): land on Notes; Wrap-Up removed from the main tab
  strip and moved to a floating, resizable "Performance" dock (WrapUpDock, opens on
  Sign); "Results" tab relabeled "Labs & Tests" + redundant Labs chart sub-tab removed
  (LabsPanel.tsx deleted); shared LetterPage extracted so note AND report previews use
  the same Epic stationery; preview tabs narrower + freeze-on-close.
- Handoff doc reconciles (this session + prior): README, SPEC, CLAUDE.md match the code.
- Live demo deployed to Cloudflare **Workers static assets** (not Pages; Pages is legacy
  for new projects): https://legend.ryanho06.workers.dev. Config in `wrangler.jsonc`
  (`not_found_handling: "single-page-application"` handles deep links). Redeploy:
  `npm run build` then `npx wrangler deploy`. Auth via `npx wrangler login`.
- Mobile gate (70c80ca): narrow-portrait viewports get a "rotate or use a laptop"
  card (RotateGate); sign-in placeholders no longer suggest the patient's own name.
- Multi-case foundation, all 3 SPEC phases shipped + browser-verified:
  - Registry refactor (8d694ea): patient.json/summary/bloods moved into the case
    folder; `CaseBundle` registry (`data/patients/index.ts`); `CaseContext`/`useCase`
    replaces static case imports; `patient.caseId` renamed `mrn`.
  - Patient switching (dec89c0): Epic-style chart tabs below the top bar
    (PatientTabBar, freeze-on-close), full-screen Patient Lists activity grouped by
    specialty (PatientListPage, hamburger opens it, last-tab-close returns to it),
    per-case `CaseUiState` map so drafts/tabs survive switches, sign-out sweeps all
    `legend*` keys except the delete-confirm preference.
  - CASE_AUTHORING.md: the Cowork-facing contract for generating new cases
    (folder layout, type rules, rubric + required rubric.test.ts, registry hookup,
    acceptance checklist).

## In flight
- Nothing mid-change; the multi-case demo loop is ready.

## Next concrete step
- Cowork generates additional cases against CASE_AUTHORING.md (a couple per
  specialty). Each is a folder + registry entry; acceptance = the checklist at the
  bottom of that doc. Then, per the roadmap (memory [[legend-roadmap]]): simulated
  attending feedback as text — first stage needing a server-side API key; the
  Worker deploy was chosen so an API-proxy endpoint can be added to
  `wrangler.jsonc` + a small `main` script without replatforming.

## Ideas / later
- Persist open (unsigned) drafts; only signed/pended notes survive reload today.
- LLM judge layer for paraphrase-heavy rubric items (schema already judge-agnostic).
- SmartText note-editing helper (next editor feature after the demo).
- Second case: once one case bundles documents.ts + encounters.ts + rubric.ts, new
  cases are data-only.
- Epic-inspired backlog: hover previews, "new since last viewed", AI chart summary.

## Blocked / decisions needed
- None.

## Notes for next session
- Verify target: `npm test` (43 tests, 5 files), `npx tsc -b`, `npm run lint`.
  Lint carries ONE pre-existing error in StickyNotePopup.tsx
  (react-hooks/immutability) that predates all this work — do not "fix" as a drive-by.
- Unsigned note drafts are in-memory only (App.tsx useState); sign or pend before a
  reload or they're lost. Signed/pended user notes persist in localStorage.
- The editor body is contentEditable HTML; scoring/reflow go through the pure libs
  (`noteText.ts`, `reflow.ts`), which use string transforms not DOMParser so node
  tests and the browser agree.
- NEVER leave verified work uncommitted (the June work sat 18 days and a hard reset
  destroyed it).
- Note feedback is a floating "Performance" dock (`WrapUpDock`), NOT a main tab; it
  opens on Sign. If a doc or comment says "Wrap-Up tab", it's stale.
