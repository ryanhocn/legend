import type { Encounter } from "../../../types";

/**
 * Chart Review > Encounters timeline for the hypercalcaemia ("off legs") case
 * (Whitmore, Dorothy, 81F). Newest first, grouped by recency like Epic's Chart
 * Review. A row resolves its primary document by `encounterId` (see documents.ts)
 * and opens it in the right rail.
 *
 * Array order is the timeline's source of truth: the recency buckets are
 * hand-curated (a 20/01 entry sits under "6 Months Ago") and not reproducible by
 * date math, so the rows are kept in display order rather than sorted. The current
 * date for this case is 06/07/2026 (what reads "Today"); admission was 05/07/2026.
 *
 * The teaching spine lives in the gap between the labels and the chemistry: the
 * clerking and the early ward round frame this as a social admission ± ?UTI, while
 * the admission bloods (adjusted calcium 3.18, AKI), the community letters (weight
 * loss, back pain, polyuria/polydipsia) and an un-chased GP myeloma screen tell a
 * different story.
 *
 * `class` drives the filter bar (inpatient / outpatient / ed); `admission` is set
 * only on the admission event itself. `provider`, `deptAbbrev` and `specialty` are
 * hardcoded display metadata for this synthetic case.
 *
 * All content is synthetic. For education and simulation only. Not for clinical use.
 */
