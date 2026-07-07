import type { ClinicalDocument, LabFlag, LabRow } from "../../../types";
import { bloods } from "./bloods";

/** SI units for the admission panel, keyed by `bloods` test name. */
const ADMISSION_LAB_UNITS: Record<string, string> = {
  WCC: "x10⁹/L",
  Neutrophils: "x10⁹/L",
  CRP: "mg/L",
  Hb: "g/L",
  Albumin: "g/L",
  Sodium: "mmol/L",
  Urea: "mmol/L",
  Creatinine: "µmol/L",
  eGFR: "mL/min/1.73m²",
  Lactate: "mmol/L",
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
 * Single source of truth for the synthetic recurrent-aspiration case
 * (Pemberton, Arthur, 89M): every clinical document, note-kind and
 * report-kind, in one list. Both views derive from it — the Notes activity
 * (and Chart Review > Notes sub-tab) filter to `kind: "note"`, while the
 * Encounters timeline resolves each row's primary document by `encounterId`.
 *
 * CASE SHAPE — an END-OF-LIFE / CEILING-OF-CARE decision disguised as "another
 * chest infection", for a post-take review to own rather than defer:
 *  - The acute problem is real: a third aspiration pneumonia in four months,
 *    septic physiology overnight (T 38.6, RR 28, SpO2 89 on air, NEWS2 5).
 *  - The trajectory is the point. Advanced dementia, CFS 8, bed-bound, weight
 *    55.9 -> 51.0 kg, albumin 24, refusing intake. The SALT review of 12/06
 *    documents END-STAGE oropharyngeal dysphagia and explicitly advises
 *    against tube feeding — recommending risk-feeding for comfort.
 *  - Two prior discharge summaries (March and May) each say in writing
 *    "consider ceiling of care / advance care planning at the next
 *    opportunity" — and neither was ever actioned. There is NO DNACPR and NO
 *    ReSPECT anywhere on file, so he is full escalation by default.
 *  - The overnight clerking treats it as an isolated pneumonia: IV antibiotics,
 *    full escalation, and a plan to "consider NG feeding for nutrition" — the
 *    over-intervention the SALT letter warns against.
 *  - The family voice is already in the chart: his daughter Julie (a
 *    registered nurse and next of kin) told the ED team she does not think
 *    "he would want to keep coming back to hospital" and asked about a
 *    ceiling of care. Nobody has had the conversation.
 *
 * The teaching failure to punish: documenting a competent pneumonia plan while
 * ignoring that this admission needs a proportionate ceiling of care, a
 * resuscitation decision, a best-interests discussion with the family, and a
 * SALT-guided feeding decision that is NOT a feeding tube.
 *
 * All content is fabricated for education and simulation only. Not for clinical use.
 */
export const caseAspiration001Documents: ClinicalDocument[] = [
  {
    kind: "note",
    id: "note-ptwr-001",
    encounterId: "enc-ptwr",
    category: "Progress",
    noteType: "Post-Take Ward Round",
    author: "Osei, Kwame",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "(A) Care of the Elderly — Ward 11",
    dateOfService: "07/07/26 0820",
    fileTime: "07/07/26 0844",
    timestamp: 1783412400,
    status: "signed",
    body: `CARE OF THE ELDERLY WARD ROUND (SHO) — post-take

S: Seen with nursing staff. Drowsy but rousable, not distressed. Rattly chest,
poor cough. Not taking oral fluids or diet overnight. Daughter (Julie) phoned
the ward again this morning.

O: T 38.4, HR 106, BP 106/60, RR 26, SpO2 90% on 2 L O2. NEWS2 5.
Chest: coarse crackles right base. Frail, cachectic. GCS ~13 (E3 V4 M6).

Bloods: WCC 14.2, CRP 168 — infection. Sodium 149, urea 12.8, creatinine 118
(AKI). CXR: right basal consolidation.

Impression: aspiration pneumonia, responding slowly to IV co-amoxiclav.

Plan:
- Continue IV co-amoxiclav; repeat bloods in AM.
- IV fluids for the AKI / hypernatraemia.
- Await consultant post-take round.
- Consider NG feeding for nutrition as not eating.
- Physio for chest, SALT re-referral for swallow.`,
  },
  {
    kind: "note",
    id: "note-hp-001",
    encounterId: "enc-admission",
    category: "H&P",
    noteType: "Admission Clerking",
    author: "Bianchi, Lucia",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "(A) Care of the Elderly — Ward 11",
    dateOfService: "07/07/26 0210",
    fileTime: "07/07/26 0258",
    timestamp: 1783390200,
    status: "signed",
    admission: true,
    body: `CARE OF THE ELDERLY ADMISSION CLERKING (overnight)
Admission Date: 07/07/2026 — PCP: Hollis, Margaret, MD

CC: Fever, drowsiness and noisy breathing after lunch at the nursing home.

HISTORY OF PRESENT ILLNESS:
Arthur Pemberton is an 89-year-old man with advanced Alzheimer's dementia,
brought in from his nursing home after becoming feverish, drowsy and
"rattly" during and after his pureed lunch. Staff describe him coughing and
going quiet at the table. He is bed-to-chair, doubly incontinent, and no
longer recognises family. This is his THIRD hospital attendance with an
aspiration event in four months (March and May).

Collateral from the home: eating and drinking much less over recent weeks,
frequently coughing on thin fluids and refusing food. Weight has fallen
(55.9 kg in March to 51 kg now). The SALT team reviewed him at the home on
12/06 and documented end-stage dysphagia.

PAST MEDICAL HISTORY:
- Advanced Alzheimer's dementia (diagnosed 2018), Clinical Frailty Scale 8
- Recurrent aspiration pneumonia (March 2026, May 2026)
- Oropharyngeal dysphagia — end-stage per SALT 12/06/2026
- Hypertension
- Previous CVA 2019

MEDICATIONS (from the home):
- Donepezil 10 mg PO ON
- Amlodipine 5 mg PO OD
- (regular oral meds — patient currently unable to swallow safely)

ALLERGIES: No known drug allergies.

EXAMINATION:
- Drowsy, rousable to voice. GCS E3 V4 M6 = 13. Cachectic, frail.
- T 38.6, HR 108, BP 112/64, RR 28, SpO2 89% on air -> 92% on 2 L. NEWS2 5.
- Chest: coarse crepitations right base, reduced air entry.
- Abdomen soft. Pressure areas intact. Contractures noted.

INVESTIGATIONS:
- WCC 14.2, neutrophils 12.1, CRP 168.
- Sodium 149, urea 12.8, creatinine 118 (baseline ~85), eGFR 48 — AKI on
  dehydration. Albumin 24. Lactate 2.2.
- CXR: right lower zone consolidation.

IMPRESSION:
1. Aspiration pneumonia (third episode) — septic, NEWS2 5.
2. Hypernatraemic dehydration with AKI.
3. Poor nutritional intake.

PLAN:
1. IV co-amoxiclav 1.2 g TDS per aspiration guidance.
2. IV fluids — 0.9% sodium chloride, cautious rehydration.
3. Oxygen to keep SpO2 >= 92%.
4. NBM until SALT review; consider NG feeding for nutrition.
5. Bloods in the morning; chest physio.
6. Full escalation — for ward-level care, senior review on the post-take round.
CODE STATUS: no DNACPR / ReSPECT on file.`,
  },
  {
    kind: "note",
    id: "note-ed-001",
    encounterId: "enc-ed",
    category: "ED Notes",
    noteType: "ED Provider Note",
    author: "Marsden, Eleanor",
    credential: "MD",
    authorRole: "*PHYSICIAN: FACULTY",
    service: "Emergency Department",
    dateOfService: "06/07/26 2240",
    fileTime: "06/07/26 2315",
    timestamp: 1783377600,
    status: "signed",
    admission: true,
    urgent: true,
    body: `EMERGENCY DEPARTMENT PROVIDER NOTE

Presenting complaint: fever and drowsiness after lunch, from nursing home.

HPI: 89M, advanced dementia, brought by ambulance after an aspiration event at
lunch — coughing on pureed food, then febrile, drowsy and tachypnoeic. Third
such presentation in four months. Bed-bound, CFS 8, minimal oral intake for
weeks per the home.

O/E: drowsy (GCS 13), febrile 38.6, RR 28, SpO2 89% air -> 92% on 2 L, HR 108.
Right basal crackles. Frail and cachectic.

Ix: septic bloods (WCC 14.2, CRP 168), AKI (creat 118, Na 149), lactate 2.2.
CXR: right basal consolidation. Aspiration pneumonia.

IMPORTANT — FAMILY DISCUSSION: his daughter Julie (next of kin, a registered
nurse) attended. She is distressed at the repeated admissions and said she does
not believe "he would want to keep coming back to hospital like this", and
asked directly whether a ceiling of care and a DNACPR should be in place. I
explained the medical team on the ward would need to lead that conversation and
review the advance care planning — there is nothing documented on our system.
She would like to be called and involved in any decision; mobile on file.

Plan: IV antibiotics and fluids started, refer Care of the Elderly. Ward team
to address ceiling of care / resuscitation status and speak with the daughter.`,
  },
  {
    kind: "note",
    id: "note-triage-001",
    encounterId: "enc-triage",
    category: "ED Notes",
    noteType: "ED Triage Note",
    author: "Kaur, Simran",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "Emergency Department",
    dateOfService: "06/07/26 2130",
    fileTime: "06/07/26 2141",
    timestamp: 1783373400,
    status: "signed",
    admission: true,
    urgent: true,
    body: `ED TRIAGE NOTE

89M from nursing home, advanced dementia, brought by ambulance after choking /
aspiration at lunch with fever and reduced consciousness.

Obs: T 38.5, HR 108, BP 114/66, RR 28, SpO2 89% RA -> 93% on 2 L. NEWS2 = 5.
Drowsy, rousable. No known drug allergies.

Ambulance / home paperwork: bed-bound, fully dependent, eats pureed diet with
supervision. Daughter (NOK) following in own car. Triage category: Urgent.
Bloods, VBG and IV access obtained; oxygen applied. Moved to majors.`,
  },
  {
    kind: "note",
    id: "note-nurse-001",
    encounterId: "enc-admission",
    category: "Nursing",
    noteType: "Nursing Admission Assessment",
    author: "Ferreira, Beatriz",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "(A) Care of the Elderly — Ward 11",
    dateOfService: "07/07/26 0330",
    fileTime: "07/07/26 0352",
    timestamp: 1783394400,
    status: "signed",
    admission: true,
    body: `NURSING ADMISSION ASSESSMENT

89M admitted to Ward 11 (Frailty) Bay 1 from ED with aspiration pneumonia.

Obs: T 38.3, HR 104, BP 108/62, RR 26, SpO2 91% on 2 L. NEWS2 = 5.
Drowsy, rousable to voice, does not follow commands. Fully dependent for all
care.

Nutrition/hydration: NBM overnight pending SALT. Declined sips when offered.
MUST score HIGH — cachectic, weight 51 kg (home records 55.9 kg in March).
Pressure areas: sacrum and heels intact but very high risk — air mattress and
2-hourly repositioning commenced.

Falls: bed-bound, low falls risk. VTE: reduced mobility — mechanical
prophylaxis only (bleeding/skin frailty), medical team aware.

Family: daughter Julie phoned the ward at 02:50, very concerned, asked to be
kept informed and to be part of any decisions about escalation. Contact number
recorded. She mentioned the SALT team had "said no to a feeding tube" at the
last review.

Comfort: settled on repositioning. No signs of pain currently; oral care given.`,
  },
  {
    kind: "encounterSummary",
    id: "admission-encounter-001",
    encounterId: "enc-admission",
    title: "Admission — ED to Hosp-Admission",
    type: "Hospital Encounter",
    department: "Care of the Elderly",
    author: "Nair, Priya, MD (Attending)",
    signedAt: "07/07/2026 01:20",
    body: `ADMISSION  [Current]
07/07/2026 01:20 — present       Mount Verdant Hospital
Admitting / Attending: Nair, Priya, MD — Care of the Elderly

PRINCIPAL PROBLEM:
Aspiration pneumonia (third episode in four months).

ENCOUNTER NOTES:
- ED Provider Note — Marsden, Eleanor, MD (Emergency Medicine)
- Admission Clerking — Bianchi, Lucia, MD (Care of the Elderly)

HOSPITAL PROBLEM LIST:
◆ Aspiration pneumonia — PRINCIPAL
- Advanced Alzheimer's dementia — CFS 8
- End-stage oropharyngeal dysphagia (SALT 12/06/2026)
- Hypernatraemic dehydration with AKI
- Malnutrition — weight 55.9 -> 51.0 kg, albumin 24
- Hypertension; previous CVA 2019

CARE TIMELINE:
21:30  Triage — aspiration at lunch, NEWS2 5
22:40  Seen by ED provider; family raised ceiling-of-care question
01:20  Admitted — Care of the Elderly, Ward 11 Bay 1

ADVANCE CARE PLANNING:
- No DNACPR on file. No ReSPECT / treatment escalation plan on file.
- Two prior discharge summaries recommended considering a ceiling of care.

EXPECTED MEDICATION LIST:
- Co-amoxiclav 1.2 g IV TDS — NEW (aspiration pneumonia)
- Sodium chloride 0.9% IV — rehydration
- Paracetamol 500 mg IV QDS PRN
- Donepezil 10 mg PO ON — withheld (NBM)
- Amlodipine 5 mg PO OD — withheld (NBM)

ALLERGIES: No known drug allergies.
CODE STATUS: Full escalation (no DNACPR/ReSPECT). ISOLATION: None.

All patient data are synthetic. For education and simulation only. Not for clinical use.`,
  },
  {
    kind: "letter",
    id: "salt-letter-001",
    encounterId: "enc-salt",
    title: "SALT Review — End-Stage Dysphagia",
    type: "Speech & Language Therapy Letter",
    department: "Speech & Language Therapy",
    author: "Redmond, Ciara (Speech & Language Therapist)",
    signedAt: "12/06/2026",
    body: `SPEECH & LANGUAGE THERAPY — COMMUNITY REVIEW (nursing home)

Re: Mr Arthur Pemberton — recurrent aspiration, swallow review.

Reviewed at the nursing home following his second aspiration pneumonia. Bedside
assessment across a full meal and thickened fluids.

Findings: severe oropharyngeal dysphagia with a delayed, unsafe swallow — overt
coughing and a wet, gurgly voice on both pureed diet (IDDSI 4) and mildly
thickened fluids (IDDSI 2). Silent aspiration is very likely. This is END-STAGE
dysphagia in the context of advanced dementia and is expected to progress; it
is not amenable to further swallow rehabilitation.

Recommendations:
- There is NO safe oral consistency that eliminates aspiration risk.
- Enteral (NG / PEG) tube feeding is NOT recommended: in advanced dementia it
  does not reduce aspiration pneumonia, improve survival or comfort, and carries
  its own burdens. This was discussed with the home and family.
- We recommend RISK-FEEDING (feeding at risk) for pleasure and comfort — small
  amounts of preferred textures given carefully by a familiar carer, accepting
  the aspiration risk as part of a comfort-focused approach.
- This is an appropriate trigger to revisit the overall ceiling of care and
  advance care planning with the family.

All patient data are synthetic. For education and simulation only. Not for clinical use.

Kind regards,
C. Redmond, SLT`,
  },
  {
    kind: "letter",
    id: "dc-summary-may-001",
    encounterId: "enc-dc-may",
    title: "Discharge Summary — Aspiration Pneumonia (May)",
    type: "Discharge Summary",
    department: "Care of the Elderly",
    author: "Achebe, Ngozi, MD (Care of the Elderly)",
    signedAt: "24/05/2026",
    body: `DISCHARGE SUMMARY

Re: Mr Arthur Pemberton — admitted 18/05/2026, discharged 24/05/2026.

Reason for admission: aspiration pneumonia (second episode), treated with IV
co-amoxiclav and supportive care. Recovered to baseline and returned to the
nursing home.

Background: advanced Alzheimer's dementia, CFS 8, increasingly frail with
declining oral intake and recurrent aspiration.

Recommendations at discharge:
- SALT to review swallow in the community (referral made).
- We would STRONGLY recommend that, at the next opportunity, the team and
  family CONSIDER A CEILING OF CARE and advance care planning (including
  resuscitation status) given the recurrent aspiration and overall trajectory.
  This was raised with the family in principle but a formal plan was not
  completed this admission.
- Continue current medications; GP to review polypharmacy.

All patient data are synthetic. For education and simulation only. Not for clinical use.

Dr N. Achebe`,
  },
  {
    kind: "letter",
    id: "dc-summary-mar-001",
    encounterId: "enc-dc-mar",
    title: "Discharge Summary — Aspiration Pneumonia (March)",
    type: "Discharge Summary",
    department: "Care of the Elderly",
    author: "Achebe, Ngozi, MD (Care of the Elderly)",
    signedAt: "15/03/2026",
    body: `DISCHARGE SUMMARY

Re: Mr Arthur Pemberton — admitted 09/03/2026, discharged 15/03/2026.

Reason for admission: aspiration pneumonia (first documented episode). Treated
with IV antibiotics, responded well, returned to the nursing home at baseline.

Background: advanced Alzheimer's dementia, bed-to-chair, fully dependent.
Weight 55.9 kg. Some coughing on fluids noted by the home.

Recommendations at discharge:
- Modified diet as tolerated; home to monitor intake and swallow.
- Advance care planning would be appropriate in due course given his frailty —
  suggest the community team consider a ceiling of care and ReSPECT at a future
  review. Not commenced this admission.

All patient data are synthetic. For education and simulation only. Not for clinical use.

Dr N. Achebe`,
  },
  {
    kind: "report",
    id: "cxr-report-001",
    encounterId: "enc-cxr",
    title: "Chest X-Ray — Portable",
    type: "Radiology Report",
    department: "Radiology",
    author: "Volkov, Irina, MD (Radiology)",
    signedAt: "06/07/2026 23:05",
    body: `CHEST X-RAY (AP, portable, ED)

Clinical details: 89M, dementia, aspiration event, febrile, hypoxic.

Findings: patchy air-space opacification in the right lower zone consistent
with consolidation, in keeping with aspiration pneumonia. Right-sided volume
appears slightly reduced. No large pleural effusion. No pneumothorax. Heart
size difficult to assess (AP, rotated); no gross pulmonary oedema.

Comparison: similar right basal changes on the 19/05/2026 film (prior
aspiration), largely resolved on the interim outpatient request.

Impression: right basal consolidation — aspiration pneumonia.

All patient data are synthetic. For education and simulation only. Not for clinical use.`,
  },
  {
    kind: "lab",
    id: "lab-bloods-admit-001",
    encounterId: "enc-bloods-admit",
    title: "Admission Bloods — FBC, U&E, CRP, Albumin, Lactate",
    status: "Final",
    specimen: "Blood (serum + EDTA), venepuncture",
    collected: "06/07/2026 21:55",
    received: "06/07/2026 22:10",
    reportedAt: "06/07/2026 22:38",
    orderedBy: "Marsden, Eleanor, MD (Emergency Medicine)",
    resultingLab: "LegendCare Clinical Laboratory, Mount Verdant Hospital",
    rows: admissionLabRows,
  },
];

/** Note-kind documents only — feeds the Notes activity and Chart Review > Notes. */
export const caseAspiration001Notes = caseAspiration001Documents.filter(
  (doc): doc is Extract<ClinicalDocument, { kind: "note" }> => doc.kind === "note",
);
