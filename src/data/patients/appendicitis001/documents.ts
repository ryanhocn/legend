import type { ClinicalDocument, LabFlag, LabRow } from "../../../types";
import { bloods } from "./bloods";

/** SI units for the admission panel, keyed by `bloods` test name. */
const ADMISSION_LAB_UNITS: Record<string, string> = {
  WCC: "x10⁹/L",
  Neutrophils: "x10⁹/L",
  CRP: "mg/L",
  Hb: "g/L",
  Platelets: "x10⁹/L",
  Sodium: "mmol/L",
  Potassium: "mmol/L",
  Urea: "mmol/L",
  Creatinine: "µmol/L",
  eGFR: "mL/min/1.73m²",
  "Glucose (random)": "mmol/L",
  Bilirubin: "µmol/L",
  ALP: "U/L",
  ALT: "U/L",
  Amylase: "U/L",
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
 * Single source of truth for the synthetic atypical appendicitis case
 * (Fenwick, Dorothy, 74F): every clinical document, note-kind and report-kind,
 * in one list. Both views derive from it — the Notes activity (and Chart
 * Review > Notes sub-tab) filter to `kind: "note"`, while the Encounters
 * timeline resolves each row's primary document by `encounterId`.
 *
 * Note-kind documents drive the Notes/Trans browser: category tabs filter by
 * `category`, "Admission" by the `admission` flag and "Incomplete" by `status`.
 * The list sorts by `timestamp`. Report-kind documents (the AXR, GP letters,
 * orders, the admission summary) are reached only via their encounter row.
 *
 * CASE SHAPE — an ATYPICAL (retrocaecal) appendicitis clerked as constipation:
 *  - 74F, vague right-sided discomfort, anorexia, "not been opened bowels 3
 *    days". Retrocaecal position = soft abdomen, mild RIF fullness only,
 *    examined properly ONCE; PR "declined — to be repeated" and never chased.
 *  - The label is blessed early (AXR faecal loading, telephone consultant
 *    agreement) and then trusted while the chart trends the other way: serial
 *    WCC 11.9 -> 14.6 -> 17.8 and CRP 46 -> 118 -> 203 across two days, a
 *    low-grade pyrexia creeping to 38.1, NEWS2 1 -> 5, and a food chart that
 *    shows she has stopped eating.
 *  - Regular paracetamol + codeine keep the pain score "controlled" (and the
 *    codeine feeds the constipation), so reassurance is recorded while the
 *    observations deteriorate.
 *  - Latent / system-factor hooks (NOT individual blame): a weekend admission
 *    with SHO-only cover and the consultant round deferred to Monday; repeat
 *    bloods ordered "routinely" then resulted with no one to read them; a
 *    night FY1 who reviews the obs chart but defers to the morning round;
 *    medicines reconciliation delayed to Monday, where the pharmacist flags
 *    metformin against the rising creatinine (AKI 92 -> 121 -> 148, baseline
 *    76) just as contrast CT becomes the obvious next step.
 *
 * All content is fabricated for education and simulation only. Not for clinical use.
 */
export const caseAppendicitis001Documents: ClinicalDocument[] = [
  {
    kind: "note",
    id: "note-hp-001",
    encounterId: "enc-admission",
    category: "H&P",
    noteType: "H&P",
    author: "Adeyemi, Tobi",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "(A) General Surgery — SAU",
    dateOfService: "04/07/26 2130",
    fileTime: "04/07/26 2204",
    timestamp: 1783200600,
    status: "signed",
    admission: true,
    body: `GENERAL SURGERY ADMISSION CLERKING
Admission Date: Sat 04/07/2026 — GP: Nair, Priya, MD

CC: "Not been opened bowels for 3 days", off food, vague right-sided abdominal
discomfort.

HISTORY OF PRESENT ILLNESS:
Dorothy Fenwick is a 74-year-old woman referred by ED with 3 days of
constipation and a vague ache on the right side of the abdomen, lower more than
upper. Appetite poor for 2–3 days — "gone off my food". No vomiting, no urinary
symptoms (dipstick: trace leucocytes only, nitrite negative). Phoned her GP on
01/07 and was advised senna, without effect. Low-grade temperature in the ED
(37.4) — felt likely viral.

PAST MEDICAL HISTORY:
- Type 2 diabetes mellitus (metformin)            2018
- Essential hypertension                          2015
- Hyperlipidaemia                                 2015
- Sigmoid diverticulosis (colonoscopy 03/2025 — otherwise normal to caecum)
- Osteoarthritis, knees

ALLERGIES:
- No known drug allergies.

MEDICATIONS (on admission):
- Metformin 1 g PO BD
- Ramipril 2.5 mg PO OD
- Atorvastatin 20 mg PO ON
- Senna 15 mg PO ON (started 01/07, OTC on GP advice)

EXAMINATION:
- Comfortable at rest. T 37.5, HR 86, BP 136/78.
- Abdomen: SOFT. Mild fullness in the right iliac fossa, no guarding, no
  rebound, bowel sounds present. Hernial orifices clear.
- PR examination declined by patient this evening — to be repeated on the
  ward round.

INVESTIGATIONS:
- WCC 11.9, CRP 46 — mildly raised, in keeping with constipation / possible
  viral illness. Creatinine 92 (no recent comparison to hand).
- LFTs and amylase normal. Glucose 9.6.
- AXR: moderate faecal loading, no obstruction, no free gas.

IMPRESSION:
Constipation with faecal loading. No features of an acute surgical abdomen
this evening.

PLAN:
1. Senna 15 mg ON + macrogol 1 sachet BD; phosphate enema in the morning if
   no result.
2. Regular paracetamol 1 g QDS + codeine 30 mg QDS for comfort.
3. Encourage oral fluids and diet; food chart.
4. Continue all regular medications, including metformin.
5. Discussed with Mr Whitmore (consultant on call) by telephone — agreed:
   laxatives, home when bowels open. Repeat bloods if not settling.`,
  },
  {
    kind: "note",
    id: "note-ed-001",
    encounterId: "enc-ed",
    category: "ED Notes",
    noteType: "ED Provider Note",
    author: "Kaminski, Piotr",
    credential: "MD",
    authorRole: "*PHYSICIAN: FACULTY",
    service: "Emergency Department",
    dateOfService: "04/07/26 1510",
    fileTime: "04/07/26 1538",
    timestamp: 1783177800,
    status: "signed",
    admission: true,
    body: `EMERGENCY DEPARTMENT PROVIDER NOTE

Presenting complaint: bowels not opened for 3 days, off food, vague
right-sided abdominal discomfort.

HPI: 74F brought in by her daughter. Three days of constipation despite senna
started on GP telephone advice (01/07). A vague, poorly localised ache on the
right side of the abdomen. Appetite reduced. No vomiting, no diarrhoea, no
urinary symptoms, no PV bleeding.

Examination: looks reasonably well. T 37.4, HR 88, BP 138/78, SpO2 97% RA.
Abdomen SOFT, mild fullness in the right iliac fossa without guarding or
rebound. Bowel sounds present. PR examination offered and declined in the
department.

Because she is 74 with right-sided discomfort I considered appendicitis, but
the abdomen is soft with no localising peritonism and the AXR shows moderate
faecal loading without obstruction — the picture was felt more in keeping
with constipation. Urine dip: trace leucocytes, nitrite negative — does not
support UTI.

Bloods: WCC 11.9, CRP 46 — modestly raised, attributed to constipation /
possible viral illness. Creatinine 92. LFTs and amylase normal.

Impression: constipation with faecal loading.

Plan: referred to General Surgery for review — anticipate laxatives and home
if she settles. Analgesia charted. Daughter updated.`,
  },
  {
    kind: "note",
    id: "note-triage-001",
    encounterId: "enc-triage",
    category: "ED Notes",
    noteType: "ED Triage Note",
    author: "Mercer, Lily",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "Emergency Department",
    dateOfService: "04/07/26 1340",
    fileTime: "04/07/26 1352",
    timestamp: 1783172400,
    status: "signed",
    admission: true,
    body: `ED TRIAGE NOTE

74F brought by daughter. "Not been opened bowels for 3 days." Off her food,
complains of a vague ache on the right side of her tummy. Walked in from the
car, no distress.

Obs: T 37.4, HR 88, BP 138/78, RR 16, SpO2 97% RA. NEWS2 = 1.
No allergies. Diabetic — on metformin.

Triage category: Standard. Bloods sent, urine dip obtained. To minors
waiting room.`,
  },
  {
    kind: "note",
    id: "note-nurse-001",
    encounterId: "enc-admission",
    category: "Nursing",
    noteType: "Nursing Admission Assessment",
    author: "Delgado, Maria",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "(A) General Surgery — SAU",
    dateOfService: "04/07/26 2240",
    fileTime: "04/07/26 2258",
    timestamp: 1783204800,
    status: "signed",
    admission: true,
    body: `NURSING ADMISSION ASSESSMENT

74F admitted to SAU Bay 2 from ED with constipation.

Obs on arrival: T 37.5, HR 86, BP 136/78, RR 16, SpO2 97% RA. NEWS2 = 1.
Pain 3/10, right side of abdomen — settled after paracetamol + codeine as
charted.

Risk assessments: falls — moderate (74, nocturia); pressure areas (Waterlow)
— moderate; VTE — assessment for medical team. No allergies. Capillary
glucose monitoring commenced (diabetic on metformin).

Food chart commenced — ate a few mouthfuls of supper only, "not hungry".
Bowel chart commenced — nil since 01/07 per patient. Daughter present and
updated; patient settled for the night.`,
  },
  {
    kind: "note",
    id: "note-wr-001",
    encounterId: "enc-ward-round-d2",
    category: "Progress",
    noteType: "Ward Round Note",
    author: "Hughes, Rhian",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "(A) General Surgery — SAU",
    dateOfService: "05/07/26 0840",
    fileTime: "05/07/26 0856",
    timestamp: 1783240800,
    status: "signed",
    body: `SURGICAL WARD ROUND (Sunday) — SHO-led review

Day 2. Admitted with constipation. Consultant round deferred to Monday list
as per weekend rota.

No bowel motion overnight despite senna and macrogol. Ate little supper.
Pain 2/10 after analgesia — "comfortable".

Obs: T 37.6 this morning, HR 88, BP 132/76. Low-grade temperature — likely
nothing acute, continue to observe.

Brief examination: abdomen soft, mildly uncomfortable on the right, no
guarding.

Impression: constipation, awaiting laxative effect.

Plan:
- Phosphate enema this morning; continue senna + macrogol.
- Encourage oral fluids and diet.
- Repeat routine bloods today.
- Analgesia as charted (paracetamol + codeine — pain well controlled).
- Home tomorrow if bowels open; consultant review on the Monday round.`,
  },
  {
    kind: "note",
    id: "note-nurse-002",
    encounterId: "enc-admission",
    category: "Nursing",
    noteType: "Nursing Shift Note",
    author: "Osei, Abena",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "(A) General Surgery — SAU",
    dateOfService: "05/07/26 2045",
    fileTime: "05/07/26 2102",
    timestamp: 1783284300,
    status: "signed",
    body: `NURSING SHIFT NOTE (Late)

Phosphate enema given 10:30 — small result only; bowels not opened since.
Refused lunch and supper. Food chart: sips of tea and half a biscuit all day.
Says she "just doesn't feel right".

Obs: T 37.8 at 14:00, 37.9 at 20:00. HR 96, BP 124/72, RR 18. NEWS2 = 3.
Pain recorded 2/10 following 18:00 codeine — patient reluctant to move in bed.

Repeat bloods taken 16:10 by phlebotomy as requested on the morning round —
results in the system from 16:40, no doctor review documented this evening.
Evening SHO informed of the temperature by phone — advised paracetamol and
review on the morning round. Daughter visited, concerned she is "not herself".`,
  },
  {
    kind: "note",
    id: "note-nurse-003",
    encounterId: "enc-admission",
    category: "Nursing",
    noteType: "Nursing Shift Note",
    author: "Yeboah, Kwame",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "(A) General Surgery — SAU",
    dateOfService: "06/07/26 0630",
    fileTime: "06/07/26 0644",
    timestamp: 1783319400,
    status: "signed",
    urgent: true,
    body: `NURSING SHIFT NOTE (Night)

Poor night. Uncomfortable turning in bed — "sore on the right". Slept in
short stretches.

05:30 obs: T 38.1, HR 102, BP 118/70, RR 20, SpO2 95% RA. NEWS2 = 5.
Escalated to night FY1, who reviewed the obs chart at 05:50 — advised bloods
with the morning phlebotomy round and handover to the day team for review.

Paracetamol + codeine given 06:00; pain 3/10 after. Nil eaten since Saturday;
taking sips only. Bowels not opened. Urine output reduced overnight —
concentrated. Day team to review this morning.`,
  },
  {
    kind: "note",
    id: "note-draft-001",
    encounterId: "enc-admission",
    category: "Progress",
    noteType: "Progress Note",
    author: "Hughes, Rhian",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "(A) General Surgery — SAU",
    dateOfService: "06/07/26 0750",
    fileTime: "—",
    timestamp: 1783324200,
    status: "incomplete",
    body: `PRE-ROUND JOTTINGS (DRAFT)

Day 3. Admitted Saturday as "constipation". Bowels still not opened. Overnight
temp 38.1, HR 102 — NEWS2 5 at 05:30.

***chase this morning's bloods — WCC/CRP were up again yesterday (14.6 / 118)
   and I don't think anyone actioned them***
***abdomen needs a proper re-examination + PR (declined at clerking — never
   done)***
***discuss with the registrar — ?imaging (creatinine rising, check before any
   contrast)***
***metformin still on the chart — hold?***

[Draft — not signed. For the Monday consultant round.]`,
  },
  {
    kind: "note",
    id: "note-pharm-001",
    encounterId: "enc-admission",
    category: "Progress",
    noteType: "Best Poss Rx Hx",
    author: "Sandhu, Jaspreet",
    credential: "PharmD",
    authorRole: ".PHARMACIST",
    service: "Pharmacy",
    dateOfService: "06/07/26 0815",
    fileTime: "06/07/26 0834",
    timestamp: 1783325700,
    status: "signed",
    body: `BEST POSSIBLE MEDICATION HISTORY

Medicines reconciliation delayed to Monday (weekend admission).
Sources: patient interview, GP summary, community pharmacy record (2 sources).

Regular medications confirmed:
- Metformin 1 g PO BD — being given. FLAG: creatinine 148 this morning
  (baseline 76 in 04/2026), eGFR 30 — AKI. Recommend HOLD metformin during
  this acute illness (renal impairment / lactic acidosis risk) and BEFORE any
  contrast imaging is considered.
- Ramipril 2.5 mg PO OD — recommend hold while creatinine is rising and oral
  intake is poor.
- Atorvastatin 20 mg PO ON — continue.
- Senna 15 mg ON / macrogol BD — as charted.

Started this admission:
- Codeine 30 mg PO QDS (regular): constipating, and regular opioid dosing may
  be blunting abdominal pain assessment in an older patient — recommend the
  team reviews ongoing need.

No known drug allergies (patient confirms; GP record agrees).
Recommendations handed to the ward team — awaiting doctor review.`,
  },
  {
    kind: "encounterSummary",
    id: "admission-encounter-001",
    encounterId: "enc-admission",
    title: "Admission — ED to Hosp-Admission",
    type: "Hospital Encounter",
    department: "General Surgery",
    author: "Whitmore, James, MD (Attending)",
    signedAt: "04/07/2026 21:15",
    body: `ADMISSION  [Current]
Sat 04/07/2026 21:15 — present       Mount Verdant Hospital
Admitting / Attending: Whitmore, James, MD — General Surgery

PRINCIPAL PROBLEM:
Constipation with right-sided abdominal discomfort (?faecal loading).

ENCOUNTER NOTES:
- ED Provider Note — Kaminski, Piotr, MD (Emergency Medicine)
- Surgical Admission Clerking — Adeyemi, Tobi, MD (General Surgery)

HOSPITAL PROBLEM LIST:
◆ Constipation (?faecal loading) — PRINCIPAL
- Right iliac fossa discomfort — cause not established
- Type 2 diabetes mellitus (metformin — continued)
- Essential hypertension
- Hyperlipidaemia
- Sigmoid diverticulosis (colonoscopy 03/2025)

CARE TIMELINE:
13:40  Arrived in ED (brought by daughter)
15:10  Seen by ED provider — referred General Surgery
21:15  Admitted — General Surgery, SAU Bay 2

EXPECTED MEDICATION LIST:
- Senna 15 mg PO ON + macrogol 1 sachet PO BD
- Phosphate enema PR PRN
- Paracetamol 1 g PO QDS
- Codeine phosphate 30 mg PO QDS
- Metformin 1 g PO BD — continued
- Ramipril 2.5 mg PO OD — continued
- Atorvastatin 20 mg PO ON

ALLERGIES: No known drug allergies.
CODE STATUS: For escalation. ISOLATION: None.

All patient data are synthetic. For education and simulation only. Not for clinical use.`,
  },
  {
    kind: "report",
    id: "axr-report-001",
    encounterId: "enc-axr",
    title: "X-ray Abdomen (Supine)",
    type: "Radiology Report",
    department: "Radiology",
    author: "Okonkwo, Ada, MD (Radiology)",
    signedAt: "04/07/2026 15:00",
    body: `EXAMINATION: Abdominal radiograph (supine), ED.
CLINICAL DETAILS: 74F, 3 days constipation, vague right-sided discomfort.
?faecal loading ?obstruction.

FINDINGS:
- Moderate faecal loading throughout the colon, most marked on the right.
- No dilated small- or large-bowel loops. Gas pattern otherwise unremarkable.
- No free intraperitoneal gas identified on this supine film (erect views not
  obtained).
- Degenerative change in the lower lumbar spine.

IMPRESSION:
Faecal loading without evidence of obstruction.
NOTE: the appendix is not assessable on plain film, and a normal AXR does not
exclude early intra-abdominal inflammation — clinical correlation advised.`,
  },
  {
    kind: "lab",
    id: "lab-bloods-admit-001",
    encounterId: "enc-bloods-admit",
    title: "Admission Bloods — FBC, U&E, LFTs, CRP, Amylase",
    status: "Final",
    specimen: "Blood (serum + EDTA), venepuncture",
    collected: "04/07/2026 14:05",
    received: "04/07/2026 14:18",
    reportedAt: "04/07/2026 14:55",
    orderedBy: "Kaminski, Piotr, MD (Emergency Medicine)",
    resultingLab: "LegendCare Clinical Laboratory, Mount Verdant Hospital",
    rows: admissionLabRows,
  },
  {
    kind: "lab",
    id: "lab-bloods-d2-001",
    encounterId: "enc-bloods-d2",
    title: "Repeat Bloods — FBC, U&E, CRP (day 2)",
    status: "Final",
    specimen: "Blood (serum + EDTA), venepuncture",
    collected: "05/07/2026 16:10",
    received: "05/07/2026 16:22",
    reportedAt: "05/07/2026 16:40",
    orderedBy: "Hughes, Rhian, MD (General Surgery)",
    resultingLab: "LegendCare Clinical Laboratory, Mount Verdant Hospital",
    rows: [
      { test: "WCC", value: "14.6", units: "x10⁹/L", range: "4.0–11.0", flag: "H" },
      { test: "Neutrophils", value: "12.1", units: "x10⁹/L", range: "2.0–7.5", flag: "H" },
      { test: "CRP", value: "118", units: "mg/L", range: "<5", flag: "H" },
      { test: "Hb", value: "124", units: "g/L", range: "115–160", flag: "" },
      { test: "Platelets", value: "356", units: "x10⁹/L", range: "150–400", flag: "" },
      { test: "Sodium", value: "133", units: "mmol/L", range: "135–145", flag: "L" },
      { test: "Potassium", value: "4.9", units: "mmol/L", range: "3.5–5.3", flag: "" },
      { test: "Urea", value: "11.4", units: "mmol/L", range: "2.5–7.8", flag: "H" },
      { test: "Creatinine", value: "121", units: "µmol/L", range: "45–90", flag: "H" },
      { test: "eGFR", value: "38", units: "mL/min/1.73m²", range: ">60", flag: "L" },
    ],
  },
  {
    kind: "lab",
    id: "lab-bloods-today-001",
    encounterId: "enc-bloods-today",
    title: "Repeat Bloods — FBC, U&E, CRP (day 3)",
    status: "Final",
    specimen: "Blood (serum + EDTA), venepuncture",
    collected: "06/07/2026 07:00",
    received: "06/07/2026 07:12",
    reportedAt: "06/07/2026 07:55",
    orderedBy: "Hughes, Rhian, MD (General Surgery)",
    resultingLab: "LegendCare Clinical Laboratory, Mount Verdant Hospital",
    rows: [
      { test: "WCC", value: "17.8", units: "x10⁹/L", range: "4.0–11.0", flag: "H" },
      { test: "Neutrophils", value: "15.6", units: "x10⁹/L", range: "2.0–7.5", flag: "H" },
      { test: "CRP", value: "203", units: "mg/L", range: "<5", flag: "H" },
      { test: "Hb", value: "122", units: "g/L", range: "115–160", flag: "" },
      { test: "Platelets", value: "371", units: "x10⁹/L", range: "150–400", flag: "" },
      { test: "Sodium", value: "132", units: "mmol/L", range: "135–145", flag: "L" },
      { test: "Potassium", value: "5.2", units: "mmol/L", range: "3.5–5.3", flag: "" },
      { test: "Urea", value: "13.8", units: "mmol/L", range: "2.5–7.8", flag: "H" },
      { test: "Creatinine", value: "148", units: "µmol/L", range: "45–90", flag: "H" },
      { test: "eGFR", value: "30", units: "mL/min/1.73m²", range: ">60", flag: "L" },
    ],
  },
  {
    kind: "lab",
    id: "lab-urinalysis-001",
    encounterId: "enc-urinalysis",
    title: "Urinalysis (Dipstick)",
    status: "Final",
    specimen: "Urine (ward void), point-of-care dipstick",
    collected: "04/07/2026 14:10",
    reportedAt: "04/07/2026 14:20",
    orderedBy: "Kaminski, Piotr, MD (Emergency Medicine)",
    resultingLab: "Point-of-care testing, Emergency Department",
    rows: [
      { test: "Leucocytes", value: "Trace", range: "Negative", flag: "A" },
      { test: "Nitrites", value: "Negative", range: "Negative", flag: "" },
      { test: "Blood", value: "Negative", range: "Negative", flag: "" },
      { test: "Protein", value: "Negative", range: "Negative", flag: "" },
      { test: "Glucose", value: "+", range: "Negative", flag: "A" },
      { test: "Ketones", value: "Trace", range: "Negative", flag: "A" },
    ],
  },
  {
    kind: "letter",
    id: "gp-tel-letter-001",
    encounterId: "enc-gp-tel",
    title: "Primary Care — Telephone Consultation",
    type: "Letter",
    department: "Primary Care",
    author: "Nair, Priya, MD",
    signedAt: "01/07/2026",
    body: `Dear colleague,

Telephone consultation with Mrs Fenwick. Two days without a bowel motion and
a vague ache on the right side of her abdomen. No fever reported. Eating a
little less than usual but drinking well. No vomiting, no urinary symptoms.

Advised senna 15 mg at night (over the counter) with plenty of fluids, and
safety-netted clearly: call back or attend urgently if the pain worsens or
localises, she develops fever or vomiting, or her bowels have not opened
within the next couple of days.

Of note she had a colonoscopy in 03/2025 for altered bowel habit —
diverticulosis only, no neoplasia.

Kind regards,
Dr P. Nair`,
  },
  {
    kind: "order",
    id: "refill-metformin-001",
    encounterId: "enc-refill-metformin",
    title: "Repeat Prescription — Metformin",
    type: "Medication Order",
    department: "Primary Care",
    author: "Nair, Priya, MD",
    signedAt: "05/06/2026",
    body: `REPEAT PRESCRIPTION (issued electronically to community pharmacy)

Drug: Metformin 500 mg tablets
Directions: Take TWO tablets twice daily with food.
Quantity: 112 tablets (4 weeks).
Indication: Type 2 diabetes mellitus.

Last issue: 08/05/2026. Compliance good per pharmacy record. Renal function
checked 04/2026 — satisfactory (eGFR 74). Next HbA1c due at annual review.`,
  },
  {
    kind: "order",
    id: "refill-ramipril-001",
    encounterId: "enc-refill-ramipril",
    title: "Repeat Prescription — Ramipril",
    type: "Medication Order",
    department: "Primary Care",
    author: "Nair, Priya, MD",
    signedAt: "05/06/2026",
    body: `REPEAT PRESCRIPTION (issued electronically to community pharmacy)

Drug: Ramipril 2.5 mg capsules
Directions: Take ONE capsule each morning.
Quantity: 56 capsules (8 weeks).
Indication: Essential hypertension.

Last issue: 10/04/2026. Compliance good per pharmacy record. No cough or
dizziness reported. U&E checked 04/2026 — normal. BP within target at last
review.`,
  },
  {
    kind: "letter",
    id: "diabetes-review-letter-001",
    encounterId: "enc-diabetes-review",
    title: "Primary Care — Annual Diabetes Review",
    type: "Letter",
    department: "Primary Care",
    author: "Nair, Priya, MD",
    signedAt: "02/04/2026",
    body: `Dear colleague,

Annual diabetes review for Mrs Fenwick. She is well. HbA1c 54 mmol/mol on
metformin 1 g BD — acceptable for her age; no hypoglycaemic symptoms. Weight
73.5 kg, stable. Feet low risk; retinal screening up to date.

Renal function is at her usual baseline: creatinine 76, eGFR 74. Lipids at
target on atorvastatin. BP 132/76 on ramipril 2.5 mg.

Plan:
- Continue metformin 1 g BD, ramipril and atorvastatin.
- Repeat bloods before next annual review, sooner if unwell.

Kind regards,
Dr P. Nair`,
  },
  {
    kind: "lab",
    id: "lab-bloods-annual-001",
    encounterId: "enc-bloods-annual",
    title: "Annual Diabetes Bloods — HbA1c, Renal, Lipids",
    status: "Final",
    specimen: "Blood (serum + EDTA), venepuncture",
    collected: "02/04/2026 09:05",
    received: "02/04/2026 09:12",
    reportedAt: "02/04/2026 09:20",
    orderedBy: "Nair, Priya, MD (Primary Care)",
    resultingLab: "LegendCare Clinical Laboratory, Mount Verdant Hospital",
    rows: [
      { test: "HbA1c", value: "54", units: "mmol/mol", range: "20–41", flag: "H" },
      { test: "Creatinine", value: "76", units: "µmol/L", range: "45–90", flag: "" },
      { test: "eGFR", value: "74", units: "mL/min/1.73m²", range: ">60", flag: "" },
      { test: "Sodium", value: "139", units: "mmol/L", range: "135–145", flag: "" },
      { test: "Potassium", value: "4.4", units: "mmol/L", range: "3.5–5.3", flag: "" },
      { test: "Total cholesterol", value: "4.2", units: "mmol/L", range: "<5.0", flag: "" },
      { test: "ALT", value: "18", units: "U/L", range: "<40", flag: "" },
    ],
  },
  {
    kind: "report",
    id: "colonoscopy-report-001",
    encounterId: "enc-colonoscopy",
    title: "Colonoscopy Report",
    type: "Endoscopy Report",
    department: "Gastroenterology",
    author: "Farrow, Edward, MD (Gastroenterology)",
    signedAt: "14/03/2025",
    body: `COLONOSCOPY REPORT

INDICATION: Altered bowel habit (intermittent constipation). FIT negative;
completed for reassurance given age.

EXTENT: Caecum reached (caecal pole and ileocaecal valve photographed);
terminal ileum intubated. Bowel preparation good.

FINDINGS:
- Sigmoid diverticulosis — scattered diverticula, no inflammation, no
  stricturing.
- Appendiceal orifice normal.
- No polyps, no mass lesion, no colitis. Terminal ileum normal.

IMPRESSION:
Sigmoid diverticulosis; no neoplasia. No follow-up endoscopy required.
Manage bowel habit with dietary fibre and fluids.`,
  },
  {
    kind: "letter",
    id: "htn-review-letter-001",
    encounterId: "enc-htn-review",
    title: "Primary Care — Hypertension Review",
    type: "Letter",
    department: "Primary Care",
    author: "Nair, Priya, MD",
    signedAt: "10/02/2025",
    body: `Dear colleague,

Routine hypertension review. Mrs Fenwick is well with no cardiovascular
symptoms. Home and clinic readings within target on ramipril 2.5 mg OD.

Examination: BP 134/78, HR 76 regular. Heart sounds normal, chest clear. No
oedema.

Plan:
- Continue ramipril 2.5 mg OD.
- Annual bloods (U&E, HbA1c, lipids) with the diabetes review.
- Lifestyle advice reinforced.

No acute issues. Routine follow-up.

Kind regards,
Dr P. Nair`,
  },
];

/** Note-kind documents only — feeds the Notes activity and Chart Review > Notes. */
export const caseAppendicitis001Notes = caseAppendicitis001Documents.filter(
  (doc): doc is Extract<ClinicalDocument, { kind: "note" }> => doc.kind === "note",
);
