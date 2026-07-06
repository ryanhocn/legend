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
npm run dev      # Vite dev server on http://localhost:5173
npm run build    # tsc -b && vite build (type-check + production build)
npm run lint     # eslint .
npm test         # vitest run (unit tests for the pure lib/ logic)
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
- `src/components/`: grouped by area (`chart/`, `notes/`, `summary/`, `panels/`, `layout/` (incl. `PatientTabBar`), `patients/` (`PatientListPage`), `wrapup/` (`WrapUpDock` floating panel + `WrapUpModule` (embeddable body) + `FeedbackReport`)), plus top-level `SignInPage.tsx`, `PatientWorkspace.tsx`, `RotateGate.tsx`. `panels/LetterPage.tsx` is the shared Epic-style letter-page chrome used by both `NotePreview` and `ReportPreview`.
- `src/data/patients/<caseId>/`: ALL of a case's content: `patient.json` (demographics, `CasePatient`), `summary.ts` (`CaseSummary`), `bloods.ts`, `documents.ts` (the *static* source of truth for clinical documents, a `ClinicalDocument[]` discriminated on `kind`), `encounters.ts` (timeline), `rubric.ts` + `rubric.test.ts` (scoring rubric + model note). See CASE_AUTHORING.md for the full authoring contract.
- `src/data/patients/index.ts`: the case registry (`caseRegistry: CaseBundle[]`, `getCase`, `listSpecialties`). Adding a case = folder + one entry here.
- `src/context/CaseContext.ts`: `useCase()` delivers the active `CaseBundle` to workspace components (sidebar, banners, summary, wrap-up); only valid under the provider.
- `src/data/`: shared UI config (`tabs.ts`).
- `src/types.ts`: shared types (`MainTab`, `ChartTab`, `Encounter`, `ClinicalDocument` = `ClinicalNote` | `ClinicalReport` | `ClinicalLab` | `ClinicalMicro`, `Note`/`Report` aliases, `NoteDraft`, `NoteStatus`, `NoteCategory`, `CaseBundle`/`CasePatient`/`CaseSummary`/`CaseUiState`; note-feedback + session types `RubricItem`, `CaseRubric`, `RubricTrigger`, `PdqiDimension`, `UserProfile`, ...).
- `src/lib/`: pure, React-free, unit-tested logic. `clinician.ts` (name formatting), `rubric.ts` + `noteText.ts` (deterministic note scoring), `reflow.ts` (display-time line-break reflow for note rendering), `userNotes.ts` (builds signed/pended trainee notes), `session.ts` (sign-in/out + localStorage keys), `wrapupAttempt.ts` (persisted feedback attempt).
- `src/App.css`: single global stylesheet for the whole app.

## Gotchas

- **Tab types must match data.** `MainTab` / `ChartTab` in `src/types.ts` must stay in sync with the tab lists in `src/data/tabs.ts` (a mismatch is a build error under `tsc`).
- **One chart, many lenses.** Every static clinical document lives once in `documents.ts` with a `kind` (`note` | `letter` | `report` | `order` | `encounterSummary` | `lab` | `micro`) and an `encounterId`. The Notes activity (and Chart Review > Notes sub-tab) filter to `kind: "note"` — which now includes both the pre-authored inpatient notes and trainee-authored signed/pended notes (also `kind:"note"`, `encounterId:"enc-admission"`). `EncounterTable` resolves each row's primary document by `encounterId` (prefers a non-note file, else the matching note) and the right-rail `DocumentPanel` switches on `kind` (`NotePreview` / `LabReport` / `MicroReport` / `ReportPreview`). Structured `lab`/`micro` docs carry typed payloads rendered as Epic-style receipts (`ReportBanner` header); the admission `lab` reuses the case's `bloods.ts` to avoid drift. Don't *fork* the static document store, and don't move docs to `.md`/JSON without a loader — the localStorage user-note store (below) is the one sanctioned runtime store.
- **Trainee session + note feedback.** The app is gated behind `SignInPage`, which captures a `UserProfile` into localStorage; `App.tsx` bails to the gate until it's set. localStorage keys live in `lib/session.ts` (`legend-user`, `legend-user-notes-<caseId>`, `legend-skip-delete-confirm`) plus the wrap-up attempt key in `lib/wrapupAttempt.ts` and per-case sticky keys (`legend.sticky.<mrn>`). Sign publishes the draft as a signed user note (`lib/userNotes.ts`, id prefix `user-note-`) AND auto-opens the floating "Performance" feedback dock (`WrapUpDock`, `wrapupOpen` in the case's `CaseUiState` — not a main tab), which scores it against the per-case rubric (`lib/rubric.ts` + `data/patients/<caseId>/rubric.ts`); Pend files it Incomplete. Only user notes (`user-note-` prefix) are deletable. The top-right user bubble signs out: `signOut()` sweeps every `legend*` key EXCEPT the device-level `legend-skip-delete-confirm`, so new per-case keys never need registering.
- **Patient switching.** Sign-in lands on the Patient Lists activity (specialty-grouped, from the registry); a row click opens a chart tab (`PatientTabBar`, same equal-width + freeze-on-close ergonomics as the note preview tabs) landing on Notes. The hamburger reopens the list; closing the last tab returns to it. Closing a tab discards that case's in-memory ui state (open drafts included — signed/pended notes persist). Do not put per-case state in components that survive a case switch without either living in the `CaseUiState` map or being under the keyed workspace remount (`usePersistentState` must never see its key change mid-life).
- **Encounters are display-curated.** `Encounter` has `date` (DD/MM/YYYY, never "Today") + optional `time`, a `class` (`inpatient`|`outpatient`|`ed`) for the Chart Review filter bar, an `admission` flag (red Type + Admissions filter), and hardcoded `provider`/`deptAbbrev`/`specialty`. Filters are additive-OR; none checked = show all.
- **Times are Unix timestamps.** Note-kind documents store `timestamp` (epoch seconds) and sort by it; display strings (`dateOfService`, `fileTime`) are separate fields. Report-kind documents have no `timestamp` (reached via their encounter row); the `Encounter` timeline is curated array order, not timestamp-sorted, with a per-row `group` recency bucket.
- **One stylesheet.** All styling lives in `src/App.css`; there are no CSS modules.
- **Note editor is contentEditable.** Rich text (B/I/U, per-run font size) wraps the selection in styled `<span>`s directly (not `execCommand` for sizing), so it survives the toolbar stealing focus.
