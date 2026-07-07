import type { Encounter } from "../../../types";

/**
 * Chart Review > Encounters timeline for the delirium ("dementia getting worse")
 * case (Ashworth, Ronald, 87M). Newest first, grouped by recency like Epic's
 * Chart Review. A row resolves its primary document by `encounterId` (see
 * documents.ts) and opens it in the right rail.
 *
 * Array order is the timeline's source of truth: the recency buckets are
 * hand-curated (a 20/05 entry sits under "6 Weeks Ago") and not reproducible by
 * date math, so the rows are kept in display order rather than sorted. The
 * current date for this case is 06/07/2026 (what reads "Today"); admission was
 * 05/07/2026.
 *
 * The teaching spine lives in the gap between the label and the chart: the
 * clerking and the post-take round frame this as "dementia progression ?UTI",
 * while the ED nursing collateral (lucid one week ago), the urology letter (new
 * oxybutynin, residual never measured), the pharmacy note (anticholinergic
 * burden; avoid haloperidol in Parkinson's) and the nursing observations
 * (suprapubic fullness, dribbling, no bladder scan, no bowels x5 days) tell a
 * different story.
 *
 * `class` drives the filter bar (inpatient / outpatient / ed); `admission` is
 * set only on the admission event itself. `provider`, `deptAbbrev` and
 * `specialty` are hardcoded display metadata for this synthetic case.
 *
 * All content is synthetic. For education and simulation only. Not for clinical use.
 */
