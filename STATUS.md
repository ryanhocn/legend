# STATUS: Legend

> Living state. Update at the end of every working block so a fresh session can resume from here after `/clear`.

Last updated: 2026-07-04
Branch / worktree: main

## Done
- Chart Review redesign + encounter receipts + Results module: recovered from
  Claude Code file-history after an accidental hard reset, verified green,
  committed as 71d79a9.
- Note-feedback loop specced in SPEC.md (rubric checklist scoring, PDQI-9 framing,
  deterministic matcher first, LLM judge later).
- README roadmap section added (cites PDQI-9 / Stetson 2012 for the hackathon story).

## In flight
- Phase 1 of SPEC.md: scoring engine (types, src/lib/noteText.ts, src/lib/rubric.ts,
  vitest setup, tests first).

## Blocked / decisions needed
- None.

## Notes for next session
- NEVER leave verified work uncommitted. The June work sat 18 days uncommitted and a
  hard reset destroyed it; recovery recipe is in project memory
  (claude-file-history-recovery).
- Wrap-up tab already exists in MainTab ("wrapup") rendering PlaceholderModule; the
  feedback UI replaces that in Phase 3.
- Note drafts are in-memory only (App.tsx useState); the editor body is contentEditable
  HTML, so scoring needs the noteText.ts plain-text extraction.
- Pre-existing lint error in StickyNotePopup.tsx (react-hooks/immutability) predates
  all of this; do not "fix" it as a drive-by.
