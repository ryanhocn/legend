import type { Encounter } from "../../../types";

/**
 * Chart Review > Encounters timeline for the subdural case (Marchant, Eileen, 79F).
 * Newest first, grouped by recency like Epic's Chart Review. A row resolves its
 * primary document by `encounterId` (see documents.ts) and opens it in the right rail.
 *
 * Array order is the timeline's source of truth: the recency buckets are
 * hand-curated (the 26/06 index fall sits under "2 Weeks Ago") and not
 * reproducible by date math, so the rows are kept in display order rather than
 * sorted. The current date for this case is 06/07/2026 (what reads "Today" in
 * the notes); the readmission was yesterday evening, 05/07/2026, and the index
 * fall / ED attendance was 10 days ago on 26/06/2026.
 *
 * `class` drives the filter bar (inpatient / outpatient / ed); `admission` is set
 * only on the admission event itself. `provider`, `deptAbbrev` and `specialty` are
 * hardcoded display metadata for this synthetic case.
 *
 * All content is synthetic. For education and simulation only. Not for clinical use.
 */
export const caseSubdural001Encounters: Encounter[] = [
  {
    id: "enc-micro-urine",
    date: "06/07/2026",
    time: "10:05",
    class: "inpatient",
    type: "Microbiology",
    specialty: "Microbiology",
    deptAbbrev: "MICRO",
    provider: "",
    description:
      "Urine culture (MSU): mixed growth, ?contamination — does not support UTI. Final at 48h.",
    status: "Preliminary",
    location: "Lab",
  },
  {
    id: "enc-ward-round",
    date: "06/07/2026",
    time: "08:30",
    class: "inpatient",
    type: "Ward Round",
    specialty: "Geriatrics",
    deptAbbrev: "COTE",
    provider: "Osei, Grace, MD",
    description:
      "Post-take review. ?UTI / deconditioning. 'Sleepy but rousable — poor night's sleep.' Apixaban continued.",
    status: "Open",
    location: "Elderly Care Unit",
  },
  {
    id: "enc-cxr",
    date: "05/07/2026",
    time: "23:50",
    class: "inpatient",
    type: "Imaging",
    specialty: "Radiology",
    deptAbbrev: "RADCX",
    provider: "Iqbal, Noor, MD",
    description:
      "CXR (confusion screen): lungs clear, no consolidation. No chest source for the presentation.",
    status: "Final",
    location: "Radiology",
  },
  {
    id: "enc-admission",
    date: "05/07/2026",
    time: "21:10",
    class: "inpatient",
    type: "Admission (Current)",
    specialty: "Geriatrics",
    deptAbbrev: "COTE",
    provider: "Osei, Grace, MD",
    description:
      "Admitted from ED. Clerked as ?UTI / deconditioning. Fluctuating drowsiness 10 days after a fall — on apixaban.",
    status: "Admitted",
    location: "Elderly Care Unit",
    principalProblem: "Fluctuating drowsiness — clerked as ?UTI / deconditioning",
    admission: true,
  },
  {
    id: "enc-bloods-admit",
    date: "05/07/2026",
    time: "20:55",
    class: "inpatient",
    type: "Bloods",
    specialty: "Clinical Biochemistry",
    deptAbbrev: "LAB",
    provider: "",
    description:
      "Bland panel: Hb 121, WCC 8.9, CRP 22, Na 132, calcium normal. INR 1.1 — does not exclude apixaban effect.",
    status: "Final",
    location: "Lab",
  },
  {
    id: "enc-ed",
    date: "05/07/2026",
    time: "19:20",
    class: "ed",
    type: "ED Note",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Kaur, Simran, MD",
    description:
      "Drowsy episodes + headache + off legs, 10 days post-fall. Dip trace leucocytes → ?UTI / deconditioning. Referred medicine.",
    status: "Signed",
    location: "ED",
  },
  {
    id: "enc-triage",
    date: "05/07/2026",
    time: "18:05",
    class: "ed",
    type: "ED Triage",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Adebayo, Funmi, RN",
    description:
      "Brought by daughter: 'keeps falling asleep, not herself'. GCS 15 at triage, NEWS2 = 1. Triage: Standard.",
    status: "Signed",
    location: "ED",
  },
  {
    id: "enc-gp-fall-fu",
    group: "1 Week Ago",
    date: "30/06/2026",
    time: "15:40",
    class: "outpatient",
    type: "Telephone",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Byrne, Colm, MD",
    description:
      "Post-fall telephone review: quieter, more tired, occasional headache — attributed to the upset of the fall. Safety-netted.",
    status: "Signed",
    location: "GP",
  },
  {
    id: "enc-ed-fall",
    group: "2 Weeks Ago",
    date: "26/06/2026",
    time: "14:55",
    class: "ed",
    type: "ED Visit",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Marsh, Elliot, MD",
    description:
      "Mechanical fall, head strike. Small scalp haematoma, GCS 15. On apixaban — discharged, 'no CT indicated'.",
    status: "Signed",
    location: "ED",
  },
  {
    id: "enc-refill-apixaban",
    group: "2 Weeks Ago",
    date: "18/06/2026",
    time: "09:05",
    class: "outpatient",
    type: "Refill",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Byrne, Colm, MD",
    description: "Apixaban 5 mg PO BD — 56 tablets. Repeat issued (dosette box).",
    status: "Dispensed",
    location: "Community Pharmacy",
  },
  {
    id: "enc-anticoag-review",
    group: "2 Months Ago",
    date: "21/04/2026",
    time: "10:30",
    class: "outpatient",
    type: "Appointment",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Byrne, Colm, MD",
    description:
      "Annual AF/anticoagulation review. CHA2DS2-VASc 4, HAS-BLED 2. Continue apixaban 5 mg BD; falls discussed.",
    status: "Signed",
    location: "GP",
  },
  {
    id: "enc-bloods-gp",
    group: "2 Months Ago",
    date: "21/04/2026",
    time: "09:15",
    class: "outpatient",
    type: "Bloods",
    specialty: "Clinical Biochemistry",
    deptAbbrev: "LAB",
    provider: "",
    description: "Anticoagulation review bloods: creatinine 82, eGFR 61, Hb 124. 5 mg BD dose still correct.",
    status: "Final",
    location: "Lab",
  },
  {
    id: "enc-gp-falls",
    group: "8 Months Ago",
    date: "10/11/2025",
    time: "11:20",
    class: "outpatient",
    type: "Appointment",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Byrne, Colm, MD",
    description:
      "Falls review (trip in the garden, no head injury). Strength & balance referral, stick provided, bone health reviewed.",
    status: "Signed",
    location: "GP",
  },
  {
    id: "enc-cardiology-af",
    group: "2 Years Ago",
    date: "12/09/2023",
    time: "14:10",
    class: "outpatient",
    type: "Appointment",
    specialty: "Cardiology",
    deptAbbrev: "CARD",
    provider: "Fontaine, Louis, MD",
    description:
      "New persistent AF. Rate control with bisoprolol; apixaban 5 mg BD started (CHA2DS2-VASc indication).",
    status: "Closed",
    location: "Cardiology Clinic",
  },
];