export const caseHypercalcaemia001Encounters: Encounter[] = [
  {
    id: "enc-ward-round",
    date: "06/07/2026",
    time: "10:15",
    class: "inpatient",
    type: "Ward Round",
    specialty: "Geriatrics",
    deptAbbrev: "COTE",
    provider: "Raman, Priya, MD",
    description:
      "Post-take review. 81F 'off legs', mildly confused. Query social admission vs UTI (urine dip positive). Bloods not yet fully reviewed.",
    status: "Open",
    location: "Ward 7",
  },
  {
    id: "enc-pharmacy",
    date: "05/07/2026",
    time: "20:30",
    class: "inpatient",
    type: "Pharmacy",
    specialty: "Pharmacy",
    deptAbbrev: "PHARM",
    provider: "Nolan, Aoife, PharmD",
    description:
      "Medicines reconciliation. Regular bendroflumethiazide + Adcal-D3 (calcium/vit D) confirmed and continued. Flagged for team review.",
    status: "Signed",
    location: "Ward 7",
  },
  {
    id: "enc-nursing-admit",
    date: "05/07/2026",
    time: "18:10",
    class: "inpatient",
    type: "Nursing",
    specialty: "Geriatrics",
    deptAbbrev: "COTE",
    provider: "Sullivan, Bridget, RN",
    description:
      "Nursing admission assessment. Falls risk high, moving-and-handling review. Constipated, no BO 5 days. Poor oral intake, thirsty.",
    status: "Signed",
    location: "Ward 7",
  },
  {
    id: "enc-bloods-admit",
    date: "05/07/2026",
    time: "19:30",
    class: "inpatient",
    type: "Bloods",
    specialty: "Clinical Biochemistry",
    deptAbbrev: "LAB",
    provider: "",
    description:
      "Adjusted calcium 3.18 (H), creatinine 158 / eGFR 28 (AKI), Hb 98, ESR 92, total protein 92 / albumin 30.",
    status: "Final",
    location: "Lab",
  },
  {
    id: "enc-urine-culture",
    date: "05/07/2026",
    time: "18:40",
    class: "inpatient",
    type: "Microbiology",
    specialty: "Microbiology",
    deptAbbrev: "MICRO",
    provider: "",
    description: "Urine culture (MSU): mixed growth, no significant bacteriuria — probable contaminant.",
    status: "Preliminary",
    location: "Lab",
  },
  {
    id: "enc-admission",
    date: "05/07/2026",
    time: "17:30",
    class: "inpatient",
    type: "Admission (Current)",
    specialty: "Geriatrics",
    deptAbbrev: "COTE",
    provider: "Raman, Priya, MD",
    description:
      "Admitted from ED. Clerked as ?social admission / ?UTI. Ward 7 Bay 2. Bloods and myeloma history not yet integrated.",
    status: "Admitted",
    location: "Ward 7",
    principalProblem: "?Social admission / ?UTI ('off legs')",
    admission: true,
  },
  {
    id: "enc-urinalysis",
    date: "05/07/2026",
    time: "16:35",
    class: "ed",
    type: "Bloods",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "",
    description:
      "Urinalysis (dip): leucocytes +, protein +, nitrites NEGATIVE, blood trace. Weak-positive — asymptomatic, not diagnostic of UTI.",
    status: "Final",
    location: "ED",
  },
  {
    id: "enc-ed",
    date: "05/07/2026",
    time: "16:20",
    class: "ed",
    type: "ED Note",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Fletcher, Rowan, MD",
    description:
      "Brought by daughter — 'not coping', off legs, muddled, constipated. Dip positive, trimethoprim started. Referred to COTE as social admission ± UTI.",
    status: "Signed",
    location: "ED",
  },
  {
    id: "enc-triage",
    date: "05/07/2026",
    time: "15:10",
    class: "ed",
    type: "ED Triage",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Adeyemi, Grace, RN",
    description: "81F brought in by daughter, 'off legs' and confused. Afebrile. NEWS2 = 2. To majors for assessment.",
    status: "Signed",
    location: "ED",
  },
  {
    id: "enc-gp-offlegs",
    group: "2 Weeks Ago",
    date: "23/06/2026",
    time: "12:30",
    class: "outpatient",
    type: "Home Visit",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Hughes, Gareth, MD",
    description:
      "Home visit: 2 months increasing tiredness, back pain, thirst, constipation and unsteadiness. Bloods + myeloma screen requested.",
    status: "Signed",
    location: "GP",
  },
  {
    id: "enc-bloods-gp",
    group: "2 Weeks Ago",
    date: "23/06/2026",
    time: "14:05",
    class: "outpatient",
    type: "Bloods",
    specialty: "Clinical Biochemistry",
    deptAbbrev: "LAB",
    provider: "",
    description: "Adjusted calcium 2.78 (H), Hb 105 (normocytic), ESR 70, total protein 88. Creatinine 96.",
    status: "Final",
    location: "Lab",
  },
  {
    id: "enc-myeloma-screen",
    group: "2 Weeks Ago",
    date: "23/06/2026",
    time: "14:05",
    class: "outpatient",
    type: "Lab Request",
    specialty: "Clinical Biochemistry",
    deptAbbrev: "LAB",
    provider: "",
    description:
      "Serum protein electrophoresis + serum free light chains requested (?myeloma). AWAITING RESULT — not yet reported.",
    status: "Pending",
    location: "Lab",
  },
  {
    id: "enc-refill-bendro",
    group: "1 Month Ago",
    date: "09/06/2026",
    time: "09:10",
    class: "outpatient",
    type: "Refill",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Hughes, Gareth, MD",
    description: "Bendroflumethiazide 2.5 mg PO OD — 28 tablets. Repeat issued.",
    status: "Dispensed",
    location: "Community Pharmacy",
  },
  {
    id: "enc-refill-adcal",
    group: "1 Month Ago",
    date: "09/06/2026",
    time: "09:10",
    class: "outpatient",
    type: "Refill",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Hughes, Gareth, MD",
    description: "Adcal-D3 (calcium carbonate 1.5 g / colecalciferol 400 IU) — 56 tablets. Repeat issued.",
    status: "Dispensed",
    location: "Community Pharmacy",
  },
  {
    id: "enc-gp-backpain",
    group: "3 Months Ago",
    date: "08/04/2026",
    time: "10:40",
    class: "outpatient",
    type: "Appointment",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Hughes, Gareth, MD",
    description:
      "New lower back pain and 3 kg weight loss. Presumed osteoporosis/mechanical — started Adcal-D3, spine X-ray requested.",
    status: "Signed",
    location: "GP",
  },
  {
    id: "enc-spine-xray",
    group: "3 Months Ago",
    date: "11/04/2026",
    time: "13:20",
    class: "outpatient",
    type: "Imaging",
    specialty: "Radiology",
    deptAbbrev: "RADXR",
    provider: "Bianchi, Marco, MD",
    description:
      "Lumbar spine X-ray: generalised osteopenia and mild loss of vertebral height at L2. Correlate clinically.",
    status: "Final",
    location: "Radiology",
  },
  {
    id: "enc-htn-review",
    group: "6 Months Ago",
    date: "20/01/2026",
    time: "11:00",
    class: "outpatient",
    type: "Appointment",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Hughes, Gareth, MD",
    description:
      "Hypertension review. BP controlled on bendroflumethiazide + amlodipine. Weight 63 kg. No acute issues.",
    status: "Closed",
    location: "GP",
  },
];
