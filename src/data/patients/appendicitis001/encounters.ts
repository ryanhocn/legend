import type { Encounter } from "../../../types";

/**
 * Chart Review > Encounters timeline for the atypical appendicitis case
 * (Fenwick, Dorothy, 74F). Newest first, grouped by recency like Epic's Chart
 * Review. A row resolves its primary document by `encounterId` (see
 * documents.ts) and opens it in the right rail.
 *
 * Array order is the timeline's source of truth: the recency buckets are
 * hand-curated and not reproducible by date math, so the rows are kept in
 * display order rather than sorted. The current date for this case is
 * 06/07/2026 (a Monday); she was admitted on Saturday evening, 04/07/2026 —
 * a weekend admission with thin cover, which is how two days of rising bloods
 * went unread.
 *
 * `class` drives the filter bar (inpatient / outpatient / ed); `admission` is
 * set only on the admission event itself. `provider`, `deptAbbrev` and
 * `specialty` are hardcoded display metadata for this synthetic case.
 *
 * All content is synthetic. For education and simulation only. Not for clinical use.
 */
export const caseAppendicitis001Encounters: Encounter[] = [
  {
    id: "enc-bloods-today",
    date: "06/07/2026",
    time: "07:55",
    class: "inpatient",
    type: "Bloods",
    specialty: "Clinical Biochemistry",
    deptAbbrev: "LAB",
    provider: "",
    description:
      "WCC 17.8, CRP 203, creatinine 148 (92 on admission, baseline 76). Resulted 07:55 — no review documented.",
    status: "Final",
    location: "Lab",
  },
  {
    id: "enc-bloods-d2",
    group: "Yesterday",
    date: "05/07/2026",
    time: "16:40",
    class: "inpatient",
    type: "Bloods",
    specialty: "Clinical Biochemistry",
    deptAbbrev: "LAB",
    provider: "",
    description:
      "WCC 14.6, CRP 118, creatinine 121 — all up from admission. Filed without comment.",
    status: "Final",
    location: "Lab",
  },
  {
    id: "enc-ward-round-d2",
    date: "05/07/2026",
    time: "08:40",
    class: "inpatient",
    type: "Ward Round",
    specialty: "General Surgery",
    deptAbbrev: "GSSAU",
    provider: "Hughes, Rhian, MD",
    description:
      "Sunday SHO review: 'constipation — continue laxatives, enema, home when bowels open'. Temp 37.6 noted, not escalated.",
    status: "Signed",
    location: "SAU",
  },
  {
    id: "enc-admission",
    group: "2 Days Ago",
    date: "04/07/2026",
    time: "21:15",
    class: "inpatient",
    type: "Admission (Current)",
    specialty: "General Surgery",
    deptAbbrev: "GSSAU",
    provider: "Whitmore, James, MD",
    description:
      "Admitted from ED under General Surgery. Principal problem: constipation (?faecal loading). SAU Bay 2.",
    status: "Admitted",
    location: "SAU",
    principalProblem: "Constipation with right-sided abdominal discomfort",
    admission: true,
  },
  {
    id: "enc-ed",
    date: "04/07/2026",
    time: "15:10",
    class: "ed",
    type: "ED Note",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Kaminski, Piotr, MD",
    description:
      "Vague right-sided discomfort + bowels not opened 3/7. Soft abdomen, mild RIF fullness. PR declined. ?Constipation — surgical referral.",
    status: "Signed",
    location: "ED",
  },
  {
    id: "enc-bloods-admit",
    date: "04/07/2026",
    time: "14:55",
    class: "ed",
    type: "Bloods",
    specialty: "Clinical Biochemistry",
    deptAbbrev: "LAB",
    provider: "",
    description:
      "WCC 11.9, CRP 46, creatinine 92. LFTs and amylase normal. 'Mildly raised — ?constipation/viral.'",
    status: "Final",
    location: "Lab",
  },
  {
    id: "enc-axr",
    date: "04/07/2026",
    time: "14:40",
    class: "ed",
    type: "Imaging",
    specialty: "Radiology",
    deptAbbrev: "RADXR",
    provider: "Okonkwo, Ada, MD",
    description:
      "AXR: moderate faecal loading, no obstruction, no free gas. Plain film cannot assess the appendix — correlation advised.",
    status: "Final",
    location: "Radiology",
  },
  {
    id: "enc-urinalysis",
    date: "04/07/2026",
    time: "14:20",
    class: "ed",
    type: "Urinalysis",
    specialty: "Point-of-Care Testing",
    deptAbbrev: "POCT",
    provider: "",
    description: "Dipstick: trace leucocytes, nitrite negative. Does not support UTI.",
    status: "Final",
    location: "ED",
  },
  {
    id: "enc-triage",
    date: "04/07/2026",
    time: "13:40",
    class: "ed",
    type: "ED Triage",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Mercer, Lily, RN",
    description:
      "74F, 'not been opened bowels 3 days', off food, right-sided ache. T 37.4. NEWS2 = 1.",
    status: "Signed",
    location: "ED",
  },
  {
    id: "enc-gp-tel",
    group: "Last Week",
    date: "01/07/2026",
    time: "09:40",
    class: "outpatient",
    type: "Telephone",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Nair, Priya, MD",
    description:
      "Telephone: 2 days no bowel motion, vague right-sided ache. Advised senna + fluids, safety-netted.",
    status: "Signed",
    location: "GP",
  },
  {
    id: "enc-refill-metformin",
    group: "1 Month Ago",
    date: "05/06/2026",
    time: "09:05",
    class: "outpatient",
    type: "Refill",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Nair, Priya, MD",
    description: "Metformin 1 g PO BD — 112 tablets. Repeat issued.",
    status: "Dispensed",
    location: "Community Pharmacy",
  },
  {
    id: "enc-refill-ramipril",
    date: "05/06/2026",
    time: "09:05",
    class: "outpatient",
    type: "Refill",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Nair, Priya, MD",
    description: "Ramipril 2.5 mg PO OD — 56 tablets. Repeat issued.",
    status: "Dispensed",
    location: "Community Pharmacy",
  },
  {
    id: "enc-diabetes-review",
    group: "3 Months Ago",
    date: "02/04/2026",
    time: "10:30",
    class: "outpatient",
    type: "Appointment",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Nair, Priya, MD",
    description:
      "Annual diabetes review. HbA1c 54 on metformin 1 g BD. Creatinine 76, eGFR 74 — baseline renal function.",
    status: "Signed",
    location: "GP",
  },
  {
    id: "enc-bloods-annual",
    date: "02/04/2026",
    time: "09:20",
    class: "outpatient",
    type: "Bloods",
    specialty: "Clinical Biochemistry",
    deptAbbrev: "LAB",
    provider: "",
    description: "HbA1c 54 mmol/mol. Creatinine 76, eGFR 74. Lipids at target.",
    status: "Final",
    location: "Lab",
  },
  {
    id: "enc-colonoscopy",
    group: "1 Year Ago",
    date: "14/03/2025",
    time: "11:15",
    class: "outpatient",
    type: "Endoscopy",
    specialty: "Gastroenterology",
    deptAbbrev: "ENDO",
    provider: "Farrow, Edward, MD",
    description:
      "Colonoscopy (altered bowel habit): sigmoid diverticulosis, otherwise normal to caecum. Appendiceal orifice normal.",
    status: "Final",
    location: "Endoscopy Unit",
  },
  {
    id: "enc-htn-review",
    date: "10/02/2025",
    time: "10:00",
    class: "outpatient",
    type: "Appointment",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Nair, Priya, MD",
    description: "Hypertension review. BP 134/78 on ramipril. Renal function normal. No acute issues.",
    status: "Closed",
    location: "GP",
  },
];
