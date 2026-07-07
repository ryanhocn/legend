import type { Encounter } from "../../../types";

/**
 * Chart Review > Encounters timeline for the NSTEMI-as-dyspepsia case
 * (Bennett, Sandra, 57F). Newest first, grouped by recency like Epic's Chart
 * Review. A row resolves its primary document by `encounterId` (see
 * documents.ts) and opens it in the right rail.
 *
 * Array order is the timeline's source of truth: the recency buckets are
 * hand-curated (the 14/04 entries sit under "3 Months Ago") and not
 * reproducible by date math, so the rows are kept in display order rather
 * than sorted. The current date for this case is 06/07/2026; the admission
 * was yesterday evening, 05/07/2026.
 *
 * `class` drives the filter bar (inpatient / outpatient / ed); `admission` is
 * set only on the admission event itself. `provider`, `deptAbbrev` and
 * `specialty` are hardcoded display metadata for this synthetic case.
 *
 * All content is synthetic. For education and simulation only. Not for clinical use.
 */
export const caseNstemi001Encounters: Encounter[] = [
  {
    id: "enc-ecg-repeat",
    date: "06/07/2026",
    time: "06:45",
    class: "inpatient",
    type: "ECG",
    specialty: "Cardiac Physiology",
    deptAbbrev: "ECG",
    provider: "",
    description:
      "Repeat 12-lead: deepening T-wave inversion V3–V6 (up to 4 mm) — dynamic change vs 05/07. ?Evolving ischaemia.",
    status: "Final",
    location: "AMU",
  },
  {
    id: "enc-bloods-trop2",
    date: "06/07/2026",
    time: "01:12",
    class: "inpatient",
    type: "Bloods",
    specialty: "Clinical Biochemistry",
    deptAbbrev: "LAB",
    provider: "",
    description:
      "hs-Troponin T 612 (admission sample 19:55: 38). Creatinine 171, eGFR 27, K 5.1.",
    status: "Final",
    location: "Lab",
  },
  {
    id: "enc-admission",
    group: "Yesterday",
    date: "05/07/2026",
    time: "21:05",
    class: "inpatient",
    type: "Admission (Current)",
    specialty: "General Medicine",
    deptAbbrev: "GMAMU",
    provider: "Adeyemi, Folake, MD",
    description:
      "Admitted from ED for serial troponins. Working label: dyspepsia / ?ACS low suspicion. AMU Bay 7.",
    status: "Admitted",
    location: "AMU",
    principalProblem: "Epigastric pain — ?dyspepsia, troponin under serial testing",
    admission: true,
  },
  {
    id: "enc-bloods-admit",
    date: "05/07/2026",
    time: "19:55",
    class: "inpatient",
    type: "Bloods",
    specialty: "Clinical Biochemistry",
    deptAbbrev: "LAB",
    provider: "",
    description:
      "hs-Troponin T 38 (ref <14). Creatinine 168, eGFR 28. Glucose 13.4, HbA1c 61. WCC and CRP normal.",
    status: "Final",
    location: "Lab",
  },
  {
    id: "enc-ed",
    date: "05/07/2026",
    time: "19:10",
    class: "ed",
    type: "ED Note",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Kowalski, Marek, MD",
    description:
      "Epigastric burning + nausea, settled with Gaviscon. Impression GORD/gastritis; troponin 'borderline, ?CKD'. Admit GM for serial troponin.",
    status: "Signed",
    location: "ED",
  },
  {
    id: "enc-ecg-ed",
    date: "05/07/2026",
    time: "18:40",
    class: "ed",
    type: "ECG",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "",
    description:
      "12-lead: sinus rhythm, T-wave inversion 1–2 mm V4–V6. Read in ED as 'non-specific'. Cardiology overread pending overnight.",
    status: "Final",
    location: "ED",
  },
  {
    id: "enc-triage",
    date: "05/07/2026",
    time: "18:10",
    class: "ed",
    type: "ED Triage",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Hughes, Bronwen, RN",
    description:
      "'Indigestion and feeling sick' walking from the car park; clammy on arrival, settled sitting. Gaviscon given. NEWS2 = 1.",
    status: "Signed",
    location: "ED",
  },
  {
    id: "enc-gp-indigestion",
    group: "3 Weeks Ago",
    date: "15/06/2026",
    time: "10:40",
    class: "outpatient",
    type: "Appointment",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Byrne, Eleanor, MD",
    description:
      "'Indigestion' on walking up the hill, settles with rest. Lansoprazole started; surgery ECG advised (not yet done).",
    status: "Signed",
    location: "GP",
  },
  {
    id: "enc-refill-metformin",
    group: "1 Month Ago",
    date: "05/06/2026",
    time: "09:20",
    class: "outpatient",
    type: "Refill",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Byrne, Eleanor, MD",
    description: "Metformin 500 mg PO, two tablets BD — 224 tablets. Repeat issued.",
    status: "Dispensed",
    location: "Community Pharmacy",
  },
  {
    id: "enc-refill-statin",
    group: "2 Months Ago",
    date: "12/05/2026",
    time: "08:55",
    class: "outpatient",
    type: "Refill",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Byrne, Eleanor, MD",
    description: "Atorvastatin 40 mg PO ON — 56 tablets. Repeat issued.",
    status: "Dispensed",
    location: "Community Pharmacy",
  },
  {
    id: "enc-refill-ramipril",
    date: "12/05/2026",
    time: "08:55",
    class: "outpatient",
    type: "Refill",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Byrne, Eleanor, MD",
    description: "Ramipril 5 mg PO OD — 56 tablets. Repeat issued. U&E due at annual review.",
    status: "Dispensed",
    location: "Community Pharmacy",
  },
  {
    id: "enc-diabetes-review",
    group: "3 Months Ago",
    date: "14/04/2026",
    time: "11:20",
    class: "outpatient",
    type: "Appointment",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Byrne, Eleanor, MD",
    description:
      "Annual diabetes review. HbA1c 61, eGFR 52 (declining), ACR 12.6. Father died of MI aged 54. QRISK high.",
    status: "Signed",
    location: "GP",
  },
  {
    id: "enc-bloods-diabetes",
    date: "14/04/2026",
    time: "09:40",
    class: "outpatient",
    type: "Bloods",
    specialty: "Clinical Biochemistry",
    deptAbbrev: "LAB",
    provider: "",
    description: "HbA1c 61 mmol/mol. Creatinine 98, eGFR 52. ACR 12.6. Total cholesterol 5.8.",
    status: "Final",
    location: "Lab",
  },
  {
    id: "enc-ed-2025",
    group: "8 Months Ago",
    date: "03/11/2025",
    time: "20:40",
    class: "ed",
    type: "ED Visit",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Murray, Ciaran, MD",
    description:
      "Epigastric discomfort after evening meal. ECG normal, single troponin 9 (negative). Discharged — dyspepsia.",
    status: "Signed",
    location: "ED",
  },
  {
    id: "enc-htn-review",
    group: "1 Year Ago",
    date: "10/07/2025",
    time: "09:30",
    class: "outpatient",
    type: "Appointment",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Byrne, Eleanor, MD",
    description:
      "Hypertension review. BP 152/92 — amlodipine added to ramipril. No chest pain reported at the time.",
    status: "Closed",
    location: "GP",
  },
];
