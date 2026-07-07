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
  Glucose: "mmol/L",
  "Corrected calcium": "mmol/L",
  INR: "",
  APTT: "s",
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
 * Single source of truth for the synthetic subdural case (Marchant, Eileen, 79F):
 * every clinical document, note-kind and report-kind, in one list. Both views
 * derive from it — the Notes activity (and Chart Review > Notes sub-tab) filter
 * to `kind: "note"`, while the Encounters timeline resolves each row's primary
 * document by `encounterId`.
 *
 * CASE SHAPE — a subacute subdural haematoma hiding behind a "simple" label:
 *  - Index event 10 days ago: a "mechanical fall, minor head injury — no
 *    concerns" ED attendance. She is on APIXABAN for AF, which under NICE-style
 *    head-injury guidance is itself an indication for a CT head — the discharge
 *    note asserts "no CT indicated" (the first error, sitting in the chart).
 *  - Readmitted with fluctuating drowsiness, worsening morning-predominant
 *    headache and new unsteadiness, clerked as "?UTI / deconditioning".
 *  - The chart contradicts the label: GCS 15 -> 14 -> 13 across nursing obs
 *    with fluctuation; new mild LEFT-sided weakness in the physio note;
 *    apixaban still on the active drug chart (given this morning); afebrile
 *    with bland bloods and a mixed-growth urine culture.
 *  - Latent / system-factor hooks (NOT individual blame): a busy post-take
 *    round reads "obs stable" without opening the GCS column; the night nurse
 *    records the falling GCS faithfully but files it "for morning review";
 *    pharmacy raises the anticoagulation question in writing and it goes
 *    unanswered; the dipstick pulls everyone toward a UTI that the culture
 *    does not support.
 *
 * All content is fabricated for education and simulation only. Not for clinical use.
 */
