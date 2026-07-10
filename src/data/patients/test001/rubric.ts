import type { CaseRubric } from "../../../types";

/**
 * Scoring rubric for the blank TestList patient (Test, Test). This is not a
 * clinical teaching case — it exists so a signed note can be scored end to end
 * (Sign -> Performance dock) while Ryan exercises prod note persistence. Two
 * minimal-but-real items: one critical safety catch (recognise it is a
 * synthetic non-clinical record) and one plan item (state the persistence-check
 * purpose).
 *
 * Trigger hygiene: the PROGRESS SmartText pastes the vitals line and every
 * bloods row into the note body. Neither item below is satisfiable by that
 * text — every trigger word ("synthetic", "placeholder", "persistence", ...) is
 * interpretive and never appears in the autofilled template.
 *
 * All content is fabricated for education and simulation only. Not for clinical
 * use.
 */
export const caseTest001Rubric: CaseRubric = {
  caseId: "test001",
  noteType: "Progress Note",
  task: { code: "progress", label: "TEST NOTE", minGrade: "fy" },
  wordBand: { target: 45, max: 150 },
  sections: [
    ["impression", "assessment"],
    ["plan"],
  ],
  items: [
    {
      id: "safety-synthetic",
      label: "Recognises this is a synthetic, non-clinical test patient",
      category: "safety",
      weight: 10,
      critical: true,
      triggers: [
        [["synthetic", "placeholder", "fabricated", "simulation only"]],
        [
          [
            "no clinical action",
            "no action needed",
            "no action required",
            "not a clinical case",
            "non-clinical",
          ],
        ],
      ],
      explanation:
        "Every field on this chart is a placeholder: there is no clinical problem to act on. Naming it as a synthetic, non-clinical test record is the whole point of the note — this case exists only to exercise note persistence, not to be managed.",
      pdqi: ["accurate", "useful"],
    },
    {
      id: "plan-persistence-check",
      label: "States the note's purpose (a prod persistence check)",
      category: "plan",
      weight: 8,
      triggers: [
        [
          ["persistence", "persist", "persists", "saved", "stored"],
          ["note", "server", "backend", "prod", "production"],
        ],
        [["persistence check", "persistence test", "prod persistence"]],
      ],
      explanation:
        "The note should record why it was written: to confirm a signed note persists to the server backend in production. That intent is what makes this a usable persistence fixture rather than an empty chart.",
      pdqi: ["useful", "thorough"],
    },
  ],
  modelNote: `TEST NOTE — synthetic placeholder patient

This is a synthetic test patient and not a clinical case; no clinical action is required. The chart exists only to check that a signed note persists to the server backend in production.

Impression: Placeholder record, no clinical problem.

Plan: Sign this note to run the prod persistence check, then reload and confirm the saved note returns from the backend.`,
};
