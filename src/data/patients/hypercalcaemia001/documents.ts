import type { ClinicalDocument, LabFlag, LabRow } from "../../../types";
import { bloods } from "./bloods";

/** SI units for the admission panel, keyed by `bloods` test name. */
const ADMISSION_LAB_UNITS: Record<string, string> = {
  "Adjusted calcium": "mmol/L",
  "Calcium (uncorrected)": "mmol/L",
  Albumin: "g/L",
  Phosphate: "mmol/L",
  Creatinine: "µmol/L",
  Urea: "mmol/L",
  eGFR: "mL/min/1.73m²",
  Potassium: "mmol/L",
  Sodium: "mmol/L",
  "Total protein": "g/L",
  Hb: "g/L",
  MCV: "fL",
  WCC: "x10⁹/L",
  Platelets: "x10⁹/L",
  ESR: "mm/hr",
  CRP: "mg/L",
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
 * Single source of truth for the synthetic hypercalcaemia case (Whitmore,
 * Dorothy, 81F): every clinical document, note-kind and report-kind, in one list.
 * Both views derive from it — the Notes activity (and Chart Review > Notes
 * sub-tab) filter to `kind: "note"`, while the Encounters timeline resolves each
 * row's primary document by `encounterId`.
 *
 * CASE SHAPE — hypercalcaemia hiding behind an "off legs / social admission"
 * label, for the learner to unpick:
 *  - The clerking and the early ward round frame this as a social admission ±
 *    ?UTI. A weak-positive urine dip (nitrites NEGATIVE) is the classic red
 *    herring, and trimethoprim was started on it.
 *  - The chart contradicts the label: adjusted calcium 3.18 with an AKI on the
 *    admission profile; a normocytic anaemia with ESR 92 and a wide globulin gap
 *    (total protein 92 vs albumin 30) — the biochemical shape of myeloma.
 *  - The history holds the breadcrumbs the labels missed: months of polyuria,
 *    polydipsia, constipation, back pain and weight loss; a GP calcium already
 *    creeping (2.78) two weeks earlier; and a myeloma screen (electrophoresis /
 *    free light chains) the GP requested that is STILL unreported.
 *  - Safety catches: (1) the raised calcium is sitting UNACTIONED — no IV fluids
 *    titrated to the calcium, no bisphosphonate plan, no repeat; (2) a drug trap
 *    — she remains prescribed a thiazide (bendroflumethiazide) and calcium/vit-D
 *    supplements (Adcal-D3) that nobody has held despite hypercalcaemia + AKI;
 *    (3) the pending myeloma screen nobody has chased.
 *
 * All content is fabricated for education and simulation only. Not for clinical use.
 */
export const caseHypercalcaemia001Documents: ClinicalDocument[] = [
  {
    kind: "note",
    id: "note-prog-001",
    encounterId: "enc-ward-round",
    category: "Progress",
    noteType: "Post-Take Ward Round",
    author: "Raman, Priya",
    credential: "MD",
    authorRole: "*PHYSICIAN: FACULTY",
    service: "(A) Geriatrics — Ward 7",
    dateOfService: "06/07/26 1015",
    fileTime: "06/07/26 1038",
    timestamp: 1783332900,
    status: "signed",
    admission: true,
    body: `GERIATRICS POST-TAKE WARD ROUND

81F admitted overnight — brought in by daughter, "not coping" at home and "off
legs". Muddled but settled overnight. Slept, eating small amounts, mobilised to
commode with two.

Background: hypertension, recurrent falls. Lives alone in a bungalow, daughter
nearby doing more and more.

Obs stable, afebrile. Chest clear, abdomen soft (a little distended, constipated).

Impression: likely a social admission — reduced coping at home with a background
of frailty. Urine dip was positive so a possible UTI is being treated
(trimethoprim, started in ED).

Plan:
- Continue trimethoprim for presumed UTI.
- Occupational therapy + physiotherapy assessment; falls review.
- Encourage oral intake, laxatives for constipation.
- Await routine bloods; social work referral re package of care.
- Continue usual regular medications.

[NB: full admission bloods not yet reviewed on this round — to check.]`,
  },
  {
    kind: "note",
    id: "note-hp-001",
    encounterId: "enc-admission",
    category: "H&P",
    noteType: "Admission Clerking",
    author: "Bright, Thomas",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "(A) Geriatrics — Ward 7",
    dateOfService: "05/07/26 1730",
    fileTime: "05/07/26 1812",
    timestamp: 1783272600,
    status: "signed",
    admission: true,
    body: `GERIATRICS ADMISSION CLERKING
Admission Date: 05/07/2026 — PCP: Hughes, Gareth, MD

CC: "Off legs", confusion and constipation — brought in by daughter.

HISTORY OF PRESENT ILLNESS:
Dorothy Whitmore is an 81-year-old woman brought in by her daughter, who feels
her mother is "not coping" at home. Over recent weeks she has become slower,
muddled and unsteady, with several near-falls. The daughter reports she is
drinking "cups and cups of tea", passing lots of urine, and has been very
constipated (no bowels open for ~5 days). She has lost weight and complains of
back pain.

There is no fever, no dysuria and no frank urinary symptoms. She is vague on
direct questioning (AMTS 7/10). No focal neurology reported.

The picture was felt in ED to be one of reduced coping ± a possible urinary
tract infection (dip positive), and she was referred for a social admission.

PAST MEDICAL HISTORY:
- Essential hypertension                          long-standing
- Recurrent falls / unsteadiness                  2026
- Lower back pain (?osteoporosis)                 04/2026

ALLERGIES:
- No known drug allergies.

MEDICATIONS (on admission — continued as per GP list):
- Bendroflumethiazide 2.5 mg PO OD
- Adcal-D3 (calcium carbonate/colecalciferol) 1 tab PO BD
- Amlodipine 5 mg PO OD
- Trimethoprim 200 mg PO BD (started in ED for ?UTI)

EXAMINATION:
- Drowsy but rousable, dry mucous membranes. AMTS 7/10.
- Chest clear. Heart sounds normal.
- Abdomen soft, mildly distended, no peritonism; faecal loading on PR.
- No focal neurology. Reduced power globally in a deconditioned pattern.

INVESTIGATIONS (pending at time of clerking):
- Bloods sent (FBC, U&E, bone profile, CRP, ESR).
- Urine dip: leucocytes +, protein +, nitrites negative, blood trace.

IMPRESSION:
?Social admission — reduced coping at home. ?UTI (urine dip positive).

PLAN:
1. Admit under Geriatrics, Ward 7 for assessment.
2. Trimethoprim for presumed UTI.
3. IV fluids for poor intake.
4. Physiotherapy / OT / falls review; social work input.
5. Chase bloods.

[Clerking completed before biochemistry resulted.]`,
  },
  {
    kind: "note",
    id: "note-ed-001",
    encounterId: "enc-ed",
    category: "ED Notes",
    noteType: "ED Provider Note",
    author: "Fletcher, Rowan",
    credential: "MD",
    authorRole: "*PHYSICIAN: FACULTY",
    service: "Emergency Department",
    dateOfService: "05/07/26 1620",
    fileTime: "05/07/26 1644",
    timestamp: 1783268400,
    status: "signed",
    admission: true,
    body: `EMERGENCY DEPARTMENT PROVIDER NOTE

Presenting complaint: "off legs", confusion, brought in by daughter.

HPI: 81F, generally slowing down over weeks, now unsteady and muddled. Daughter
can no longer manage her at home. Very thirsty, passing lots of urine, and
constipated. No fever, no cough, no dysuria.

On arrival afebrile, HR 92, BP 118/72, sats 96% RA. NEWS2 = 2. Looks dry.
Abdomen soft, constipated. No focal neurology.

Urine dip: leucocytes +, protein +, nitrites NEGATIVE, blood trace. Sent for
culture.

Impression: reduced coping at home ± possible UTI. Bloods sent. Started
trimethoprim empirically for the positive dip. Referred to Geriatrics
as a social admission for assessment and placement planning.

(Bloods not back at time of referral.)`,
  },
  {
    kind: "note",
    id: "note-triage-001",
    encounterId: "enc-triage",
    category: "ED Notes",
    noteType: "ED Triage Note",
    author: "Adeyemi, Grace",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "Emergency Department",
    dateOfService: "05/07/26 1510",
    fileTime: "05/07/26 1518",
    timestamp: 1783264200,
    status: "signed",
    admission: true,
    body: `ED TRIAGE NOTE

81F brought in by daughter — "off legs", not coping at home, a bit confused.
Daughter states mum has been drinking a lot and going to the toilet a lot, and
hasn't opened her bowels for days.

Obs: T 36.6, HR 92, BP 118/72, RR 18, SpO2 96% RA. NEWS2 = 2.
Looks dry. Alert but muddled, orientated to place not date.

Triage category: Standard. Bloods and urine requested. Moved to majors for
medical assessment.`,
  },
  {
    kind: "note",
    id: "note-nurse-001",
    encounterId: "enc-nursing-admit",
    category: "Nursing",
    noteType: "Nursing Admission Assessment",
    author: "Sullivan, Bridget",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "(A) Geriatrics — Ward 7",
    dateOfService: "05/07/26 1810",
    fileTime: "05/07/26 1833",
    timestamp: 1783275000,
    status: "signed",
    admission: true,
    body: `NURSING ADMISSION ASSESSMENT

81F admitted to Ward 7 Bay 2 from ED. Daughter reports she is "not coping".

Obs: T 36.7, HR 94, BP 112/68, RR 18, SpO2 96% RA. NEWS2 = 2.
Drowsy but rousable, orientated to place not time. Dry mouth and tongue.

Risk assessments: falls — HIGH (recent falls, unsteady, confused); pressure area
(Waterlow) — high; VTE — for medical team. Continence: passing large volumes of
dilute urine, thirsty and asking for drinks.

Bowels: no bowel motion for 5 days, abdomen distended, faecally loaded.
Nutrition: MUST score raised — recent weight loss reported by family.
Two peripheral cannulae sited. IV fluids commenced. Regular medications given as
charted (bendroflumethiazide, Adcal-D3, amlodipine). Family updated.`,
  },
  {
    kind: "note",
    id: "note-prog-002",
    encounterId: "enc-pharmacy",
    category: "Progress",
    noteType: "Best Poss Rx Hx",
    author: "Nolan, Aoife",
    credential: "PharmD",
    authorRole: ".PHARMACIST",
    service: "Pharmacy",
    dateOfService: "05/07/26 2030",
    fileTime: "05/07/26 2052",
    timestamp: 1783283400,
    status: "signed",
    admission: true,
    body: `BEST POSSIBLE MEDICATION HISTORY

Sources: patient (limited by confusion), daughter, GP repeat list, community
pharmacy record (3 sources).

Regular medications confirmed and reconciled onto the inpatient chart:
- Bendroflumethiazide 2.5 mg PO OD (for hypertension).
- Adcal-D3 (calcium carbonate 1.5 g / colecalciferol 400 IU) 1 tab PO BD
  (started 04/2026 for presumed osteoporosis / back pain).
- Amlodipine 5 mg PO OD (hypertension).
- Trimethoprim 200 mg PO BD (started in ED, ?UTI).

Allergy: No known drug allergies.

PHARMACY REVIEW — flagged to the medical team:
The admission bone profile shows an ADJUSTED CALCIUM of 3.18 mmol/L with an AKI
(creatinine 158, eGFR 28). Two of this patient's regular medicines are relevant
and were nonetheless continued on reconciliation pending a medical decision:
- Bendroflumethiazide — thiazides reduce urinary calcium excretion and RAISE
  serum calcium; usually HELD in hypercalcaemia and in AKI.
- Adcal-D3 — a calcium AND vitamin D supplement; should be HELD in hypercalcaemia.
Please review and prescribe accordingly. Also note serum electrophoresis / free
light chains were requested by the GP (23/06) and appear still outstanding.`,
  },
  {
    kind: "note",
    id: "note-prog-003",
    encounterId: "enc-admission",
    category: "Progress",
    noteType: "Progress Note",
    author: "Bright, Thomas",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "(A) Geriatrics — Ward 7",
    dateOfService: "06/07/26 1130",
    fileTime: "—",
    timestamp: 1783337400,
    status: "incomplete",
    body: `WARD PROGRESS NOTE (DRAFT)

Reviewed after the consultant round. Patient a little brighter with fluids but
still muddled and constipated.

Bloods now back — flagged by pharmacy: adjusted calcium 3.18, creatinine 158.
Need to work out cause and plan.

Plan (to finalise):
- ***recheck bone profile and renal — trend the calcium***
- ***decide on medication changes (thiazide? Adcal?)***
- ***chase the GP myeloma screen — electrophoresis / light chains***
- ***consultant to review calcium management***

[Draft — not yet signed.]`,
  },
  {
    kind: "encounterSummary",
    id: "admission-encounter-001",
    encounterId: "enc-admission",
    title: "Admission — ED to Hosp-Admission",
    type: "Hospital Encounter",
    department: "Geriatrics",
    author: "Raman, Priya, MD (Attending)",
    signedAt: "05/07/2026 17:30",
    body: `ADMISSION  [Current]
05/07/2026 17:30 — present       Mount Verdant Hospital
Admitting / Attending: Raman, Priya, MD — Geriatrics

PRINCIPAL PROBLEM (as clerked):
?Social admission / reduced coping at home ± ?UTI ("off legs").

ENCOUNTER NOTES:
- ED Provider Note — Fletcher, Rowan, MD (Emergency Medicine)
- Admission Clerking — Bright, Thomas, MD (Geriatrics)
- Post-Take Ward Round — Raman, Priya, MD (Geriatrics)

HOSPITAL PROBLEM LIST:
◆ ?Social admission — reduced coping (clerking label) — PRINCIPAL
- ?UTI (urine dip positive; nitrites negative)
- Hypercalcaemia — adjusted calcium 3.18 (on admission bloods; UNACTIONED)
- Acute kidney injury (creatinine 158, eGFR 28)
- Normocytic anaemia (Hb 98), ESR 92 — myeloma screen outstanding
- Constipation
- Essential hypertension

CARE TIMELINE:
15:10  Arrived in ED (brought by daughter)
16:20  Seen by ED provider; trimethoprim started for positive dip
17:30  Admitted — Geriatrics, Ward 7 Bay 2
19:30  Admission bloods resulted (adjusted calcium 3.18, AKI)

CURRENT MEDICATION LIST (as reconciled — NOT yet reviewed against the calcium):
- Bendroflumethiazide 2.5 mg PO OD — raises serum calcium; usually held
- Adcal-D3 (calcium/colecalciferol) 1 tab PO BD — calcium supplement; usually held
- Amlodipine 5 mg PO OD
- Trimethoprim 200 mg PO BD — for ?UTI (dip weak-positive)
- Sodium chloride 0.9% IV 8-hourly — for poor intake (not yet titrated to calcium)

ALLERGIES: No known drug allergies.
CODE STATUS: For escalation — ceiling to be discussed. ISOLATION: None.

All patient data are synthetic. For education and simulation only. Not for clinical use.`,
  },
  {
    kind: "lab",
    id: "lab-bloods-admit-001",
    encounterId: "enc-bloods-admit",
    title: "Admission Bloods — Bone Profile, U&E, FBC, ESR, CRP",
    status: "Final",
    specimen: "Blood (serum + EDTA), venepuncture",
    collected: "05/07/2026 16:45",
    received: "05/07/2026 17:05",
    reportedAt: "05/07/2026 19:30",
    orderedBy: "Fletcher, Rowan, MD (Emergency Medicine)",
    resultingLab: "LegendCare Clinical Laboratory, Mount Verdant Hospital",
    rows: admissionLabRows,
  },
  {
    kind: "lab",
    id: "lab-urinalysis-001",
    encounterId: "enc-urinalysis",
    title: "Urinalysis (Dipstick)",
    status: "Final",
    specimen: "Urine, mid-stream (dipstick)",
    collected: "05/07/2026 16:30",
    reportedAt: "05/07/2026 16:35",
    orderedBy: "Fletcher, Rowan, MD (Emergency Medicine)",
    resultingLab: "Point-of-care, Emergency Department",
    rows: [
      { test: "Leucocytes", value: "+", units: "", range: "Negative", flag: "A" },
      { test: "Nitrites", value: "Negative", units: "", range: "Negative", flag: "" },
      { test: "Protein", value: "+", units: "", range: "Negative", flag: "A" },
      { test: "Blood", value: "Trace", units: "", range: "Negative", flag: "A" },
      { test: "Glucose", value: "Negative", units: "", range: "Negative", flag: "" },
      { test: "Ketones", value: "Negative", units: "", range: "Negative", flag: "" },
      { test: "Specific gravity", value: "1.005", units: "", range: "1.005–1.030", flag: "" },
    ],
  },
  {
    kind: "lab",
    id: "lab-bloods-gp-001",
    encounterId: "enc-bloods-gp",
    title: "Community Bloods — Bone Profile, FBC, ESR, Renal",
    status: "Final",
    specimen: "Blood (serum + EDTA), venepuncture",
    collected: "23/06/2026 12:45",
    received: "23/06/2026 13:20",
    reportedAt: "23/06/2026 14:05",
    orderedBy: "Hughes, Gareth, MD (Primary Care)",
    resultingLab: "LegendCare Clinical Laboratory, Mount Verdant Hospital",
    rows: [
      { test: "Adjusted calcium", value: "2.78", units: "mmol/L", range: "2.20–2.60", flag: "H" },
      { test: "Albumin", value: "36", units: "g/L", range: "35–50", flag: "" },
      { test: "Phosphate", value: "0.84", units: "mmol/L", range: "0.80–1.50", flag: "" },
      { test: "Total protein", value: "88", units: "g/L", range: "60–80", flag: "H" },
      { test: "Creatinine", value: "96", units: "µmol/L", range: "45–90", flag: "H" },
      { test: "eGFR", value: "52", units: "mL/min/1.73m²", range: ">60", flag: "L" },
      { test: "Hb", value: "105", units: "g/L", range: "115–160", flag: "L" },
      { test: "MCV", value: "88", units: "fL", range: "80–100", flag: "" },
      { test: "ESR", value: "70", units: "mm/hr", range: "<20", flag: "H" },
    ],
  },
  {
    kind: "report",
    id: "myeloma-screen-001",
    encounterId: "enc-myeloma-screen",
    title: "Serum Electrophoresis + Free Light Chains — AWAITED",
    type: "Laboratory Report",
    department: "Clinical Biochemistry / Immunology",
    author: "LegendCare Clinical Laboratory",
    signedAt: "Requested 23/06/2026 — not yet reported",
    body: `SERUM PROTEIN ELECTROPHORESIS + SERUM FREE LIGHT CHAINS

Requested by: Hughes, Gareth, MD (Primary Care) on 23/06/2026.
Clinical details on request: elderly patient, raised total protein and ESR,
normocytic anaemia, ?myeloma / ?monoclonal gammopathy.

STATUS: IN PROCESS — RESULT NOT YET AVAILABLE.

Serum protein electrophoresis and serum free light chain assay are still awaited
at the time of this admission. No result has been filed. Please chase with the
laboratory / immunology; a monoclonal band or an abnormal free light chain ratio
would materially change management of this patient's hypercalcaemia and anaemia.

All patient data are synthetic. For education and simulation only. Not for clinical use.`,
  },
  {
    kind: "micro",
    id: "micro-urine-001",
    encounterId: "enc-urine-culture",
    title: "Urine Culture (MSU)",
    status: "Preliminary",
    specimen: "Urine, mid-stream (MSU)",
    collected: "05/07/2026 16:30",
    received: "05/07/2026 17:10",
    reportedAt: "05/07/2026 — 18:40 preliminary",
    organisms: [],
    resultText: `URINE CULTURE (MSU) — PRELIMINARY

Microscopy: white cells not raised; no organisms seen on Gram film.
Culture: MIXED GROWTH of 3 or more organisms, none predominant —
appearances of a probable contaminant / mixed skin flora.
NO SIGNIFICANT BACTERIURIA.

Interpretation: does not support a urinary tract infection. A weak-positive dip
with negative nitrites in an elderly patient is a poor test for UTI and should
not be treated as the diagnosis on its own. Correlate with the clinical picture
and consider stopping empirical antibiotics if there is no clinical infection.`,
  },
  {
    kind: "report",
    id: "spine-xray-001",
    encounterId: "enc-spine-xray",
    title: "X-ray Lumbar Spine",
    type: "Radiology Report",
    department: "Radiology",
    author: "Bianchi, Marco, MD (Radiology)",
    signedAt: "11/04/2026",
    body: `EXAMINATION: X-ray lumbar spine (AP + lateral), outpatient.
CLINICAL DETAILS: New lower back pain, weight loss. ?osteoporosis.

FINDINGS:
- Generalised reduction in bone density (osteopenia) for age.
- Mild loss of vertebral body height at L2 with preserved disc spaces.
- No aggressive lytic or sclerotic lesion identified on plain film; note that
  plain radiographs are insensitive for early marrow infiltration.
- Degenerative change at L4/L5.

IMPRESSION:
Osteopenia with a mild L2 height loss. If there is clinical or biochemical
concern (e.g. hypercalcaemia, raised ESR, anaemia), further evaluation for an
underlying marrow process (myeloma) is advised. Clinical correlation.`,
  },
  {
    kind: "letter",
    id: "gp-offlegs-001",
    encounterId: "enc-gp-offlegs",
    title: "Primary Care — Home Visit ('Off Legs')",
    type: "Letter",
    department: "Primary Care",
    author: "Hughes, Gareth, MD",
    signedAt: "23/06/2026",
    body: `Dear colleague,

I visited Mrs Whitmore at home at her daughter's request. Over the last two
months she has become increasingly tired, low in mood, unsteady on her feet and
constipated. Her daughter is particularly struck by how much she is drinking —
"endless cups of tea" — and how often she is passing water. She has ongoing lower
back pain and has clearly lost weight (clothes loose, ~7 kg down since January).

On examination she was alert but slowed, with dry mucous membranes and mild
generalised weakness. Abdomen soft, no masses, faecally loaded.

This is more than deconditioning. The combination of polyuria, polydipsia,
constipation, low mood and weight loss makes me want to exclude HYPERCALCAEMIA
and an underlying malignancy, and given her age, anaemia and back pain, MYELOMA
in particular.

Plan:
- Bloods today: FBC, U&E, bone profile (calcium), ESR, and a myeloma screen
  (serum electrophoresis + free light chains).
- Laxatives for constipation; encourage fluids.
- Review results and arrange further imaging as indicated; low threshold to
  refer to hospital if calcium is significantly raised.

Kind regards,
Dr G. Hughes`,
  },
  {
    kind: "letter",
    id: "gp-backpain-001",
    encounterId: "enc-gp-backpain",
    title: "Primary Care — Back Pain & Weight Loss",
    type: "Letter",
    department: "Primary Care",
    author: "Hughes, Gareth, MD",
    signedAt: "08/04/2026",
    body: `Dear colleague,

Mrs Whitmore attended with a few weeks of lower back pain and some unintentional
weight loss (~3 kg). No trauma. The pain is mechanical in character, worse on
movement, no red-flag neurology today. She remains independent but says she is
"slowing down".

Examination: mild lumbar tenderness, normal lower-limb neurology, normal gait
today. Observations normal.

Impression: likely mechanical/osteoporotic back pain in an older woman. I have
started Adcal-D3 (calcium and vitamin D) for presumed osteoporosis and requested
a lumbar spine X-ray. I have asked her to return if the pain worsens or if she
develops new symptoms.

(In retrospect the weight loss deserves follow-up if it continues.)

Kind regards,
Dr G. Hughes`,
  },
  {
    kind: "letter",
    id: "htn-review-001",
    encounterId: "enc-htn-review",
    title: "Primary Care — Hypertension Review",
    type: "Letter",
    department: "Primary Care",
    author: "Hughes, Gareth, MD",
    signedAt: "20/01/2026",
    body: `Dear colleague,

Routine hypertension review. Mrs Whitmore is well today with no cardiovascular
symptoms. Blood pressure is controlled on bendroflumethiazide 2.5 mg OD and
amlodipine 5 mg OD.

Examination: BP 138/82, HR 74 regular. Weight 63 kg. Heart sounds normal, chest
clear, no oedema.

Plan:
- Continue bendroflumethiazide and amlodipine.
- Annual bloods (U&E, lipids) and BP review.
- Lifestyle advice reinforced.

No acute issues. Routine follow-up.

Kind regards,
Dr G. Hughes`,
  },
  {
    kind: "order",
    id: "refill-bendro-001",
    encounterId: "enc-refill-bendro",
    title: "Repeat Prescription — Bendroflumethiazide",
    type: "Medication Order",
    department: "Primary Care",
    author: "Hughes, Gareth, MD",
    signedAt: "09/06/2026",
    body: `REPEAT PRESCRIPTION (issued electronically to community pharmacy)

Drug: Bendroflumethiazide 2.5 mg tablets
Directions: Take ONE tablet each morning.
Quantity: 28 tablets (4 weeks).
Indication: Essential hypertension.

Last issue: 12/05/2026. Compliance good per pharmacy record. Routine medication
review due — note this is a thiazide diuretic.`,
  },
  {
    kind: "order",
    id: "refill-adcal-001",
    encounterId: "enc-refill-adcal",
    title: "Repeat Prescription — Adcal-D3",
    type: "Medication Order",
    department: "Primary Care",
    author: "Hughes, Gareth, MD",
    signedAt: "09/06/2026",
    body: `REPEAT PRESCRIPTION (issued electronically to community pharmacy)

Drug: Adcal-D3 chewable tablets (calcium carbonate 1.5 g / colecalciferol 400 IU)
Directions: Take ONE tablet TWICE daily.
Quantity: 56 tablets (4 weeks).
Indication: Presumed osteoporosis / bone protection (started 04/2026).

Last issue: 12/05/2026. Compliance good per pharmacy record. This is a calcium
and vitamin D supplement — review if serum calcium is raised.`,
  },
];

/** Note-kind documents only — feeds the Notes activity and Chart Review > Notes. */
export const caseHypercalcaemia001Notes = caseHypercalcaemia001Documents.filter(
  (doc): doc is Extract<ClinicalDocument, { kind: "note" }> => doc.kind === "note",
);
