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
  "D-dimer": "mg/L FEU",
  "Troponin I (hs)": "ng/L",
  Lactate: "mmol/L",
  Glucose: "mmol/L",
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
 * Single source of truth for the synthetic pulmonary embolism case (Prescott,
 * Gordon, 68M): every clinical document, note-kind and report-kind, in one
 * list. Both views derive from it — the Notes activity (and Chart Review >
 * Notes sub-tab) filter to `kind: "note"`, while the Encounters timeline
 * resolves each row's primary document by `encounterId`.
 *
 * CASE SHAPE — a pulmonary embolism ANCHORED as "infective exacerbation of
 * COPD" for the learner to unpick:
 *  - Known COPD smoker, breathless: triage, ED and the day-2 board round all
 *    reach for IECOPD. The chart disagrees: chest clear / no wheeze on three
 *    examinations, apyrexial, no purulent sputum, WCC normal, CRP only 18,
 *    hypoxia disproportionate to a clear hyperinflated CXR, persistent sinus
 *    tachycardia, and no response to nebulisers / steroids / doxycycline.
 *  - The VTE risk factor lives in OLD encounters: right TKR 3 weeks ago, with
 *    rivaroxaban prophylaxis stopped on day 5 (GP telephone note) and reduced
 *    mobility since (outpatient physio letter).
 *  - Latent / system-factor hooks (NOT individual blame): a D-dimer added to
 *    the ED "breathlessness panel" that reported after transfer and was never
 *    actioned; a CTPA requested by the night SHO that sits unvetted while the
 *    day board round writes "continue current"; a VTE risk assessment left
 *    "to complete" so no thromboprophylaxis was ever prescribed; and a
 *    reflexive 88–92% sats target despite an ABG showing type 1 respiratory
 *    failure with a LOW pCO2.
 *
 * All content is fabricated for education and simulation only. Not for clinical use.
 */
