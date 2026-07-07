import type { Encounter } from "../../../types";

/**
 * Chart Review > Encounters timeline for the pulmonary embolism case
 * (Prescott, Gordon, 68M). Newest first, grouped by recency like Epic's Chart
 * Review. A row resolves its primary document by `encounterId` (see
 * documents.ts) and opens it in the right rail.
 *
 * Array order is the timeline's source of truth: the recency buckets are
 * hand-curated and not reproducible by date math, so the rows are kept in
 * display order rather than sorted. The current date for this case is
 * 06/07/2026 (what used to read "Today"); the admission was the evening of
 * 05/07/2026.
 *
 * `class` drives the filter bar (inpatient / outpatient / ed); `admission` is
 * set only on the admission event itself. `provider`, `deptAbbrev` and
 * `specialty` are hardcoded display metadata for this synthetic case.
 *
 * All content is synthetic. For education and simulation only. Not for clinical use.
 */
export const casePe001Encounters: Encounter[] = [
  {
    id: "enc-physio",
    date: "06/07/2026",
    time: "10:30",
    class: "inpatient",
    type: "Therapy",
    specialty: "Physiotherapy",
    deptAbbrev: "PHYSIO",
    provider: "Marsh, Verity, PT",
    description:
      "Mobility assessment. Desaturated to 84% on 2 L walking to bathroom, HR 118. Right calf noted more swollen than left. Session curtailed.",
    status: "Signed",
    location: "AMU",
  },
  {
    id: "enc-ward-round",
    date: "06/07/2026",
    time: "08:40",
    class: "inpatient",
    type: "Ward Round",
    specialty: "General Medicine",
    deptAbbrev: "GMAMU",
    provider: "Fenwick, Laura, MD",
    description:
      "Board round. Day 2 ?IECOPD — continue nebulisers, prednisolone, doxycycline. Target sats 88–92%. Home when stable.",
    status: "Open",
    location: "AMU",
  },
  {
    id: "enc-micro-sputum",
    date: "06/07/2026",
    time: "08:00",
    class: "inpatient",
    type: "Microbiology",
    specialty: "Microbiology",
    deptAbbrev: "MICRO",
    provider: "",
    description:
      "Sputum culture: poor-quality (salivary) sample. No significant growth; mixed upper respiratory flora only.",
    status: "Final",
    location: "Lab",
  },
  {
    id: "enc-ctpa-request",
    group: "Yesterday",
    date: "05/07/2026",
    time: "23:55",
    class: "inpatient",
    type: "Imaging Request",
    specialty: "Radiology",
    deptAbbrev: "RADCT",
    provider: "Osei, Kwame, MD",
    description:
      "CT pulmonary angiogram requested overnight (?PE — hypoxia disproportionate to clear CXR, recent TKR). Awaiting vetting — not yet performed.",
    status: "Awaiting vetting",
    location: "Radiology",
  },
  {
    id: "enc-night-review",
    date: "05/07/2026",
    time: "23:45",
    class: "inpatient",
    type: "Inpatient Review",
    specialty: "General Medicine",
    deptAbbrev: "GMAMU",
    provider: "Osei, Kwame, MD",
    description:
      "Night review for persistent tachycardia + SpO2 87% on 2 L. Chest clear again. ABG: type 1 respiratory failure, pCO2 3.9. CTPA requested.",
    status: "Signed",
    location: "AMU",
  },
  {
    id: "enc-post-take",
    date: "05/07/2026",
    time: "22:10",
    class: "inpatient",
    type: "Post-Take Ward Round",
    specialty: "General Medicine",
    deptAbbrev: "GMAMU",
    provider: "Adeyemi, Folake, MD",
    description:
      "Post-take review. ?IECOPD, though chest drier than expected. If not improving by morning, reconsider imaging. VTE assessment to complete.",
    status: "Signed",
    location: "AMU",
  },
  {
    id: "enc-admission",
    date: "05/07/2026",
    time: "19:45",
    class: "inpatient",
    type: "Admission (Current)",
    specialty: "General Medicine",
    deptAbbrev: "GMAMU",
    provider: "Adeyemi, Folake, MD",
    description:
      "Admitted from ED. Principal problem: breathlessness — ?infective exacerbation of COPD. AMU Bay 5.",
    status: "Admitted",
    location: "AMU",
    principalProblem: "Breathlessness — ?infective exacerbation of COPD",
    admission: true,
  },
  {
    id: "enc-bloods-admit",
    date: "05/07/2026",
    time: "19:20",
    class: "inpatient",
    type: "Bloods",
    specialty: "Clinical Biochemistry",
    deptAbbrev: "LAB",
    provider: "",
    description:
      "FBC and U&E unremarkable, CRP 18 only. D-dimer 4.2 mg/L FEU (H). hs-troponin 48 ng/L.",
    status: "Final",
    location: "Lab",
  },
  {
    id: "enc-cxr",
    date: "05/07/2026",
    time: "18:35",
    class: "ed",
    type: "Imaging",
    specialty: "Radiology",
    deptAbbrev: "RADXR",
    provider: "Novak, Petra, MD",
    description:
      "CXR: hyperinflated, clear lungs. No consolidation, effusion or pneumothorax. Hypoxia not explained by this radiograph.",
    status: "Final",
    location: "ED",
  },
  {
    id: "enc-ed",
    date: "05/07/2026",
    time: "18:05",
    class: "ed",
    type: "ED Note",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Kaur, Simran, MD",
    description:
      "3 days worsening breathlessness, known COPD. Chest quiet but clear, no wheeze. Treated as IECOPD: nebs, prednisolone, doxycycline. Admit medicine.",
    status: "Signed",
    location: "ED",
  },
  {
    id: "enc-triage",
    date: "05/07/2026",
    time: "17:10",
    class: "ed",
    type: "ED Triage",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Devlin, Aoife, RN",
    description:
      "Self-presented: breathless, known COPD, 'chest playing up'. SpO2 86% RA, HR 108, T 37.2. NEWS2 = 7.",
    status: "Signed",
    location: "ED",
  },
  {
    id: "enc-physio-op",
    group: "1 Week Ago",
    date: "29/06/2026",
    time: "14:00",
    class: "outpatient",
    type: "Therapy",
    specialty: "Physiotherapy",
    deptAbbrev: "PHYSOP",
    provider: "Odum, Grace, PT",
    description:
      "Post-TKR physiotherapy. Knee ROM improving; right lower-leg swelling 'expected post-op'. Mobility short distances with a stick, largely sedentary.",
    status: "Signed",
    location: "Outpatient Therapy",
  },
  {
    id: "enc-gp-telephone",
    group: "2 Weeks Ago",
    date: "24/06/2026",
    time: "14:20",
    class: "outpatient",
    type: "Telephone",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Pritchard, Eleanor, MD",
    description:
      "Telephone review post-TKR. Stopped rivaroxaban on day 5 after a nosebleed and has not restarted it. Advised to restart; reluctant.",
    status: "Signed",
    location: "GP",
  },
  {
    id: "enc-tkr",
    group: "3 Weeks Ago",
    date: "15/06/2026",
    time: "08:00",
    class: "inpatient",
    type: "Admission",
    specialty: "Orthopaedics",
    deptAbbrev: "ORTHO",
    provider: "Ferguson, Alistair, MD",
    description:
      "Elective right total knee arthroplasty. Uncomplicated; discharged 17/06 with rivaroxaban 10 mg OD for 14 days VTE prophylaxis.",
    status: "Discharged",
    location: "Orthopaedic Ward",
  },
  {
    id: "enc-refill-inhalers",
    group: "2 Months Ago",
    date: "05/05/2026",
    time: "09:40",
    class: "outpatient",
    type: "Refill",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Pritchard, Eleanor, MD",
    description:
      "Trimbow (beclometasone/formoterol/glycopyrronium) 2 puffs BD + salbutamol 100 micrograms PRN. Repeats issued.",
    status: "Dispensed",
    location: "Community Pharmacy",
  },
  {
    id: "enc-copd-review",
    group: "4 Months Ago",
    date: "12/03/2026",
    time: "10:30",
    class: "outpatient",
    type: "Appointment",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Pritchard, Eleanor, MD",
    description:
      "Annual COPD review. FEV1 52% predicted, MRC 3. Current smoker (cut down). One exacerbation in last year (11/2025). Vaccinations up to date.",
    status: "Signed",
    location: "GP",
  },
  {
    id: "enc-ed-iecopd",
    group: "8 Months Ago",
    date: "14/11/2025",
    time: "19:50",
    class: "ed",
    type: "ED Visit",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Hughes, Rhys, MD",
    description:
      "True IECOPD: wheeze throughout, purulent sputum, CRP 96. Brisk response to nebulisers + prednisolone. Discharged after 48 h.",
    status: "Signed",
    location: "ED",
  },
];
