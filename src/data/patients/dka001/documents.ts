import type { ClinicalDocument, LabFlag, LabRow } from "../../../types";
import { bloods } from "./bloods";

/** SI units for the admission panel, keyed by `bloods` test name. */
const ADMISSION_LAB_UNITS: Record<string, string> = {
  "Glucose (serum)": "mmol/L",
  "Ketones (BOHB)": "mmol/L",
  Sodium: "mmol/L",
  Potassium: "mmol/L",
  Bicarbonate: "mmol/L",
  Urea: "mmol/L",
  Creatinine: "µmol/L",
  WCC: "x10⁹/L",
  Neutrophils: "x10⁹/L",
  CRP: "mg/L",
  Amylase: "U/L",
  HbA1c: "mmol/mol",
  Platelets: "x10⁹/L",
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
 * Single source of truth for the synthetic DKA case (Farrell, Joshua, 19M):
 * every clinical document, note-kind and report-kind, in one list. Both views
 * derive from it — the Notes activity (and Chart Review > Notes sub-tab) filter
 * to `kind: "note"`, while the Encounters timeline resolves each row's primary
 * document by `encounterId`.
 *
 * Note-kind documents drive the Notes/Trans browser: category tabs filter by
 * `category`, "Admission" by the `admission` flag and "Incomplete" by `status`.
 * The list sorts by `timestamp`. Report-kind documents (the order, labs, letter,
 * the admission summary) are reached only via their encounter row.
 *
 * CASE SHAPE — new-presentation DKA anchored as gastroenteritis:
 *  - Triage labels 24 h of vomiting + abdominal pain "?viral gastroenteritis,
 *    oral fluids trial" (flatmates had "a bug", takeaway two nights ago) — but
 *    the SAME triage narrative records weeks of thirst, nocturnal polyuria and
 *    looser clothes. The refuting history is in the first document.
 *  - Nursing documents deep sighing (Kussmaul) respirations and a pear-drops
 *    smell on the breath; tachycardia never settles with oral fluids.
 *  - The 06:10 VBG (pH 7.18, HCO3 11, glucose 27.3, KETONES 5.8, K+ 3.4) met
 *    DKA criteria, but the "gastroenteritis" plan (ondansetron + oral fluids,
 *    consider discharge) was never revised — fixed-rate insulin only starts
 *    after the 08:15 consultant board round. A latent/system miss (gas printed
 *    during a resus call), not individual blame.
 *  - K+ 3.4 with an insulin plan pending: replacement must precede/accompany
 *    insulin — insulin shifts potassium intracellularly; hypokalaemic arrest
 *    is the killer. The second safety catch.
 *  - A "young, will settle" antiemetic-and-discharge draft sits in the chart
 *    for a careless trainee to echo. CRP 4 and an afebrile chart argue against
 *    infection; HbA1c 118 proves weeks of hyperglycaemia, not stress.
 *
 * All content is fabricated for education and simulation only. Not for clinical use.
 */
export const caseDka001Documents: ClinicalDocument[] = [
  {
    kind: "note",
    id: "note-triage-001",
    encounterId: "enc-triage",
    category: "ED Notes",
    noteType: "ED Triage Note",
    author: "Timms, Bethany",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "Emergency Department",
    dateOfService: "06/07/26 0455",
    fileTime: "06/07/26 0503",
    timestamp: 1783313700,
    status: "signed",
    admission: true,
    urgent: true,
    body: `ED TRIAGE NOTE

19M brought in by flatmate at 04:40: vomiting since yesterday afternoon (8–10
episodes), crampy central tummy pain. Takeaway with the flat two nights ago and
two flatmates have had a vomiting bug this week — "we've all had it".

Also says he has been "drinking loads" for a few weeks, is up 4–5 times a night
to pass urine, and his clothes have got looser. Looks tired, lips dry. Breath
has a slightly sweet smell.

Obs: T 36.9, HR 118, BP 104/62, RR 24, SpO2 99% RA. NEWS2 = 4.
No known drug allergies.

Impression: ?viral gastroenteritis. Oral fluids trial in the side room,
antiemetic per doctor. Stool culture requested if diarrhoea develops. Side
room for D&V precautions. Triage category: urgent.`,
  },
  {
    kind: "note",
    id: "note-nurse-001",
    encounterId: "enc-nursing-obs",
    category: "Nursing",
    noteType: "Nursing Note — Oral Fluid Trial",
    author: "Gallagher, Niamh",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "Emergency Department",
    dateOfService: "06/07/26 0535",
    fileTime: "06/07/26 0544",
    timestamp: 1783316100,
    status: "signed",
    admission: true,
    urgent: true,
    body: `ED NURSING NOTE

Checked on patient in side room. Vomited twice more; not keeping sips of water
down. Breathing is DEEP AND SIGHING — big regular breaths although his chest
sounds clear and sats are 99%. RR 26. Breath smells sweet, like pear drops /
nail varnish remover. HR 120 despite oral fluids since triage.

Passing LARGE volumes of urine — says he is "going constantly".

IV access sited x1 (L) ACF. Bloods drawn and sent; VBG taken to the gas
analyser. Doctor aware — patient next to be seen.

Obs: T 36.8, HR 120, BP 102/60, RR 26, SpO2 99% RA. NEWS2 = 5.`,
  },
  {
    kind: "note",
    id: "note-ed-001",
    encounterId: "enc-ed",
    category: "ED Notes",
    noteType: "ED Provider Note",
    author: "Prentice, Oliver",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "Emergency Department",
    dateOfService: "06/07/26 0600",
    fileTime: "06/07/26 0618",
    timestamp: 1783317600,
    status: "signed",
    admission: true,
    urgent: true,
    body: `EMERGENCY DEPARTMENT PROVIDER NOTE

Presenting complaint: vomiting and abdominal pain.

HPI: 19M university student, ~24 h of vomiting (8–10 episodes) and generalised
crampy abdominal pain after a takeaway two nights ago. Two flatmates have had a
vomiting bug this week. No diarrhoea as yet. Trying to sip water but struggling
to keep it down. No fever at home.

O/E: looks tired, dry lips. Abdomen soft, mild generalised tenderness, no
guarding, bowel sounds present. Chest clear. Obs: afebrile, HR 118, BP 104/62,
RR 24, SpO2 99%.

Impression: ?viral gastroenteritis — same bug as the flat, plus a dodgy
takeaway. Young and otherwise fit — should settle with an antiemetic.

Plan:
- Ondansetron 4 mg IV.
- Oral fluids trial — cup of water hourly, reassess.
- Bloods + VBG sent, results awaited.
- If tolerating oral fluids on reassessment, home with GP follow-up and a
  gastroenteritis advice sheet. Stool sample only if diarrhoea develops.`,
  },
  {
    kind: "note",
    id: "note-dc-001",
    encounterId: "enc-admission",
    category: "Discharge",
    noteType: "ED Discharge Summary",
    author: "Prentice, Oliver",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "Emergency Department",
    dateOfService: "06/07/26 0615",
    fileTime: "—",
    timestamp: 1783318500,
    status: "incomplete",
    body: `ED DISCHARGE SUMMARY (DRAFT — IN PROGRESS)

Diagnosis: viral gastroenteritis.

Attendance summary: 24 h vomiting and abdominal pain; flatmates with the same
bug. Ondansetron 4 mg IV given; oral fluid trial underway.

Discharge medications: ***ondansetron 4 mg PO PRN x3 days — confirm***
Advice given: ***gastroenteritis sheet, hydration, hand hygiene***
Follow-up: ***GP if not settling in 48 h***

[Incomplete — awaiting oral fluid trial and bloods before sign-off.]`,
  },
  {
    kind: "note",
    id: "note-review-001",
    encounterId: "enc-review",
    category: "ED Notes",
    noteType: "EM Consultant Review",
    author: "Drummond, Alice",
    credential: "MD",
    authorRole: "*PHYSICIAN: FACULTY",
    service: "Emergency Department",
    dateOfService: "06/07/26 0815",
    fileTime: "06/07/26 0838",
    timestamp: 1783325700,
    status: "signed",
    admission: true,
    urgent: true,
    body: `EMERGENCY MEDICINE CONSULTANT REVIEW (morning board round)

Flagged on the board: "?gastroenteritis, oral fluids trial" parked since 06:00
with an unreviewed gas. The department was at full escalation overnight and the
VBG printed while the assessing doctor was drawn into a resus call — the result
never made it back to a decision. Reviewed immediately.

The chart does not fit gastroenteritis:
- Triage narrative: WEEKS of thirst ("drinking loads"), up 4–5 times a night
  to pass urine, clothes looser. Weight 68.4 kg at the GP on 25/05 — 61.5 kg
  today (~7 kg down).
- Nursing documented deep sighing respirations with a pear-drops smell —
  KUSSMAUL breathing with acetone on the breath.
- Persistent tachycardia (HR 118 → 124) despite three hours of oral fluids.
- Afebrile throughout, CRP 4 — nothing supports an infective label. WCC 14.2
  is the leucocytosis of DKA itself. Amylase 138, mildly raised — common in
  DKA, not pancreatitis.

VBG (resulted 06:10, actioned NOW): pH 7.18, HCO3 11, pCO2 3.1, glucose 27.3,
KETONES 5.8, K+ 3.4, lactate 1.4. HbA1c added on the admission sample: 118.

Impression: DIABETIC KETOACIDOSIS — new presentation of type 1 diabetes,
initially labelled viral gastroenteritis. The vomiting and abdominal pain ARE
the DKA, not evidence against it.

***Governance: the 06:10 gas met DKA criteria and the plan was not revised for
two hours — fixed-rate insulin should have started then. Datix submitted; for
department teaching on label inheritance and anchoring, not an individual.***

Plan:
1. FIXED-RATE insulin infusion 0.1 units/kg/hr = 6 units/hr (61.5 kg).
   Commenced 08:50.
2. K+ 3.4 — do NOT run insulin without potassium replacement: 40 mmol/L KCl
   in each bag from now, recheck K+ at 1 h, continuous ECG monitoring.
   Insulin shifts potassium intracellularly — hypokalaemic arrest is the risk.
3. Sodium chloride 0.9% 1 L over 1 h, then per DKA pathway. Strict fluid
   balance; catheter only if not passing urine.
4. Hourly CBG and capillary ketones; repeat VBG at 2 h. Add glucose 10% when
   CBG <14 to keep the insulin running.
5. CANCEL the discharge plan and stand down D&V precautions. Admit (ED obs,
   then AMU). Refer diabetes team + DSN — new type 1 diagnosis.
6. VTE assessment once stable. Update patient and the flatmate who brought
   him in.`,
  },
  {
    kind: "note",
    id: "note-nurse-002",
    encounterId: "enc-nursing-friii",
    category: "Nursing",
    noteType: "Nursing Note — DKA Pathway",
    author: "Gallagher, Niamh",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "Emergency Department",
    dateOfService: "06/07/26 0940",
    fileTime: "06/07/26 0952",
    timestamp: 1783330800,
    status: "signed",
    body: `ED NURSING NOTE

Fixed-rate insulin commenced 08:50 at 6 units/hr via dedicated pump line.
Second bag sodium chloride 0.9% with 40 mmol KCl running. On continuous
cardiac monitoring per DKA pathway (K+ 3.4 on the gas).

Hourly CBG + ketone chart started: 09:00 CBG 24.1, ketones 5.2.
09:40 obs: HR 112, BP 106/62, RR 22, afebrile, SpO2 99%. Breathing visibly
less laboured than earlier. Vomited x1 since insulin start; ondansetron PRN
available. Passing urine — fluid balance chart running.

Patient tearful about "diabetes for life" — reassured; diabetes specialist
nurse to see him today. Flatmate present and supportive. Awaiting AMU bed.`,
  },
  {
    kind: "note",
    id: "note-cons-001",
    encounterId: "enc-endo",
    category: "Consults",
    noteType: "Diabetes Team Consult",
    author: "Beaumont, Isla",
    credential: "MD",
    authorRole: "*PHYSICIAN: FACULTY",
    service: "Endocrinology",
    dateOfService: "06/07/26 1100",
    fileTime: "06/07/26 1126",
    timestamp: 1783335600,
    status: "signed",
    body: `ENDOCRINOLOGY / DIABETES TEAM CONSULT

Asked to review 19M with DKA — new presentation of type 1 diabetes (HbA1c 118,
weeks of osmotic symptoms, ~7 kg weight loss; presented with vomiting initially
labelled gastroenteritis).

10:30 gas on treatment: pH 7.24, HCO3 14, ketones 4.1 — resolving. K+ 3.6 on
replacement; continue 40 mmol/L KCl and recheck 2-hourly while on the
fixed-rate infusion.

Plan:
- Continue fixed-rate insulin until ketones <0.6, pH >7.3 and eating; overlap
  s/c basal by 30–60 min before stopping the infusion.
- Start basal insulin TODAY alongside the infusion: glargine 16 units s/c OD.
- Send GAD and IA-2 antibodies + C-peptide; TFTs and coeliac screen (associated
  autoimmunity).
- DSN (Croft, Lisa) to begin new-T1DM education: injection technique, CBG
  monitoring, sick-day rules — ketone testing when unwell, NEVER stop basal
  insulin.
- Dietitian referral; young-adult diabetes clinic follow-up in 2 weeks.
- Precipitant: none required beyond the natural history — first presentation.
  The "flat bug" story is coincidence, not cause.`,
  },
  {
    kind: "encounterSummary",
    id: "admission-encounter-001",
    encounterId: "enc-admission",
    title: "Admission — ED to Hosp-Admission",
    type: "Hospital Encounter",
    department: "Emergency Medicine",
    author: "Drummond, Alice, MD (Attending)",
    signedAt: "06/07/2026 08:45",
    body: `ADMISSION  [Current]
06/07/2026 08:45 — present       Mount Verdant Hospital
Admitting / Attending: Drummond, Alice, MD — Emergency Medicine

PRINCIPAL PROBLEM:
Diabetic ketoacidosis — new presentation of type 1 diabetes.

ENCOUNTER NOTES:
- ED Provider Note — Prentice, Oliver, MD (Emergency Medicine)
- EM Consultant Review — Drummond, Alice, MD (Emergency Medicine)

HOSPITAL PROBLEM LIST:
◆ Diabetic ketoacidosis (pH 7.18, ketones 5.8) — PRINCIPAL
- Type 1 diabetes mellitus — new diagnosis (HbA1c 118)
- Hypokalaemia risk on insulin (K+ 3.4 — replacement running)
- Dehydration with pre-renal AKI (creatinine 118)
- Initial label "?viral gastroenteritis" — revised 08:15

CARE TIMELINE:
04:40  Arrived in ED (brought by flatmate)
04:55  Triage — "?viral gastroenteritis, oral fluids trial"
06:00  Seen by ED doctor; ondansetron + oral fluid trial
06:10  VBG resulted: pH 7.18, ketones 5.8, K+ 3.4 — not actioned
08:15  EM consultant board round — DKA recognised; plan revised
08:45  Admitted — Emergency Medicine (ED obs, awaiting AMU bed)
08:50  Fixed-rate insulin + potassium replacement commenced

EXPECTED MEDICATION LIST:
- Insulin (soluble) IV fixed rate 6 units/hr (0.1 units/kg/hr)
- Sodium chloride 0.9% 1 L IV + KCl 40 mmol/L — per DKA pathway
- Glucose 10% IV — add when CBG <14 mmol/L
- Ondansetron 4 mg IV PRN
- Insulin glargine 16 units s/c OD — first dose today per diabetes team

ALLERGIES: No known drug allergies.
CODE STATUS: For escalation. ISOLATION: D&V precautions stood down 08:15.

All patient data are synthetic. For education and simulation only. Not for clinical use.`,
  },
  {
    kind: "order",
    id: "order-ondansetron-001",
    encounterId: "enc-ondansetron",
    title: "Medication Order — Ondansetron",
    type: "Medication Order",
    department: "Emergency Department",
    author: "Prentice, Oliver, MD",
    signedAt: "06/07/2026 06:02",
    body: `EMERGENCY DEPARTMENT MEDICATION ORDER

Drug: Ondansetron 4 mg, IV, STAT.
Indication: nausea and vomiting — ?viral gastroenteritis.
Administered: 06:12 (Gallagher, Niamh, RN).

Reassess after antiemetic + oral fluid trial; if tolerating oral fluids,
anticipate discharge with GP follow-up and gastroenteritis advice sheet.
Stool culture only if diarrhoea develops.`,
  },
  {
    kind: "lab",
    id: "lab-vbg-001",
    encounterId: "enc-vbg",
    title: "Venous Blood Gas (POC)",
    status: "Final",
    specimen: "Venous blood, gas syringe (point-of-care)",
    collected: "06/07/2026 05:52",
    reportedAt: "06/07/2026 06:10",
    orderedBy: "Prentice, Oliver, MD (Emergency Medicine)",
    resultingLab: "ED blood gas analyser (POCT), Mount Verdant Hospital",
    rows: [
      { test: "pH", value: "7.18", units: "", range: "7.35–7.45", flag: "L" },
      { test: "pCO2", value: "3.1", units: "kPa", range: "4.7–6.0", flag: "L" },
      { test: "HCO3-", value: "11", units: "mmol/L", range: "22–26", flag: "L" },
      { test: "Base excess", value: "-14.2", units: "mmol/L", range: "-2 – +2", flag: "L" },
      { test: "Glucose", value: "27.3", units: "mmol/L", range: "3.5–7.8", flag: "HH" },
      { test: "Ketones", value: "5.8", units: "mmol/L", range: "<0.6", flag: "HH" },
      { test: "Lactate", value: "1.4", units: "mmol/L", range: "0.5–2.2", flag: "" },
      { test: "Sodium", value: "131", units: "mmol/L", range: "135–145", flag: "L" },
      { test: "Potassium", value: "3.4", units: "mmol/L", range: "3.5–5.3", flag: "L" },
      { test: "Chloride", value: "96", units: "mmol/L", range: "95–108", flag: "" },
      { test: "Anion gap", value: "24", units: "mmol/L", range: "8–16", flag: "H" },
    ],
  },
  {
    kind: "lab",
    id: "lab-bloods-admit-001",
    encounterId: "enc-bloods-admit",
    title: "Admission Bloods — U&E, Glucose, Ketones, FBC, CRP, HbA1c",
    status: "Final",
    specimen: "Blood (serum + EDTA), venepuncture",
    collected: "06/07/2026 05:45",
    received: "06/07/2026 05:58",
    reportedAt: "06/07/2026 06:55",
    orderedBy: "Prentice, Oliver, MD (Emergency Medicine)",
    resultingLab: "LegendCare Clinical Laboratory, Mount Verdant Hospital",
    rows: admissionLabRows,
  },
  {
    kind: "lab",
    id: "lab-vbg-002",
    encounterId: "enc-vbg-2",
    title: "Venous Blood Gas (POC) — Repeat on Treatment",
    status: "Final",
    specimen: "Venous blood, gas syringe (point-of-care)",
    collected: "06/07/2026 10:26",
    reportedAt: "06/07/2026 10:30",
    orderedBy: "Drummond, Alice, MD (Emergency Medicine)",
    resultingLab: "ED blood gas analyser (POCT), Mount Verdant Hospital",
    rows: [
      { test: "pH", value: "7.24", units: "", range: "7.35–7.45", flag: "L" },
      { test: "pCO2", value: "3.4", units: "kPa", range: "4.7–6.0", flag: "L" },
      { test: "HCO3-", value: "14", units: "mmol/L", range: "22–26", flag: "L" },
      { test: "Base excess", value: "-10.1", units: "mmol/L", range: "-2 – +2", flag: "L" },
      { test: "Glucose", value: "21.4", units: "mmol/L", range: "3.5–7.8", flag: "H" },
      { test: "Ketones", value: "4.1", units: "mmol/L", range: "<0.6", flag: "H" },
      { test: "Lactate", value: "1.2", units: "mmol/L", range: "0.5–2.2", flag: "" },
      { test: "Sodium", value: "133", units: "mmol/L", range: "135–145", flag: "L" },
      { test: "Potassium", value: "3.6", units: "mmol/L", range: "3.5–5.3", flag: "" },
      { test: "Chloride", value: "99", units: "mmol/L", range: "95–108", flag: "" },
      { test: "Anion gap", value: "19", units: "mmol/L", range: "8–16", flag: "H" },
    ],
  },
  {
    kind: "letter",
    id: "gp-letter-001",
    encounterId: "enc-gp-tired",
    title: "Primary Care Review — Tiredness",
    type: "Letter",
    department: "Primary Care",
    author: "Holloway, Margaret, MD",
    signedAt: "25/05/2026",
    body: `Dear colleague,

I reviewed Joshua, a 19-year-old university student, who came in feeling
"tired all the time" during the exam period. He is revising late, sleeping
poorly and drinking a lot of water and energy drinks at his desk; he has
noticed needing to pass urine more often, which we discussed in the context of
his fluid intake and the warm weather. He looks well. Weight 68.4 kg.

Examination unremarkable; observations normal. We agreed this is most in
keeping with revision-period fatigue and disturbed sleep. Bloods not taken
today; plan to review in four weeks after his exams finish, with bloods
(including glucose and thyroid function) if the tiredness persists.

Safety-netting given: to return sooner if he feels worse, loses weight, or the
thirst and urinary frequency continue.

Kind regards,
Dr M. Holloway`,
  },
  {
    kind: "report",
    id: "ed-2024-001",
    encounterId: "enc-ed-ankle",
    title: "ED Attendance — Summary",
    type: "ED Visit Summary",
    department: "Emergency Department",
    author: "Doyle, Sean, MD",
    signedAt: "14/09/2024",
    body: `EMERGENCY DEPARTMENT ATTENDANCE — SUMMARY

Presenting complaint: left ankle injury during five-a-side football.

HPI: inversion injury, immediate lateral pain and swelling. Able to
weight-bear four steps in the department.

Examination: swelling and tenderness over the lateral malleolus; ligamentous
laxity not assessable acutely. Neurovascularly intact.

Investigations: X-ray left ankle (Ottawa criteria met) — no fracture.

Impression: lateral ligament sprain. Discharged with RICE advice, analgesia
and physiotherapy self-referral information. No follow-up required.`,
  },
];

/** Note-kind documents only — feeds the Notes activity and Chart Review > Notes. */
export const caseDka001Notes = caseDka001Documents.filter(
  (doc): doc is Extract<ClinicalDocument, { kind: "note" }> => doc.kind === "note",
);
