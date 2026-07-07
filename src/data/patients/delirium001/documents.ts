import type { ClinicalDocument, LabFlag, LabRow } from "../../../types";
import { bloods } from "./bloods";

/** SI units for the admission panel, keyed by `bloods` test name. */
const ADMISSION_LAB_UNITS: Record<string, string> = {
  Hb: "g/L",
  WCC: "x10⁹/L",
  Neutrophils: "x10⁹/L",
  Platelets: "x10⁹/L",
  CRP: "mg/L",
  Sodium: "mmol/L",
  Potassium: "mmol/L",
  Urea: "mmol/L",
  Creatinine: "µmol/L",
  eGFR: "mL/min/1.73m²",
  "Adjusted calcium": "mmol/L",
  "Glucose (random)": "mmol/L",
  TSH: "mU/L",
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
 * Single source of truth for the synthetic delirium case (Ashworth, Ronald, 87M):
 * every clinical document, note-kind and report-kind, in one list. Both views
 * derive from it — the Notes activity (and Chart Review > Notes sub-tab) filter
 * to `kind: "note"`, while the Encounters timeline resolves each row's primary
 * document by `encounterId`.
 *
 * CASE SHAPE — hyperactive delirium hiding behind a "dementia getting worse
 * ?UTI" label, for the learner to unpick:
 *  - The clerking anchors on "known dementia, progression, ?UTI" off a positive
 *    dip (nitrites NEGATIVE — and the dip was "positive" at urology three weeks
 *    earlier too). The culture comes back mixed growth.
 *  - The chart contradicts the label: an ED nursing collateral note has the
 *    daughter describing him independent and lucid ONE WEEK AGO (daily
 *    crossword), and the memory clinic letter says MILD cognitive impairment
 *    (MoCA 23/30) — not dementia. A 4AT is never completed.
 *  - The real drivers are on the drug chart and in the bladder: oxybutynin NEW
 *    from urology clinic 3 weeks ago, on long-standing amitriptyline and regular
 *    codeine (no bowels open 5 days on the stool chart); nursing document
 *    suprapubic fullness and dribbling (overflow) incontinence, but the bladder
 *    scan is requested twice and never done. Creatinine 142 vs baseline 88 —
 *    a post-renal AKI nobody connects.
 *  - The overnight trap: an on-call doctor, mid-night-workload, writes up
 *    haloperidol PRN for the agitation and one dose is given — against the
 *    Parkinson's disease documented in the clerking PMH, the pharmacy note and
 *    the neurology letter ("avoid dopamine antagonists").
 *  - Latent / system-factor hooks (NOT individual blame): a scanner off the ward
 *    at the critical moment, a night doctor covering four wards, a urology
 *    clinic that couldn't measure the residual the day it started the
 *    antimuscarinic, and a "known dementia" label copied forward from a
 *    handover sheet.
 *
 * All content is fabricated for education and simulation only. Not for clinical use.
 */
export const caseDelirium001Documents: ClinicalDocument[] = [
  {
    kind: "note",
    id: "note-prog-001",
    encounterId: "enc-ward-round",
    category: "Progress",
    noteType: "Post-Take Ward Round",
    author: "Whitfield, Eleanor",
    credential: "MD",
    authorRole: "*PHYSICIAN: FACULTY",
    service: "(A) Geriatrics — Ward 9",
    dateOfService: "06/07/26 0845",
    fileTime: "06/07/26 0907",
    timestamp: 1783327500,
    status: "signed",
    admission: true,
    body: `GERIATRICS POST-TAKE WARD ROUND

87M admitted yesterday evening with confusion and agitation on a background of
"known dementia" (per clerking). Difficult night — agitated, climbing over the
bed rails, haloperidol 0.5 mg given at 03:10 with little effect. Calmer this
morning, dozing intermittently.

Obs stable, afebrile. NEWS2 2. Chest clear, heart sounds normal. Abdomen soft;
lower abdomen not formally examined — patient resists palpation. Bowels not
open since admission.

Impression: progression of dementia with a superimposed ?UTI — continue
antibiotics. Agitation being managed with PRN as charted.

Plan:
- Continue cefalexin for ?UTI; chase urine culture.
- CT head today (requested) to exclude a structural cause.
- PRN haloperidol as charted if agitation recurs.
- Referral to social work re increased package of care ?placement.
- Bloods to be reviewed this afternoon.

[4AT not completed this round — patient drowsy. Bladder scan requested
yesterday — still not done. Collateral history not yet reviewed by medical
team.]`,
  },
  {
    kind: "note",
    id: "note-hp-001",
    encounterId: "enc-admission",
    category: "H&P",
    noteType: "Admission Clerking",
    author: "Marsh, Oliver",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "(A) Geriatrics — Ward 9",
    dateOfService: "05/07/26 2140",
    fileTime: "05/07/26 2218",
    timestamp: 1783287600,
    status: "signed",
    admission: true,
    body: `GERIATRICS ADMISSION CLERKING
Admission Date: 05/07/2026 — PCP: Byrne, Siobhan, MD

CC: Confusion and agitation — "dementia getting worse", ?UTI.

HISTORY OF PRESENT ILLNESS:
Ronald Ashworth is an 87-year-old man brought in by his daughter with worsening
confusion over the last 2 days. He has been up at night, wandering, accusing his
daughter of moving his things, and reportedly "seeing workmen in the bedroom".
Known dementia per the ED sheet (memory clinic 2025), now progressing.

He has been incontinent of urine over the last few days — pads in ED — in
keeping with the dementia progressing. Urine dip is positive (leucocytes ++),
so a UTI may be the trigger; of note the dip was also "positive" at his urology
clinic visit last month.

No fever at home, no cough, no diarrhoea, no head injury or fall witnessed.

PAST MEDICAL HISTORY:
- Parkinson's disease (co-careldopa)              2021
- Dementia (memory clinic)                        10/2025
- Benign prostatic hyperplasia                    2019
- Osteoarthritis (knees)                          long-standing
- Essential hypertension                          2015
- Insomnia                                        long-standing

ALLERGIES:
- No known drug allergies.

MEDICATIONS (on admission — continued as per GP list):
- Co-careldopa 25/100 1 tab PO TDS
- Tamsulosin 400 micrograms PO OD
- Oxybutynin 5 mg PO BD (started 15/06/2026, urology clinic)
- Amitriptyline 10 mg PO ON
- Codeine 30 mg PO QDS PRN
- Amlodipine 5 mg PO OD
- Paracetamol 1 g PO QDS PRN

EXAMINATION:
- Agitated, distractible, disorientated to time and place. AMTS not completed —
  patient uncooperative.
- Chest clear. Heart sounds normal. Afebrile.
- Abdomen soft, some non-specific lower abdominal discomfort. PR declined.
- Tremor and mild rigidity in keeping with known Parkinson's. No new focal
  neurology appreciable.

INVESTIGATIONS:
- Urine dip: leucocytes ++, protein +, nitrites negative, blood trace.
- Bloods: creatinine 142 — likely chronic for age; repeat in AM. WCC and CRP
  unremarkable. Calcium normal.

IMPRESSION:
Progression of known dementia with a superimposed ?UTI (dip positive).

PLAN:
1. Admit under Geriatrics, Ward 9 for assessment.
2. Cefalexin 500 mg TDS for ?UTI (started in ED).
3. Encourage oral fluids; food chart.
4. Physiotherapy / OT; social work re package of care ?placement.
5. CT head if no improvement.
6. Continue all regular medications as charted.`,
  },
  {
    kind: "note",
    id: "note-ed-002",
    encounterId: "enc-ed",
    category: "ED Notes",
    noteType: "ED Provider Note",
    author: "Kavanagh, Dermot",
    credential: "MD",
    authorRole: "*PHYSICIAN: FACULTY",
    service: "Emergency Department",
    dateOfService: "05/07/26 1945",
    fileTime: "05/07/26 2012",
    timestamp: 1783280700,
    status: "signed",
    admission: true,
    urgent: true,
    body: `EMERGENCY DEPARTMENT PROVIDER NOTE

Presenting complaint: confusion and agitation — daughter reports "his dementia
has got much worse" over about 48 hours.

HPI: 87M, increasingly muddled, agitated and up all night for 2 days. Wandering,
suspicious of family, visual hallucinations reported (people in the room). Newly
wet — pads. Background of Parkinson's disease and memory clinic follow-up.

On arrival afebrile, HR 96, BP 142/82, sats 96% RA. NEWS2 = 3 (new confusion).
Restless in the cubicle, pulling at his cannula. Chest clear, abdomen soft on
brief examination — difficult to assess further, patient would not stay on the
trolley.

Urine dip: leucocytes ++, protein +, nitrites NEGATIVE, blood trace. Sent for
culture. Bloods sent.

Impression: acute worsening of cognition on a background of known cognitive
impairment — ?UTI as the trigger given the dip. Started cefalexin 500 mg TDS
empirically. Referred to Geriatrics.

Daughter gave a detailed account to nursing staff — see ED nursing collateral
note this attendance.`,
  },
  {
    kind: "note",
    id: "note-ed-collateral",
    encounterId: "enc-ed-collateral",
    category: "ED Notes",
    noteType: "ED Nursing Note — Collateral",
    author: "Price, Gwen",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "Emergency Department",
    dateOfService: "05/07/26 1905",
    fileTime: "05/07/26 1926",
    timestamp: 1783278300,
    status: "signed",
    admission: true,
    body: `ED NURSING NOTE — COLLATERAL HISTORY (daughter, at bedside)

Spoke with daughter at length while patient in cubicle 4.

- One week ago he was "completely himself": lives alone, self-caring, cooks,
  does the crossword every day, walked to the shop on Sunday.
- The change began about 48 hours ago and is worse at night — up till 4 a.m.,
  moving furniture, saying there are workmen in the bedroom.
- He has been wetting himself for the past few days, which is NEW — "he keeps
  dribbling", and stands at the toilet for ages with little result.
- Bowels not opened for about 5 days as far as she knows.
- Medications: "the bladder tablet from the urology doctor is new" — started
  about 3 weeks ago. Also takes his Parkinson's tablets, a night-time tablet
  for sleep, and codeine for his knees "most days lately".
- Daughter is adamant: "This is not his normal. Something has happened."

Handed over verbally to ED doctor and documented here.`,
  },
  {
    kind: "note",
    id: "note-ed-001",
    encounterId: "enc-triage",
    category: "ED Notes",
    noteType: "ED Triage Note",
    author: "Mbeki, Naledi",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "Emergency Department",
    dateOfService: "05/07/26 1820",
    fileTime: "05/07/26 1831",
    timestamp: 1783275600,
    status: "signed",
    admission: true,
    urgent: true,
    body: `ED TRIAGE NOTE

87M brought in by daughter — increasingly confused and agitated for 2 days,
"dementia getting worse". Restless, trying to leave the waiting area, needs
redirection. Daughter reports he was well a week ago.

Obs: T 37.2, HR 96, BP 142/82, RR 18, SpO2 96% RA. NEWS2 = 3 (new confusion).
Pads on — wet on arrival.

Triage category: Urgent. Moved to majors, cubicle 4. Bloods and urine dip
requested. Falls risk flagged — call bell in reach, family staying with him.`,
  },
  {
    kind: "note",
    id: "note-nurse-001",
    encounterId: "enc-nursing-admit",
    category: "Nursing",
    noteType: "Nursing Admission Assessment",
    author: "Novak, Petra",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "(A) Geriatrics — Ward 9",
    dateOfService: "05/07/26 2230",
    fileTime: "05/07/26 2254",
    timestamp: 1783290600,
    status: "signed",
    admission: true,
    body: `NURSING ADMISSION ASSESSMENT

87M admitted to Ward 9 Bay 4 from ED with acute confusion, ?UTI.

Obs: T 37.0, HR 92, BP 138/80, RR 18, SpO2 96% RA. NEWS2 2.
Confused, restless, intermittently trying to get off the bed. Orientated to
person only.

Risk assessments: falls — HIGH (agitated, unsteady, Parkinson's); pressure area
(Waterlow) — moderate; VTE — for medical team. Enhanced observation requested.

Continence: dribbling incontinence — pads in use, wet twice since arrival with
small volumes. Lower abdomen looks full and feels firm; patient grimaces on
light palpation suprapubically. BLADDER SCAN REQUESTED — ward scanner away for
repair, to chase from Ward 11.

Bowels: no bowel motion for 5 days per daughter — stool chart commenced.
Nutrition: eating little; food chart commenced.

Cannula in situ, patent. Regular medications given as charted (co-careldopa
given at 18:00 with ED, oxybutynin and amitriptyline given tonight). Daughter
updated and gone home; contact number on file.`,
  },
  {
    kind: "note",
    id: "note-prog-002",
    encounterId: "enc-pharmacy",
    category: "Progress",
    noteType: "Best Poss Rx Hx",
    author: "Chandra, Meera",
    credential: "PharmD",
    authorRole: ".PHARMACIST",
    service: "Pharmacy",
    dateOfService: "05/07/26 2045",
    fileTime: "05/07/26 2109",
    timestamp: 1783284300,
    status: "signed",
    admission: true,
    body: `BEST POSSIBLE MEDICATION HISTORY

Sources: daughter, GP repeat list, community pharmacy record (3 sources).
Patient interview not possible (acute confusion).

Regular medications confirmed and reconciled onto the inpatient chart:
- Co-careldopa 25/100 1 tab PO TDS (08:00 / 13:00 / 18:00) — Parkinson's.
  TIME-CRITICAL: doses must not be omitted or delayed in hospital.
- Tamsulosin 400 micrograms PO OD (BPH).
- Oxybutynin 5 mg PO BD — NEW 15/06/2026 (urology clinic). Antimuscarinic.
- Amitriptyline 10 mg PO ON — on repeat since 2019 (insomnia). Anticholinergic.
- Codeine 30 mg PO QDS PRN — issued 05/2026 (knee OA); daughter reports he has
  been taking it most days. Constipating.
- Amlodipine 5 mg PO OD (hypertension).
- Paracetamol 1 g PO QDS PRN.

Allergy: No known drug allergies.

PHARMACY REVIEW — flagged to the medical team:
1. CUMULATIVE ANTICHOLINERGIC BURDEN is high (oxybutynin + amitriptyline, plus
   codeine) in a patient with documented cognitive impairment now acutely
   confused. The oxybutynin is new within 3 weeks and the timing fits the
   deterioration. Recommend hold / deprescribing review.
2. Oxybutynin + codeine in an 87M with BPH: risk of urinary retention and
   constipation — note dribbling incontinence and 5 days without a bowel
   motion on the nursing assessment.
3. PARKINSON'S DISEASE: avoid dopamine antagonists (haloperidol, metoclopramide,
   prochlorperazine). If an antiemetic is needed use domperidone or ondansetron;
   if sedation is unavoidable, low-dose lorazepam is preferred.
All continued on reconciliation pending a medical decision — please review.`,
  },
  {
    kind: "note",
    id: "note-oncall-001",
    encounterId: "enc-oncall",
    category: "Progress",
    noteType: "On-Call Review (Night)",
    author: "Rossiter, Jack",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "(A) Geriatrics — Ward 9 (on call)",
    dateOfService: "06/07/26 0250",
    fileTime: "06/07/26 0304",
    timestamp: 1783306200,
    status: "signed",
    body: `ON-CALL REVIEW (NIGHT)

Asked to see at 02:30 — agitated, trying to climb over the bed rails, pulled at
cannula, wandered into the corridor. Not aggressive to staff but not
redirectable. Nursing staff concerned for his safety and that of the bay.

Obs: T 37.3, HR 104, BP 148/84, SpO2 95% RA.

Reviewed briefly between bleeps; clerking documents known dementia, now
progressing, ?UTI on antibiotics. Examination limited by agitation: chest
clear; abdomen difficult to assess — pulls away on palpation of the lower
abdomen.

Impression: agitation on a background of dementia, ?UTI (on cefalexin).

Plan:
- Haloperidol 0.5 mg PO/IM PRN (max BD) written up for agitation; one dose
  given at 03:10 with nursing staff present.
- Encourage oral fluids. Day team to review in the morning.

[Full background and medication list not reviewed — night workload, covering
four wards.]`,
  },
  {
    kind: "note",
    id: "note-nurse-002",
    encounterId: "enc-admission",
    category: "Nursing",
    noteType: "Nursing Night Note",
    author: "Santos, Miguel",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "(A) Geriatrics — Ward 9",
    dateOfService: "06/07/26 0430",
    fileTime: "06/07/26 0447",
    timestamp: 1783312200,
    status: "signed",
    body: `NURSING NIGHT NOTE

Very disturbed night. From ~01:00 increasingly agitated — climbing over the bed
rails, moving other patients' tables, picking at the air, telling staff there
are "workmen behind the curtain". On-call doctor reviewed 02:30; haloperidol
0.5 mg PO given 03:10 — minimal effect, settled on his own by about 05:00.

Wet through pads twice overnight — keeps dribbling small volumes, stood at the
urinal for long periods passing very little. Lower abdomen still looks full and
firm. BLADDER SCAN STILL OUTSTANDING — scanner to be borrowed from Ward 11 in
the morning; request carried forward.

Stool chart: day 5 — no bowel motion.

Obs 04:00: T 37.1, HR 98, BP 140/80, SpO2 96% RA. Falls prevention measures in
place; enhanced observation continued through the night.`,
  },
  {
    kind: "note",
    id: "note-prog-003",
    encounterId: "enc-admission",
    category: "Progress",
    noteType: "Progress Note",
    author: "Marsh, Oliver",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "(A) Geriatrics — Ward 9",
    dateOfService: "06/07/26 1050",
    fileTime: "—",
    timestamp: 1783335000,
    status: "incomplete",
    body: `WARD PROGRESS NOTE (DRAFT)

Reviewed after the post-take round. Calmer than overnight but still muddled,
dozing. CT head done — awaiting formal report.

Daughter telephoned the ward — unhappy with the "dementia" label, says he was
doing the crossword a week ago. Her account is in the ED nursing collateral
note.

Plan (to finalise):
- ***bladder scan — STILL not done, chase the Ward 11 scanner***
- ***drug chart review — oxybutynin new 3/52, amitriptyline, codeine — d/w
  pharmacist re anticholinergic burden***
- ***4AT to complete***
- ***query haloperidol PRN vs Parkinson's — check with senior***
- ***bowels — 5 days, needs laxatives prescribed***

[Draft — not yet signed.]`,
  },
  {
    kind: "encounterSummary",
    id: "admission-encounter-001",
    encounterId: "enc-admission",
    title: "Admission — ED to Hosp-Admission",
    type: "Hospital Encounter",
    department: "Geriatrics",
    author: "Whitfield, Eleanor, MD (Attending)",
    signedAt: "05/07/2026 21:40",
    body: `ADMISSION  [Current]
05/07/2026 21:40 — present       Mount Verdant Hospital
Admitting / Attending: Whitfield, Eleanor, MD — Geriatrics

PRINCIPAL PROBLEM (as clerked):
?Progression of known dementia ± ?UTI (acute confusion and agitation).

ENCOUNTER NOTES:
- ED Provider Note — Kavanagh, Dermot, MD (Emergency Medicine)
- ED Nursing Note (Collateral) — Price, Gwen, RN (Emergency Department)
- Admission Clerking — Marsh, Oliver, MD (Geriatrics)
- On-Call Review (Night) — Rossiter, Jack, MD (Geriatrics)
- Post-Take Ward Round — Whitfield, Eleanor, MD (Geriatrics)

HOSPITAL PROBLEM LIST:
◆ ?Dementia progression (clerking label) — PRINCIPAL
- ?UTI (dip positive; nitrites negative — culture mixed growth)
- Acute agitation — haloperidol 0.5 mg PRN added overnight (NOT reviewed
  against the Parkinson's disease below)
- ?Urinary retention — suprapubic fullness + dribbling incontinence (nursing);
  bladder scan requested, NOT yet done
- Constipation — no bowels open 5 days (stool chart)
- Acute kidney injury — creatinine 142 (baseline 88, 02/2026)
- Parkinson's disease (co-careldopa — time-critical)
- Mild cognitive impairment (memory clinic 10/2025 — MoCA 23/30)
- Benign prostatic hyperplasia
- Essential hypertension

CARE TIMELINE:
18:20  Arrived in ED (brought by daughter)
19:05  Collateral history documented by ED nursing
19:45  Seen by ED provider; cefalexin started for positive dip
21:40  Admitted — Geriatrics, Ward 9 Bay 4
02:50  On-call review for agitation; haloperidol PRN written up, dose given 03:10

CURRENT MEDICATION LIST (as reconciled — NOT yet reviewed against the confusion):
- Co-careldopa 25/100 1 tab PO TDS — TIME-CRITICAL (Parkinson's); give on time
- Oxybutynin 5 mg PO BD — NEW 15/06/2026 (urology); antimuscarinic
- Amitriptyline 10 mg PO ON — anticholinergic; on repeat since 2019
- Codeine 30 mg PO QDS PRN — constipating; in regular use per daughter
- Tamsulosin 400 micrograms PO OD
- Amlodipine 5 mg PO OD
- Cefalexin 500 mg PO TDS — for ?UTI (dip weak-positive)
- Haloperidol 0.5 mg PO/IM PRN — added overnight; NOT reviewed against Parkinson's
- Paracetamol 1 g PO QDS PRN

ALLERGIES: No known drug allergies.
CODE STATUS: For escalation — ceiling to be discussed. ISOLATION: None.

All patient data are synthetic. For education and simulation only. Not for clinical use.`,
  },
  {
    kind: "report",
    id: "ct-head-001",
    encounterId: "enc-ct-head",
    title: "CT Head (Non-Contrast)",
    type: "Radiology Report",
    department: "Radiology",
    author: "Lindqvist, Erik, MD (Radiology)",
    signedAt: "06/07/2026 10:05",
    body: `EXAMINATION: CT head (non-contrast), inpatient.
CLINICAL DETAILS: Acute confusion and agitation over 48 hours. Background
Parkinson's disease and mild cognitive impairment. ?acute intracranial cause.

FINDINGS:
- No acute infarct or intracranial haemorrhage. No extra-axial collection.
- No space-occupying lesion. No hydrocephalus. No midline shift.
- Mild to moderate small vessel ischaemic change and involutional change,
  in keeping with age.
- Bony vault intact; no fracture.

IMPRESSION:
No acute intracranial abnormality. The appearances do not explain an acute
48-hour deterioration in cognition — consider systemic, drug-related or
metabolic causes of delirium. Clinical correlation advised.`,
  },
  {
    kind: "lab",
    id: "lab-bloods-admit-001",
    encounterId: "enc-bloods-admit",
    title: "Admission Bloods — FBC, U&E, Bone Profile, Glucose, TSH, CRP",
    status: "Final",
    specimen: "Blood (serum + EDTA), venepuncture",
    collected: "05/07/2026 19:10",
    received: "05/07/2026 19:25",
    reportedAt: "05/07/2026 21:05",
    orderedBy: "Kavanagh, Dermot, MD (Emergency Medicine)",
    resultingLab: "LegendCare Clinical Laboratory, Mount Verdant Hospital",
    rows: admissionLabRows,
  },
  {
    kind: "lab",
    id: "lab-urinalysis-001",
    encounterId: "enc-urinalysis",
    title: "Urinalysis (Dipstick)",
    status: "Final",
    specimen: "Urine (pad specimen — patient unable to provide MSU)",
    collected: "05/07/2026 18:35",
    reportedAt: "05/07/2026 18:40",
    orderedBy: "Kavanagh, Dermot, MD (Emergency Medicine)",
    resultingLab: "Point-of-care, Emergency Department",
    rows: [
      { test: "Leucocytes", value: "++", units: "", range: "Negative", flag: "A" },
      { test: "Nitrites", value: "Negative", units: "", range: "Negative", flag: "" },
      { test: "Protein", value: "+", units: "", range: "Negative", flag: "A" },
      { test: "Blood", value: "Trace", units: "", range: "Negative", flag: "A" },
      { test: "Glucose", value: "Negative", units: "", range: "Negative", flag: "" },
      { test: "Ketones", value: "Negative", units: "", range: "Negative", flag: "" },
      { test: "Specific gravity", value: "1.022", units: "", range: "1.005–1.030", flag: "" },
    ],
  },
  {
    kind: "micro",
    id: "micro-urine-001",
    encounterId: "enc-urine-culture",
    title: "Urine Culture",
    status: "Preliminary",
    specimen: "Urine (pad specimen, ED)",
    collected: "05/07/2026 18:35",
    received: "05/07/2026 19:20",
    reportedAt: "06/07/2026 — 09:20 preliminary",
    organisms: [],
    resultText: `URINE CULTURE — PRELIMINARY

Microscopy: white cells not significantly raised; epithelial cells ++
(suggests contamination of the specimen).
Culture: MIXED GROWTH of 3 or more organisms, none predominant —
appearances of a probable contaminant / mixed flora.
NO SIGNIFICANT BACTERIURIA.

Interpretation: does not support a urinary tract infection. A positive
leucocyte dip with negative nitrites in an elderly man with prostatic disease
and incomplete emptying is common and is a poor basis for an antibiotic
prescription on its own. Correlate clinically and consider stopping empirical
antibiotics if there is no other evidence of infection.`,
  },
  {
    kind: "letter",
    id: "urology-clinic-001",
    encounterId: "enc-urology-clinic",
    title: "Urology Clinic — LUTS Review",
    type: "Letter",
    department: "Urology",
    author: "Farooq, Imran, MD",
    signedAt: "15/06/2026",
    body: `Dear colleague,

I reviewed Mr Ashworth in the urology clinic regarding bothersome lower urinary
tract symptoms on a background of benign prostatic enlargement, for which he
takes tamsulosin. His symptoms are now storage-predominant: daytime frequency,
urgency and nocturia x3.

Examination: smoothly enlarged, benign-feeling prostate. PSA 2.8 (stable).
Urine dip in clinic: leucocytes +, nitrites negative — no treatment indicated.
Flow rate was reduced. I had intended to measure a post-void residual today but
the clinic bladder scanner was unavailable; this should be measured at
follow-up.

Plan agreed:
- Start oxybutynin 5 mg twice daily for the storage symptoms; continue
  tamsulosin.
- I counselled him and his daughter about dry mouth and constipation.
- Review in 6 weeks with a post-void residual. Given his age and Parkinson's
  disease, the oxybutynin should be stopped promptly if he develops confusion,
  worsening voiding difficulty or retention.

Kind regards,
Mr I. Farooq`,
  },
  {
    kind: "order",
    id: "refill-amitriptyline-001",
    encounterId: "enc-refill-amitriptyline",
    title: "Repeat Prescription — Amitriptyline",
    type: "Medication Order",
    department: "Primary Care",
    author: "Byrne, Siobhan, MD",
    signedAt: "08/06/2026",
    body: `REPEAT PRESCRIPTION (issued electronically to community pharmacy)

Drug: Amitriptyline 10 mg tablets
Directions: Take ONE tablet at night.
Quantity: 28 tablets (4 weeks).
Indication: Insomnia / low mood (on repeat since 2019).

Last issue: 11/05/2026. Compliance good per pharmacy record. Structured
medication review OVERDUE — note this is an anticholinergic in an older adult
under memory clinic follow-up.`,
  },
  {
    kind: "order",
    id: "refill-cocareldopa-001",
    encounterId: "enc-refill-cocareldopa",
    title: "Repeat Prescription — Co-careldopa",
    type: "Medication Order",
    department: "Primary Care",
    author: "Byrne, Siobhan, MD",
    signedAt: "08/06/2026",
    body: `REPEAT PRESCRIPTION (issued electronically to community pharmacy)

Drug: Co-careldopa 25 mg/100 mg tablets
Directions: Take ONE tablet THREE times daily (08:00, 13:00, 18:00).
Quantity: 84 tablets (4 weeks).
Indication: Parkinson's disease.

Last issue: 11/05/2026. Compliance good per pharmacy record. TIME-CRITICAL
MEDICINE — doses must not be omitted or delayed, including in hospital.`,
  },
  {
    kind: "letter",
    id: "gp-knee-001",
    encounterId: "enc-gp-knee",
    title: "Primary Care — Knee Osteoarthritis Flare",
    type: "Letter",
    department: "Primary Care",
    author: "Byrne, Siobhan, MD",
    signedAt: "20/05/2026",
    body: `Dear colleague,

Mr Ashworth attended with a flare of his right knee osteoarthritis — worse on
stairs, disturbing his sleep. He remains independent and walks to the shop most
days. Examination: bony deformity and crepitus, small effusion, no instability.
No red flags.

Plan:
- Regular paracetamol; codeine 30 mg up to four times daily as required for the
  flare. I warned him about constipation and drowsiness and offered a laxative,
  which he declined.
- Physiotherapy referral; continue quadriceps exercises.
- He also takes amitriptyline 10 mg at night (long-standing) — to be looked at
  again at his next structured medication review.

Kind regards,
Dr S. Byrne`,
  },
  {
    kind: "letter",
    id: "neuro-pd-001",
    encounterId: "enc-pd-review",
    title: "Neurology — Parkinson's Disease Annual Review",
    type: "Letter",
    department: "Neurology",
    author: "Achebe, Chinedu, MD",
    signedAt: "12/02/2026",
    body: `Dear colleague,

Annual Parkinson's disease review. Mr Ashworth remains stable on co-careldopa
25/100 three times daily: mild rest tremor and rigidity, no motor fluctuations,
no falls this year, and importantly NO hallucinations. Cognition per memory
clinic — mild impairment, stable. He remains independent.

Bloods today: creatinine 88, eGFR 68 — satisfactory baseline.

Standing advice for any admission or intercurrent illness:
- Co-careldopa is TIME-CRITICAL — give on time, every time; do not omit.
- AVOID dopamine antagonists: haloperidol, metoclopramide and prochlorperazine
  will worsen parkinsonism and must not be prescribed. For nausea use
  domperidone or ondansetron; if sedation is truly unavoidable, use low-dose
  lorazepam.
- Anticholinergic and sedating drugs should be minimised — his cognition is
  vulnerable.

Routine review in 12 months, sooner if concerns.

Kind regards,
Dr C. Achebe`,
  },
  {
    kind: "letter",
    id: "memory-clinic-001",
    encounterId: "enc-memory-clinic",
    title: "Memory Clinic — Assessment Outcome",
    type: "Letter",
    department: "Older Adult Psychiatry",
    author: "Sinclair, Moira, MD",
    signedAt: "14/10/2025",
    body: `Dear colleague,

Thank you for referring Mr Ashworth to the memory clinic. He attended with his
daughter. Assessment today: MoCA 23/30, losing points on delayed recall and
attention. Occupational history and informant account confirm he remains fully
independent — he cooks, manages his own medication with a dosette box, and does
the crossword daily.

Diagnosis: MILD COGNITIVE IMPAIRMENT in the context of Parkinson's disease.
This does NOT meet criteria for dementia: there is no functional impairment.

Advice:
- No cognitive enhancer indicated at present; annual review here.
- Avoid anticholinergic and sedating medication wherever possible — his
  cognition is vulnerable and such drugs commonly precipitate confusion in
  this group. His amitriptyline is worth reviewing at the practice.
- We discussed driving (he no longer drives) and lasting power of attorney.

Any ACUTE change in cognition or behaviour should be assessed as delirium, not
attributed to this diagnosis.

Kind regards,
Dr M. Sinclair`,
  },
];

/** Note-kind documents only — feeds the Notes activity and Chart Review > Notes. */
export const caseDelirium001Notes = caseDelirium001Documents.filter(
  (doc): doc is Extract<ClinicalDocument, { kind: "note" }> => doc.kind === "note",
);
