import type { ClinicalDocument, LabFlag, LabRow } from "../../../types";
import { bloods } from "./bloods";

/** SI units for the admission panel, keyed by `bloods` test name. */
const ADMISSION_LAB_UNITS: Record<string, string> = {
  WCC: "x10⁹/L",
  Hb: "g/L",
  Platelets: "x10⁹/L",
  CRP: "mg/L",
  "D-dimer": "µg/L",
  Creatinine: "µmol/L",
  eGFR: "mL/min/1.73m²",
  Urea: "mmol/L",
  Sodium: "mmol/L",
  Potassium: "mmol/L",
  "Troponin T": "ng/L",
  Lactate: "mmol/L",
  INR: "",
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
 * Single source of truth for the synthetic aortic dissection case
 * (Ferris, Malcolm, 66M): every clinical document, note-kind and report-kind, in
 * one list. Both views derive from it — the Notes activity (and Chart Review >
 * Notes sub-tab) filter to `kind: "note"`, while the Encounters timeline resolves
 * each row's primary document by `encounterId`.
 *
 * CASE SHAPE — an aortic dissection ANCHORED as renal colic. The teaching spine
 * punishes accepting a handed-down label without re-examining the evidence:
 *  - Pain was SUDDEN, TEARING and maximal at ONSET (ambulance + triage), then
 *    quietly re-described as "loin pain" in the clerking, losing its danger.
 *  - Blood pressure differs markedly BETWEEN ARMS (nursing obs, right 196/104 vs
 *    left 158/92) — recorded once, no one comments.
 *  - Urine dipstick is NEGATIVE for blood (no haematuria) — against a stone.
 *  - A NEW early diastolic murmur (aortic regurgitation) is documented once in
 *    the clerking exam but dropped from the impression.
 *  - CT KUB finds NO calculus but reports an incidental dilated thoracic aorta
 *    at the limit of the field and RECOMMENDS a dedicated CT aortogram — which
 *    sits unactioned while the renal colic label is carried forward.
 *  - Latent hooks: long-standing poorly controlled hypertension and a ~40
 *    pack-year ex-smoking history live in the GP letters, not the ED note.
 *
 * SAFETY CATCHES (critical rubric items):
 *  1. The CT aortogram recommendation is never actioned.
 *  2. Opioid analgesia is titrated up (codeine -> morphine) while the diagnosis
 *     is never revisited — "pain controlled" is treated as reassurance.
 *  3. Systolic BP in the 180s–190s is left unmanaged; no arterial-pressure
 *     target is set despite a possible dissection.
 *
 * All content is fabricated for education and simulation only. Not for clinical use.
 */
export const caseDissection001Documents: ClinicalDocument[] = [
  {
    kind: "note",
    id: "note-prog-001",
    encounterId: "enc-review",
    category: "Progress",
    noteType: "ED Progress Note",
    author: "Fernsby, Alan",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "Emergency Department",
    dateOfService: "06/07/26 1015",
    fileTime: "06/07/26 1031",
    timestamp: 1783332900,
    status: "signed",
    admission: true,
    body: `ED PROGRESS NOTE

66M admitted overnight with left flank pain, working diagnosis renal colic.

CT KUB now reported: no renal or ureteric stone seen. Reviewed with the patient.

Pain is settling well since morphine — now 2/10, comfortable and resting. Obs:
HR 78, BP 190/102, afebrile. Passing urine, no vomiting.

Impression: renal colic — likely a small stone that has passed. Bloods otherwise
reassuring; troponin not raised.

Plan:
- Continue analgesia as required; wean once pain-free.
- Encourage oral fluids; urology outpatient follow-up with a repeat scan if pain
  recurs.
- Consider discharge later today if remains comfortable.

(Radiology also mentioned the aorta at the top of the scan — will leave for the
outpatient team to consider.)`,
  },
  {
    kind: "note",
    id: "note-nurse-002",
    encounterId: "enc-admission",
    category: "Nursing",
    noteType: "Nursing Shift Note",
    author: "Adeyemi, Funke",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "Emergency Department",
    dateOfService: "06/07/26 0950",
    fileTime: "06/07/26 1004",
    timestamp: 1783331400,
    status: "signed",
    admission: true,
    body: `NURSING SHIFT NOTE (ED Majors)

66M for CT KUB, ?renal colic. Pain improved after morphine, now 2/10 and settled.

Obs this hour: T 37.1, HR 80, BP 184/98, RR 16, SpO2 98% RA. NEWS2 = 1. Blood
pressure remains high but patient asymptomatic and comfortable; medical team aware
of ongoing analgesia plan.

Cannula patent. Awaiting CT report and medical review re disposition. Reassured,
family telephoned and updated.`,
  },
  {
    kind: "note",
    id: "note-nurse-001",
    encounterId: "enc-nursing-obs",
    category: "Nursing",
    noteType: "Nursing Assessment / Obs",
    author: "Bianchi, Marco",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "Emergency Department",
    dateOfService: "06/07/26 0715",
    fileTime: "06/07/26 0728",
    timestamp: 1783322100,
    status: "signed",
    admission: true,
    body: `NURSING ASSESSMENT — ED MAJORS

66M, sudden severe left flank pain. Pain score 8/10 despite codeine. Morphine 4 mg
IV given as charted, with metoclopramide. Reassessed at 15 min: pain 4/10.

Observations: T 36.9, HR 84, RR 18, SpO2 98% RA.

Blood pressure taken in BOTH ARMS as it read very high on the machine:
  RIGHT arm 196/104
  LEFT arm  158/92
Manual recheck confirms the difference. Recorded for medical review.

Two peripheral cannulae in situ. Urinalysis sent (see result). Continues to
mobilise to the toilet independently.`,
  },
  {
    kind: "note",
    id: "note-ed-001",
    encounterId: "enc-ed",
    category: "ED Notes",
    noteType: "ED Provider Note",
    author: "Reyes, Daniel",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "Emergency Department",
    dateOfService: "06/07/26 0630",
    fileTime: "06/07/26 0658",
    timestamp: 1783319400,
    status: "signed",
    admission: true,
    urgent: true,
    body: `EMERGENCY DEPARTMENT PROVIDER NOTE

Presenting complaint: left loin pain.

HPI: 66M with left-sided loin pain since early this morning, radiating round to
the back. Brought in by ambulance. Given morphine by paramedics with some effect.
No dysuria, no frequency. Not vomiting. Passed urine in the department.

PMH: hypertension. Ex-smoker.

Examination:
- Uncomfortable but not distressed after analgesia.
- Abdomen soft; tender left flank, no peritonism. No palpable mass. Bowel sounds
  present. Femoral pulses present.
- Chest clear. Heart sounds I + II with an added EARLY DIASTOLIC MURMUR at the
  left sternal edge.

Investigations: FBC, U&E, CRP, D-dimer sent. ECG sinus, LVH, no ischaemia.
Urine dip sent. CT KUB requested to confirm a stone.

Impression: left renal colic — clinically the most likely cause of loin pain in
this age group. Awaiting CT KUB.

Plan: analgesia (codeine + PRN morphine), antiemetic, IV fluids, CT KUB.
Urology if a stone is confirmed.`,
  },
  {
    kind: "note",
    id: "note-triage-001",
    encounterId: "enc-triage",
    category: "ED Notes",
    noteType: "ED Triage Note",
    author: "Harding, Louise",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "Emergency Department",
    dateOfService: "06/07/26 0540",
    fileTime: "06/07/26 0552",
    timestamp: 1783316400,
    status: "signed",
    admission: true,
    urgent: true,
    body: `ED TRIAGE NOTE

66M arrived by ambulance. Sudden onset severe left flank pain radiating to the
back, came on all at once about an hour ago while gardening — describes it as a
"TEARING" pain that was WORST straight away, not building up. Paramedics gave
morphine.

Obs: T 36.8, HR 96, BP 198/108, RR 20, SpO2 97% RA. NEWS2 = 2.

Very hypertensive. Presumed renal colic given the loin pain — to majors for
analgesia and imaging. Doctor informed. Pain score 7/10 after pre-hospital
morphine.`,
  },
  {
    kind: "note",
    id: "note-ambulance-001",
    encounterId: "enc-ambulance",
    category: "ED Notes",
    noteType: "Ambulance Handover",
    author: "Nolan, Craig",
    credential: "Paramedic",
    authorRole: ".PARAMEDIC (HCPC)",
    service: "Ambulance Service",
    dateOfService: "06/07/26 0520",
    fileTime: "06/07/26 0535",
    timestamp: 1783315200,
    status: "signed",
    admission: true,
    urgent: true,
    body: `AMBULANCE / PRE-HOSPITAL HANDOVER

66M. 999 call for sudden severe pain. On arrival found sitting on the back step,
pale and sweaty, holding his left side.

History: was gardening when a severe pain came on in the left loin, going through
to the back. States it was as bad as it would get from the very first second —
"like something tearing". No preceding warning. No chest pain volunteered. No
trauma.

Obs on scene: BP 204/110 (right arm), HR 90, RR 20, SpO2 96% RA, afebrile, GCS 15.

Treatment: IV access, morphine 5 mg IV titrated + ondansetron. Pain eased to 6/10.
Blue-lighted in as query renal colic vs abdominal cause. Handed over to triage.`,
  },
  {
    kind: "encounterSummary",
    id: "admission-encounter-001",
    encounterId: "enc-admission",
    title: "Admission — ED Majors",
    type: "Emergency Encounter",
    department: "Emergency Medicine",
    author: "Osei, Nadia, MD (Consultant)",
    signedAt: "06/07/2026 07:30",
    body: `ED MAJORS  [Current]
06/07/2026 05:35 — present       Mount Verdant Hospital
Attending: Osei, Nadia, MD — Emergency Medicine

PRINCIPAL PROBLEM (as charted):
Left flank pain — ?renal colic (working label).

ENCOUNTER NOTES:
- Ambulance Handover — Nolan, Craig (Paramedic)
- ED Triage Note — Harding, Louise (RN)
- ED Provider Note — Reyes, Daniel, MD (Emergency Medicine)
- ED Progress Note — Fernsby, Alan, MD (Emergency Medicine)

WORKING PROBLEM LIST:
◆ Left flank pain, ?renal colic — WORKING LABEL
- Severe hypertension (BP 180s–190s systolic, no target set)
- Ex-smoker (~40 pack-years)
- CT KUB: no calculus; dilated thoracic aorta — CT aortogram advised (OUTSTANDING)

CARE TIMELINE:
05:20  Ambulance on scene — sudden tearing loin-to-back pain
05:40  Triage — ?renal colic, very hypertensive
06:30  ED clerking — codeine, CT KUB requested
07:15  Nursing obs — BP differs between arms (R 196/104, L 158/92)
08:45  CT KUB reported — no stone; aortogram recommended
10:15  ED review — pain settled on morphine; renal colic continued

EXPECTED MEDICATION LIST:
- Morphine sulfate 2–4 mg IV PRN (titrated)
- Codeine phosphate 60 mg PO QDS PRN
- Paracetamol 1 g IV/PO QDS PRN
- Metoclopramide 10 mg IV TDS PRN
- Sodium chloride 0.9% IV
- Amlodipine 10 mg PO OD — usual medication (BP uncontrolled)
- Ramipril 5 mg PO OD — usual medication (BP uncontrolled)

ALLERGIES: No known drug allergies.
CODE STATUS: For escalation. ISOLATION: None.

All patient data are synthetic. For education and simulation only. Not for clinical use.`,
  },
  {
    kind: "report",
    id: "ct-kub-report-001",
    encounterId: "enc-ct-kub",
    title: "CT KUB (non-contrast)",
    type: "Radiology Report",
    department: "Radiology",
    author: "Bahri, Samir, MD (Radiology)",
    signedAt: "06/07/2026 08:45",
    body: `EXAMINATION: CT KUB (non-contrast), for ?ureteric calculus.
CLINICAL DETAILS: 66M, acute left loin pain, ?renal colic. Query obstructing stone.

FINDINGS:
- Kidneys: normal in size and position. NO hydronephrosis or perinephric
  stranding on either side. No renal or ureteric calculus identified along the
  course of either ureter. Bladder unremarkable.
- No obstructing stone to account for the pain.
- INCIDENTAL: at the very top of the scanned field the visualised THORACIC AORTA
  appears mildly dilated / prominent (measures approximately 4.3 cm) and is
  incompletely assessed on this stone-protocol study.

IMPRESSION:
1. NO renal or ureteric calculus; no obstruction. The imaging does not support
   renal colic as the cause of the pain.
2. Incidental mildly dilated thoracic aorta at the limit of the field. If there
   is clinical concern for an aortic cause, a DEDICATED CT AORTOGRAM is
   recommended for proper assessment. Please correlate clinically.`,
  },
  {
    kind: "report",
    id: "ecg-report-001",
    encounterId: "enc-ecg",
    title: "12-Lead ECG",
    type: "ECG Report",
    department: "Emergency Medicine",
    author: "Reyes, Daniel, MD (Emergency Medicine)",
    signedAt: "06/07/2026 06:10",
    body: `12-LEAD ECG

Rate 88 bpm. Sinus rhythm. Normal axis. PR and QT intervals normal.

Voltage criteria for left ventricular hypertrophy with minor lateral repolarisation
changes, in keeping with long-standing hypertension. No acute ST elevation or
depression. No dynamic T-wave changes compared with none on file.

Interpretation: sinus rhythm with LVH; no acute ischaemic changes. Does not exclude
a non-cardiac cause of the pain.`,
  },
  {
    kind: "report",
    id: "urine-dip-001",
    encounterId: "enc-urine",
    title: "Urinalysis (Dipstick)",
    type: "Point-of-care Test",
    department: "Emergency Medicine",
    author: "Bianchi, Marco, RN",
    signedAt: "06/07/2026 06:15",
    body: `URINALYSIS — DIPSTICK (point-of-care)

Specimen: mid-stream urine, clear, straw-coloured.

Blood ............ NEGATIVE
Nitrites ......... Negative
Leucocytes ....... Negative
Protein .......... Trace
Glucose .......... Negative
Ketones .......... Negative
pH ............... 6.0

Comment: NO haematuria. Absence of blood on dipstick makes an obstructing
ureteric calculus less likely (haematuria present in the large majority of acute
stones). Not diagnostic in isolation — correlate clinically.`,
  },
  {
    kind: "lab",
    id: "lab-bloods-admit-001",
    encounterId: "enc-bloods-admit",
    title: "Admission Bloods — FBC, U&E, CRP, D-dimer, Troponin",
    status: "Final",
    specimen: "Blood (serum + EDTA + citrate), venepuncture",
    collected: "06/07/2026 06:20",
    received: "06/07/2026 06:32",
    reportedAt: "06/07/2026 06:55",
    orderedBy: "Reyes, Daniel, MD (Emergency Medicine)",
    resultingLab: "LegendCare Clinical Laboratory, Mount Verdant Hospital",
    rows: admissionLabRows,
  },
  {
    kind: "letter",
    id: "gp-htn-review-001",
    encounterId: "enc-htn-review",
    title: "Primary Care — Hypertension Review",
    type: "Letter",
    department: "Primary Care",
    author: "Ellery, Marcus, MD",
    signedAt: "20/06/2026",
    body: `Dear colleague,

Hypertension review for Mr Ferris. His blood pressure remains POORLY CONTROLLED:
clinic reading today 182/98, and the few home readings he has recorded are
similar. He is on amlodipine 10 mg and ramipril 5 mg but admits his adherence is
patchy and he has missed several reviews.

He is a recent ex-smoker (~40 pack-year history, stopped about two months ago).
No chest pain, breathlessness or claudication today. Examination otherwise
unremarkable; no abdominal bruit appreciated.

Plan:
- Up-titrate ramipril to 10 mg OD; reinforce adherence.
- Repeat U&E in 2 weeks; home BP diary.
- Reiterated cardiovascular risk given hypertension and smoking history.

Kind regards,
Dr M. Ellery`,
  },
  {
    kind: "lab",
    id: "lab-bloods-gp-001",
    encounterId: "enc-bloods-gp",
    title: "Primary Care Bloods — U&E, Lipids, HbA1c",
    status: "Final",
    specimen: "Blood (serum + EDTA), venepuncture",
    collected: "20/06/2026 09:10",
    received: "20/06/2026 09:26",
    reportedAt: "20/06/2026 12:40",
    orderedBy: "Ellery, Marcus, MD (Primary Care)",
    resultingLab: "LegendCare Clinical Laboratory, Mount Verdant Hospital",
    rows: [
      { test: "Sodium", value: "140", units: "mmol/L", range: "135–145", flag: "" },
      { test: "Potassium", value: "4.4", units: "mmol/L", range: "3.5–5.3", flag: "" },
      { test: "Urea", value: "6.8", units: "mmol/L", range: "2.5–7.8", flag: "" },
      { test: "Creatinine", value: "110", units: "µmol/L", range: "60–110", flag: "" },
      { test: "eGFR", value: "62", units: "mL/min/1.73m²", range: ">60", flag: "" },
      { test: "Total cholesterol", value: "5.8", units: "mmol/L", range: "<5.0", flag: "H" },
      { test: "HbA1c", value: "39", units: "mmol/mol", range: "20–41", flag: "" },
    ],
  },
  {
    kind: "order",
    id: "refill-amlodipine-001",
    encounterId: "enc-refill-amlodipine",
    title: "Repeat Prescription — Amlodipine",
    type: "Medication Order",
    department: "Primary Care",
    author: "Ellery, Marcus, MD",
    signedAt: "02/06/2026",
    body: `REPEAT PRESCRIPTION (issued electronically to community pharmacy)

Drug: Amlodipine 10 mg tablets
Directions: Take ONE tablet each morning.
Quantity: 28 tablets (4 weeks).
Indication: Essential hypertension.

Pharmacy note: collection intermittent — several late/missed pick-ups over the
past year. Adherence counselling advised at next review.`,
  },
  {
    kind: "order",
    id: "refill-ramipril-001",
    encounterId: "enc-refill-ramipril",
    title: "Repeat Prescription — Ramipril",
    type: "Medication Order",
    department: "Primary Care",
    author: "Ellery, Marcus, MD",
    signedAt: "02/06/2026",
    body: `REPEAT PRESCRIPTION (issued electronically to community pharmacy)

Drug: Ramipril 5 mg capsules
Directions: Take ONE capsule each morning.
Quantity: 28 capsules (4 weeks).
Indication: Essential hypertension.

Pharmacy note: uptake variable; last two issues collected late. To be up-titrated
at the next hypertension review.`,
  },
  {
    kind: "letter",
    id: "gp-smoking-001",
    encounterId: "enc-smoking",
    title: "Primary Care — Smoking Cessation Review",
    type: "Letter",
    department: "Primary Care",
    author: "Ellery, Marcus, MD",
    signedAt: "10/04/2026",
    body: `Dear colleague,

Smoking cessation review for Mr Ferris. He has a long history of cigarette use —
approximately 40 pack-years — and stopped smoking about eight weeks ago with
nicotine replacement. He is doing well and remains abstinent.

Blood pressure is high in clinic today at 176/96; he is on amlodipine and ramipril
but concedes he does not always take them. Cardiovascular risk discussed at length
given his age, hypertension and smoking history.

Plan:
- Continue NRT; congratulate on cessation.
- Hypertension review in a few weeks with repeat bloods and BP diary.

Kind regards,
Dr M. Ellery`,
  },
  {
    kind: "letter",
    id: "gp-htn-old-001",
    encounterId: "enc-htn-review-old",
    title: "Primary Care — Hypertension Review",
    type: "Letter",
    department: "Primary Care",
    author: "Ellery, Marcus, MD",
    signedAt: "15/07/2025",
    body: `Dear colleague,

Routine review. Mr Ferris has newly elevated blood pressure, confirmed on ambulatory
monitoring (average 152/94). No end-organ symptoms. Current smoker at this time.

Examination: BP 168/94, HR 74 regular. Heart sounds normal, chest clear. No oedema.

Plan:
- Start amlodipine 5 mg OD.
- Lifestyle advice including smoking cessation.
- Recheck BP and U&E in 4 weeks; annual review thereafter.

Kind regards,
Dr M. Ellery`,
  },
];

/** Note-kind documents only — feeds the Notes activity and Chart Review > Notes. */
export const caseDissection001Notes = caseDissection001Documents.filter(
  (doc): doc is Extract<ClinicalDocument, { kind: "note" }> => doc.kind === "note",
);
