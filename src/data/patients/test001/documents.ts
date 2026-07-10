import type { ClinicalDocument, LabFlag, LabRow } from "../../../types";
import { bloods } from "./bloods";

/** SI units for the admission panel, keyed by `bloods` test name. */
const ADMISSION_LAB_UNITS: Record<string, string> = {
  Hb: "g/L",
  WCC: "x10⁹/L",
  Platelets: "x10⁹/L",
  Sodium: "mmol/L",
  Potassium: "mmol/L",
  Creatinine: "µmol/L",
};

function toLabFlag(descriptive: string): LabFlag {
  if (/low/i.test(descriptive)) return "L";
  if (/high/i.test(descriptive)) return "H";
  return "";
}

/** Admission bloods receipt rows derived from the shared `bloods` summary panel. */
const admissionLabRows: LabRow[] = bloods.map((result) => ({
  test: result.test,
  value: result.value,
  units: ADMISSION_LAB_UNITS[result.test] ?? "",
  range: result.range,
  flag: toLabFlag(result.flag),
}));

/**
 * Single source of truth for the blank TestList patient (Test, Test). This is
 * NOT a clinical teaching case: it exists so Ryan can safely exercise
 * server-side note persistence in prod without touching real training cases.
 * Content is intentionally minimal and obviously placeholder — one clerking
 * note, one admission summary, and the admission bloods receipt.
 *
 * All content is fabricated for education and simulation only. Not for clinical
 * use.
 */
export const caseTest001Documents: ClinicalDocument[] = [
  {
    kind: "note",
    id: "note-clerking-001",
    encounterId: "enc-admission",
    category: "H&P",
    noteType: "Admission Clerking",
    author: "Testerson, Alex",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "(A) TestList — Ward T",
    dateOfService: "01/01/26 0900",
    fileTime: "01/01/26 0915",
    timestamp: 1767258000,
    status: "signed",
    admission: true,
    body: `PLACEHOLDER ADMISSION CLERKING — TEST PATIENT

This is a synthetic test patient. It is not a clinical case. The chart exists
only to verify server-side note persistence in the production environment.

CC: none — placeholder record.

History: none recorded. Everything on this chart is fabricated and deliberately
blank.

Examination: unremarkable. Obs within normal limits, NEWS2 0.

Bloods: routine admission panel, all within range.

Impression: no clinical problem. Placeholder test patient.

Plan: none required — this record is for prod persistence checks only.

All patient data are synthetic. For education and simulation only. Not for
clinical use.`,
  },
  {
    kind: "encounterSummary",
    id: "admission-encounter-001",
    encounterId: "enc-admission",
    title: "Admission — TestList (Placeholder)",
    type: "Hospital Encounter",
    department: "TestList",
    author: "Consultant, Test, MD (Attending)",
    signedAt: "01/01 09:00",
    body: `ADMISSION  [Current]
01/01/2026 09:00 — present       Mount Verdant Hospital
Admitting / Attending: Consultant, Test, MD — TestList

PRINCIPAL PROBLEM:
None — placeholder test patient.

ENCOUNTER NOTES:
- Admission Clerking — Testerson, Alex, MD (TestList)

HOSPITAL PROBLEM LIST:
◆ None — placeholder test patient — PRINCIPAL

CARE TIMELINE:
08:30  Admission bloods — all within range
09:00  Admitted — TestList, Ward T Bay 1

VTE ASSESSMENT: not applicable (placeholder).
ALLERGIES: No known drug allergies.
CODE STATUS: For escalation. ISOLATION: None.

All patient data are synthetic. For education and simulation only. Not for clinical use.`,
  },
  {
    kind: "lab",
    id: "lab-bloods-admit-001",
    encounterId: "enc-bloods-admit",
    title: "Admission Bloods — FBC, U&E",
    status: "Final",
    specimen: "Blood (serum + EDTA), venepuncture",
    collected: "01/01/2026 08:30",
    received: "01/01/2026 08:46",
    reportedAt: "01/01/2026 09:05",
    orderedBy: "Testerson, Alex, MD (TestList)",
    resultingLab: "LegendCare Clinical Laboratory, Mount Verdant Hospital",
    rows: admissionLabRows,
  },
];

/** Note-kind documents only — feeds the Notes activity and Chart Review > Notes. */
export const caseTest001Notes = caseTest001Documents.filter(
  (doc): doc is Extract<ClinicalDocument, { kind: "note" }> => doc.kind === "note",
);
