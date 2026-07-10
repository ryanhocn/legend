import type { Encounter } from "../../../types";

/**
 * Chart Review > Encounters timeline for the hyponatraemia case (Marsh,
 * Eileen, 71F). Newest first, grouped by recency like Epic's Chart Review. A
 * row resolves its primary document by `encounterId` (see documents.ts).
 *
 * Array order is the timeline's source of truth: the recency buckets are
 * hand-curated and not reproducible by date math. The current date for this
 * case is 09/07/2026 (the morning after an overnight admission on 08/07/2026).
 *
 * All content is synthetic. For education and simulation only. Not for clinical use.
 */
export const caseHyponatraemia001Encounters: Encounter[] = [
  {
    id: "enc-bloods-repeat",
    date: "09/07/2026",
    time: "06:55",
    class: "inpatient",
    type: "Bloods",
    specialty: "Clinical Biochemistry",
    deptAbbrev: "LAB",
    provider: "",
    description:
      "Repeat U&E: sodium 124 (118 on admission), potassium 3.6. Urea 2.9, creatinine 55.",
    status: "Final",
    location: "Lab",
  },
  {
    id: "enc-admission",
    date: "08/07/2026",
    time: "23:15",
    class: "inpatient",
    type: "Admission (Current)",
    specialty: "General Medicine",
    deptAbbrev: "GMAMU",
    provider: "Braithwaite, Helen, MD",
    description:
      "Admitted from ED. Confusion + fall with sodium 118 — clerked as ?dehydration, IV saline running. AMU Bay 6.",
    status: "Admitted",
    location: "AMU",
    principalProblem: "Severe hyponatraemia with confusion",
    admission: true,
  },
  {
    id: "enc-ed",
    date: "08/07/2026",
    time: "21:45",
    class: "ed",
    type: "ED Note",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Kaur, Simran, MD",
    description:
      "Confusion + fall. Na 118; brief unresponsive episode with twitching on the trolley 21:30 (?'funny turn'). IV saline started, referred to medicine.",
    status: "Signed",
    location: "ED",
  },
  {
    id: "enc-ct-head",
    date: "08/07/2026",
    time: "21:05",
    class: "inpatient",
    type: "Imaging",
    specialty: "Radiology",
    deptAbbrev: "RADCT",
    provider: "Varga, Tomas, MD",
    description:
      "CT head (non-contrast): no acute intracranial abnormality. No haemorrhage or collection.",
    status: "Final",
    location: "Radiology",
  },
  {
    id: "enc-bloods-admit",
    date: "08/07/2026",
    time: "20:55",
    class: "inpatient",
    type: "Bloods",
    specialty: "Clinical Biochemistry",
    deptAbbrev: "LAB",
    provider: "",
    description:
      "Sodium 118 (phoned by lab), potassium 3.4. Urea 3.1, creatinine 58. Glucose, calcium, CRP normal.",
    status: "Final",
    location: "Lab",
  },
  {
    id: "enc-triage",
    date: "08/07/2026",
    time: "19:10",
    class: "ed",
    type: "ED Triage",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Nwosu, Chidinma, RN",
    description:
      "Brought in by daughter after a fall — 'muddled' for days. AMT 4/10. NEWS2 = 3 (new confusion).",
    status: "Signed",
    location: "ED",
  },
  {
    id: "enc-refill-sertraline",
    group: "2 Weeks Ago",
    date: "24/06/2026",
    time: "09:14",
    class: "outpatient",
    type: "Refill",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Farrant, Joan, MD",
    description: "Sertraline 50 mg PO OD — 28 tablets. Repeat issued; review due with July bloods.",
    status: "Dispensed",
    location: "Community Pharmacy",
  },
  {
    id: "enc-bp-review",
    group: "3 Weeks Ago",
    date: "16/06/2026",
    time: "10:30",
    class: "outpatient",
    type: "Appointment",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Farrant, Joan, MD",
    description:
      "BP above target on amlodipine — indapamide 2.5 mg ADDED. U&E arranged for 4 weeks after starting.",
    status: "Signed",
    location: "GP",
  },
  {
    id: "enc-mood-review",
    group: "5 Months Ago",
    date: "12/02/2026",
    time: "11:20",
    class: "outpatient",
    type: "Appointment",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Farrant, Joan, MD",
    description:
      "Bereavement low mood (PHQ-9 14). Sertraline 50 mg started; baseline bloods sent; 4-week review.",
    status: "Signed",
    location: "GP",
  },
  {
    id: "enc-bloods-baseline",
    group: "5 Months Ago",
    date: "12/02/2026",
    time: "14:15",
    class: "outpatient",
    type: "Bloods",
    specialty: "Clinical Biochemistry",
    deptAbbrev: "LAB",
    provider: "",
    description: "Baseline pre-sertraline: sodium 137, potassium 4.2, TSH 2.1 — all normal.",
    status: "Final",
    location: "Lab",
  },
];
