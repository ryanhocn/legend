import type { Encounter } from "../../../types";

/**
 * Chart Review > Encounters timeline for the DKA case (Farrell, Joshua, 19M).
 * Newest first, grouped by recency like Epic's Chart Review. A row resolves its
 * primary document by `encounterId` (see documents.ts) and opens it in the
 * right rail.
 *
 * Array order is the timeline's source of truth: the recency buckets are
 * hand-curated (the 25/05 GP visit sits under "6 Weeks Ago") and not
 * reproducible by date math, so the rows are kept in display order rather than
 * sorted. The current date for this case is 06/07/2026 (what reads "Today").
 * The prior history is deliberately sparse — he is 19 and previously healthy;
 * the one GP visit (tiredness, thirst attributed to revision) is where a
 * glucose was never checked.
 *
 * `class` drives the filter bar (inpatient / outpatient / ed); `admission` is
 * set only on the admission event itself. `provider`, `deptAbbrev` and
 * `specialty` are hardcoded display metadata for this synthetic case.
 *
 * All content is synthetic. For education and simulation only. Not for clinical use.
 */
export const caseDka001Encounters: Encounter[] = [
  {
    id: "enc-endo",
    date: "06/07/2026",
    time: "11:00",
    class: "ed",
    type: "Consult",
    specialty: "Endocrinology",
    deptAbbrev: "ENDO",
    provider: "Beaumont, Isla, MD",
    description:
      "Diabetes team review. New T1DM with DKA resolving on FRIII. Basal glargine started; DSN education, antibodies sent.",
    status: "Signed",
    location: "ED Majors",
  },
  {
    id: "enc-vbg-2",
    date: "06/07/2026",
    time: "10:30",
    class: "ed",
    type: "Blood Gas",
    specialty: "Clinical Biochemistry",
    deptAbbrev: "POCT",
    provider: "",
    description:
      "Repeat VBG on treatment: pH 7.24, HCO3 14, ketones 4.1, K+ 3.6 on replacement. Improving.",
    status: "Final",
    location: "ED",
  },
  {
    id: "enc-nursing-friii",
    date: "06/07/2026",
    time: "09:40",
    class: "ed",
    type: "Nursing Note",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Gallagher, Niamh, RN",
    description:
      "FRIII running 6 units/hr, KCl 40 mmol/L in fluids, continuous ECG. Hourly CBG/ketones. Obs improving.",
    status: "Signed",
    location: "ED Majors",
  },
  {
    id: "enc-admission",
    date: "06/07/2026",
    time: "08:45",
    class: "ed",
    type: "Admission (Current)",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Drummond, Alice, MD",
    description:
      "Admitted from ED. Principal problem: diabetic ketoacidosis — new type 1 diabetes. ED obs, awaiting AMU bed.",
    status: "Admitted",
    location: "ED Majors",
    principalProblem: "Diabetic ketoacidosis — new presentation of type 1 diabetes",
    admission: true,
  },
  {
    id: "enc-review",
    date: "06/07/2026",
    time: "08:15",
    class: "ed",
    type: "Senior Review",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Drummond, Alice, MD",
    description:
      "EM consultant board round. 06:10 VBG never actioned — pH 7.18, ketones 5.8. DKA, NOT gastroenteritis. K+ 3.4 flagged; FRIII + KCl started.",
    status: "Signed",
    location: "ED Majors",
  },
  {
    id: "enc-bloods-admit",
    date: "06/07/2026",
    time: "06:55",
    class: "ed",
    type: "Bloods",
    specialty: "Clinical Biochemistry",
    deptAbbrev: "LAB",
    provider: "",
    description:
      "Glucose 26.8, ketones 5.8, K+ 3.4, bicarbonate 11, creatinine 118. CRP 4. HbA1c 118.",
    status: "Final",
    location: "Lab",
  },
  {
    id: "enc-ondansetron",
    date: "06/07/2026",
    time: "06:12",
    class: "ed",
    type: "Order",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Prentice, Oliver, MD",
    description:
      "Ondansetron 4 mg IV stat — '?viral gastroenteritis'. Oral fluid trial; anticipate discharge if tolerating.",
    status: "Given",
    location: "ED",
  },
  {
    id: "enc-vbg",
    date: "06/07/2026",
    time: "06:10",
    class: "ed",
    type: "Blood Gas",
    specialty: "Clinical Biochemistry",
    deptAbbrev: "POCT",
    provider: "",
    description:
      "VBG: pH 7.18, HCO3 11, glucose 27.3, KETONES 5.8, K+ 3.4. Resulted 06:10 — not actioned until 08:15.",
    status: "Final",
    location: "ED",
  },
  {
    id: "enc-ed",
    date: "06/07/2026",
    time: "06:00",
    class: "ed",
    type: "ED Note",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Prentice, Oliver, MD",
    description:
      "24 h vomiting + abdo pain, flatmates unwell. '?Viral gastroenteritis — young, should settle.' Ondansetron + oral fluids, consider discharge.",
    status: "Signed",
    location: "ED Majors",
  },
  {
    id: "enc-nursing-obs",
    date: "06/07/2026",
    time: "05:35",
    class: "ed",
    type: "Nursing Note",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Gallagher, Niamh, RN",
    description:
      "Not tolerating oral fluids. DEEP SIGHING breathing, pear-drops smell, HR 120, large urine volumes. VBG taken.",
    status: "Signed",
    location: "ED",
  },
  {
    id: "enc-triage",
    date: "06/07/2026",
    time: "04:55",
    class: "ed",
    type: "ED Triage",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Timms, Bethany, RN",
    description:
      "24 h vomiting + abdo pain after takeaway; flatmates had 'a bug'. Also weeks of thirst, nocturia, looser clothes. '?Viral gastroenteritis, oral fluids trial.'",
    status: "Signed",
    location: "ED",
  },
  {
    id: "enc-gp-tired",
    group: "6 Weeks Ago",
    date: "25/05/2026",
    time: "15:40",
    class: "outpatient",
    type: "Appointment",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Holloway, Margaret, MD",
    description:
      "'Tired all the time' during exams. Thirst/urinary frequency attributed to fluid intake + warm weather. Weight 68.4 kg. No bloods — review in 4 weeks.",
    status: "Signed",
    location: "GP",
  },
  {
    id: "enc-ed-ankle",
    group: "Over 1 Year Ago",
    date: "14/09/2024",
    time: "18:20",
    class: "ed",
    type: "ED Visit",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Doyle, Sean, MD",
    description:
      "Left ankle inversion injury (five-a-side). X-ray no fracture. Lateral ligament sprain — RICE, discharged.",
    status: "Signed",
    location: "ED",
  },
];