export const caseDelirium001Encounters: Encounter[] = [
  {
    id: "enc-ct-head",
    date: "06/07/2026",
    time: "10:05",
    class: "inpatient",
    type: "Imaging",
    specialty: "Radiology",
    deptAbbrev: "RADCT",
    provider: "Lindqvist, Erik, MD",
    description:
      "CT head: no acute infarct or haemorrhage. Small vessel and involutional change only — does not explain an acute 48 h deterioration.",
    status: "Final",
    location: "Radiology",
  },
  {
    id: "enc-urine-culture",
    date: "06/07/2026",
    time: "09:20",
    class: "inpatient",
    type: "Microbiology",
    specialty: "Microbiology",
    deptAbbrev: "MICRO",
    provider: "",
    description:
      "Urine culture: MIXED GROWTH, no significant bacteriuria — probable contaminant. Does not support a UTI.",
    status: "Preliminary",
    location: "Lab",
  },
  {
    id: "enc-ward-round",
    date: "06/07/2026",
    time: "08:45",
    class: "inpatient",
    type: "Ward Round",
    specialty: "Geriatrics",
    deptAbbrev: "COTE",
    provider: "Whitfield, Eleanor, MD",
    description:
      "Post-take review. Label 'dementia progression ?UTI' continued. 4AT not completed; bladder scan still outstanding; collateral not reviewed.",
    status: "Open",
    location: "Ward 9",
  },
  {
    id: "enc-oncall",
    date: "06/07/2026",
    time: "02:50",
    class: "inpatient",
    type: "On-Call Review",
    specialty: "Geriatrics",
    deptAbbrev: "COTE",
    provider: "Rossiter, Jack, MD",
    description:
      "Called overnight for agitation. Haloperidol 0.5 mg PRN written up and one dose given — background Parkinson's not checked.",
    status: "Signed",
    location: "Ward 9",
  },
  {
    id: "enc-nursing-admit",
    date: "05/07/2026",
    time: "22:30",
    class: "inpatient",
    type: "Nursing",
    specialty: "Geriatrics",
    deptAbbrev: "COTE",
    provider: "Novak, Petra, RN",
    description:
      "Nursing admission. Suprapubic fullness, dribbling incontinence, wet pads. No bowels open 5 days — stool chart. Bladder scan requested, NOT done.",
    status: "Signed",
    location: "Ward 9",
  },
  {
    id: "enc-admission",
    date: "05/07/2026",
    time: "21:40",
    class: "inpatient",
    type: "Admission (Current)",
    specialty: "Geriatrics",
    deptAbbrev: "COTE",
    provider: "Whitfield, Eleanor, MD",
    description:
      "Admitted from ED. Clerked as 'known dementia, progression, ?UTI'. Ward 9 Bay 4. Collateral and drug timeline not integrated.",
    status: "Admitted",
    location: "Ward 9",
    principalProblem: "?Dementia progression ± ?UTI (acute confusion)",
    admission: true,
  },
  {
    id: "enc-bloods-admit",
    date: "05/07/2026",
    time: "21:05",
    class: "inpatient",
    type: "Bloods",
    specialty: "Clinical Biochemistry",
    deptAbbrev: "LAB",
    provider: "",
    description:
      "Creatinine 142 / eGFR 38 (baseline 88 in 02/2026), urea 13.6. Calcium NORMAL (2.41). WCC normal, CRP 11.",
    status: "Final",
    location: "Lab",
  },
  {
    id: "enc-pharmacy",
    date: "05/07/2026",
    time: "20:45",
    class: "inpatient",
    type: "Pharmacy",
    specialty: "Pharmacy",
    deptAbbrev: "PHARM",
    provider: "Chandra, Meera, PharmD",
    description:
      "Medicines reconciliation. High anticholinergic burden flagged (oxybutynin NEW 15/06 + amitriptyline + codeine). Avoid haloperidol in Parkinson's.",
    status: "Signed",
    location: "Ward 9",
  },
  {
    id: "enc-ed",
    date: "05/07/2026",
    time: "19:45",
    class: "ed",
    type: "ED Note",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Kavanagh, Dermot, MD",
    description:
      "'Dementia much worse' over 48 h — agitated, hallucinating, newly wet. Dip positive, cefalexin started. Referred to COTE.",
    status: "Signed",
    location: "ED",
  },
  {
    id: "enc-ed-collateral",
    date: "05/07/2026",
    time: "19:05",
    class: "ed",
    type: "Nursing",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Price, Gwen, RN",
    description:
      "Collateral from daughter: independent and lucid ONE WEEK AGO — daily crossword. New dribbling incontinence; 'bladder tablet' new 3 weeks.",
    status: "Signed",
    location: "ED",
  },
  {
    id: "enc-urinalysis",
    date: "05/07/2026",
    time: "18:40",
    class: "ed",
    type: "Bloods",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "",
    description:
      "Urinalysis (dip, pad specimen): leucocytes ++, nitrites NEGATIVE, protein +, blood trace. Weak-positive — not diagnostic of UTI.",
    status: "Final",
    location: "ED",
  },
  {
    id: "enc-triage",
    date: "05/07/2026",
    time: "18:20",
    class: "ed",
    type: "ED Triage",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Mbeki, Naledi, RN",
    description:
      "87M brought by daughter — acutely confused and agitated for 2 days. Afebrile. NEWS2 = 3 (new confusion). To majors.",
    status: "Signed",
    location: "ED",
  },
  {
    id: "enc-urology-clinic",
    group: "3 Weeks Ago",
    date: "15/06/2026",
    time: "14:20",
    class: "outpatient",
    type: "Appointment",
    specialty: "Urology",
    deptAbbrev: "UROCL",
    provider: "Farooq, Imran, MD",
    description:
      "LUTS review. Oxybutynin 5 mg BD ADDED to tamsulosin. Post-void residual NOT measured — scanner unavailable. Dip 'positive', nitrites negative.",
    status: "Signed",
    location: "Urology Clinic",
  },
  {
    id: "enc-refill-amitriptyline",
    group: "1 Month Ago",
    date: "08/06/2026",
    time: "09:15",
    class: "outpatient",
    type: "Refill",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Byrne, Siobhan, MD",
    description:
      "Amitriptyline 10 mg PO ON — 28 tablets. Repeat issued. On repeat since 2019; structured medication review overdue.",
    status: "Dispensed",
    location: "Community Pharmacy",
  },
  {
    id: "enc-refill-cocareldopa",
    group: "1 Month Ago",
    date: "08/06/2026",
    time: "09:15",
    class: "outpatient",
    type: "Refill",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Byrne, Siobhan, MD",
    description:
      "Co-careldopa 25/100 PO TDS — 84 tablets. Repeat issued. Time-critical Parkinson's medicine.",
    status: "Dispensed",
    location: "Community Pharmacy",
  },
  {
    id: "enc-gp-knee",
    group: "6 Weeks Ago",
    date: "20/05/2026",
    time: "11:30",
    class: "outpatient",
    type: "Appointment",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Byrne, Siobhan, MD",
    description:
      "Knee OA flare. Codeine 30 mg QDS PRN started — constipation warned, laxative declined. Physio referral.",
    status: "Signed",
    location: "GP",
  },
  {
    id: "enc-pd-review",
    group: "5 Months Ago",
    date: "12/02/2026",
    time: "10:00",
    class: "outpatient",
    type: "Appointment",
    specialty: "Neurology",
    deptAbbrev: "NEURO",
    provider: "Achebe, Chinedu, MD",
    description:
      "Parkinson's annual review — stable on co-careldopa (time-critical). AVOID haloperidol/metoclopramide. Baseline creatinine 88.",
    status: "Signed",
    location: "Neurology Clinic",
  },
  {
    id: "enc-memory-clinic",
    group: "9 Months Ago",
    date: "14/10/2025",
    time: "14:00",
    class: "outpatient",
    type: "Appointment",
    specialty: "Older Adult Psychiatry",
    deptAbbrev: "MEMCL",
    provider: "Sinclair, Moira, MD",
    description:
      "Memory clinic: MILD cognitive impairment (MoCA 23/30) — NOT dementia. Independent ADLs, daily crossword. Avoid anticholinergics.",
    status: "Signed",
    location: "Memory Clinic",
  },
];