export const casePe001Documents: ClinicalDocument[] = [
  {
    kind: "note",
    id: "note-ed-001",
    encounterId: "enc-triage",
    category: "ED Notes",
    noteType: "ED Triage Note",
    author: "Devlin, Aoife",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "Emergency Department",
    dateOfService: "05/07/26 1710",
    fileTime: "05/07/26 1724",
    timestamp: 1783267800,
    status: "signed",
    admission: true,
    urgent: true,
    body: `ED TRIAGE NOTE

68M self-presented, breathless. Known COPD — "my chest is playing up again".
Very short of breath walking from the car, speaking in short sentences. Dry
cough, no sputum brought up. Recovering from a knee replacement — walks with
a stick, mobility reduced.

Obs: T 37.2, HR 108, BP 132/78, RR 26, SpO2 86% RA. NEWS2 = 7.
No known drug allergies — band applied.

Triage category: Very urgent. Moved to majors. Salbutamol nebuliser started
per COPD protocol, doctor informed. Bloods + VBG taken, IV access x1 sited.`,
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
    dateOfService: "05/07/26 1805",
    fileTime: "05/07/26 1838",
    timestamp: 1783271100,
    status: "signed",
    admission: true,
    urgent: true,
    body: `EMERGENCY DEPARTMENT PROVIDER NOTE

Presenting complaint: breathlessness on a background of COPD.

HPI: 68M, known COPD (FEV1 52% predicted 03/2026), 40 pack-years, still smoking
a few per day. Three days of steadily worsening breathlessness with a dry cough.
No fever or chills at home. No change in sputum — usually scant and white, none
produced today. Felt his "heart racing" since yesterday. Previous admission with
an exacerbation 11/2025, which responded quickly to nebulisers and steroids.

Examination: alert, breathless at rest. Chest QUIET BUT CLEAR — no wheeze, no
crackles. HS I+II+0. Calves: right lower leg oedematous post knee replacement
(15/06), wound healing. Obs: T 37.2, HR 108 sinus, BP 132/78, RR 26, SpO2 86% RA
improving to 90% on 2 L.

Investigations: ECG sinus tachycardia 108, no ischaemic change. CXR hyperinflated,
no consolidation. Bloods sent including the department breathlessness panel
(FBC, U&E, CRP, D-dimer, troponin) — several results to follow after transfer.

Impression: infective exacerbation of COPD, presumed viral trigger.

Plan: salbutamol + ipratropium nebulisers, prednisolone 30 mg PO (5 days),
doxycycline 200 mg loading then 100 mg OD. Target SpO2 88–92% pending gases.
Refer General Medicine for admission. Ward team to review outstanding bloods.`,
  },
  {
    kind: "note",
    id: "note-hp-001",
    encounterId: "enc-admission",
    category: "H&P",
    noteType: "H&P",
    author: "Whitcombe, Thomas",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "(A) General Medicine — AMU",
    dateOfService: "05/07/26 2030",
    fileTime: "05/07/26 2112",
    timestamp: 1783279800,
    status: "signed",
    admission: true,
    body: `GENERAL MEDICINE ADMISSION H&P
Admission Date: 05/07/2026 — PCP: Pritchard, Eleanor, MD

CC: Breathlessness on a background of COPD.

HISTORY OF PRESENT ILLNESS:
Gordon Prescott is a 68-year-old man with COPD presenting with 3 days of
progressive breathlessness and a dry cough. No fever, rigors or coryza. No
increase in sputum volume or purulence — he has produced no sputum today. He
reports his heart "racing" and feeling winded on minimal exertion. His last
exacerbation (11/2025) felt different — "wheezy and chesty"; this time his
chest feels "tight but quiet".

He had an elective right total knee arthroplasty on 15/06/2026 and has been
mostly chair-bound at home since, mobilising short distances with a stick.
He says he "finished with the blood thinner" after the operation.

PAST MEDICAL HISTORY:
- COPD (FEV1 52% predicted, 03/2026); 40 pack-years, current smoker  2014
- Right total knee arthroplasty                                      15/06/2026
- Essential hypertension                                             2017

MEDICATIONS (on admission):
- Trimbow (beclometasone/formoterol/glycopyrronium) 2 puffs BD
- Salbutamol 100 micrograms INH PRN
- Amlodipine 5 mg PO OD
- Paracetamol PRN (knee)

ALLERGIES: No known drug allergies.

EXAMINATION:
- Alert, breathless on talking. Apyrexial (37.1).
- Chest: hyperexpanded, CLEAR on auscultation — no wheeze, no crackles.
- CVS: HR 106 regular, BP 128/76, HS normal, JVP not elevated.
- Legs: right knee wound healing well; right lower leg oedematous —
  post-operative. Left calf soft.

INVESTIGATIONS:
- CXR: hyperinflated, clear. No consolidation.
- ECG: sinus tachycardia 106.
- Bloods: WCC 9.8, CRP 18. Remainder of the ED breathlessness panel reported
  after transfer — to be reviewed.

IMPRESSION:
Infective exacerbation of COPD (working diagnosis per ED), although sputum is
not purulent and the chest is clear.

PLAN:
1. Salbutamol + ipratropium nebulisers, prednisolone 30 mg OD, doxycycline.
2. Target SpO2 88–92% (COPD) on 2 L nasal cannulae.
3. Sputum sample when able; repeat obs 4-hourly.
4. VTE assessment: to complete.
5. Senior review on the post-take round.`,
  },
  {
    kind: "note",
    id: "note-nurse-001",
    encounterId: "enc-admission",
    category: "Nursing",
    noteType: "Nursing Admission Assessment",
    author: "Mercado, Liezel",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "(A) General Medicine — AMU",
    dateOfService: "05/07/26 2100",
    fileTime: "05/07/26 2126",
    timestamp: 1783281600,
    status: "signed",
    admission: true,
    body: `NURSING ADMISSION ASSESSMENT

68M admitted to AMU Bay 5 from ED with ?exacerbation of COPD.

Obs on arrival: T 37.1, HR 106, BP 126/74, RR 24, SpO2 89% on 2 L. NEWS2 = 6.
Breathless on transferring to bed. Dry cough — no sputum produced for the pot
despite encouragement. No wheeze audible at the bedside.

Risk assessments: falls — moderate (recent knee surgery, walks with stick);
pressure areas (Waterlow) — moderate; VTE — to be completed by medical team.
No known drug allergies, band checked. One peripheral cannula in situ.
Right knee dressing clean and dry; right lower leg noted swollen — elevated
on a pillow. Family aware of admission.`,
  },
  {
    kind: "note",
    id: "note-prog-001",
    encounterId: "enc-post-take",
    category: "Progress",
    noteType: "Post-Take Ward Round",
    author: "Adeyemi, Folake",
    credential: "MD",
    authorRole: "*PHYSICIAN: FACULTY",
    service: "(A) General Medicine — AMU",
    dateOfService: "05/07/26 2210",
    fileTime: "05/07/26 2231",
    timestamp: 1783285800,
    status: "signed",
    admission: true,
    body: `POST-TAKE WARD ROUND NOTE

Seen on the evening post-take round with the on-call team.

68M, COPD, 3 days breathlessness. Treated as an infective exacerbation in ED.
Reviewed: chest is drier than I would expect for an infective exacerbation —
clear, no wheeze. Apyrexial. CRP only 18, WCC normal. Dry cough, no sputum.

Obs: HR 108, BP 128/76, RR 24, SpO2 89% on 2 L.

Impression: ?IECOPD — accept the working label overnight, but the clinical
picture is not fully convincing.

Plan:
- Continue nebulisers, prednisolone and doxycycline overnight.
- If not improving by morning, reconsider the diagnosis and the need for
  further imaging — hypoxia is more than the CXR explains.
- Chase outstanding admission bloods from the ED panel.
- VTE risk assessment to be completed by the ward team.
- Sputum sample if obtainable. Repeat ABG if sats fall.`,
  },
  {
    kind: "note",
    id: "note-prog-002",
    encounterId: "enc-night-review",
    category: "Progress",
    noteType: "Inpatient Review (Night)",
    author: "Osei, Kwame",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "(A) General Medicine — AMU (Night)",
    dateOfService: "05/07/26 2345",
    fileTime: "06/07/26 0008",
    timestamp: 1783291500,
    status: "signed",
    body: `NIGHT REVIEW — asked to see for persistent tachycardia and SpO2 87% on 2 L.

68M, day 0 of ?IECOPD. Nebulisers given as charted with little effect.

O/E: chest again CLEAR — no wheeze (third clear examination today). Apyrexial.
HR 110 sinus on repeat ECG, no ischaemic change. Speaking in full sentences.

ABG on 2 L: pH 7.47, pCO2 3.9, pO2 7.4, HCO3 22, lactate 1.5 —
type 1 respiratory failure with a LOW pCO2. He is not retaining.

Noted the admission D-dimer has now reported at 4.2 (breathlessness panel).
Hypoxia is out of keeping with the CXR, and he had a knee replacement 3 weeks
ago. PE needs excluding — I have requested a CTPA; it will need vetting by
radiology in the morning. Day team please discuss and expedite.

Plan overnight: continue current treatment; obs hourly; ABG if deteriorates.
I have not started anticoagulation overnight — for the day team to decide with
imaging (recent surgery). Handed over verbally at 07:30.`,
  },
  {
    kind: "note",
    id: "note-nurse-002",
    encounterId: "enc-admission",
    category: "Nursing",
    noteType: "Nursing Shift Note",
    author: "Byrne, Sinead",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "(A) General Medicine — AMU",
    dateOfService: "06/07/26 0630",
    fileTime: "06/07/26 0649",
    timestamp: 1783315800,
    status: "signed",
    body: `NURSING SHIFT NOTE (Night)

Settled at times but remains breathless on any exertion. Nebulisers given as
charted with little apparent benefit. SpO2 88–90% on 2 L all shift; dips to
86% when off oxygen for washing. HR 105–112 throughout. Apyrexial overnight.

At 03:00 complained of a brief sharp pain on the right side of the chest on
deep breathing — settled without analgesia, doctor not called. Dry cough only;
still no sputum for the pot.

Right lower leg remains more swollen than the left — elevated on a pillow
(post-op knee). Knee dressing intact. Ate little, drinking well. For medical
review on the morning round.`,
  },
  {
    kind: "note",
    id: "note-prog-003",
    encounterId: "enc-ward-round",
    category: "Progress",
    noteType: "Board Round Note",
    author: "Fenwick, Laura",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "(A) General Medicine — AMU",
    dateOfService: "06/07/26 0840",
    fileTime: "06/07/26 0852",
    timestamp: 1783323600,
    status: "signed",
    body: `BOARD ROUND NOTE — AMU

68M. IECOPD day 2.

Obs: T 37.2, HR 108, BP 124/74, RR 23, SpO2 88% on 2 L. Chest clear.

Plan:
- Continue nebulisers, prednisolone and doxycycline.
- Target sats 88–92% (COPD).
- Await sputum culture.
- Home when sats stable — likely tomorrow if settles.

Full ward round review to follow.`,
  },
  {
    kind: "note",
    id: "note-prog-004",
    encounterId: "enc-admission",
    category: "Progress",
    noteType: "Best Poss Rx Hx",
    author: "Nakamura, Kenji",
    credential: "PharmD",
    authorRole: ".PHARMACIST",
    service: "Pharmacy",
    dateOfService: "06/07/26 0915",
    fileTime: "06/07/26 0941",
    timestamp: 1783325700,
    status: "signed",
    body: `BEST POSSIBLE MEDICATION HISTORY

Sources: patient interview, GP summary, community pharmacy record (2 sources).

Regular medications confirmed:
- Trimbow (beclometasone/formoterol/glycopyrronium) 2 puffs BD — own inhaler
  with him; technique acceptable.
- Salbutamol 100 micrograms INH PRN.
- Amlodipine 5 mg PO OD.
- Paracetamol 1 g PO PRN (knee).

RIVAROXABAN DISCREPANCY: discharge letter of 17/06/2026 (right TKR) prescribed
rivaroxaban 10 mg OD for 14 days VTE prophylaxis. Community pharmacy dispensing
and the patient's own account indicate he STOPPED it after 5 days following a
nosebleed and did not restart (see GP telephone note 24/06). He told the
clerking team he had "finished" the course.

VTE FLAG: no pharmacological thromboprophylaxis has been prescribed since
admission, and the VTE risk assessment remains outstanding — recent major
lower-limb surgery + reduced mobility. Flagged to the ward team: decision
needed today.

No known drug allergies (patient confirms).`,
  },
  {
    kind: "note",
    id: "note-ther-001",
    encounterId: "enc-physio",
    category: "Progress",
    noteType: "Physiotherapy Note",
    author: "Marsh, Verity",
    credential: "PT",
    authorRole: ".THERAPIST: (PT)",
    service: "Physiotherapy — AMU",
    dateOfService: "06/07/26 1030",
    fileTime: "06/07/26 1047",
    timestamp: 1783330200,
    status: "signed",
    body: `PHYSIOTHERAPY NOTE — mobility assessment

Seen for mobility assessment (recent right TKR, admitted with ?IECOPD).

Transferred to standing with a stick. On walking to the bathroom (~10 m):
SpO2 fell from 89% to 84% on 2 L, RR 30, HR 118. Recovery to baseline slow
(~4 minutes). Chest sounds clear on auscultation before and after — no wheeze
to suggest bronchospasm limiting him. Session curtailed in view of desaturation.

Right calf visibly more swollen than the left; reported to nursing staff and
documented for the medical team.

Plan: no further mobilisation until medical review of exertional desaturation.
Bed exercises provided. Will re-review once cause established.`,
  },
  {
    kind: "encounterSummary",
    id: "admission-encounter-001",
    encounterId: "enc-admission",
    title: "Admission — ED to Hosp-Admission",
    type: "Hospital Encounter",
    department: "General Medicine",
    author: "Adeyemi, Folake, MD (Attending)",
    signedAt: "05/07/2026 19:45",
    body: `ADMISSION  [Current]
05/07/2026 19:45 — present       Mount Verdant Hospital
Admitting / Attending: Adeyemi, Folake, MD — General Medicine

PRINCIPAL PROBLEM:
Breathlessness — ?infective exacerbation of COPD (working label, under review).

ENCOUNTER NOTES:
- ED Provider Note — Kaur, Simran, MD (Emergency Medicine)
- Admission H&P — Whitcombe, Thomas, MD (General Medicine)
- Post-Take Ward Round — Adeyemi, Folake, MD (General Medicine)

HOSPITAL PROBLEM LIST:
◆ ?Infective exacerbation of COPD — PRINCIPAL (poor response to treatment)
- Hypoxia — disproportionate to CXR findings
- Persistent sinus tachycardia
- COPD (FEV1 52% predicted, 03/2026)
- Right total knee arthroplasty (15/06/2026)
- Essential hypertension

CARE TIMELINE:
17:10  Arrived in ED (self-presented)
18:05  Seen by ED provider; nebulisers, prednisolone, doxycycline started
19:45  Admitted — General Medicine, AMU Bay 5

EXPECTED MEDICATION LIST:
- Salbutamol 2.5 mg NEB QDS + PRN
- Ipratropium 500 micrograms NEB QDS
- Prednisolone 30 mg PO OD (5 days)
- Doxycycline 100 mg PO OD (200 mg loading given in ED)
- Trimbow 2 puffs BD (own inhaler)
- Amlodipine 5 mg PO OD
- Paracetamol 1 g PO QDS PRN
- VTE prophylaxis — NOT PRESCRIBED; risk assessment outstanding

ALLERGIES: No known drug allergies.
CODE STATUS: For escalation. ISOLATION: None.

All patient data are synthetic. For education and simulation only. Not for clinical use.`,
  },
  {
    kind: "report",
    id: "cxr-report-001",
    encounterId: "enc-cxr",
    title: "CXR — Chest (PA)",
    type: "Radiology Report",
    department: "Radiology",
    author: "Novak, Petra, MD (Radiology)",
    signedAt: "05/07/2026 18:35",
    body: `EXAMINATION: Chest radiograph (PA erect), ED.
CLINICAL DETAILS: Breathless, known COPD, SpO2 86% RA. ?consolidation.

FINDINGS:
- Hyperinflated lungs with flattened hemidiaphragms, consistent with COPD.
- No focal consolidation. No pleural effusion. No pneumothorax.
- Cardiomediastinal contour within normal limits. Pulmonary vasculature
  unremarkable on this projection.
- Bones and soft tissues: no acute abnormality.

IMPRESSION:
Hyperinflation in keeping with known COPD. No acute focal lung abnormality.
The degree of hypoxia is not explained by this radiograph — clinical
correlation advised.`,
  },
  {
    kind: "order",
    id: "ctpa-request-001",
    encounterId: "enc-ctpa-request",
    title: "Imaging Request — CT Pulmonary Angiogram",
    type: "Imaging Order",
    department: "Radiology",
    author: "Osei, Kwame, MD (General Medicine, night)",
    signedAt: "05/07/2026 23:55",
    body: `IMAGING REQUEST — CT PULMONARY ANGIOGRAM (CTPA)

Requested: 05/07/2026 23:55 — Osei, Kwame, MD (General Medicine, night team)

CLINICAL DETAILS:
68M admitted ?IECOPD but the picture does not fit: chest clear on three
examinations, no wheeze, apyrexial, CRP 18 only, no purulent sputum, and no
response to nebulisers/steroids. Persistent sinus tachycardia 105–112. SpO2
87% on 2 L with a CLEAR hyperinflated CXR. ABG: type 1 respiratory failure,
pCO2 3.9 (low). Right total knee arthroplasty 15/06/2026, reduced mobility
since. D-dimer 4.2 mg/L FEU. ?Pulmonary embolism.

QUESTION: PE — filling defect?

STATUS: AWAITING VETTING — request not yet protocolled or scheduled.
Radiology day team to vet 06/07; referring team please discuss if urgent.
Renal function satisfactory (creatinine 88) for contrast.`,
  },
  {
    kind: "letter",
    id: "tkr-discharge-001",
    encounterId: "enc-tkr",
    title: "Orthopaedic Discharge — Right Total Knee Arthroplasty",
    type: "Letter",
    department: "Orthopaedics",
    author: "Ferguson, Alistair, MD",
    signedAt: "17/06/2026",
    body: `Dear colleague,

Mr Prescott was admitted on 15/06/2026 for an elective right total knee
arthroplasty for osteoarthritis, performed under spinal anaesthesia. The
procedure and recovery were uncomplicated and he was discharged on 17/06/2026.

Discharge medications:
- Rivaroxaban 10 mg PO OD for 14 DAYS (extended VTE prophylaxis after knee
  arthroplasty — course to complete on 01/07/2026).
- Paracetamol 1 g QDS PRN; codeine 30 mg PRN (short supply).

Advice given: mobilise little and often with the stick, outpatient
physiotherapy arranged, wound review with the practice nurse at 2 weeks.
Please encourage completion of the rivaroxaban course; we have counselled him
on the importance of VTE prophylaxis after knee replacement.

Routine orthopaedic follow-up at 6 weeks with radiographs.

Kind regards,
Mr A. Ferguson`,
  },
  {
    kind: "letter",
    id: "gp-telephone-001",
    encounterId: "enc-gp-telephone",
    title: "Primary Care — Telephone Review (Post-TKR)",
    type: "Letter",
    department: "Primary Care",
    author: "Pritchard, Eleanor, MD",
    signedAt: "24/06/2026",
    body: `Dear colleague,

Telephone review with Mr Prescott following his right knee replacement on
15/06/2026. The wound is healing well per the practice nurse's review and his
pain is controlled on paracetamol.

Of note: he tells me he STOPPED the rivaroxaban after five days following a
self-limiting nosebleed, and has not restarted it. I explained that the
14-day course is there to prevent blood clots after knee surgery and advised
him to restart and complete it; he was reluctant ("it made my nose bleed and
the knee is fine"). We agreed to revisit at the wound check. No calf pain or
swelling reported beyond the expected post-operative changes at this point.

He remains largely chair-bound at home, mobilising short distances with a
stick. Physiotherapy is ongoing.

Kind regards,
Dr E. Pritchard`,
  },
  {
    kind: "letter",
    id: "physio-op-001",
    encounterId: "enc-physio-op",
    title: "Outpatient Physiotherapy — Post-TKR Review",
    type: "Letter",
    department: "Physiotherapy",
    author: "Odum, Grace, PT",
    signedAt: "29/06/2026",
    body: `Dear colleague,

Outpatient physiotherapy review, right total knee arthroplasty (15/06/2026).

Progress: knee flexion 0–85 degrees, quadriceps strength improving but still
reduced. Transfers independent with a stick; walking short distances indoors
only, largely sedentary between sessions. Encouraged to mobilise little and
often.

The right lower leg remains swollen relative to the left — attributed to
expected post-operative changes at this stage; advised elevation when resting
and to report any calf pain, increasing swelling or breathlessness.

Next review in 2 weeks. Home exercise programme updated.

Kind regards,
Grace Odum, Physiotherapist`,
  },
  {
    kind: "order",
    id: "refill-inhalers-001",
    encounterId: "enc-refill-inhalers",
    title: "Repeat Prescription — Inhalers",
    type: "Medication Order",
    department: "Primary Care",
    author: "Pritchard, Eleanor, MD",
    signedAt: "05/05/2026",
    body: `REPEAT PRESCRIPTION (issued electronically to community pharmacy)

Drug: Trimbow (beclometasone/formoterol/glycopyrronium) 87/5/9 inhaler
Directions: TWO puffs twice daily.
Quantity: 1 inhaler (4 weeks).

Drug: Salbutamol 100 micrograms inhaler
Directions: One to two puffs as required for breathlessness.
Quantity: 1 inhaler.

Indication: COPD (FEV1 52% predicted, 03/2026).
Last issue: 06/04/2026. Inhaler technique checked at annual review.
Compliance good per pharmacy record. No rescue-pack issues since 11/2025.`,
  },
  {
    kind: "letter",
    id: "copd-review-001",
    encounterId: "enc-copd-review",
    title: "Primary Care — Annual COPD Review",
    type: "Letter",
    department: "Primary Care",
    author: "Pritchard, Eleanor, MD",
    signedAt: "12/03/2026",
    body: `Dear colleague,

Annual COPD review for Mr Prescott.

Spirometry today: FEV1 1.42 L (52% predicted), FEV1/FVC 0.58 — moderate
airflow obstruction. MRC dyspnoea scale 3. He remains a current smoker
(40 pack-years) but has cut down to around five per day; cessation support
offered again and declined for now.

One exacerbation in the last 12 months (11/2025, brief admission, responded
briskly to nebulisers and prednisolone). No home oxygen. On Trimbow 2 puffs BD
with salbutamol PRN; inhaler technique checked and acceptable. Influenza,
COVID and pneumococcal vaccinations up to date.

Plan: continue current inhaled therapy; rescue pack NOT issued this year at
his request (unused last year); review sooner if exacerbations increase.

Kind regards,
Dr E. Pritchard`,
  },
  {
    kind: "report",
    id: "ed-iecopd-2025-001",
    encounterId: "enc-ed-iecopd",
    title: "ED Attendance — Summary",
    type: "ED Visit Summary",
    department: "Emergency Department",
    author: "Hughes, Rhys, MD",
    signedAt: "14/11/2025",
    body: `EMERGENCY DEPARTMENT ATTENDANCE — SUMMARY

Presenting complaint: breathlessness and productive cough, known COPD.

HPI: 4 days of increasing breathlessness with cough productive of purulent
green sputum following a head cold. Wheezy and "chesty" per patient.

Examination: T 37.9, HR 98, RR 24, SpO2 90% RA. Widespread expiratory wheeze
throughout both lung fields.

Investigations: WCC 14.2, CRP 96. CXR hyperinflated, no consolidation.

Impression: infective exacerbation of COPD.

Course: brisk response to salbutamol/ipratropium nebulisers and prednisolone;
started doxycycline. Admitted under General Medicine for 48 h and discharged
with a rescue pack and GP follow-up. Smoking cessation advice given.`,
  },
  {
    kind: "lab",
    id: "lab-bloods-admit-001",
    encounterId: "enc-bloods-admit",
    title: "Admission Bloods — FBC, U&E, CRP, D-dimer, Troponin",
    status: "Final",
    specimen: "Blood (serum + EDTA), venepuncture",
    collected: "05/07/2026 17:25",
    received: "05/07/2026 17:41",
    reportedAt: "05/07/2026 19:20",
    orderedBy: "Kaur, Simran, MD (Emergency Medicine)",
    resultingLab: "LegendCare Clinical Laboratory, Mount Verdant Hospital",
    rows: admissionLabRows,
  },
  {
    kind: "micro",
    id: "micro-sputum-001",
    encounterId: "enc-micro-sputum",
    title: "Sputum Culture",
    status: "Final",
    specimen: "Sputum (expectorated)",
    collected: "05/07/2026 21:30",
    received: "05/07/2026 22:10",
    reportedAt: "06/07/2026 08:00",
    organisms: [],
    resultText: `SPUTUM CULTURE — FINAL

Macroscopic: salivary; POOR-QUALITY sample.
Microscopy: epithelial cells ++, scanty leucocytes. No organisms seen on
Gram stain.

Culture: NO SIGNIFICANT GROWTH. Mixed upper respiratory flora only.

Comment: sample quality poor (salivary) — repeat only if clinically indicated.
No pathogens isolated; correlate with the clinical picture before attributing
symptoms to lower respiratory tract infection.`,
  },
];

/** Note-kind documents only — feeds the Notes activity and Chart Review > Notes. */
export const casePe001Notes = casePe001Documents.filter(
  (doc): doc is Extract<ClinicalDocument, { kind: "note" }> => doc.kind === "note",
);
