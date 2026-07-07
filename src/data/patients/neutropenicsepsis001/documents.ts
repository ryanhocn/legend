import type { ClinicalDocument, LabFlag, LabRow } from "../../../types";
import { bloods } from "./bloods";

/** SI units for the admission panel, keyed by `bloods` test name. */
const ADMISSION_LAB_UNITS: Record<string, string> = {
  WCC: "x10⁹/L",
  Neutrophils: "x10⁹/L",
  Lymphocytes: "x10⁹/L",
  Haemoglobin: "g/L",
  Platelets: "x10⁹/L",
  CRP: "mg/L",
  Lactate: "mmol/L",
  Urea: "mmol/L",
  Creatinine: "µmol/L",
  Sodium: "mmol/L",
  Potassium: "mmol/L",
  Bilirubin: "µmol/L",
  ALT: "U/L",
  Albumin: "g/L",
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
 * Single source of truth for the synthetic neutropenic sepsis case (Whitfield,
 * Diane, 52F): every clinical document, note-kind and report-kind, in one list.
 * Both views derive from it — the Notes activity (and Chart Review > Notes
 * sub-tab) filter to `kind: "note"`, while the Encounters timeline resolves each
 * row's primary document by `encounterId`.
 *
 * Note-kind documents drive the Notes/Trans browser: category tabs filter by
 * `category`, "Admission" by the `admission` flag and "Incomplete" by `status`.
 * The list sorts by `timestamp`. Report-kind documents (letters, imaging, orders,
 * the admission summary) are reached only via their encounter row.
 *
 * CASE SHAPE — neutropenic sepsis mislabelled as a viral illness:
 *  - Triage records "flu-like illness, well-looking, ?viral" and sends her to
 *    the waiting room; the whole chart argues against it.
 *  - The oncology history (day 10 post cycle 2 docetaxel) sits in the clinic
 *    letters and the chemotherapy record — the thing the triage label ignores.
 *  - The admission FBC resulted at 08:20 with NEUTROPHILS 0.3; antibiotics were
 *    not given on that result — the door-to-antibiotic (1 hour) standard is
 *    breached — the time-critical miss.
 *  - Paracetamol given at triage transiently masked the fever (07:45 obs), the
 *    false reassurance behind the "well-looking" label.
 *  - The neutropenic sepsis pathway order defaulted to piperacillin/tazobactam
 *    with an overridden allergy alert, against a documented PENICILLIN
 *    ANAPHYLAXIS — caught downstream by pharmacy/microbiology and switched to
 *    aztreonam + vancomycin + gentamicin.
 *
 * All content is fabricated for education and simulation only. Not for clinical use.
 */
export const caseNeutropenicsepsis001Documents: ClinicalDocument[] = [
  {
    kind: "note",
    id: "note-triage-001",
    encounterId: "enc-triage",
    category: "ED Notes",
    noteType: "ED Triage Note",
    author: "Okoye, Grace",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "Emergency Department",
    dateOfService: "06/07/26 0710",
    fileTime: "06/07/26 0718",
    timestamp: 1783321800,
    status: "signed",
    admission: true,
    urgent: true,
    body: `ED TRIAGE NOTE

52F self-presented feeling generally unwell for a day: fever at home, aches,
tiredness and a mild sore throat. Says it is "probably a flu bug going round the
family". Walked in unaided, chatting, looks reasonably well.

Obs: T 38.2, HR 96, BP 118/74, RR 18, SpO2 97% RA. NEWS2 = 2.
Allergy band applied: PENICILLIN — ANAPHYLAXIS.

Given paracetamol 1 g PO for fever and comfort. Flu-like illness, well-looking,
?viral. Triage category: standard. To wait in the waiting room for the ED stream;
re-triage if not seen or if she feels worse.`,
  },
  {
    kind: "note",
    id: "note-nurse-obs-001",
    encounterId: "enc-nursing-obs",
    category: "Nursing",
    noteType: "Nursing Escalation Note",
    author: "Hunt, Rebecca",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "Emergency Department",
    dateOfService: "06/07/26 0915",
    fileTime: "06/07/26 0922",
    timestamp: 1783329300,
    status: "signed",
    admission: true,
    urgent: true,
    body: `ED NURSING ESCALATION NOTE

Called to the waiting room — patient had a shaking chill (rigor) and looked
flushed and clammy. Repeat obs taken.

Obs: T 37.9 (paracetamol given at triage ~2h ago), HR 108, BP 104/64, RR 20,
SpO2 96% RA. NEWS2 = 5.

On asking, she volunteers she is having chemotherapy for breast cancer and her
"last treatment was about a week and a half ago". This was not captured at
triage. Moved out of the waiting room into Majors. Doctor escalated immediately;
IV access sited, bloods repeated/chased. Allergy band checked — PENICILLIN
(anaphylaxis).`,
  },
  {
    kind: "note",
    id: "note-ed-001",
    encounterId: "enc-ed",
    category: "ED Notes",
    noteType: "ED Provider Note",
    author: "Ahmed, Yusuf",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "Emergency Department",
    dateOfService: "06/07/26 1005",
    fileTime: "06/07/26 1031",
    timestamp: 1783332300,
    status: "signed",
    admission: true,
    urgent: true,
    body: `EMERGENCY DEPARTMENT PROVIDER NOTE

Reviewed after nursing escalation. Booked in at 07:10 as a ?viral illness and
waited; brought through after a rigor and deteriorating observations.

HPI: 52F, ~1 day of fever, malaise and a mild sore throat. Crucially she is DAY
10 post CYCLE 2 of adjuvant docetaxel/cyclophosphamide for breast cancer (day
unit 26/06) — i.e. at the expected neutrophil nadir. This is NOT a viral illness:
it is neutropenic sepsis until proven otherwise.

The paracetamol given at triage masked the fever (07:45 temp 37.4), which
contributed to the "well-looking" label — she has since rigored and her obs are
septic.

Obs now: T 38.6, HR 116, BP 98/58, RR 22, SpO2 95% RA. NEWS2 escalating.
Exam: mild pharyngeal erythema, early oral mucositis; chest clear; no focal
source. Cannula sites clean.

FBC (resulted 08:20): WCC 1.1, NEUTROPHILS 0.3 — profound neutropenia. CRP 88,
lactate 2.1, creatinine 96 (baseline ~68 — early AKI). CXR clear.

***Governance flag: the neutrophil count resulted at 08:20 and antibiotics were
NOT given on that result. Door-to-antibiotic target (1 hour from arrival) is
breached — antibiotics are the immediate priority.***

Impression: high-risk febrile (neutropenic) sepsis, day 10 post docetaxel.

Plan:
- IV empirical antibiotics NOW — do not wait for cultures.
- NOTE: neutropenic sepsis pathway defaults to piperacillin/tazobactam, but she
  has a documented PENICILLIN ANAPHYLAXIS — pip/taz is contraindicated. Pharmacy
  and microbiology contacted for an allergy-safe regimen (see their notes).
- Blood cultures x2 + urine sent; septic screen. IV fluid bolus.
- Protective (neutropenic) isolation; refer acute oncology; admit.`,
  },
  {
    kind: "note",
    id: "note-pharm-001",
    encounterId: "enc-pharmacy",
    category: "Progress",
    noteType: "Pharmacy Review",
    author: "Doran, Claire",
    credential: "PharmD",
    authorRole: ".PHARMACIST",
    service: "Pharmacy",
    dateOfService: "06/07/26 1040",
    fileTime: "06/07/26 1053",
    timestamp: 1783334400,
    status: "signed",
    admission: true,
    body: `PHARMACY MEDICINES REVIEW

Contacted re: neutropenic sepsis empirical antibiotic order.

ALLERGY / PRESCRIBING SAFETY ALERT:
The Neutropenic Sepsis Pathway order defaulted to PIPERACILLIN/TAZOBACTAM 4.5 g
IV. The patient has a documented, verified PENICILLIN ANAPHYLAXIS (2018 — lip and
throat swelling, urticaria, adrenaline given). Piperacillin/tazobactam is a
penicillin and is CONTRAINDICATED. The pathway allergy alert appears to have been
overridden at ordering.

Action: pip/taz order held (do NOT administer). Escalated to microbiology for an
allergy-appropriate regimen — see Microbiology advice.

Regular medications (BPMH, 2 sources — patient + GP record):
- Levothyroxine 100 mcg PO OD (continue).
- Adjuvant docetaxel/cyclophosphamide, cycle 2 given 26/06/2026 (chemotherapy —
  do not re-dose here).
No anticoagulation on file. Note platelets 112 — check before any invasive step.`,
  },
  {
    kind: "note",
    id: "note-micro-001",
    encounterId: "enc-micro-advice",
    category: "Consults",
    noteType: "Microbiology Consult",
    author: "Fenwick, Alan",
    credential: "MD",
    authorRole: "*PHYSICIAN: FACULTY",
    service: "Microbiology",
    dateOfService: "06/07/26 1110",
    fileTime: "06/07/26 1124",
    timestamp: 1783336200,
    status: "signed",
    admission: true,
    body: `MICROBIOLOGY — ANTIMICROBIAL ADVICE

Re: 52F, high-risk febrile neutropenia (neutrophils 0.3), day 10 post docetaxel.
Documented PENICILLIN ANAPHYLAXIS (severe — throat swelling, adrenaline in 2018).

Piperacillin/tazobactam and all penicillins are CONTRAINDICATED; given a true
anaphylaxis, avoid cephalosporins/carbapenems as first line here too. Recommended
penicillin-allergy empirical regimen for neutropenic sepsis (local policy):

- AZTREONAM 2 g IV TDS (Gram-negative cover; monobactam — negligible penicillin
  cross-reactivity) PLUS
- VANCOMYCIN IV (weight-based, levels) for Gram-positive cover PLUS
- GENTAMICIN 5 mg/kg IV OD (single daily dosing; monitor renal function/levels).

Give the FIRST DOSE IMMEDIATELY — the door-to-antibiotic target is already
breached. Ensure blood cultures x2 were taken before the first dose (confirmed
sent) but DO NOT delay antibiotics further for any pending sample. Review at 48 h
with cultures; de-escalate on sensitivities. Likely organisms: Gram-negatives
(E. coli, Pseudomonas), Gram-positives from mucositis/line.`,
  },
  {
    kind: "note",
    id: "note-onc-001",
    encounterId: "enc-onc",
    category: "Consults",
    noteType: "Acute Oncology Advice",
    author: "Sinclair, Ruth",
    credential: "MD",
    authorRole: "*PHYSICIAN: FACULTY",
    service: "Acute Oncology",
    dateOfService: "06/07/26 1130",
    fileTime: "06/07/26 1147",
    timestamp: 1783337400,
    status: "signed",
    admission: true,
    body: `ACUTE ONCOLOGY — TELEPHONE ADVICE

Discussed by phone with ED. Known patient: adjuvant docetaxel/cyclophosphamide
for right breast cancer (WLE 04/2026), cycle 2 given 26/06/2026 — today is DAY 10,
the expected nadir.

This is high-risk febrile neutropenia (neutrophils 0.3, sepsis physiology, AKI).
MASCC risk score low (i.e. HIGH risk) — for admission and inpatient IV
antibiotics; not suitable for oral/ambulatory management.

Advice:
- IV broad-spectrum antibiotics within the hour (allergy-adjusted — liaise with
  microbiology; she must NOT receive pip/taz given penicillin anaphylaxis).
- Consider G-CSF (filgrastim) given profound neutropenia and sepsis — will review.
- Full septic screen; examine mouth/mucositis, cannula sites, chest, perineum.
- Protective isolation, strict neutropenic precautions.
- Chemotherapy cycle 3 to be deferred/reviewed by oncology after recovery.
Acute oncology team to review on the ward.`,
  },
  {
    kind: "note",
    id: "note-nurse-admit-001",
    encounterId: "enc-admission",
    category: "Nursing",
    noteType: "Nursing Admission Assessment",
    author: "Pereira, Marta",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "Emergency Department",
    dateOfService: "06/07/26 1215",
    fileTime: "06/07/26 1229",
    timestamp: 1783340100,
    status: "signed",
    admission: true,
    body: `NURSING ADMISSION ASSESSMENT

52F admitted from ED with neutropenic sepsis; nursed in a side room under
protective (neutropenic) isolation while awaiting an inpatient bed.

Obs (post fluids + first antibiotic dose): T 37.9, HR 104, BP 108/66, RR 20,
SpO2 96% RA. NEWS2 = 3, improving. Rigors settled.

Allergy band PENICILLIN (anaphylaxis) checked and present; wrong-drug alert
briefed to team. Two peripheral cannulae in situ. IV fluids and antibiotics
running (aztreonam/vancomycin/gentamicin). Falls risk low; pressure areas intact;
VTE assessment to be completed by medical team (platelets 112). Patient anxious;
partner phoned. Neutropenic diet and precautions explained.`,
  },
  {
    kind: "note",
    id: "note-review-001",
    encounterId: "enc-review",
    category: "Progress",
    noteType: "Senior Review",
    author: "Kapoor, Priya",
    credential: "MD",
    authorRole: "*PHYSICIAN: FACULTY",
    service: "Emergency Department",
    dateOfService: "06/07/26 1240",
    fileTime: "06/07/26 1258",
    timestamp: 1783341600,
    status: "signed",
    admission: true,
    body: `EM CONSULTANT SENIOR REVIEW

52F, day 10 post cycle 2 adjuvant docetaxel for breast cancer, presented with
fever, malaise and sore throat. Booked as a ?viral illness at 07:10 and waited;
brought through after a rigor and a rising NEWS2.

This is neutropenic sepsis, not a viral illness. The neutrophil count (0.3)
resulted at 08:20; antibiotics were not given on that result and the
door-to-antibiotic standard was breached — this has been escalated as a
patient-safety incident. Paracetamol at triage masked the fever and reinforced
the "well-looking" label.

Obs after resuscitation: T 37.9, HR 104, BP 108/66. Bloods: WCC 1.1, neutrophils
0.3, CRP 88, lactate 2.1, creatinine 96 (AKI). CXR clear; likely source oral
mucositis/pharynx.

Impression: high-risk febrile neutropenia / neutropenic sepsis, day 10 post
docetaxel.

Plan:
- First-dose IV antibiotics given (aztreonam + vancomycin + gentamicin) — pip/taz
  avoided as documented PENICILLIN ANAPHYLAXIS.
- Cultures x2 + urine sent pre-antibiotics; chase and de-escalate at 48 h.
- Continue IV fluids; monitor lactate, urine output and renal function.
- Protective isolation; acute oncology reviewing; consider G-CSF.
- Admit under acute medicine/oncology. Complete VTE assessment (platelets 112).
- Datix filed re antibiotic delay; feedback to triage on neutropenic red flags.`,
  },
  {
    kind: "note",
    id: "note-prog-draft-001",
    encounterId: "enc-admission",
    category: "Progress",
    noteType: "Progress Note",
    author: "Ahmed, Yusuf",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "Emergency Department",
    dateOfService: "06/07/26 1320",
    fileTime: "—",
    timestamp: 1783344000,
    status: "incomplete",
    body: `POST-RESUSCITATION PROGRESS NOTE (DRAFT)

Neutropenic sepsis, first-dose antibiotics given, obs improving.

Plan:
- ***confirm second cannula patent; vancomycin level with next dose***
- ***chase blood cultures x2 / urine — de-escalate on sensitivities***
- ***acute oncology to decide on G-CSF and cycle 3 timing***
- ***repeat FBC, U&E, lactate in AM; monitor for tumour-lysis unlikely but check***
- ***complete VTE assessment — platelets 112, document decision***

[Draft — not yet signed.]`,
  },
  {
    kind: "encounterSummary",
    id: "admission-encounter-001",
    encounterId: "enc-admission",
    title: "Admission — ED to Hosp-Admission",
    type: "Hospital Encounter",
    department: "Emergency Medicine",
    author: "Kapoor, Priya, MD (Attending)",
    signedAt: "06/07/2026 12:00",
    body: `ADMISSION  [Current]
06/07/2026 12:00 — present       Mount Verdant Hospital
Admitting / Attending: Kapoor, Priya, MD — Emergency Medicine

PRINCIPAL PROBLEM:
Neutropenic sepsis — day 10 post cycle 2 adjuvant docetaxel (breast cancer).

ENCOUNTER NOTES:
- ED Triage Note — Okoye, Grace, RN (?viral — see note)
- ED Provider Note — Ahmed, Yusuf, MD (Emergency Medicine)
- EM Consultant Senior Review — Kapoor, Priya, MD (Emergency Medicine)

HOSPITAL PROBLEM LIST:
◆ Neutropenic sepsis (high-risk febrile neutropenia) — PRINCIPAL
- Severe neutropenia (neutrophils 0.3)
- Breast cancer — adjuvant docetaxel/cyclophosphamide (cycle 2, day 10)
- Acute kidney injury (creatinine 96, baseline ~68)
- ?Source — oral mucositis / pharyngitis
- Primary hypothyroidism (levothyroxine)

CARE TIMELINE:
07:10  Arrived in ED (self-presented; triaged ?viral, to waiting room)
08:20  FBC resulted — neutrophils 0.3
09:15  Rigor + deteriorating obs; escalated to ED provider
11:25  First-dose IV antibiotics given (aztreonam/vancomycin/gentamicin)
12:00  Admitted — Emergency Medicine, protective isolation

EXPECTED MEDICATION LIST:
- Aztreonam 2 g IV TDS (penicillin anaphylaxis — see Microbiology advice)
- Vancomycin IV BD (weight-based, levels)
- Gentamicin 5 mg/kg IV OD (renal function/levels)
- Sodium chloride 0.9% IV — resuscitation then maintenance
- Paracetamol 1 g IV/PO QDS PRN
- Levothyroxine 100 mcg PO OD
- (Piperacillin/tazobactam ORDERED via pathway then HELD — penicillin anaphylaxis)

ALLERGIES: Penicillin — ANAPHYLAXIS (lip/throat swelling, 2018).
CODE STATUS: For escalation. ISOLATION: Protective (neutropenic).

All patient data are synthetic. For education and simulation only. Not for clinical use.`,
  },
  {
    kind: "order",
    id: "abx-order-001",
    encounterId: "enc-abx-order",
    title: "Neutropenic Sepsis Pathway — Empirical Antibiotics",
    type: "Medication Order",
    department: "Emergency Medicine",
    author: "Ahmed, Yusuf, MD",
    signedAt: "06/07/2026 10:15",
    body: `NEUTROPENIC SEPSIS PATHWAY — EMPIRICAL ANTIBIOTIC ORDER

Order set: "Neutropenic Sepsis (Adult) — Empirical Antibiotics".
Default agent (auto-populated by order set):
- PIPERACILLIN/TAZOBACTAM 4.5 g IV STAT then 4.5 g IV QDS.

>>> ALLERGY INTERACTION ALERT <<<
PENICILLIN — ANAPHYLAXIS on file. Piperacillin/tazobactam contains a penicillin.
Severity: CONTRAINDICATED.
Override reason entered at ordering: "sepsis — time critical".

STATUS: REQUIRES REVIEW — flagged by ward pharmacy. Do NOT administer
piperacillin/tazobactam. Awaiting microbiology allergy-safe regimen.

[Teaching artifact: this is the system default that must be caught. The correct
action is to withhold pip/taz and prescribe the penicillin-allergy regimen —
see Microbiology advice.]`,
  },
  {
    kind: "report",
    id: "cxr-report-001",
    encounterId: "enc-cxr",
    title: "Chest X-ray — PA",
    type: "Radiology Report",
    department: "Radiology",
    author: "Okonkwo, Ada, MD (Radiology)",
    signedAt: "06/07/2026 09:55",
    body: `EXAMINATION: Chest X-ray, PA erect.
CLINICAL DETAILS: Neutropenic, febrile, sore throat. Source screen.

FINDINGS:
- Lungs clear; no focal consolidation, no effusion, no pneumothorax.
- Heart size normal. Mediastinal contours normal.
- No free sub-diaphragmatic air. Bones and soft tissues unremarkable.

IMPRESSION:
No acute cardiopulmonary abnormality. No radiographic source of sepsis. Clinical
correlation; consider mucositis/pharyngitis and continue the septic screen.`,
  },
  {
    kind: "letter",
    id: "onc-clinic-letter-001",
    encounterId: "enc-onc-clinic",
    title: "Oncology Clinic — Adjuvant Chemotherapy Plan",
    type: "Letter",
    department: "Oncology",
    author: "Sinclair, Ruth, MD",
    signedAt: "04/06/2026",
    body: `Dear colleague,

I reviewed Mrs Whitfield in the oncology clinic to consent for adjuvant
chemotherapy following wide local excision of a right breast carcinoma (grade 2
invasive ductal, ER+/HER2-, 1/3 sentinel nodes positive).

Plan agreed:
- 4 cycles of adjuvant DOCETAXEL + CYCLOPHOSPHAMIDE, 3-weekly, in the day unit.
- Pre-cycle FBC each cycle; treatment held if counts not recovered.
- Adjuvant endocrine therapy (letrozole) and radiotherapy to follow chemotherapy.

NEUTROPENIC SEPSIS SAFETY-NETTING (given verbally and in writing, 24h helpline
card issued):
- Chemotherapy lowers the white cell count; the nadir is usually days 7–14.
- If she develops a temperature of 38 °C or above, or feels unwell/shivery at any
  time, she must attend the Emergency Department IMMEDIATELY and say she is on
  chemotherapy. This can be life-threatening and antibiotics must not be delayed.
- She should not wait, and should not be triaged as a routine viral illness.

Kind regards,
Dr R. Sinclair, Consultant Medical Oncologist

All patient data are synthetic. For education and simulation only. Not for clinical use.`,
  },
  {
    kind: "report",
    id: "chemo-cycle2-001",
    encounterId: "enc-chemo-cycle2",
    title: "Chemotherapy Record — Cycle 2",
    type: "SACT Administration Record",
    department: "Oncology Day Unit",
    author: "Bassey, Ngozi, MD",
    signedAt: "26/06/2026",
    body: `SYSTEMIC ANTI-CANCER THERAPY (SACT) — ADMINISTRATION RECORD

Regimen: Adjuvant DOCETAXEL + CYCLOPHOSPHAMIDE (breast). CYCLE 2 of 4.
Date given: 26/06/2026 (day unit). Cycle interval: 3-weekly.

Pre-treatment check:
- FBC 25/06/2026: WCC 5.2, neutrophils 3.8 (recovered from cycle 1 nadir).
- Renal/hepatic function within limits. Fit to proceed. No dose reduction.

Administered:
- Dexamethasone premedication.
- Docetaxel 75 mg/m² IV.
- Cyclophosphamide 600 mg/m² IV.
- Antiemetics per protocol. No infusion reaction.

Counselling: nadir days 7–14. Neutropenic sepsis advice re-issued and 24h
helpline number confirmed. Next pre-cycle bloods and cycle 3 to be arranged.

All patient data are synthetic. For education and simulation only. Not for clinical use.`,
  },
  {
    kind: "report",
    id: "chemo-cycle1-001",
    encounterId: "enc-chemo-cycle1",
    title: "Chemotherapy Record — Cycle 1",
    type: "SACT Administration Record",
    department: "Oncology Day Unit",
    author: "Bassey, Ngozi, MD",
    signedAt: "05/06/2026",
    body: `SYSTEMIC ANTI-CANCER THERAPY (SACT) — ADMINISTRATION RECORD

Regimen: Adjuvant DOCETAXEL + CYCLOPHOSPHAMIDE (breast). CYCLE 1 of 4.
Date given: 05/06/2026 (day unit).

Pre-treatment check: baseline FBC, renal and hepatic function within limits.
Administered docetaxel 75 mg/m² and cyclophosphamide 600 mg/m² IV with
dexamethasone premedication and antiemetics. Tolerated well; no reaction.

Counselling: explained the neutrophil nadir (days 7–14) and the risk of
neutropenic sepsis. Written information and 24-hour chemotherapy helpline card
given. Advised to attend ED urgently with any fever or feeling unwell.

All patient data are synthetic. For education and simulation only. Not for clinical use.`,
  },
  {
    kind: "letter",
    id: "surgery-letter-001",
    encounterId: "enc-surgery",
    title: "Breast Surgery — Operation Note / Letter",
    type: "Letter",
    department: "Breast Surgery",
    author: "Radcliffe, Helen, MD",
    signedAt: "15/04/2026",
    body: `Dear colleague,

Mrs Whitfield underwent wide local excision of a right breast carcinoma with
sentinel lymph node biopsy as a day case. The procedure was uneventful.

Histology: grade 2 invasive ductal carcinoma, 22 mm, ER positive (Allred 8),
PR positive, HER2 negative. Sentinel nodes: 1 of 3 involved (micrometastasis).
Margins clear.

Discussed at the breast MDT: for adjuvant chemotherapy, endocrine therapy and
radiotherapy. Referred to medical oncology (Dr Sinclair). Recovering well at
review; wound healing satisfactorily.

Kind regards,
Miss H. Radcliffe, Consultant Breast Surgeon`,
  },
  {
    kind: "letter",
    id: "diagnosis-letter-001",
    encounterId: "enc-diagnosis",
    title: "Breast Clinic — Triple Assessment",
    type: "Letter",
    department: "Breast Surgery",
    author: "Radcliffe, Helen, MD",
    signedAt: "18/03/2026",
    body: `Dear colleague,

Mrs Whitfield attended the one-stop breast clinic with a self-detected right
breast lump. Triple assessment performed:

- Clinical: 2 cm firm mobile lump, upper outer quadrant, right breast (P4).
- Imaging: mammogram and ultrasound — suspicious mass (U4/M4).
- Core biopsy: invasive ductal carcinoma, ER positive, HER2 negative (B5b).

Staging bloods and CT arranged; no evidence of distant disease. Listed for wide
local excision + sentinel node biopsy and referred to the breast MDT. She was
counselled and is coping well with family support.

Kind regards,
Miss H. Radcliffe, Consultant Breast Surgeon`,
  },
  {
    kind: "letter",
    id: "gp-thyroid-letter-001",
    encounterId: "enc-gp-thyroid",
    title: "Primary Care — Hypothyroidism Review",
    type: "Letter",
    department: "Primary Care",
    author: "Fletcher, Thomas, MD",
    signedAt: "09/01/2026",
    body: `Dear colleague,

Routine review of Mrs Whitfield's primary hypothyroidism. She is well: no
lethargy, weight stable, no cold intolerance. Compliant with levothyroxine
100 mcg once daily.

TFTs today: TSH 2.1 (in range), free T4 normal. Continue current dose; repeat
issued. Annual TFTs arranged.

Only other regular medicine is the levothyroxine. Notes a longstanding PENICILLIN
allergy (anaphylaxis, 2018) — carries an alert card. No acute issues.

Kind regards,
Dr T. Fletcher`,
  },
  {
    kind: "report",
    id: "penicillin-2018-001",
    encounterId: "enc-penicillin-2018",
    title: "ED Attendance — Anaphylaxis (2018)",
    type: "ED Visit Summary",
    department: "Emergency Department",
    author: "Doyle, Sean, MD",
    signedAt: "12/08/2018",
    body: `EMERGENCY DEPARTMENT ATTENDANCE — SUMMARY (historical)

Presenting complaint: acute allergic reaction after antibiotics.

HPI: developed lip and tongue swelling, widespread urticaria and wheeze within
~20 minutes of the first dose of AMOXICILLIN (prescribed for a dental infection).
No prior known drug allergy.

Management: treated as ANAPHYLAXIS — IM adrenaline, antihistamine, steroid, IV
fluids and oxygen. Good response; observed and discharged with an adrenaline
auto-injector and clear advice.

Impression: ANAPHYLAXIS to penicillin (amoxicillin). PENICILLIN allergy recorded
as a high-severity, verified reaction. Advised to avoid all penicillins and to
inform every future prescriber. Alert added to the record.`,
  },
  {
    kind: "lab",
    id: "lab-bloods-admit-001",
    encounterId: "enc-bloods-admit",
    title: "Admission Bloods — FBC, U&E, CRP, Lactate",
    status: "Final",
    specimen: "Blood (serum + EDTA), venepuncture",
    collected: "06/07/2026 08:02",
    received: "06/07/2026 08:11",
    reportedAt: "06/07/2026 08:20",
    orderedBy: "Ahmed, Yusuf, MD (Emergency Medicine)",
    resultingLab: "LegendCare Clinical Laboratory, Mount Verdant Hospital",
    rows: admissionLabRows,
  },
  {
    kind: "lab",
    id: "lab-bloods-precycle2-001",
    encounterId: "enc-fbc-precycle2",
    title: "Pre-Cycle-2 FBC + Renal/Hepatic",
    status: "Final",
    specimen: "Blood (serum + EDTA), venepuncture",
    collected: "25/06/2026 09:05",
    received: "25/06/2026 09:14",
    reportedAt: "25/06/2026 09:20",
    orderedBy: "Bassey, Ngozi, MD (Oncology)",
    resultingLab: "LegendCare Clinical Laboratory, Mount Verdant Hospital",
    rows: [
      { test: "WCC", value: "5.2", units: "x10⁹/L", range: "4.0–11.0", flag: "" },
      { test: "Neutrophils", value: "3.8", units: "x10⁹/L", range: "2.0–7.5", flag: "" },
      { test: "Haemoglobin", value: "116", units: "g/L", range: "115–160", flag: "" },
      { test: "Platelets", value: "228", units: "x10⁹/L", range: "150–400", flag: "" },
      { test: "CRP", value: "3", units: "mg/L", range: "<5", flag: "" },
      { test: "Creatinine", value: "68", units: "µmol/L", range: "45–90", flag: "" },
      { test: "ALT", value: "20", units: "U/L", range: "<40", flag: "" },
      { test: "Bilirubin", value: "8", units: "µmol/L", range: "<21", flag: "" },
    ],
  },
  {
    kind: "micro",
    id: "micro-cultures-001",
    encounterId: "enc-micro-cultures",
    title: "Blood Culture (x2 sets) + Urine Culture",
    status: "Preliminary",
    specimen: "Blood culture x2 sets (aerobic + anaerobic, separate sites); Urine (MSU)",
    collected: "06/07/2026 09:25",
    received: "06/07/2026 09:52",
    reportedAt: "06/07/2026 — preliminary",
    organisms: [],
    resultText: `BLOOD CULTURE (x2 sets) — PRELIMINARY
Two sets collected from separate peripheral sites before the first antibiotic
dose (neutropenic sepsis pathway). NO GROWTH TO DATE. Bottles incubating; Gram
stain pending. Cultures examined daily — any change telephoned. In neutropenia,
signs of infection may be blunted; treat empirically regardless of this result.

URINE CULTURE (MSU) — PRELIMINARY
Microscopy: no organisms seen; no significant pyuria. NO GROWTH TO DATE. Awaiting
culture.

CHASE: results outstanding — someone must follow up and de-escalate on
sensitivities at 48 h. Likely organisms in neutropenic sepsis: Gram-negatives
(E. coli, Pseudomonas), Gram-positives from mucositis or line.`,
  },
];

/** Note-kind documents only — feeds the Notes activity and Chart Review > Notes. */
export const caseNeutropenicsepsis001Notes = caseNeutropenicsepsis001Documents.filter(
  (doc): doc is Extract<ClinicalDocument, { kind: "note" }> => doc.kind === "note",
);
