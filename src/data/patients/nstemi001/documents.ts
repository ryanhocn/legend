import type { ClinicalDocument, LabFlag, LabRow } from "../../../types";
import { bloods } from "./bloods";

/** SI units for the admission panel, keyed by `bloods` test name. */
const ADMISSION_LAB_UNITS: Record<string, string> = {
  Hb: "g/L",
  WCC: "x10⁹/L",
  Platelets: "x10⁹/L",
  CRP: "mg/L",
  Sodium: "mmol/L",
  Potassium: "mmol/L",
  Urea: "mmol/L",
  Creatinine: "µmol/L",
  eGFR: "mL/min/1.73m²",
  "Glucose (random)": "mmol/L",
  HbA1c: "mmol/mol",
  "hs-Troponin T": "ng/L",
  "Total cholesterol": "mmol/L",
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
 * Single source of truth for the synthetic NSTEMI case (Bennett, Sandra, 57F):
 * every clinical document, note-kind and report-kind, in one list. Both views
 * derive from it — the Notes activity (and Chart Review > Notes sub-tab) filter
 * to `kind: "note"`, while the Encounters timeline resolves each row's primary
 * document by `encounterId`.
 *
 * Note-kind documents drive the Notes/Trans browser: category tabs filter by
 * `category`, "Admission" by the `admission` flag and "Incomplete" by `status`.
 * The list sorts by `timestamp`. Report-kind documents (letters, ECGs, orders,
 * the admission summary) are reached only via their encounter row.
 *
 * CASE SHAPE — an NSTEMI anchored as DYSPEPSIA for the learner to unpick:
 *  - "Indigestion": exertional epigastric burning + nausea + clamminess in a
 *    57F diabetic — an anginal equivalent, mislabelled GORD from triage onward.
 *  - The chart contradicts the label: hs-troponin 38 -> 612 overnight (a
 *    dynamic rise a stable CKD elevation cannot explain), T-wave inversion
 *    V4–V6 deepening on the repeat ECG, an exertional pattern already sitting
 *    in the GP letter of 15/06, and a heavy risk profile (T2DM, HTN,
 *    hyperlipidaemia, 20 pack-years, father's MI at 54).
 *  - Latent / system-factor hooks (NOT individual blame): the 612 troponin
 *    resulted at 01:12 and was never actioned — the night SHO's review draft
 *    ("chase troponin") was interrupted and never completed; the clerking plan
 *    says "load aspirin 300 mg" against a documented ASPIRIN ALLERGY
 *    (angioedema + bronchospasm); the same plan reaches for fondaparinux with
 *    an eGFR of 28 (AKI on CKD) and continues metformin. Pharmacy flags all
 *    three this morning; no doctor has acted on any of them.
 *  - Deliberately NOT the cholangitis texture: apyrexial, CRP 4, no jaundice —
 *    the epigastric pain here is cardiac, not biliary.
 *
 * All content is fabricated for education and simulation only. Not for clinical use.
 */
export const caseNstemi001Documents: ClinicalDocument[] = [
  {
    kind: "note",
    id: "note-hp-001",
    encounterId: "enc-admission",
    category: "H&P",
    noteType: "H&P",
    author: "Fletcher, Daniel",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "(A) General Medicine — AMU",
    dateOfService: "05/07/26 2045",
    fileTime: "05/07/26 2132",
    timestamp: 1783284300,
    status: "signed",
    admission: true,
    body: `GENERAL MEDICINE ADMISSION CLERKING
Admission Date: 05/07/2026 — PCP: Byrne, Eleanor, MD

CC: "Indigestion" — epigastric burning with nausea, worse on exertion.

HISTORY OF PRESENT ILLNESS:
Sandra Bennett is a 57-year-old woman with ~3 weeks of "indigestion": a central
epigastric / lower retrosternal BURNING that comes on when she walks up the hill
to the bus stop and settles within a few minutes of rest. Seen by her GP on
15/06 and started on lansoprazole for presumed reflux, with little change. This
evening the burning came on walking in from the hospital car park, lasted ~40
minutes AT REST, with nausea and clamminess. It settled in ED after Gaviscon.
No vomiting, no dysphagia, no weight loss, no melaena. No jaundice, no fever.

PAST MEDICAL HISTORY:
- Type 2 diabetes mellitus (2018)
- Essential hypertension
- Hyperlipidaemia
- CKD 3a — eGFR 52 at annual review 14/04/2026 (declining; ACR 12.6)
- Ex-smoker, ~20 pack-years (stopped 2024)

FAMILY HISTORY:
- Father died of a myocardial infarction aged 54.

ALLERGIES:
- ASPIRIN — facial swelling (angioedema) and wheeze, 2019.

MEDICATIONS (on admission):
- Metformin 1 g PO BD
- Ramipril 5 mg PO OD
- Amlodipine 5 mg PO OD
- Atorvastatin 40 mg PO ON
- Lansoprazole 30 mg PO OD (started 15/06/2026 for "indigestion")

EXAMINATION:
- Comfortable at rest, warm, no pallor now. Not jaundiced.
- Obs: T 36.7, HR 88, BP 154/92, RR 16, SpO2 97% RA. NEWS2 = 0.
- Abdomen soft, non-tender — the pain is NOT reproducible on palpation.
- Chest clear, heart sounds normal, no murmur, no oedema.

INVESTIGATIONS:
- ECG (18:40): sinus rhythm, T-wave inversion 1–2 mm V4–V6 — read as
  "non-specific"; no prior available in ED for comparison.
- hs-Troponin T 38 (ref <14) — borderline; ED felt this may reflect CKD.
- Creatinine 168, eGFR 28 (baseline 52 in April) — ?dehydration, recheck.
- Glucose 13.4, HbA1c 61. WCC 9.2, CRP 4 — no inflammatory response.

IMPRESSION:
1. Epigastric pain, most likely dyspepsia / gastritis — settled with Gaviscon.
2. ?ACS — LOW suspicion: burning character, previous negative workup (11/2025),
   troponin only mildly raised (?renal). Serial troponin to complete pathway.
3. AKI on CKD — likely poor intake; encourage oral fluids.

PLAN:
1. Gaviscon PRN; continue lansoprazole 30 mg OD.
2. Repeat troponin and U&E at 23:50 (6 h sample); repeat ECG in the morning.
3. If repeat troponin elevated: load aspirin 300 mg PO, start fondaparinux
   2.5 mg SC per ACS pathway, and refer cardiology.
4. Continue regular medications, including metformin.
5. Encourage oral fluids; recheck renal function with the 23:50 bloods.
6. Home in the morning if troponin stable and pain-free. VTE assessment done.`,
  },
  {
    kind: "note",
    id: "note-ed-001",
    encounterId: "enc-ed",
    category: "ED Notes",
    noteType: "ED Provider Note",
    author: "Kowalski, Marek",
    credential: "MD",
    authorRole: "*PHYSICIAN: FACULTY",
    service: "Emergency Department",
    dateOfService: "05/07/26 1910",
    fileTime: "05/07/26 1944",
    timestamp: 1783278600,
    status: "signed",
    admission: true,
    urgent: true,
    body: `EMERGENCY DEPARTMENT PROVIDER NOTE

Presenting complaint: "indigestion" — epigastric burning and nausea.

HPI: 57F, burning epigastric / lower chest discomfort that started walking in
from the car park, with nausea and feeling "clammy and awful". Similar but
briefer episodes over ~3 weeks, mostly when walking uphill; on lansoprazole
from the GP since 15/06 with little benefit. Settled over ~40 minutes here
after Gaviscon at triage.

Background: T2DM, hypertension, hyperlipidaemia, ex-smoker. ALLERGY: aspirin
(facial swelling). Attended in 11/2025 with post-prandial epigastric
discomfort — normal ECG and negative troponin then, discharged as dyspepsia.

O/E: comfortable after Gaviscon. Abdomen soft, mild epigastric fullness, no
tenderness, no guarding. Chest clear. Obs unremarkable apart from BP 158/94.

Investigations:
- ECG: sinus rhythm, T-wave inversion 1–2 mm V4–V6. Likely non-specific; no
  prior ECG available in the department for comparison.
- Bloods: hs-troponin 38 (ref <14) — borderline, may reflect her renal
  impairment (creatinine 168). WCC and CRP normal. Glucose 13.4.

Impression: epigastric pain, most likely GORD / gastritis — symptoms settled
with antacid. ACS thought unlikely, but troponin above cut-off so cannot be
signed off from ED: admit General Medicine for a serial troponin at 6 hours
and morning review. Advised the admitting team of the aspirin allergy.`,
  },
  {
    kind: "note",
    id: "note-triage-001",
    encounterId: "enc-triage",
    category: "ED Notes",
    noteType: "ED Triage Note",
    author: "Hughes, Bronwen",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "Emergency Department",
    dateOfService: "05/07/26 1810",
    fileTime: "05/07/26 1824",
    timestamp: 1783275000,
    status: "signed",
    admission: true,
    urgent: true,
    body: `ED TRIAGE NOTE

57F self-presented: "indigestion and feeling sick". Burning behind the lower
chest / upper tummy that came on walking from the car park. Pale and clammy on
arrival, settled after sitting. States she has had the same "indigestion" for
a few weeks when walking up hills.

Obs: T 36.8, HR 92, BP 158/94, RR 18, SpO2 97% RA. NEWS2 = 1.
Allergy band applied: ASPIRIN.

Gaviscon 10 mL given at triage with relief. ECG requested per the
chest-discomfort pathway and bloods taken. Triage category: Standard.
Moved to ambulatory area to await review.`,
  },
  {
    kind: "note",
    id: "note-nurse-001",
    encounterId: "enc-admission",
    category: "Nursing",
    noteType: "Nursing Admission Assessment",
    author: "Adeboye, Grace",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "(A) General Medicine — AMU",
    dateOfService: "05/07/26 2115",
    fileTime: "05/07/26 2141",
    timestamp: 1783286100,
    status: "signed",
    admission: true,
    body: `NURSING ADMISSION ASSESSMENT

57F admitted to AMU Bay 7 from ED with epigastric pain for serial troponin.

Obs on arrival: T 36.7, HR 88, BP 154/92, RR 16, SpO2 97% RA. NEWS2 = 0.
Pain score 0/10 at present. Aspirin allergy band checked and present.

Risk assessments: falls — low; pressure areas — low; VTE — completed by
medical team. One peripheral cannula (20G, right forearm) in situ, patent.
Capillary glucose 13.9 — diabetic, on metformin; CBG monitoring commenced.
Patient settled, anxious to be home tomorrow for work. Call bell within reach;
advised to report ANY return of the indigestion feeling immediately.`,
  },
  {
    kind: "note",
    id: "note-nurse-002",
    encounterId: "enc-admission",
    category: "Nursing",
    noteType: "Nursing Shift Note",
    author: "Petrova, Elena",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "(A) General Medicine — AMU",
    dateOfService: "06/07/26 0010",
    fileTime: "06/07/26 0031",
    timestamp: 1783296600,
    status: "signed",
    body: `NURSING SHIFT NOTE (Night)

23:30 — patient called: "the indigestion is back", burning central chest /
epigastrium with nausea, looked pale and sweaty. HR 104, BP 148/86, SpO2 96%.
Gaviscon 10 mL given as charted; settled over ~20 minutes.

23:50 — scheduled 6-hour bloods taken while cannula accessed (troponin + U&E
as per clerking plan) and sent. Night SHO (Dr Nair) informed of the episode at
23:55 — will review; currently with an unwell patient on Ward 9.

00:05 — pain free, obs back to baseline (HR 90, BP 142/84). Will continue
half-hourly obs for 2 hours then 4-hourly if stable.`,
  },
  {
    kind: "note",
    id: "note-night-001",
    encounterId: "enc-admission",
    category: "Progress",
    noteType: "Night Review",
    author: "Nair, Priya",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "(A) General Medicine — AMU",
    dateOfService: "06/07/26 0040",
    fileTime: "—",
    timestamp: 1783298400,
    status: "incomplete",
    body: `NIGHT REVIEW (DRAFT)

Asked to review re: further episode of "indigestion" at 23:30 — central
burning + nausea, pale and clammy per nursing staff. Settled with Gaviscon by
the time of my review. Obs back to baseline, chest clear, abdomen soft.

Two episodes now within 6 hours, the first on minimal exertion and this one at
rest. Working label is dyspepsia but ***ACS is not excluded — do not discharge
on the morning round until the 23:50 troponin is reviewed***

***chase 23:50 troponin + U&E — pending at time of this review***
***repeat ECG in the morning and compare with the 18:40 ED trace***
***if troponin has risen: this is NOT dyspepsia — treat as ACS; NB aspirin
allergy on the band, and check renal function before any anticoagulant***

[Called away to an unwell patient on Ward 9 — draft not completed or signed.]`,
  },
  {
    kind: "note",
    id: "note-nurse-003",
    encounterId: "enc-admission",
    category: "Nursing",
    noteType: "Nursing Shift Note",
    author: "Petrova, Elena",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "(A) General Medicine — AMU",
    dateOfService: "06/07/26 0715",
    fileTime: "06/07/26 0726",
    timestamp: 1783322100,
    status: "signed",
    body: `NURSING SHIFT NOTE (Night summary / handover)

Settled night after the 23:30 episode (see earlier note). No further pain.
Obs stable throughout, NEWS2 = 0 since 01:00. Slept from ~01:30.

Repeat bloods from 23:50 RESULTED overnight — on the system for day-team
review; night SHO did not get back to the ward (busy shift). Repeat ECG done
at 06:45 by the cardiac physiologist and filed.

06:00 CBG 11.8. Morning medications given at 08:05 as charted, including
metformin. Patient ate breakfast, feels well, keen to go home this morning —
asking when the doctors will round.`,
  },
  {
    kind: "note",
    id: "note-pharm-001",
    encounterId: "enc-admission",
    category: "Progress",
    noteType: "Best Poss Rx Hx",
    author: "Whitworth, Josephine",
    credential: "PharmD",
    authorRole: ".PHARMACIST",
    service: "Pharmacy",
    dateOfService: "06/07/26 0840",
    fileTime: "06/07/26 0903",
    timestamp: 1783327200,
    status: "signed",
    admission: true,
    body: `BEST POSSIBLE MEDICATION HISTORY

Sources: patient interview, GP summary, community pharmacy record (2 sources).

Regular medications confirmed:
- Metformin 1 g PO BD — eGFR now 28 (AKI on CKD): recommend HOLD (lactic
  acidosis risk; also relevant if contrast angiography is being considered).
  NB still on the chart — given this morning at 08:05.
- Ramipril 5 mg PO OD — recommend hold while AKI; review with renal trend.
- Amlodipine 5 mg PO OD — continue.
- Atorvastatin 40 mg PO ON — continue.
- Lansoprazole 30 mg PO OD (started 15/06/2026 for "indigestion").

Allergy: ASPIRIN — angioedema (facial swelling) and bronchospasm, 2019.
Confirmed with the patient; she carries this on a pharmacy alert card.

PRESCRIBING FLAGS FOR THE DAY TEAM:
1. The clerking plan states "if repeat troponin elevated: load aspirin 300 mg"
   — CONTRAINDICATED against the documented aspirin allergy. If antiplatelet
   loading is needed, use clopidogrel 300 mg per the allergy pathway (or as
   cardiology advise).
2. The same plan lists fondaparinux 2.5 mg per the ACS pathway. eGFR is 28 and
   falling (27 on the 23:50 sample): fondaparinux needs caution in severe
   renal impairment — recommend discussing dose-adjusted enoxaparin (or
   unfractionated heparin) with cardiology rather than defaulting to pathway
   dosing.
3. Unable to confirm whether the repeat troponin has been reviewed — flagged
   to the nurse in charge.`,
  },
  {
    kind: "encounterSummary",
    id: "admission-encounter-001",
    encounterId: "enc-admission",
    title: "Admission — ED to Hosp-Admission",
    type: "Hospital Encounter",
    department: "General Medicine",
    author: "Adeyemi, Folake, MD (Attending)",
    signedAt: "05/07/2026 21:05",
    body: `ADMISSION  [Current]
05/07/2026 21:05 — present       Mount Verdant Hospital
Admitting / Attending: Adeyemi, Folake, MD — General Medicine

PRINCIPAL PROBLEM:
Epigastric pain — ?dyspepsia; troponin above cut-off, under serial testing.

ENCOUNTER NOTES:
- ED Provider Note — Kowalski, Marek, MD (Emergency Medicine)
- Admission Clerking — Fletcher, Daniel, MD (General Medicine)

HOSPITAL PROBLEM LIST:
◆ Epigastric pain ?cause — dyspepsia vs ACS — PRINCIPAL
- hs-Troponin T 38 on admission (repeat pending at clerking)
- AKI on CKD 3a (creatinine 168, eGFR 28; baseline 52 in 04/2026)
- Type 2 diabetes mellitus
- Essential hypertension
- Hyperlipidaemia

CARE TIMELINE:
18:10  Arrived in ED (self-presented); Gaviscon at triage
18:40  ECG — T-wave inversion V4–V6, read as non-specific
19:10  Seen by ED provider; troponin 38 — admit for serial testing
21:05  Admitted — General Medicine, AMU Bay 7

EXPECTED MEDICATION LIST:
- Gaviscon Advance 10 mL PO QDS PRN
- Lansoprazole 30 mg PO OD
- Metformin 1 g PO BD — on chart (pharmacy recommend HOLD, eGFR 28)
- Ramipril 5 mg PO OD — pharmacy recommend hold while AKI
- Amlodipine 5 mg PO OD
- Atorvastatin 40 mg PO ON
- GTN spray 400 micrograms SL PRN — charted, not yet given
- Paracetamol 1 g PO QDS PRN

ALLERGIES: Aspirin — angioedema and bronchospasm.
CODE STATUS: For escalation. ISOLATION: None.

All patient data are synthetic. For education and simulation only. Not for clinical use.`,
  },
  {
    kind: "report",
    id: "ecg-repeat-001",
    encounterId: "enc-ecg-repeat",
    title: "12-Lead ECG — Repeat (AM)",
    type: "Diagnostic Cardiology Report",
    department: "Cardiac Physiology",
    author: "Lindqvist, Erik, MD (Cardiology)",
    signedAt: "06/07/2026 08:05",
    body: `12-LEAD ECG — REPEAT (requested by night team, performed 06:45)

Rate 86 bpm, sinus rhythm. PR 168 ms, QRS 92 ms, QTc 438 ms. Normal axis.

FINDINGS:
- T-wave inversion V3–V6, now 3–4 mm deep (05/07 18:40 trace: 1–2 mm, V4–V6
  only). Flattened T waves in I and aVL.
- No ST-segment elevation. No pathological Q waves. No LBBB.

COMPARISON: dynamic and progressive T-wave change against the trace of
05/07/2026 18:40. For reference, the ED ECG of 03/11/2025 was normal — these
changes are NEW since then.

IMPRESSION:
Deepening anterolateral T-wave inversion — in the clinical context this is
consistent with evolving myocardial ischaemia and should NOT be read as
non-specific. Recommend urgent clinical review, correlation with the serial
troponin, and cardiology referral.`,
  },
  {
    kind: "report",
    id: "ecg-ed-001",
    encounterId: "enc-ecg-ed",
    title: "12-Lead ECG — ED",
    type: "Diagnostic Cardiology Report",
    department: "Emergency Department",
    author: "Lindqvist, Erik, MD (Cardiology — overread)",
    signedAt: "06/07/2026 07:55 (overread of 05/07/2026 18:40 trace)",
    body: `12-LEAD ECG — ED PRESENTATION (05/07/2026 18:40)

Rate 92 bpm, sinus rhythm. PR 164 ms, QRS 90 ms, QTc 432 ms. Normal axis.

FINDINGS:
- T-wave inversion 1–2 mm in V4–V6. No ST elevation, no Q waves, no LBBB.
- Automated interpretation at the time: "non-specific T-wave abnormality" —
  accepted at ED review, with no prior trace available in the department.

CARDIOLOGY OVERREAD (routine next-morning batch):
The previous ECG on file (03/11/2025, ED) was normal. Lateral T-wave
inversion is therefore NEW, and in a diabetic patient with exertional
epigastric symptoms it should be treated as ischaemic until proven otherwise
— correlate with serial troponins and repeat the ECG with any further pain.`,
  },
  {
    kind: "letter",
    id: "gp-indigestion-001",
    encounterId: "enc-gp-indigestion",
    title: "Primary Care Review — 'Indigestion'",
    type: "Letter",
    department: "Primary Care",
    author: "Byrne, Eleanor, MD",
    signedAt: "15/06/2026",
    body: `Dear colleague,

I reviewed Mrs Bennett regarding ~3 weeks of "indigestion". She describes a
central burning behind the lower breastbone and upper abdomen which, on close
questioning, comes on when she walks up the hill to the bus stop and settles
within a few minutes of standing still. It is sometimes worse after a heavy
meal. There is occasional nausea with it. No vomiting, no dysphagia, no
weight loss.

Given her diabetes, hypertension and family history I did consider a cardiac
cause. Examination today was normal (BP 150/90, HR 84 regular, chest clear)
and the burning quality is in keeping with reflux, so I have started
lansoprazole 30 mg each morning and asked her to book an ECG with our
healthcare assistant this week (not yet done at the time of writing) and
review in 3 weeks.

Safety-netting given clearly: any discomfort at rest, sweating, breathlessness
or spread to the arm or jaw — call 999, do not wait for us.

Kind regards,
Dr E. Byrne`,
  },
  {
    kind: "letter",
    id: "gp-diabetes-001",
    encounterId: "enc-diabetes-review",
    title: "Primary Care — Annual Diabetes Review",
    type: "Letter",
    department: "Primary Care",
    author: "Byrne, Eleanor, MD",
    signedAt: "14/04/2026",
    body: `Dear colleague,

Annual diabetes review for Mrs Bennett (T2DM since 2018).

Results: HbA1c 61 mmol/mol (57 last year). Creatinine 98, eGFR 52 — down from
61 twelve months ago; urine ACR 12.6 mg/mmol. BP 148/88 on ramipril and
amlodipine. Total cholesterol 5.8 on atorvastatin 40 mg. Weight 87 kg, BMI 31.
Ex-smoker (~20 pack-years, stopped 2024). Family history: her father died of a
myocardial infarction aged 54. Her calculated cardiovascular risk is high.

Feet: pulses present, sensation intact. Retinal screening up to date.

Plan agreed:
- Continue metformin 1 g BD; renal function to be rechecked in 6 months — the
  dose will need review if eGFR declines further.
- Early diabetic nephropathy: continue ramipril; monitor ACR.
- Reinforced statin adherence and dietary advice; declined dietitian referral.
- BP target discussed; will uptitrate if home readings remain above target.

Kind regards,
Dr E. Byrne`,
  },
  {
    kind: "letter",
    id: "gp-htn-001",
    encounterId: "enc-htn-review",
    title: "Primary Care — Hypertension Review",
    type: "Letter",
    department: "Primary Care",
    author: "Byrne, Eleanor, MD",
    signedAt: "10/07/2025",
    body: `Dear colleague,

Hypertension review for Mrs Bennett. Clinic BP 152/92 with similar home
readings on ramipril 5 mg alone, so we have added amlodipine 5 mg each
morning. She reports no chest pain, breathlessness or palpitations; she does
mention she is "not as fit as she was" and avoids the hill by taking the bus.

Examination: HR 78 regular, heart sounds normal, chest clear, no oedema.

Plan:
- Add amlodipine 5 mg OD; recheck BP and U&E in 4 weeks.
- Annual bloods with the diabetes review as scheduled.
- Lifestyle advice reinforced; she remains an ex-smoker.

Kind regards,
Dr E. Byrne`,
  },
  {
    kind: "order",
    id: "refill-metformin-001",
    encounterId: "enc-refill-metformin",
    title: "Repeat Prescription — Metformin",
    type: "Medication Order",
    department: "Primary Care",
    author: "Byrne, Eleanor, MD",
    signedAt: "05/06/2026",
    body: `REPEAT PRESCRIPTION (issued electronically to community pharmacy)

Drug: Metformin 500 mg tablets
Directions: Take TWO tablets twice daily with food.
Quantity: 224 tablets (8 weeks).
Indication: Type 2 diabetes mellitus.

Last issue: 10/04/2026. Compliance good per pharmacy record. eGFR 52 at the
April review — renal function due for recheck; dose to be reviewed if it
declines further.`,
  },
  {
    kind: "order",
    id: "refill-statin-001",
    encounterId: "enc-refill-statin",
    title: "Repeat Prescription — Atorvastatin",
    type: "Medication Order",
    department: "Primary Care",
    author: "Byrne, Eleanor, MD",
    signedAt: "12/05/2026",
    body: `REPEAT PRESCRIPTION (issued electronically to community pharmacy)

Drug: Atorvastatin 40 mg tablets
Directions: Take ONE tablet at night.
Quantity: 56 tablets (8 weeks).
Indication: Hyperlipidaemia / high cardiovascular risk (QRISK).

Last issue: 17/03/2026. Compliance good per pharmacy record. No reported
myalgia. Lipids reviewed at the April diabetes review.`,
  },
  {
    kind: "order",
    id: "refill-ramipril-001",
    encounterId: "enc-refill-ramipril",
    title: "Repeat Prescription — Ramipril",
    type: "Medication Order",
    department: "Primary Care",
    author: "Byrne, Eleanor, MD",
    signedAt: "12/05/2026",
    body: `REPEAT PRESCRIPTION (issued electronically to community pharmacy)

Drug: Ramipril 5 mg capsules
Directions: Take ONE capsule each morning.
Quantity: 56 capsules (8 weeks).
Indication: Essential hypertension; renoprotection (diabetic nephropathy).

Last issue: 17/03/2026. Compliance good per pharmacy record. U&E due with the
next annual bloods. No cough reported.`,
  },
  {
    kind: "report",
    id: "ed-2025-001",
    encounterId: "enc-ed-2025",
    title: "ED Attendance — Summary",
    type: "ED Visit Summary",
    department: "Emergency Department",
    author: "Murray, Ciaran, MD",
    signedAt: "03/11/2025",
    body: `EMERGENCY DEPARTMENT ATTENDANCE — SUMMARY

Presenting complaint: epigastric discomfort after an evening meal.

HPI: Two hours of central epigastric burning after a large evening meal. No
exertional component reported at the time. No sweating, no breathlessness.

Examination: comfortable, obs normal. Abdomen soft, mild epigastric
tenderness, no peritonism.

Investigations: ECG — normal sinus rhythm, no T-wave abnormality. Single
hs-troponin 9 (ref <14) — negative. FBC, U&E, LFTs unremarkable.

Impression: dyspepsia. Discharged with antacid advice and GP follow-up.
Safety-netted to return with pain at rest, sweating, breathlessness or
radiation to arm/jaw.

All patient data are synthetic. For education and simulation only. Not for clinical use.`,
  },
  {
    kind: "lab",
    id: "lab-bloods-admit-001",
    encounterId: "enc-bloods-admit",
    title: "Admission Bloods — FBC, U&E, Glucose, hs-Troponin T",
    status: "Final",
    specimen: "Blood (serum + EDTA), venepuncture",
    collected: "05/07/2026 18:25",
    received: "05/07/2026 18:41",
    reportedAt: "05/07/2026 19:55",
    orderedBy: "Kowalski, Marek, MD (Emergency Medicine)",
    resultingLab: "LegendCare Clinical Laboratory, Mount Verdant Hospital",
    rows: admissionLabRows,
  },
  {
    kind: "lab",
    id: "lab-bloods-trop2-001",
    encounterId: "enc-bloods-trop2",
    title: "Serial Sample — hs-Troponin T, U&E (6-hour repeat)",
    status: "Final",
    specimen: "Blood (serum), venepuncture",
    collected: "05/07/2026 23:50",
    received: "06/07/2026 00:08",
    reportedAt: "06/07/2026 01:12",
    orderedBy: "Fletcher, Daniel, MD (General Medicine)",
    resultingLab: "LegendCare Clinical Laboratory, Mount Verdant Hospital",
    rows: [
      { test: "hs-Troponin T", value: "612", units: "ng/L", range: "<14", flag: "HH" },
      { test: "Creatinine", value: "171", units: "µmol/L", range: "45–90", flag: "H" },
      { test: "eGFR", value: "27", units: "mL/min/1.73m²", range: ">60", flag: "L" },
      { test: "Potassium", value: "5.1", units: "mmol/L", range: "3.5–5.3", flag: "" },
      { test: "Sodium", value: "136", units: "mmol/L", range: "135–145", flag: "" },
    ],
  },
  {
    kind: "lab",
    id: "lab-bloods-diabetes-001",
    encounterId: "enc-bloods-diabetes",
    title: "Annual Diabetes Bloods — HbA1c, Renal, Lipids",
    status: "Final",
    specimen: "Blood (serum + EDTA) + urine, venepuncture",
    collected: "14/04/2026 09:15",
    received: "14/04/2026 09:28",
    reportedAt: "14/04/2026 09:40",
    orderedBy: "Byrne, Eleanor, MD (Primary Care)",
    resultingLab: "LegendCare Clinical Laboratory, Mount Verdant Hospital",
    rows: [
      { test: "HbA1c", value: "61", units: "mmol/mol", range: "20–41", flag: "H" },
      { test: "Creatinine", value: "98", units: "µmol/L", range: "45–90", flag: "H" },
      { test: "eGFR", value: "52", units: "mL/min/1.73m²", range: ">60", flag: "L" },
      { test: "Urine ACR", value: "12.6", units: "mg/mmol", range: "<3.0", flag: "H" },
      { test: "Total cholesterol", value: "5.8", units: "mmol/L", range: "<5.0", flag: "H" },
      { test: "LDL cholesterol", value: "3.6", units: "mmol/L", range: "<3.0", flag: "H" },
      { test: "HDL cholesterol", value: "1.0", units: "mmol/L", range: ">1.0", flag: "" },
      { test: "ALT", value: "28", units: "U/L", range: "<40", flag: "" },
    ],
  },
];

/** Note-kind documents only — feeds the Notes activity and Chart Review > Notes. */
export const caseNstemi001Notes = caseNstemi001Documents.filter(
  (doc): doc is Extract<ClinicalDocument, { kind: "note" }> => doc.kind === "note",
);
