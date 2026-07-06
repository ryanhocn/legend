# SmartText templates + sticky note fixes

Date: 2026-07-07
Status: approved

## Goal

Two small sticky-note fixes, plus an Epic-style SmartText (dot phrase) system in the note editor: type `hp` into SmartText field, get an H&P template with demographics autofilled and `***` wildcard fields the trainee tabs through and completes from chart review.

## Non-goals

- No sign-in or toolbar toggle. SmartText only fires when the trainee invokes it from the Insert SmartText field, so the feature is opt-in by nature.
- No in-body dot-phrase trigger. In Epic, dot phrases are user-defined shortcuts; SmartText is the system default. Roadmap item: user-defined dot phrases (typed in the note body) once accounts exist.
- No full Epic-style history autofill (PMH/PSH/meds pulled from the chart). Roadmap item: offer it as an unlockable after sustained >75% rubric performance, once accounts exist.
- No per-case template authoring. Templates fill only from data every case already has (`patient.json` + admission encounter).

## Part 1: Sticky note fixes

In `StickyNotePopup.tsx` and `App.css`:

1. Remove the `Star` icon and the "Pop out" button from the title bar (and the `Star` import).
2. Increase the default size from 240x150 to 340x240.
3. Persist position and size under one global key `legend.sticky.layout` (JSON `{x, y, w, h}`) via `usePersistentState`. The key is constant, so the never-change-key rule for `usePersistentState` holds. Layout is global, not per patient: the sticky should sit in the same place on every chart; only its text is per MRN. Sign-out sweeps the key along with the other `legend*` keys, which is consistent with existing behavior.
   - Position: written on drag (same pointer handlers), clamped to the viewport on load so a saved position off a smaller window stays reachable.
   - Size: the popup already uses CSS `resize: both`; a `ResizeObserver` on the popup element captures user resizes and writes `w`/`h`, which apply back as inline width/height.

## Part 2: SmartText engine

### Pure logic: `src/lib/smarttext.ts` (unit-tested, React-free)

- `SmartPhrase = { id, label, description, build(patient: CasePatient, admissionDate: string) => html }`. Two phrases ship: `HP` and `PROGRESS`.
- `matchPhrases(query)`: case-insensitive substring match against id and label, so `hp`, `HP`, and `prog` all resolve. Returns matches for the suggestion dropdown.
- Wildcards in built HTML are inline chips: `<span class="st-wildcard" contenteditable="false">***</span>`, styled like the pink boxed `***` chips in `references/EMR/epic_smarttext_.FLOORHP8.png`.

### Editor integration: `NoteEditor.tsx`

- The existing dead "Insert SmartText" toolbar input becomes the entry point: typing filters `matchPhrases` results into a dropdown under the field (id + label); arrow keys move the highlight, Enter or click inserts, Escape dismisses and clears.
- Insertion: splice the template HTML at the last saved editor caret (`savedRange`, already maintained for the font-size dropdown; falls back to end of note if none), then select the first wildcard chip and focus the editor.
- Tab / Shift+Tab: cycle to the next/previous `.st-wildcard` chip by selecting the whole node, so typing replaces the chip wholesale. Chips are click-selectable and deletable when a section does not apply. With no chips in the note, Tab keeps its default behavior.
- Sign gate: Sign is disabled while any `.st-wildcard` chip remains, with the reason shown ("Complete all *** fields before signing"). Pend stays allowed with chips outstanding. Both match real Epic. Side effect: signed notes never contain chips, so `rubric.ts` scoring and `noteText.ts` extraction are untouched by this feature.

### Known risk

Caret behavior around inline `contenteditable="false"` spans has browser quirks. Fallback if chips misbehave: editable spans whose contents get selected on Tab. Same UX, weaker guarantee against half-edited wildcards.

## Part 3: Templates (demographics-only autofill)

- `HP` (flagship, modelled on the reference image): bold `ADMISSION H&P` header line, admission date (from the case's admission-flagged encounter) and PCP line, then `CC: ***`, an HPI stem such as "Bennett, Sandra is a 57yr old female with ***", and sections for PMH, PSH, Allergies (autofilled from `patient.allergies`), Medications, Physical Exam, Labs, Assessment, Plan. Everything not in `patient.json` is a wildcard.
- `PROGRESS`: SOAP skeleton with the name/date stem and wildcards for Subjective, Objective, Assessment, Plan.

## Testing

- Vitest (existing `src/lib` convention): `matchPhrases` fuzzy matching, template builders (given a `CasePatient`, output contains the autofilled fields and the expected wildcard count).
- Manual verify in the running app: type `HP` in SmartText field in draft, accept, tab through chips, confirm Sign disabled until all chips resolved, confirm signed note scores normally in the Performance dock. Sticky note: move, resize, switch patients and reload, layout persists; default size correct on fresh state.