export const caseSubdural001Documents: ClinicalDocument[] = [
  {
    kind: "note",
    id: "note-hp-001",
    encounterId: "enc-admission",
    category: "H&P",
    noteType: "H&P",
    author: "Fletcher, James",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "(A) Geriatrics",
    dateOfService: "05/07/26 2145",
    fileTime: "05/07/26 2226",
    timestamp: 1783287900,
    status: "signed",
    admission: true,
    body: `GERIATRICS ADMISSION H&P (CLERKING)
Admission Date: 05/07/2026 — PCP: Byrne, Colm, MD

CC: Fluctuating drowsiness, headache and unsteadiness. "Not herself" per daughter.

HISTORY OF PRESENT ILLNESS:
Eileen Marchant is a 79-year-old woman brought in by her daughter with 2–3 days
of intermittent drowsiness — "drifts off mid-sentence, then perks up" — a
headache that is worse in the mornings, and new unsteadiness on her feet. She
had a mechanical trip over a rug at home 10 DAYS AGO with a bang to the left
side of the head; seen in this ED on 26/06, small scalp haematoma, discharged
same day (discharge note: "no CT indicated"). She takes APIXABAN for AF. Since
the fall the family describe her as quieter and more tired; one episode of
vomiting this morning. No fever, no dysuria or frequency volunteered; daughter
wonders about a "waterworks infection" as this happened to a neighbour.

Previously independent at home with a stick; now needing an arm to steady her.

PAST MEDICAL HISTORY:
- Atrial fibrillation (on apixaban)                09/2023
- Recurrent falls (falls review 11/2025)           2025
- Essential hypertension                           2016
- Osteoarthritis (knees)                           2014

ALLERGIES: No known drug allergies.

MEDICATIONS (on admission):
- Apixaban 5 mg PO BD
- Bisoprolol 2.5 mg PO OD
- Amlodipine 5 mg PO OD
- Colecalciferol 800 units PO OD
- Paracetamol 1 g PO QDS PRN

EXAMINATION:
- Drowsy earlier in ED per daughter but currently alert, GCS 15. Orientated to
  person and place, hesitant on date. Small resolving haematoma over the LEFT
  parietal scalp.
- HR 74 irregularly irregular, BP 138/78, T 36.8, SpO2 96% RA. Chest clear.
- Neuro screen: moves all four limbs on the bed, pupils equal and reactive.
  Formal limb/gait assessment limited by tiredness this evening — to complete
  on the ward round.

INVESTIGATIONS:
- Bloods largely unremarkable: Hb 121, WCC 8.9, CRP 22, Na 132, urea 8.9,
  corrected calcium 2.38. Clotting screen "normal" (INR 1.1).
- Urine dip: trace leucocytes, nitrites NEGATIVE. Sample sent for culture.
- CXR requested to complete the confusion screen.

IMPRESSION:
?UTI / deconditioning following recent fall; ?element of delirium. Frail older
woman, likely to need therapy input before home.

PLAN:
1. Start nitrofurantoin MR 100 mg BD for possible UTI; chase urine culture.
2. Encourage oral fluids; delirium screen bloods sent (calcium/glucose normal).
3. Physio + OT review for mobility and discharge planning.
4. Continue regular medications including apixaban. VTE prophylaxis not
   required (already anticoagulated).
5. Treatment escalation plan discussed with daughter — for ward-based care.`,
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
    dateOfService: "05/07/26 1920",
    fileTime: "05/07/26 1952",
    timestamp: 1783279200,
    status: "signed",
    admission: true,
    body: `EMERGENCY DEPARTMENT PROVIDER NOTE

Presenting complaint: episodes of drowsiness, headache, "off legs".

HPI: 79F brought by her daughter. Over 2–3 days she has had spells of marked
drowsiness alternating with near-normal alertness, a headache, and has become
unsteady. Background of a mechanical fall 10 days ago (seen here 26/06, scalp
haematoma, discharged). Long-term apixaban for AF.

On assessment: alert, GCS 15, afebrile 36.9, HR 76 irregular, BP 141/80.
Abdomen soft. Chest clear. Neurology grossly intact on brief screen; gait not
formally assessed (patient tired, kept in wheelchair).

Urine dip: trace leucocytes, nitrites negative — sent for culture.
Bloods unremarkable apart from CRP 22 and Na 132.

Impression: ?UTI / deconditioning in a frail older person; ?evolving delirium.
Discussed with the medical registrar — accepted for Geriatrics for
delirium screen and therapy assessment. Daughter updated.`,
  },
  {
    kind: "note",
    id: "note-ed-001",
    encounterId: "enc-triage",
    category: "ED Notes",
    noteType: "ED Triage Note",
    author: "Adebayo, Funmi",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "Emergency Department",
    dateOfService: "05/07/26 1805",
    fileTime: "05/07/26 1819",
    timestamp: 1783274700,
    status: "signed",
    admission: true,
    body: `ED TRIAGE NOTE

79F brought by daughter: "keeps falling asleep and isn't herself". Fell at home
10 days ago, seen here at the time. Daughter reports headache and one vomit
this morning. Patient rousable and chatting at triage, GCS 15.

Obs: T 36.9, HR 76 (irregular), BP 141/80, RR 16, SpO2 96% RA. NEWS2 = 1.
No allergy band required — NKDA.

Triage category: Standard. To majors waiting area with daughter. Bloods and
urine dip requested.`,
  },
  {
    kind: "note",
    id: "note-nurse-001",
    encounterId: "enc-admission",
    category: "Nursing",
    noteType: "Nursing Admission Assessment",
    author: "Szymanska, Alina",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "(A) Geriatrics",
    dateOfService: "05/07/26 2320",
    fileTime: "05/07/26 2341",
    timestamp: 1783293600,
    status: "signed",
    admission: true,
    body: `NURSING ADMISSION ASSESSMENT

79F admitted to Elderly Care Unit Bay 4 from ED. Settled on arrival, GCS 15,
orientated to place. Small bruise noted over the left side of the scalp
(from fall 10 days ago per daughter).

Obs on arrival: T 36.8, HR 72 irregular, BP 136/76, RR 16, SpO2 96% RA.
NEWS2 = 1.

Risk assessments: falls — HIGH (recent falls, unsteady); bed in low position,
call bell in reach. Pressure areas (Waterlow) — moderate. Nutrition (MUST) — 1.
No catheter. One peripheral cannula in situ. Daughter given ward contact card;
she mentioned the head injury advice leaflet from the previous ED visit is
still on the fridge at home. Night staff handed over to monitor conscious
level as she was sleepy in ED earlier.`,
  },
  {
    kind: "note",
    id: "note-nurse-002",
    encounterId: "enc-admission",
    category: "Nursing",
    noteType: "Nursing Shift Note",
    author: "Reyes, Marisol",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "(A) Geriatrics",
    dateOfService: "06/07/26 0605",
    fileTime: "06/07/26 0618",
    timestamp: 1783317900,
    status: "signed",
    urgent: true,
    body: `NURSING SHIFT NOTE (Night)

Variable night. Slept from 00:00.

02:00 — very drowsy when woken for obs, rousable to voice, answering slowly.
GCS 14 (E3 V5 M6). Recorded on the obs chart.

04:00 — sleeping, snoring loudly. Not woken (do-not-disturb rounding).

05:30 — harder to rouse, eyes open to voice only, confused conversation.
GCS 13 (E3 V4 M6). Complaining that her head is "pounding" — worse than
yesterday evening. Vomited once, small volume. Paracetamol given 06:15.
NEWS2 = 4 (ACVPU = V). Obs chart updated and GCS trend documented.

Plan: continue routine obs; for review by the day team on the morning ward
round. Daughter phoning at 09:00 for an update.`,
  },
  {
    kind: "note",
    id: "note-prog-001",
    encounterId: "enc-ward-round",
    category: "Progress",
    noteType: "Post-Take Ward Round",
    author: "Osei, Grace",
    credential: "MD",
    authorRole: "*PHYSICIAN: FACULTY",
    service: "(A) Geriatrics",
    dateOfService: "06/07/26 0830",
    fileTime: "06/07/26 0856",
    timestamp: 1783326600,
    status: "signed",
    admission: true,
    body: `POST-TAKE WARD ROUND NOTE

Seen on the post-take round with the on-call team (busy take, 14 patients).

79F admitted overnight: intermittently drowsy, headache, off legs. Recent
mechanical fall 10 days ago, seen in ED at the time and discharged. Clerked as
?UTI / deconditioning. On apixaban for AF.

This morning sleepy but rousable — nursing staff report a poor night's sleep;
new environment. Obs reviewed: afebrile, haemodynamically stable. Moving all
four limbs on the bed. Urine dip positive for leucocytes.

Impression: ?UTI / deconditioning in a frail older woman; possible
hypoactive delirium.

Plan:
- Continue nitrofurantoin; chase urine culture.
- Encourage sitting out and oral intake; physio + OT to see today.
- Continue regular medications. Bloods largely reassuring — repeat U&E
  tomorrow (Na 132).
- Aim for early supported discharge once mobilising — daughter keen to have
  her home. Review at board round.`,
  },
  {
    kind: "note",
    id: "note-prog-002",
    encounterId: "enc-admission",
    category: "Progress",
    noteType: "Physiotherapy Note",
    author: "Hughes, Rhian",
    credential: "PT",
    authorRole: ".PHYSIOTHERAPIST",
    service: "Therapies — Physiotherapy",
    dateOfService: "06/07/26 1030",
    fileTime: "06/07/26 1047",
    timestamp: 1783333800,
    status: "signed",
    body: `PHYSIOTHERAPY INITIAL ASSESSMENT

Seen for mobility assessment as requested (previously independent indoors with
a stick per daughter).

Subjective: drowsy but rousable; says her head aches. Keen to try walking.

Objective:
- Sit-to-stand with assistance of two.
- NEW finding: mild LEFT-sided weakness — left grip weaker than right, LEFT
  pronator drift present, left foot catching on attempted steps. Veering to
  the left. This is a change from the daughter's description of her baseline.
- Transfers currently assist x2. Standing tolerance <1 minute — unsafe to
  progress today.

Analysis: not safe to mobilise; presentation is beyond "deconditioning" —
new asymmetric weakness noted.

Plan: mobilisation DEFERRED. Handed over verbally to the bay nurse to inform
the medical team of the new left-sided weakness. Will review tomorrow or
after medical review.`,
  },
  {
    kind: "note",
    id: "note-prog-003",
    encounterId: "enc-admission",
    category: "Progress",
    noteType: "Best Poss Rx Hx",
    author: "Chu, Vanessa",
    credential: "PharmD",
    authorRole: ".PHARMACIST",
    service: "Pharmacy",
    dateOfService: "06/07/26 1145",
    fileTime: "06/07/26 1204",
    timestamp: 1783338300,
    status: "signed",
    body: `BEST POSSIBLE MEDICATION HISTORY

Sources: patient's daughter, GP summary, community pharmacy record (3 sources).

Regular medications confirmed:
- Apixaban 5 mg PO BD (AF; dose criteria for 5 mg BD met — age 79, weight
  56 kg, creatinine 84). On the inpatient chart; GIVEN this morning 08:00.
- Bisoprolol 2.5 mg PO OD.
- Amlodipine 5 mg PO OD.
- Colecalciferol 800 units PO OD.
- Paracetamol 1 g PO QDS PRN.
- Nitrofurantoin MR 100 mg PO BD — started this admission for ?UTI.

Allergy: none known (daughter confirms).

PHARMACIST QUERY FOR THE TEAM: she had a fall with a head strike on 26/06 and
has been readmitted with drowsiness. Please review whether APIXABAN should
continue pending assessment — happy to advise on interruption/reversal options
if needed. Note that a normal INR/APTT does NOT exclude a therapeutic apixaban
effect (standard clotting screens do not measure factor Xa inhibition).
Awaiting team response.`,
  },
  {
    kind: "note",
    id: "note-prog-004",
    encounterId: "enc-admission",
    category: "Progress",
    noteType: "Progress Note",
    author: "Fletcher, James",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "(A) Geriatrics",
    dateOfService: "06/07/26 1240",
    fileTime: "—",
    timestamp: 1783341600,
    status: "incomplete",
    body: `PROGRESS NOTE (DRAFT)

Daughter phoned the ward — very concerned that mum is "much sleepier than
usual, keeps drifting off mid-sentence". Requesting to speak to a doctor this
afternoon.

Reviewed briefly at the bedside: drowsy, opens eyes to voice.

- ***review this afternoon's obs — nursing report GCS has been varying***
- ***physio note flagged something re: left side? — to read***
- ***chase urine culture — lab says prelim mixed growth?***
- ***discuss with registrar re: whether further investigations needed***

[Draft — not yet signed.]`,
  },
  {
    kind: "encounterSummary",
    id: "admission-encounter-001",
    encounterId: "enc-admission",
    title: "Admission — ED to Hosp-Admission",
    type: "Hospital Encounter",
    department: "Geriatrics",
    author: "Osei, Grace, MD (Attending)",
    signedAt: "05/07/2026 21:10",
    body: `ADMISSION  [Current]
05/07/2026 21:10 — present       Mount Verdant Hospital
Admitting / Attending: Osei, Grace, MD — Geriatrics

PRINCIPAL PROBLEM:
Fluctuating drowsiness — clerked as ?UTI / deconditioning.

ENCOUNTER NOTES:
- ED Provider Note — Kaur, Simran, MD (Emergency Medicine)
- Post-Take Ward Round — Osei, Grace, MD (Geriatrics)

HOSPITAL PROBLEM LIST:
◆ ?UTI / deconditioning (working label) — PRINCIPAL
- Fluctuating conscious level — cause not established
- Fall with head strike 26/06/2026 — on apixaban; no CT head performed
- Atrial fibrillation — apixaban continued on the inpatient chart
- Recurrent falls
- Essential hypertension

CARE TIMELINE:
18:05  Arrived in ED (brought by daughter)
19:20  Seen by ED provider; urine dip trace leucocytes
21:10  Admitted — Geriatrics, Elderly Care Unit Bay 4

EXPECTED MEDICATION LIST:
- Apixaban 5 mg PO BD — CONTINUED (see pharmacy query)
- Nitrofurantoin MR 100 mg PO BD — started for ?UTI
- Bisoprolol 2.5 mg PO OD
- Amlodipine 5 mg PO OD
- Colecalciferol 800 units PO OD
- Paracetamol 1 g PO QDS PRN

ALLERGIES: No known drug allergies.
CODE STATUS: For escalation. ISOLATION: None.

All patient data are synthetic. For education and simulation only. Not for clinical use.`,
  },
  {
    kind: "report",
    id: "cxr-report-001",
    encounterId: "enc-cxr",
    title: "Chest X-ray — Portable",
    type: "Radiology Report",
    department: "Radiology",
    author: "Iqbal, Noor, MD (Radiology)",
    signedAt: "05/07/2026 23:50",
    body: `EXAMINATION: Chest radiograph (AP, portable), Elderly Care Unit.
CLINICAL DETAILS: 79F, drowsy episodes, ?UTI/?delirium. Confusion screen.

FINDINGS:
- Lungs clear. No consolidation, effusion or pneumothorax.
- Heart size at the upper limit of normal for an AP projection.
- Degenerative change in the thoracic spine. No acute bony abnormality.

IMPRESSION:
No acute cardiopulmonary abnormality. No radiographic support for a chest
source of the presentation.`,
  },
  {
    kind: "report",
    id: "ed-fall-001",
    encounterId: "enc-ed-fall",
    title: "ED Attendance — Summary (Fall)",
    type: "ED Visit Summary",
    department: "Emergency Department",
    author: "Marsh, Elliot, MD",
    signedAt: "26/06/2026",
    body: `EMERGENCY DEPARTMENT ATTENDANCE — SUMMARY

Presenting complaint: mechanical fall at home with minor head injury.

HPI: 79F tripped over a rug at home this morning and banged the left side of
her head on a sideboard. Attended with her daughter. She cannot clearly
remember hitting the ground; no seizure activity witnessed. No vomiting in
the department. Walking independently with her stick on arrival.

Medications include APIXABAN 5 mg BD for atrial fibrillation.

Examination: GCS 15 throughout. Small LEFT parietal scalp haematoma, no
laceration, no boggy swelling. Pupils equal and reactive. No focal
neurological deficit. Cervical spine non-tender, full range of movement.
Obs normal.

Investigations: none performed. No CT indicated — GCS 15, no vomiting, no
focal deficit.

Impression: mechanical fall, minor head injury — no concerns. Scalp haematoma
only.

Disposition: discharged home with her daughter. Head injury advice leaflet
given. GP to follow up. Advised to return if drowsiness, vomiting, worsening
headache, weakness or confusion.`,
  },
  {
    kind: "letter",
    id: "gp-fall-fu-001",
    encounterId: "enc-gp-fall-fu",
    title: "Primary Care — Post-Fall Telephone Review",
    type: "Letter",
    department: "Primary Care",
    author: "Byrne, Colm, MD",
    signedAt: "30/06/2026",
    body: `Dear colleague,

Telephone review following Mrs Marchant's fall and ED attendance on 26/06.
I spoke with her and with her daughter Susan.

The scalp bruise is settling. Susan feels her mother has been quieter and
more tired than usual since the fall, napping in the afternoons, with an
occasional headache managed with paracetamol. Mrs Marchant herself says she
is "just a bit shaken up". No vomiting reported at the time of the call, no
weakness described, eating and drinking adequately.

I have attributed this to the general upset of the fall and to the bruising,
and advised rest and regular review. Safety-netting reiterated to Susan:
seek urgent same-day review if she becomes more drowsy or confused, vomits,
develops a worsening headache, or any weakness — mindful that she takes
apixaban.

Kind regards,
Dr C. Byrne`,
  },
  {
    kind: "order",
    id: "refill-apixaban-001",
    encounterId: "enc-refill-apixaban",
    title: "Repeat Prescription — Apixaban",
    type: "Medication Order",
    department: "Primary Care",
    author: "Byrne, Colm, MD",
    signedAt: "18/06/2026",
    body: `REPEAT PRESCRIPTION (issued electronically to community pharmacy)

Drug: Apixaban 5 mg tablets
Directions: Take ONE tablet TWICE daily.
Quantity: 56 tablets (4 weeks).
Indication: Stroke prevention in atrial fibrillation.

Last issue: 21/05/2026. Compliance good per pharmacy record (dosette box).
Dose criteria for 5 mg BD reviewed 21/04/2026 — still met (one criterion only:
weight 56 kg; age <80, creatinine <133). Annual anticoagulation review done
04/2026; next due 04/2027.`,
  },
  {
    kind: "letter",
    id: "gp-anticoag-review-001",
    encounterId: "enc-anticoag-review",
    title: "Primary Care — AF / Anticoagulation Annual Review",
    type: "Letter",
    department: "Primary Care",
    author: "Byrne, Colm, MD",
    signedAt: "21/04/2026",
    body: `Dear colleague,

Annual atrial fibrillation and anticoagulation review for Mrs Marchant.

She remains in AF, rate-controlled on bisoprolol 2.5 mg (resting HR 70s). No
palpitations, syncope or heart failure symptoms. CHA2DS2-VASc score 4 (age,
hypertension, female sex); HAS-BLED 2. Renal function checked today —
creatinine 82, eGFR 61 — apixaban 5 mg BD remains the correct dose (only one
dose-reduction criterion met: weight 56 kg).

We discussed her falls history. I explained that falls alone are NOT a reason
to stop anticoagulation — the stroke-prevention benefit outweighs the bleeding
risk for the great majority of older people who fall — but that any fall with
a HEAD INJURY needs prompt medical assessment precisely because she is
anticoagulated. She and her daughter were happy with this.

Plan: continue apixaban 5 mg BD and bisoprolol. Repeat U&E and review in 12
months, sooner if intercurrent illness.

Kind regards,
Dr C. Byrne`,
  },
  {
    kind: "letter",
    id: "gp-falls-001",
    encounterId: "enc-gp-falls",
    title: "Primary Care — Falls Review",
    type: "Letter",
    department: "Primary Care",
    author: "Byrne, Colm, MD",
    signedAt: "10/11/2025",
    body: `Dear colleague,

Falls review following a trip in the garden last month (no head injury, soft
tissue bruising to the hip only).

Mrs Marchant reports two falls in the past year, both trips over obstacles
rather than dizziness or blackouts. No syncope, no presyncope, no new
neurology. Lying and standing blood pressures acceptable (no significant
postural drop on today's readings). Medication reviewed — no culprit
sedatives.

Plan:
- Referral to the community strength and balance programme.
- Walking stick provided and height checked; footwear advice given.
- Bone health: continue colecalciferol; DEXA requested.
- Home hazard review by occupational therapy (rugs discussed, patient
  reluctant to part with them).

Kind regards,
Dr C. Byrne`,
  },
  {
    kind: "letter",
    id: "cardiology-af-001",
    encounterId: "enc-cardiology-af",
    title: "Cardiology Clinic — New Atrial Fibrillation",
    type: "Letter",
    department: "Cardiology",
    author: "Fontaine, Louis, MD",
    signedAt: "12/09/2023",
    body: `Dear Dr Byrne,

Thank you for referring Mrs Marchant, who presented with palpitations and was
found to be in atrial fibrillation, confirmed as persistent AF on the 24-hour
tape.

Echocardiogram shows a structurally normal heart with preserved LV function
and a mildly dilated left atrium. Thyroid function normal.

We have adopted a rate-control strategy with bisoprolol 2.5 mg once daily.
Given her CHA2DS2-VASc score she has a clear indication for anticoagulation,
and we have started APIXABAN 5 mg twice daily today after discussing stroke
and bleeding risk. Please add this to her repeat list and include renal
function and an anticoagulation check in her annual review.

No further cardiology follow-up planned; happy to see her again if rate
control proves difficult.

Kind regards,
Mr L. Fontaine, Cardiology`,
  },
  {
    kind: "lab",
    id: "lab-bloods-admit-001",
    encounterId: "enc-bloods-admit",
    title: "Admission Bloods — FBC, U&E, CRP, Calcium, Glucose, Clotting",
    status: "Final",
    specimen: "Blood (serum + EDTA + citrate), venepuncture",
    collected: "05/07/2026 19:40",
    received: "05/07/2026 19:58",
    reportedAt: "05/07/2026 20:55",
    orderedBy: "Kaur, Simran, MD (Emergency Medicine)",
    resultingLab: "LegendCare Clinical Laboratory, Mount Verdant Hospital",
    rows: admissionLabRows,
  },
  {
    kind: "lab",
    id: "lab-bloods-gp-001",
    encounterId: "enc-bloods-gp",
    title: "Anticoagulation Review — U&E, FBC, LFTs",
    status: "Final",
    specimen: "Blood (serum + EDTA), venepuncture",
    collected: "21/04/2026 09:15",
    received: "21/04/2026 09:31",
    reportedAt: "21/04/2026 10:02",
    orderedBy: "Byrne, Colm, MD (Primary Care)",
    resultingLab: "LegendCare Clinical Laboratory, Mount Verdant Hospital",
    rows: [
      { test: "Hb", value: "124", units: "g/L", range: "115–165", flag: "" },
      { test: "Platelets", value: "241", units: "x10⁹/L", range: "150–400", flag: "" },
      { test: "Sodium", value: "138", units: "mmol/L", range: "135–145", flag: "" },
      { test: "Potassium", value: "4.4", units: "mmol/L", range: "3.5–5.3", flag: "" },
      { test: "Urea", value: "6.8", units: "mmol/L", range: "2.5–7.8", flag: "" },
      { test: "Creatinine", value: "82", units: "µmol/L", range: "45–90", flag: "" },
      { test: "eGFR", value: "61", units: "mL/min/1.73m²", range: ">60", flag: "" },
      { test: "Bilirubin", value: "9", units: "µmol/L", range: "<21", flag: "" },
      { test: "ALT", value: "22", units: "U/L", range: "<40", flag: "" },
      { test: "Albumin", value: "39", units: "g/L", range: "35–50", flag: "" },
    ],
  },
  {
    kind: "micro",
    id: "micro-urine-001",
    encounterId: "enc-micro-urine",
    title: "Urine Culture (MSU)",
    status: "Preliminary",
    specimen: "Urine (MSU)",
    collected: "05/07/2026 19:50",
    received: "05/07/2026 20:35",
    reportedAt: "06/07/2026 — 24 hour read",
    organisms: [],
    resultText: `URINE CULTURE (MSU) — PRELIMINARY

Microscopy: WCC 40 x10⁶/L (borderline); epithelial cells +++ — suggests
perineal contamination of the sample.

Culture at 24 hours: MIXED GROWTH of 3 organism types, each <10⁵ cfu/mL.
Most consistent with CONTAMINATION. This result does NOT support a diagnosis
of urinary tract infection.

Comment: asymptomatic bacteriuria and positive leucocyte dipsticks are common
in women over 65 and are not by themselves evidence of UTI. In an older
patient with confusion or drowsiness, please look for another cause before
attributing the presentation to urine. Repeat sample only if genuine urinary
symptoms or signs of sepsis develop.

Final report to follow at 48 hours.`,
  },
];

/** Note-kind documents only — feeds the Notes activity and Chart Review > Notes. */
export const caseSubdural001Notes = caseSubdural001Documents.filter(
  (doc): doc is Extract<ClinicalDocument, { kind: "note" }> => doc.kind === "note",
);
