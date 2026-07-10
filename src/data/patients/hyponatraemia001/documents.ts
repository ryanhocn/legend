import type { ClinicalDocument, LabFlag, LabRow } from "../../../types";
import { bloods } from "./bloods";

/** SI units for the admission panel, keyed by `bloods` test name. */
const ADMISSION_LAB_UNITS: Record<string, string> = {
  Sodium: "mmol/L",
  Potassium: "mmol/L",
  Urea: "mmol/L",
  Creatinine: "µmol/L",
  eGFR: "mL/min/1.73m²",
  "Glucose (random)": "mmol/L",
  "Adjusted calcium": "mmol/L",
  CRP: "mg/L",
  WCC: "x10⁹/L",
  Hb: "g/L",
  Platelets: "x10⁹/L",
  ALT: "U/L",
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
 * Single source of truth for the synthetic hyponatraemia case (Marsh, Eileen,
 * 71F): every clinical document, note-kind and report-kind, in one list.
 *
 * CASE SHAPE — a drug-induced severe hyponatraemia mislabelled as dehydration:
 *  - 71F, confusion + fall. Na 118 with LOW-NORMAL urea, normal creatinine and
 *    a stable weight — biochemistry that argues against the "?dehydration"
 *    label the night team gave it. Clinically euvolaemic.
 *  - TWO culprit medicines on the chart: indapamide (added 16/06/2026 at a BP
 *    review, U&E check arranged but not yet done) and sertraline (started
 *    12/02/2026 for bereavement low mood; baseline Na then was 137).
 *  - The ED note records a brief unresponsive episode with twitching on the
 *    trolley at 21:30 — a likely seizure filed as a "funny turn". The night
 *    clerking never mentions it (nobody read the ED note back).
 *  - The trap in motion: 0.9% saline started in ED for "dehydration" is still
 *    running, the repeat sodium is 124 by 06:10 (+6 mmol in ~9 h, on course to
 *    overshoot the 8–10 mmol/24 h ceiling), and both culprit medicines were
 *    given again at 08:00 this morning.
 *  - Latent / system-factor hooks (NOT individual blame): a reasonable GP BP
 *    intensification WITH monitoring arranged (admission beat the blood test);
 *    a busy-night clerking that inherited the ED label; paired osmolalities
 *    and urine sodium assumed rather than sent.
 *
 * All content is fabricated for education and simulation only. Not for clinical use.
 */
export const caseHyponatraemia001Documents: ClinicalDocument[] = [
  {
    kind: "note",
    id: "note-hp-001",
    encounterId: "enc-admission",
    category: "H&P",
    noteType: "H&P",
    author: "O'Donnell, Ciara",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "(A) General Medicine — AMU",
    dateOfService: "08/07/26 2230",
    fileTime: "08/07/26 2318",
    timestamp: 1783546200,
    status: "signed",
    admission: true,
    body: `GENERAL MEDICINE ADMISSION CLERKING
Admission Date: 08/07/2026 — PCP: Farrant, Joan, MD

CC: Confusion and a fall at home.

HISTORY OF PRESENT ILLNESS:
Eileen Marsh is a 71-year-old woman brought in by her daughter after being
found on the floor at home this evening. Per the daughter she has been
"muddled" and "not herself" for 3–4 days: repeating questions, unsteady,
nauseated, eating less than usual but still drinking tea. Tonight she was
found sitting on the lounge floor, unable to say how she got there. No
witnessed loss of consciousness at home; possible light head contact with the
carpet — CT head requested from ED and reported normal.

PAST MEDICAL HISTORY:
- Essential hypertension                          2019
- Low mood following bereavement                  02/2026

MEDICATIONS (per GP summary — to confirm with daughter and medicines bag):
- Amlodipine 5 mg PO OD
- Indapamide 2.5 mg PO OD
- Sertraline 50 mg PO OD
- Paracetamol 1 g PO PRN

ALLERGIES: No known drug allergies.

EXAMINATION:
- Drowsy but rousable, disoriented — AMT 6/10. GCS 14 (E4 V4 M6).
- Mucous membranes look dry; skin turgor equivocal. No oedema. JVP not raised.
- Chest clear, heart sounds normal. Abdomen soft, non-tender.
- Neuro: moving all four limbs, no lateralising signs, plantars downgoing.
- Small graze left elbow. Urine dip: unremarkable — no nitrites or leucocytes.

INVESTIGATIONS:
- Sodium 118 on the admission panel; potassium 3.4. Urea 3.1, creatinine 58.
- Glucose 5.6, adjusted calcium 2.38 — normal. CRP 4, WCC 8.9 — quiet.
- CT head (non-contrast): no acute intracranial abnormality.
- ECG: sinus rhythm, no acute change.

IMPRESSION:
Confusion with hyponatraemia, ?dehydration (found on floor, presumed poor
intake). Fall likely mechanical in the context of confusion.

PLAN:
1. IV 0.9% sodium chloride 1 L over 8 hours (continue infusion started in ED).
2. Repeat U&E in the morning; ward round review.
3. Collateral history from daughter tomorrow; medicines bag to be brought in.
4. Falls precautions, bed near nursing station.
Discussed with the medical registrar by phone: continue current fluids
overnight, repeat sodium first thing, review on the morning round.`,
  },
  {
    kind: "note",
    id: "note-ed-002",
    encounterId: "enc-ed",
    category: "ED Notes",
    noteType: "ED Provider Note",
    author: "Kaur, Simran",
    credential: "MD",
    authorRole: "*PHYSICIAN: FACULTY",
    service: "Emergency Department",
    dateOfService: "08/07/26 2145",
    fileTime: "08/07/26 2204",
    timestamp: 1783543500,
    status: "signed",
    admission: true,
    urgent: true,
    body: `EMERGENCY DEPARTMENT PROVIDER NOTE

Presenting complaint: confusion and a fall at home; brought in by daughter.

HPI: 71F, 3–4 days of increasing confusion per family, found on the lounge
floor this evening. No incontinence or tongue biting reported at home. Still
drinking; eating less. First seen 20:15.

Examination: drowsy, disoriented — AMT 4/10 at triage, GCS 14. Afebrile,
haemodynamically stable. Chest clear, abdomen soft. No focal neurology.
Small graze left elbow. Urine dip unremarkable.

Investigations: sodium 118 (phoned by the lab at 20:55), potassium 3.4.
Glucose and calcium normal, CRP 4 — the easy metabolic and infective screens
for confusion are negative. CT head (fall + confusion): no acute intracranial
abnormality.

EVENT 21:30 — while awaiting the medical team she had a brief episode on the
trolley: approximately 90 seconds unresponsive with eyes open, lip-smacking
and twitching of the left hand per the HCA, then drowsy for around 10 minutes
before returning to her baseline. ?vasovagal ?"funny turn". GCS 14 after.

Impression: confusion with severe hyponatraemia, ?dehydration (found on
floor, presumed poor intake). IV 0.9% sodium chloride 1 L over 8 hours
started. Referred to General Medicine for admission; medicines review and
collateral history to follow on the ward.`,
  },
  {
    kind: "note",
    id: "note-ed-001",
    encounterId: "enc-triage",
    category: "ED Notes",
    noteType: "ED Triage Note",
    author: "Nwosu, Chidinma",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "Emergency Department",
    dateOfService: "08/07/26 1910",
    fileTime: "08/07/26 1922",
    timestamp: 1783534200,
    status: "signed",
    admission: true,
    urgent: true,
    body: `ED TRIAGE NOTE

71F brought in by daughter after a fall at home — found on the floor.
Daughter reports she has been "muddled" for a few days. Patient disoriented,
repeating questions. AMT 4/10.

Obs: T 36.6, HR 82, BP 150/84, RR 16, SpO2 96% RA. NEWS2 = 3 (new confusion).
No visible injury apart from a graze to the left elbow.

Triage category: Urgent. Moved to majors, trolley with rails. Bloods and IV
access taken at triage. Daughter present and staying.`,
  },
  {
    kind: "note",
    id: "note-nurse-001",
    encounterId: "enc-admission",
    category: "Nursing",
    noteType: "Nursing Admission Assessment",
    author: "Petrova, Elena",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "(A) General Medicine — AMU",
    dateOfService: "08/07/26 2330",
    fileTime: "08/07/26 2354",
    timestamp: 1783549800,
    status: "signed",
    admission: true,
    body: `NURSING ADMISSION ASSESSMENT

71F admitted to AMU Bay 6 from ED with confusion and a fall at home.

Obs on arrival: T 36.5, HR 78, BP 148/82, RR 16, SpO2 96% RA. NEWS2 = 3
(scores for new confusion). Disoriented to place and time, pleasant, AMT 6/10.
Settled with reassurance.

IV 0.9% sodium chloride running via left forearm cannula as prescribed.
Risk assessments: falls — HIGH (fall at home, confusion): bed near the
nursing station, low bed, call bell in reach, hourly rounding. Pressure areas
(Waterlow) — moderate. Weight 61.0 kg on the bed scales.

Graze to left elbow cleaned and dressed. Daughter accompanied her to the
ward, will bring her medicines bag in the morning.`,
  },
  {
    kind: "note",
    id: "note-nurse-002",
    encounterId: "enc-admission",
    category: "Nursing",
    noteType: "Nursing Shift Note",
    author: "Adeyemi, Funmilayo",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "(A) General Medicine — AMU",
    dateOfService: "09/07/26 0730",
    fileTime: "09/07/26 0748",
    timestamp: 1783578600,
    status: "signed",
    body: `NURSING SHIFT NOTE (Night → Day handover)

Slept in short stretches. No further episodes witnessed overnight. Obs stable
throughout, NEWS2 0–1 by morning. Noticeably brighter and more orientated
this morning — AMT 8/10 at 07:00. Took breakfast and tea.

Repeat bloods taken at 06:10 as requested. Second litre of 0.9% sodium
chloride commenced at 07:00 as prescribed (infusion continuing). Morning
medications given at 08:00 as charted.

Daughter visited early with the medicines bag — handed to pharmacy. Passed
urine x2 overnight, good volumes. Falls precautions continue.`,
  },
  {
    kind: "note",
    id: "note-pharm-001",
    encounterId: "enc-admission",
    category: "Progress",
    noteType: "Best Poss Rx Hx",
    author: "Cheng, Lydia",
    credential: "PharmD",
    authorRole: ".PHARMACIST",
    service: "Pharmacy",
    dateOfService: "09/07/26 0805",
    fileTime: "09/07/26 0829",
    timestamp: 1783580700,
    status: "signed",
    body: `BEST POSSIBLE MEDICATION HISTORY

Sources: GP summary, medicines bag (brought by daughter), daughter interview
(3 sources).

Regular medications confirmed:
- Amlodipine 5 mg PO OD (since 2019).
- Indapamide 2.5 mg PO OD — STARTED 16/06/2026 at GP blood pressure review
  (box in bag dispensed 16/06/2026). GP letter documents U&E check arranged
  for 4 weeks after starting — that blood test has not yet happened.
- Sertraline 50 mg PO OD — started 12/02/2026 (bereavement low mood).
- Paracetamol 1 g PO PRN.

Adherence good per daughter (dosette filled weekly). No OTC or herbal
products in the bag. No known drug allergies.

All four regular medicines are charted and were given at 08:00 this morning.
Flag to team: new diuretic started 22 days ago with the safety bloods still
outstanding — please review the drug chart against today's chemistry.`,
  },
  {
    kind: "encounterSummary",
    id: "admission-encounter-001",
    encounterId: "enc-admission",
    title: "Admission — ED to Hosp-Admission",
    type: "Hospital Encounter",
    department: "General Medicine",
    author: "Braithwaite, Helen, MD (Attending)",
    signedAt: "08/07/2026 23:15",
    body: `ADMISSION  [Current]
08/07/2026 23:15 — present       Mount Verdant Hospital
Admitting / Attending: Braithwaite, Helen, MD — General Medicine

PRINCIPAL PROBLEM:
Confusion with severe hyponatraemia (sodium 118) — clerked as ?dehydration.

ENCOUNTER NOTES:
- ED Provider Note — Kaur, Simran, MD (Emergency Medicine)
- Admission Clerking — O'Donnell, Ciara, MD (General Medicine)

HOSPITAL PROBLEM LIST:
◆ Severe hyponatraemia (Na 118) — PRINCIPAL
- Confusion — 3–4 days per family
- Fall at home (found on floor); CT head normal
- Unexplained episode on the ED trolley 21:30 (?vasovagal)
- Essential hypertension
- Low mood (bereavement, 02/2026)

CARE TIMELINE:
19:10  Arrived in ED (brought by daughter after a fall)
20:55  Admission bloods reported — sodium 118 phoned by the lab
21:05  CT head — no acute intracranial abnormality
21:30  Brief unresponsive episode on the trolley (see ED note)
22:30  Clerked by General Medicine
23:15  Admitted — AMU Bay 6

EXPECTED MEDICATION LIST:
- Sodium chloride 0.9% 1 L IV over 8 hours (started in ED, continuing)
- Amlodipine 5 mg PO OD
- Indapamide 2.5 mg PO OD (started 16/06/2026)
- Sertraline 50 mg PO OD (started 12/02/2026)
- Paracetamol 1 g PO QDS PRN

ALLERGIES: No known drug allergies.
CODE STATUS: For escalation. ISOLATION: None.

All patient data are synthetic. For education and simulation only. Not for clinical use.`,
  },
  {
    kind: "report",
    id: "ct-head-001",
    encounterId: "enc-ct-head",
    title: "CT Head — Non-contrast",
    type: "Radiology Report",
    department: "Radiology",
    author: "Varga, Tomas, MD (Radiology)",
    signedAt: "08/07/2026 21:20",
    body: `EXAMINATION: CT head, non-contrast, urgent (from ED).
CLINICAL DETAILS: Fall at home with confusion; possible head contact. ?acute
intracranial pathology.

FINDINGS:
- No acute intracranial haemorrhage. No extra-axial collection.
- No established or acute territorial infarct. Grey-white differentiation
  preserved. No mass, no midline shift, no hydrocephalus.
- Mild age-appropriate involutional change and periventricular low
  attenuation in keeping with small vessel disease.
- No calvarial fracture. Soft tissues unremarkable.

IMPRESSION:
No acute intracranial abnormality. The presented confusion is not explained
by this examination — suggest correlation with biochemistry.`,
  },
  {
    kind: "letter",
    id: "gp-bp-review-001",
    encounterId: "enc-bp-review",
    title: "Primary Care — Blood Pressure Review",
    type: "Letter",
    department: "Primary Care",
    author: "Farrant, Joan, MD",
    signedAt: "16/06/2026",
    body: `Dear colleague,

Blood pressure review for Mrs Marsh. Home readings over two weeks average
156/92 on amlodipine 5 mg, clinic reading today 158/90. She is otherwise
well; renal function and electrolytes at the February check were normal.

Plan agreed with the patient:
- ADD indapamide 2.5 mg each morning alongside amlodipine 5 mg.
- Blood test (U&E) arranged for 4 weeks after starting, with a blood
  pressure recheck at the same visit.
- Lifestyle advice revisited (salt, activity).

She remains independent at home and continues to see the practice nurse
regarding her mood, which is slowly improving.

Kind regards,
Dr J. Farrant`,
  },
  {
    kind: "order",
    id: "refill-sertraline-001",
    encounterId: "enc-refill-sertraline",
    title: "Repeat Prescription — Sertraline",
    type: "Medication Order",
    department: "Primary Care",
    author: "Farrant, Joan, MD",
    signedAt: "24/06/2026",
    body: `REPEAT PRESCRIPTION (issued electronically to community pharmacy)

Drug: Sertraline 50 mg tablets
Directions: Take ONE tablet each morning.
Quantity: 28 tablets (4 weeks).
Indication: Low mood (bereavement).

Last issue: 27/05/2026. Compliance good per pharmacy record (weekly dosette).
Mood improving per practice nurse review. Medication review due with the
blood pressure / U&E check arranged for July.`,
  },
  {
    kind: "letter",
    id: "gp-mood-review-001",
    encounterId: "enc-mood-review",
    title: "Primary Care — Mood Review",
    type: "Letter",
    department: "Primary Care",
    author: "Farrant, Joan, MD",
    signedAt: "12/02/2026",
    body: `Dear colleague,

I reviewed Mrs Marsh with her daughter. Since her husband died in November
she has had low mood, poor sleep and reduced appetite. No thoughts of
self-harm; she is eating and drinking adequately and remains independent.
PHQ-9 today 14 (moderate).

Plan agreed:
- Start sertraline 50 mg each morning; review in 4 weeks.
- Baseline bloods today (U&E, TFTs) — see report.
- Referred to the practice nurse for regular support and to the local
  bereavement service.

Safety-netting discussed with both her and her daughter.

Kind regards,
Dr J. Farrant`,
  },
  {
    kind: "lab",
    id: "lab-bloods-admit-001",
    encounterId: "enc-bloods-admit",
    title: "Admission Bloods — U&E, FBC, CRP, Glucose, Calcium",
    status: "Final",
    specimen: "Blood (serum + EDTA), venepuncture",
    collected: "08/07/2026 19:25",
    received: "08/07/2026 19:48",
    reportedAt: "08/07/2026 20:55",
    orderedBy: "Kaur, Simran, MD (Emergency Medicine)",
    resultingLab: "LegendCare Clinical Laboratory, Mount Verdant Hospital",
    rows: admissionLabRows,
  },
  {
    kind: "lab",
    id: "lab-bloods-repeat-001",
    encounterId: "enc-bloods-repeat",
    title: "Repeat U&E — 06:10",
    status: "Final",
    specimen: "Blood (serum), venepuncture",
    collected: "09/07/2026 06:10",
    received: "09/07/2026 06:24",
    reportedAt: "09/07/2026 06:55",
    orderedBy: "O'Donnell, Ciara, MD (General Medicine)",
    resultingLab: "LegendCare Clinical Laboratory, Mount Verdant Hospital",
    rows: [
      { test: "Sodium", value: "124", units: "mmol/L", range: "135–145", flag: "L" },
      { test: "Potassium", value: "3.6", units: "mmol/L", range: "3.5–5.3", flag: "" },
      { test: "Urea", value: "2.9", units: "mmol/L", range: "2.5–7.8", flag: "" },
      { test: "Creatinine", value: "55", units: "µmol/L", range: "45–90", flag: "" },
      { test: "eGFR", value: ">90", units: "mL/min/1.73m²", range: ">60", flag: "" },
    ],
  },
  {
    kind: "lab",
    id: "lab-bloods-baseline-001",
    encounterId: "enc-bloods-baseline",
    title: "Baseline Bloods — U&E, TFTs (pre-sertraline)",
    status: "Final",
    specimen: "Blood (serum), venepuncture",
    collected: "12/02/2026 10:40",
    received: "12/02/2026 11:02",
    reportedAt: "12/02/2026 14:15",
    orderedBy: "Farrant, Joan, MD (Primary Care)",
    resultingLab: "LegendCare Clinical Laboratory, Mount Verdant Hospital",
    rows: [
      { test: "Sodium", value: "137", units: "mmol/L", range: "135–145", flag: "" },
      { test: "Potassium", value: "4.2", units: "mmol/L", range: "3.5–5.3", flag: "" },
      { test: "Urea", value: "4.8", units: "mmol/L", range: "2.5–7.8", flag: "" },
      { test: "Creatinine", value: "62", units: "µmol/L", range: "45–90", flag: "" },
      { test: "eGFR", value: ">90", units: "mL/min/1.73m²", range: ">60", flag: "" },
      { test: "TSH", value: "2.1", units: "mU/L", range: "0.3–4.2", flag: "" },
    ],
  },
];

/** Note-kind documents only — feeds the Notes activity and Chart Review > Notes. */
export const caseHyponatraemia001Notes = caseHyponatraemia001Documents.filter(
  (doc): doc is Extract<ClinicalDocument, { kind: "note" }> => doc.kind === "note",
);
