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
  Amylase: "U/L",
  ALT: "U/L",
  Bilirubin: "µmol/L",
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
 * Single source of truth for the synthetic mesenteric ischaemia case
 * (Osborne, Frank, 77M): every clinical document, note-kind and report-kind, in
 * one list. Both views derive from it — the Notes activity (and Chart Review >
 * Notes sub-tab) filter to `kind: "note"`, while the Encounters timeline
 * resolves each row's primary document by `encounterId`.
 *
 * CASE SHAPE — acute mesenteric ischaemia anchored as GASTROENTERITIS:
 *  - Sudden severe generalised pain + ONE vomit + ONE loose stool, clerked as
 *    "?gastroenteritis / ?viral — IV fluids, stool culture".
 *  - The classic dissociation is documented on every page but never named:
 *    pain 10/10 on escalating morphine while the abdomen stays soft.
 *  - The embolic substrate hides in the history: AF with prior TIA, warfarin
 *    stopped 22/05/2026 after an epistaxis and never restarted (ED summary,
 *    GP letters, DNA'd anticoagulation review, pharmacy med rec).
 *  - Serial gases climb 2.1 -> 2.9 -> 3.6 -> 4.4 with a metabolic acidosis;
 *    the on-call review reads the lactate as "dehydration". Dark bloody stool
 *    overnight sits in a nursing note. The post-take round, told "comfortable
 *    overnight", keeps the gastroenteritis plan.
 *  - Latent / system-factor hooks (NOT individual blame): a time-pressured
 *    night shift; an anticoagulation review that was DNA'd and never rebooked;
 *    a reassuring plain film read as "normal"; analgesia titrated to comfort
 *    while the diagnosis went unchased.
 *
 * All content is fabricated for education and simulation only. Not for clinical use.
 */
export const caseMesischaemia001Documents: ClinicalDocument[] = [
  {
    kind: "note",
    id: "note-hp-001",
    encounterId: "enc-admission",
    category: "H&P",
    noteType: "H&P",
    author: "Adeoye, Tobi",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "(A) General Surgery — SAU",
    dateOfService: "05/07/26 2210",
    fileTime: "05/07/26 2248",
    timestamp: 1783289400,
    status: "signed",
    admission: true,
    body: `GENERAL SURGERY ADMISSION CLERKING
Admission Date: 05/07/2026 — PCP: Ellison, Margaret, MD

CC: Sudden severe generalised abdominal pain; one episode of vomiting and one
episode of diarrhoea.

HISTORY OF PRESENT ILLNESS:
Frank Osborne is a 77-year-old man with sudden-onset severe generalised
abdominal pain from ~16:00 today while watching television. Pain constant,
"all over", 10/10, not eased by position. One episode of vomiting (bilious)
and one loose stool shortly after onset — no blood in either at that time.
No fever, no urinary symptoms. Last normal meal lunchtime; no takeaway,
no unwell contacts, no recent travel.

PAST MEDICAL HISTORY:
- Atrial fibrillation (rate-controlled)                    2021
- TIA — full recovery, on warfarin at the time             09/2024
- Essential hypertension                                   2015
- Osteoarthritis, right knee                               2018

MEDICATIONS (per patient):
- Bisoprolol 5 mg PO OD
- Amlodipine 5 mg PO OD
- Atorvastatin 40 mg PO ON
- Paracetamol 1 g PO PRN
- Warfarin — STOPPED ~6 weeks ago after a nosebleed (per patient); not
  restarted since.

ALLERGIES: NKDA.

SOCIAL: lives with wife, independent, lifelong non-smoker, minimal alcohol.

EXAMINATION:
- Alert, in obvious pain, writhing on the trolley. Pulse irregularly irregular.
- Abdomen: SOFT. Mild generalised tenderness only, no guarding, no rebound,
  no peritonism. Bowel sounds present. No hernias, no pulsatile mass.
- PR: brown stool on glove, no melaena at time of examination.
- Chest clear; heart sounds irregular, no murmur.

INVESTIGATIONS:
- WCC 15.8, CRP 18, amylase 142 (mildly raised), creatinine 118, INR 1.0.
- VBG 18:50: pH 7.38, lactate 2.1.
- AXR: unremarkable — no obstruction, no free gas (erect CXR).
- ECG: AF, rate 118, no acute ischaemic change.

IMPRESSION:
?Viral gastroenteritis / ?non-specific abdominal pain in a 77M — vomiting +
diarrhoea with a soft abdomen. Amylase only mildly raised, against
pancreatitis. AXR against obstruction. Pain severity noted; abdomen benign.

PLAN:
1. Admit SAU, side room (contact precautions — ?infective diarrhoea).
2. IV crystalloid, antiemetic, analgesia as charted.
3. Stool culture + C. difficile screen; encourage light diet as tolerated.
4. Repeat bloods and gas with the morning round; post-take review am.`,
  },
  {
    kind: "note",
    id: "note-ed-002",
    encounterId: "enc-ed",
    category: "ED Notes",
    noteType: "ED Provider Note",
    author: "Kowalski, Marta",
    credential: "MD",
    authorRole: "*PHYSICIAN: FACULTY",
    service: "Emergency Department",
    dateOfService: "05/07/26 1940",
    fileTime: "05/07/26 2005",
    timestamp: 1783280400,
    status: "signed",
    admission: true,
    urgent: true,
    body: `EMERGENCY DEPARTMENT PROVIDER NOTE

Presenting complaint: sudden severe generalised abdominal pain, one vomit,
one loose stool.

HPI: 77M, abrupt onset ~16:00 of constant generalised abdominal pain, 10/10.
Vomited once, one loose stool. No fever, no dysuria. No previous similar pain.

On arrival: distressed with pain, pulse irregularly irregular at 116,
BP 148/86, afebrile, SpO2 96% RA.

Examination: abdomen SOFT with mild generalised tenderness only — no guarding,
no rebound, bowel sounds present. Examination notably unimpressive for the
degree of reported pain. No pulsatile mass, hernial orifices clear.

Workup:
- ECG: atrial fibrillation, rate 118, no acute ST change.
- Bloods sent; VBG lactate 2.1, pH 7.38.
- AXR + erect CXR: no obstruction, no free gas.
- Morphine 5 mg IV titrated, then a further 5 mg — pain persists 8–10/10.

Impression: ?gastroenteritis / ?non-specific abdominal pain. Not obstructed
on plain film; amylase awaited. Referred to General Surgery for admission,
analgesia and observation given pain severity and age.`,
  },
  {
    kind: "note",
    id: "note-ed-001",
    encounterId: "enc-triage",
    category: "ED Notes",
    noteType: "ED Triage Note",
    author: "Doyle, Niamh",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "Emergency Department",
    dateOfService: "05/07/26 1840",
    fileTime: "05/07/26 1852",
    timestamp: 1783279200,
    status: "signed",
    admission: true,
    urgent: true,
    body: `ED TRIAGE NOTE

77M brought in by wife with sudden "terrible pain all over my stomach" since
~16:00. Vomited once at home, one episode of diarrhoea. Writhing on the
trolley, cannot get comfortable. Pain score 10/10.

Obs: T 36.9, HR 116 IRREGULAR, BP 148/86, RR 20, SpO2 96% RA. NEWS2 = 3.
Abdomen feels soft on triage assessment.

Triage category: Very urgent. ECG done — shows AF, given to doctor. Bloods +
VBG taken, IV access sited. Analgesia requested from ED doctor.`,
  },
  {
    kind: "note",
    id: "note-nurse-001",
    encounterId: "enc-admission",
    category: "Nursing",
    noteType: "Nursing Admission Assessment",
    author: "Okoro, Chidi",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "(A) General Surgery — SAU",
    dateOfService: "05/07/26 2240",
    fileTime: "05/07/26 2305",
    timestamp: 1783291200,
    status: "signed",
    admission: true,
    body: `NURSING ADMISSION ASSESSMENT

77M admitted to SAU Side Room 1 from ED with ?gastroenteritis. Contact
precautions commenced (?infective diarrhoea) pending stool culture.

Obs on arrival: T 37.0, HR 112 irregular, BP 132/78, RR 18, SpO2 96% RA.
NEWS2 = 3. Pain 9/10 across the whole abdomen despite morphine in ED —
further dose given as charted. Abdomen soft to touch.

Risk assessments: falls — moderate (age, opioids); pressure areas (Waterlow)
— moderate; VTE — to be completed by medical team. No allergy band required
(NKDA). One peripheral cannula in situ, IV fluids running. Wife present,
updated, gone home for the night. Call bell within reach.`,
  },
  {
    kind: "note",
    id: "note-oncall-001",
    encounterId: "enc-oncall-review",
    category: "Progress",
    noteType: "On-Call Review",
    author: "Hassan, Yusuf",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "(A) General Surgery — On Call",
    dateOfService: "06/07/26 0445",
    fileTime: "06/07/26 0502",
    timestamp: 1783313100,
    status: "signed",
    body: `ON-CALL REVIEW (NIGHT)

Asked by nursing staff to review — pain 10/10 despite 20 mg morphine since
admission, patient restless and asking for more.

Obs: T 37.2, HR 118 irregular (known AF), BP 112/70, RR 22, SpO2 95% RA.
NEWS2 = 4.

Examination: abdomen remains SOFT, mild generalised tenderness, no guarding,
no rebound, bowel sounds quiet but present. Patient says the pain is "like
nothing I've ever had".

Gases: VBG 03:30 — pH 7.31, HCO3 19, BE -6, lactate 3.6 (23:30: 2.9;
admission 18:50: 2.1).

Impression: gastroenteritis with dehydration — lactate likely hypovolaemic
in the context of vomiting, diarrhoea and poor intake. Abdomen benign.

Plan:
- Further 500 mL crystalloid bolus, then continue maintenance fluids.
- Increase morphine to 10 mg 2-hourly PRN; cyclizine for nausea.
- Repeat gas with the morning bloods; day team / post-take round to review.`,
  },
  {
    kind: "note",
    id: "note-nurse-002",
    encounterId: "enc-admission",
    category: "Nursing",
    noteType: "Nursing Shift Note",
    author: "Santos, Maria",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "(A) General Surgery — SAU",
    dateOfService: "06/07/26 0520",
    fileTime: "06/07/26 0534",
    timestamp: 1783315200,
    status: "signed",
    body: `NURSING SHIFT NOTE (Night)

Difficult night. Pain has remained 9–10/10 across the whole abdomen for most
of the shift despite regular morphine — reviewed by Dr Hassan at 04:45, fluids
increased and morphine dose increased as charted. Morphine 10 mg given 04:50
with only brief effect. Patient restless, states pain is "like nothing before".

05:00 — passed a DARK STOOL MIXED WITH FRESH BLOOD, moderate amount. Sample
saved in the sluice for the day team. Dr Hassan informed by phone — advised
document and for ward round review this morning.

Obs 05:15: T 37.3, HR 122 irregular, BP 104/68, RR 22, SpO2 95% RA. NEWS2 = 5.
Continues on IV fluids. Remains in side room on contact precautions. Wife
telephoned overnight — updated that he is "being kept comfortable".`,
  },
  {
    kind: "note",
    id: "note-wr-001",
    encounterId: "enc-ward-round",
    category: "Progress",
    noteType: "Post-Take Ward Round",
    author: "Farrow, Dominic",
    credential: "MD",
    authorRole: "*PHYSICIAN: FACULTY",
    service: "(A) General Surgery — SAU",
    dateOfService: "06/07/26 0745",
    fileTime: "06/07/26 0810",
    timestamp: 1783323900,
    status: "signed",
    admission: true,
    body: `SURGICAL POST-TAKE WARD ROUND NOTE

Seen on the post-take round with the on-call team. Busy take — 14 patients.

77M admitted yesterday evening with sudden generalised abdominal pain, one
vomit and one loose stool. Clerked as ?viral gastroenteritis. Handover from
night team: comfortable overnight after additional analgesia.

Patient drowsy but rousable following overnight opioids. Abdomen soft,
mildly tender generally, no peritonism.

Obs: HR 122 irregular (known AF, on bisoprolol), BP 104/68, T 37.3.

Impression: viral gastroenteritis with dehydration.

Plan:
- Continue IV fluids; encourage oral intake / light diet as tolerated.
- Antiemetics and analgesia as charted.
- Chase stool culture; continue contact precautions.
- Morning bloods and repeat gas awaited at time of review — team to check.
- Home tomorrow if settling.`,
  },
  {
    kind: "note",
    id: "note-nurse-003",
    encounterId: "enc-admission",
    category: "Nursing",
    noteType: "Nursing Shift Note",
    author: "Okoro, Chidi",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "(A) General Surgery — SAU",
    dateOfService: "06/07/26 0845",
    fileTime: "06/07/26 0858",
    timestamp: 1783327500,
    status: "signed",
    body: `NURSING SHIFT NOTE (Early)

Took over at 07:30. Patient woke shortly after the ward round complaining of
10/10 abdominal pain again — morphine 10 mg given at 08:30 (now 40 mg in the
last 24 h). Abdomen still soft to touch. He looks grey and unwell to me.

Obs 08:40: T 37.4, HR 126 irregular, BP 98/60, RR 24, SpO2 94% RA. NEWS2 = 6.
Escalated to the surgical F1 — asked for a doctor to review this morning,
also flagged the bloody stool from the night shift (sample still in sluice)
and this morning's gas result in the notes. Awaiting review.

Nil by mouth this morning by his own choice — refusing breakfast due to pain.
IV fluids continue. Wife visiting from 10:00.`,
  },
  {
    kind: "note",
    id: "note-pharm-001",
    encounterId: "enc-admission",
    category: "Progress",
    noteType: "Best Poss Rx Hx",
    author: "Whitcombe, Eleanor",
    credential: "PharmD",
    authorRole: ".PHARMACIST",
    service: "Pharmacy",
    dateOfService: "06/07/26 0905",
    fileTime: "06/07/26 0928",
    timestamp: 1783328700,
    status: "signed",
    body: `BEST POSSIBLE MEDICATION HISTORY

Sources: patient interview, GP summary record, community pharmacy (3 sources).

Regular medications confirmed:
- Bisoprolol 5 mg PO OD (AF rate control — continued).
- Amlodipine 5 mg PO OD (hypertension — continued).
- Atorvastatin 40 mg PO ON (post-TIA secondary prevention — continued).
- Paracetamol 1 g PO PRN.

ANTICOAGULATION — FLAG TO TEAM:
- Warfarin 3 mg OD was STOPPED on 22/05/2026 after an epistaxis requiring
  ED attendance and nasal packing (INR 4.8 on the day).
- GP record: anticoagulation review booked 12/06/2026 to discuss restarting
  (or DOAC switch) — DID NOT ATTEND; no rebooking on file.
- He therefore has AF + previous TIA (CHA2DS2-VASc 5) and is currently on
  NO anticoagulation, and has been for ~6 weeks. Urgent team decision needed
  on anticoagulation this admission.

Also note: VTE prophylaxis not yet prescribed since admission — for medical
team assessment alongside the anticoagulation decision.`,
  },
  {
    kind: "note",
    id: "note-prog-001",
    encounterId: "enc-admission",
    category: "Progress",
    noteType: "Progress Note",
    author: "Nguyen, Lily",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "(A) General Surgery — SAU",
    dateOfService: "06/07/26 0935",
    fileTime: "—",
    timestamp: 1783330500,
    status: "incomplete",
    body: `PROGRESS NOTE (DRAFT)

Asked to review by nursing staff — ongoing severe pain post ward round.

***gas 07:00 now resulted: pH 7.27, BE -9, lactate 4.4 — trend from admission
   2.1 -> 2.9 -> 3.6 -> 4.4. d/w senior***
***dark stool with fresh blood overnight (nursing note 05:20) — significance?***
***pain still 10/10 on 40 mg morphine/24 h but abdomen soft — doesn't add up***
***warfarin stopped 6/52 ago, AF — see pharmacy note***

[Draft — not yet signed.]`,
  },
  {
    kind: "encounterSummary",
    id: "admission-encounter-001",
    encounterId: "enc-admission",
    title: "Admission — ED to Hosp-Admission",
    type: "Hospital Encounter",
    department: "General Surgery",
    author: "Farrow, Dominic, MD (Attending)",
    signedAt: "05/07/2026 21:45",
    body: `ADMISSION  [Current]
05/07/2026 21:45 — present       Mount Verdant Hospital
Admitting / Attending: Farrow, Dominic, MD — General Surgery

PRINCIPAL PROBLEM:
?Gastroenteritis — severe generalised abdominal pain, vomiting and diarrhoea.

ENCOUNTER NOTES:
- ED Provider Note — Kowalski, Marta, MD (Emergency Medicine)
- Admission Clerking — Adeoye, Tobi, MD (General Surgery)
- Surgical Post-Take Ward Round — Farrow, Dominic, MD (General Surgery)

HOSPITAL PROBLEM LIST:
◆ ?Viral gastroenteritis — PRINCIPAL (working label)
- Acute severe generalised abdominal pain — escalating opioid requirement
- Atrial fibrillation — warfarin STOPPED 22/05/2026, not restarted
- Previous TIA (09/2024)
- Essential hypertension
- Osteoarthritis, right knee

CARE TIMELINE:
05/07/2026 18:35  Arrived in ED (brought by wife)
05/07/2026 19:40  Seen by ED provider; referred General Surgery
05/07/2026 21:45  Admitted — General Surgery, SAU Side Room 1

EXPECTED MEDICATION LIST:
- Morphine sulfate 10 mg IV/SC 2-hourly PRN
- Cyclizine 50 mg IV TDS PRN
- Sodium chloride 0.9% IV — maintenance + boluses
- Paracetamol 1 g IV/PO QDS PRN
- Bisoprolol 5 mg PO OD
- Amlodipine 5 mg PO OD
- Atorvastatin 40 mg PO ON
- ANTICOAGULATION: NONE currently — warfarin stopped 22/05/2026 (epistaxis),
  restart never actioned. VTE prophylaxis not yet assessed.

ALLERGIES: No known drug allergies.
CODE STATUS: For escalation. ISOLATION: Contact — ?infective diarrhoea.

All patient data are synthetic. For education and simulation only. Not for clinical use.`,
  },
  {
    kind: "report",
    id: "axr-report-001",
    encounterId: "enc-axr",
    title: "AXR + Erect CXR",
    type: "Radiology Report",
    department: "Radiology",
    author: "Lindqvist, Erik, MD (Radiology)",
    signedAt: "05/07/2026 20:15",
    body: `EXAMINATION: Abdominal radiograph (supine) + erect chest radiograph, ED.
CLINICAL DETAILS: Sudden severe generalised abdominal pain, vomiting and
diarrhoea. ?obstruction ?perforation.

FINDINGS:
- Non-specific bowel gas pattern. No dilated small or large bowel loops.
- No free gas under the diaphragms on the erect chest film.
- No radio-opaque calculi. Incidental vascular calcification of the aorta
  and iliac vessels. Lung bases clear.

IMPRESSION:
No obstruction or free intraperitoneal gas.

NOTE: A normal plain film does NOT exclude mesenteric ischaemia; in the
appropriate clinical context (severe pain out of keeping with examination,
AF, rising lactate) CT ANGIOGRAPHY is the investigation of choice.`,
  },
  {
    kind: "report",
    id: "ecg-report-001",
    encounterId: "enc-ecg",
    title: "12-Lead ECG — ED",
    type: "ECG Report",
    department: "Emergency Department",
    author: "Kowalski, Marta, MD (Emergency Medicine)",
    signedAt: "05/07/2026 19:15",
    body: `12-LEAD ECG — Emergency Department

Rhythm: ATRIAL FIBRILLATION, ventricular rate 118. No P waves.
Axis: normal. QRS 92 ms. QTc 442 ms.
ST/T: no acute ST elevation or depression; no dynamic change on repeat.

Comparison (GP record, 24/03/2026): AF, rate 74 — rate-controlled on
bisoprolol at that time.

Interpretation: known AF, now with a fast ventricular response. No acute
ischaemic change. Troponin not indicated on clinical grounds — pain is
abdominal, not cardiac in character.`,
  },
  {
    kind: "lab",
    id: "lab-bloods-admit-001",
    encounterId: "enc-bloods-admit",
    title: "Admission Bloods — FBC, U&E, Amylase, LFTs, CRP",
    status: "Final",
    specimen: "Blood (serum + EDTA), venepuncture",
    collected: "05/07/2026 19:05",
    received: "05/07/2026 19:18",
    reportedAt: "05/07/2026 19:55",
    orderedBy: "Kowalski, Marta, MD (Emergency Medicine)",
    resultingLab: "LegendCare Clinical Laboratory, Mount Verdant Hospital",
    rows: admissionLabRows,
  },
  {
    kind: "lab",
    id: "lab-vbg-admit-001",
    encounterId: "enc-vbg-admit",
    title: "Venous Blood Gas — ED (18:50)",
    status: "Final",
    specimen: "Venous blood, heparinised syringe (POCT)",
    collected: "05/07/2026 18:50",
    reportedAt: "05/07/2026 18:56",
    orderedBy: "Kowalski, Marta, MD (Emergency Medicine)",
    resultingLab: "Point-of-care blood gas analyser, ED",
    rows: [
      { test: "pH", value: "7.38", units: "", range: "7.35–7.45", flag: "" },
      { test: "pCO2", value: "5.1", units: "kPa", range: "4.7–6.0", flag: "" },
      { test: "HCO3", value: "23", units: "mmol/L", range: "22–26", flag: "" },
      { test: "Base excess", value: "-1", units: "mmol/L", range: "-2 to +2", flag: "" },
      { test: "Lactate", value: "2.1", units: "mmol/L", range: "<2.0", flag: "H" },
      { test: "Glucose", value: "7.9", units: "mmol/L", range: "4.0–7.8", flag: "H" },
    ],
  },
  {
    kind: "lab",
    id: "lab-vbg-night-001",
    encounterId: "enc-vbg-night",
    title: "Venous Blood Gas — SAU (03:30)",
    status: "Final",
    specimen: "Venous blood, heparinised syringe (POCT)",
    collected: "06/07/2026 03:30",
    reportedAt: "06/07/2026 03:37",
    orderedBy: "Hassan, Yusuf, MD (General Surgery, on call)",
    resultingLab: "Point-of-care blood gas analyser, SAU",
    rows: [
      { test: "pH", value: "7.31", units: "", range: "7.35–7.45", flag: "L" },
      { test: "pCO2", value: "4.4", units: "kPa", range: "4.7–6.0", flag: "L" },
      { test: "HCO3", value: "19", units: "mmol/L", range: "22–26", flag: "L" },
      { test: "Base excess", value: "-6", units: "mmol/L", range: "-2 to +2", flag: "L" },
      { test: "Lactate", value: "3.6", units: "mmol/L", range: "<2.0", flag: "H" },
      { test: "Glucose", value: "8.4", units: "mmol/L", range: "4.0–7.8", flag: "H" },
    ],
  },
  {
    kind: "lab",
    id: "lab-vbg-morning-001",
    encounterId: "enc-vbg-morning",
    title: "Venous Blood Gas — SAU (07:00)",
    status: "Final",
    specimen: "Venous blood, heparinised syringe (POCT)",
    collected: "06/07/2026 07:00",
    reportedAt: "06/07/2026 07:20",
    orderedBy: "Hassan, Yusuf, MD (General Surgery, on call)",
    resultingLab: "Point-of-care blood gas analyser, SAU",
    rows: [
      { test: "pH", value: "7.27", units: "", range: "7.35–7.45", flag: "LL" },
      { test: "pCO2", value: "4.1", units: "kPa", range: "4.7–6.0", flag: "L" },
      { test: "HCO3", value: "16", units: "mmol/L", range: "22–26", flag: "LL" },
      { test: "Base excess", value: "-9", units: "mmol/L", range: "-2 to +2", flag: "LL" },
      { test: "Lactate", value: "4.4", units: "mmol/L", range: "<2.0", flag: "HH" },
      { test: "Potassium", value: "5.3", units: "mmol/L", range: "3.5–5.0", flag: "H" },
    ],
  },
  {
    kind: "micro",
    id: "micro-stool-001",
    encounterId: "enc-stool-micro",
    title: "Stool Culture + C. difficile Screen",
    status: "Preliminary",
    specimen: "Faeces (single sample, Bristol type 6)",
    collected: "05/07/2026 22:00",
    received: "05/07/2026 22:30",
    reportedAt: "06/07/2026 — 12 hour review",
    organisms: [],
    resultText: `STOOL CULTURE — PRELIMINARY
Salmonella, Shigella, Campylobacter, E. coli O157: NO PATHOGENS ISOLATED TO
DATE (12 hours). Culture continues; final report at 48–72 hours.

C. DIFFICILE SCREEN — GDH antigen NOT detected; toxin NOT detected.

Microscopy: no ova, cysts or parasites seen. Note: single episode of
diarrhoea reported — a solitary loose stool is weak support for an infective
gastroenteritis; interpret culture in clinical context.`,
  },
  {
    kind: "report",
    id: "ed-epistaxis-001",
    encounterId: "enc-ed-epistaxis",
    title: "ED Attendance — Epistaxis on Warfarin",
    type: "ED Visit Summary",
    department: "Emergency Department",
    author: "Marsh, Colin, MD",
    signedAt: "22/05/2026",
    body: `EMERGENCY DEPARTMENT ATTENDANCE — SUMMARY

Presenting complaint: recurrent left-sided epistaxis, not settling with
pressure at home. On warfarin for AF.

Findings: active anterior bleed, left Little's area. INR 4.8 today.
Haemodynamically stable, Hb 141.

Management: anterior nasal pack (Rapid Rhino) inserted with good effect.
Warfarin WITHHELD from today given INR 4.8 and active bleeding; vitamin K
1 mg PO given per protocol. ENT advice: pack out at 48 h via ENT clinic —
done, no re-bleed.

Disposition: discharged. GP to follow up: recheck INR and REASSESS
ANTICOAGULATION — he has AF with a previous TIA, so the decision to restart
warfarin (or switch agent) needs to be made actively once bleeding risk has
settled. Letter sent to GP practice.`,
  },
  {
    kind: "letter",
    id: "gp-epistaxis-fu-001",
    encounterId: "enc-gp-epistaxis-fu",
    title: "Primary Care — Epistaxis Follow-Up",
    type: "Letter",
    department: "Primary Care",
    author: "Ellison, Margaret, MD",
    signedAt: "26/05/2026",
    body: `Dear colleague,

I reviewed Mr Osborne following his ED attendance on 22/05/2026 with
epistaxis on warfarin (INR 4.8, anterior pack). The pack has been removed
and there has been no further bleeding. He is well.

Warfarin remains WITHHELD for now. INR today 1.4 and falling. He is
understandably reluctant to restart "the blood thinner" after a frightening
bleed, and I have not restarted it today.

Plan: anticoagulation review booked for 12/06/2026 to rediscuss restarting
warfarin versus switching to a DOAC — he has AF and a previous TIA
(CHA2DS2-VASc 5), so remaining off anticoagulation long-term is not a safe
steady state and the decision should not drift.

Kind regards,
Dr M. Ellison`,
  },
  {
    kind: "letter",
    id: "gp-dna-001",
    encounterId: "enc-dna-review",
    title: "Primary Care — DNA: Anticoagulation Review",
    type: "Letter",
    department: "Primary Care",
    author: "Ellison, Margaret, MD",
    signedAt: "15/06/2026",
    body: `Dear Mr Osborne,

You were booked for an anticoagulation review on 12/06/2026 to discuss
restarting warfarin (or an alternative) following your nosebleed in May.
Our records show you DID NOT ATTEND this appointment.

Please contact the surgery to rebook. This review is important: you have
atrial fibrillation and a previous mini-stroke, and you are currently taking
NO blood-thinning medication, which increases your risk of stroke.

[Practice record: no rebooking made as of 15/06/2026. Recall task set for
routine follow-up.]

Yours sincerely,
Dr M. Ellison`,
  },
  {
    kind: "letter",
    id: "gp-af-review-001",
    encounterId: "enc-af-review",
    title: "Primary Care — AF / Anticoagulation Annual Review",
    type: "Letter",
    department: "Primary Care",
    author: "Ellison, Margaret, MD",
    signedAt: "24/03/2026",
    body: `Dear colleague,

Annual atrial fibrillation review for Mr Osborne. He is well with no
palpitations, syncope or heart failure symptoms. Rate-controlled on
bisoprolol 5 mg (pulse 74, irregularly irregular). BP 134/82.

Anticoagulation: warfarin 3 mg OD, time in therapeutic range 78% over the
last 12 months — good control. CHA2DS2-VASc 5 (age, hypertension, previous
TIA 09/2024); HAS-BLED 2. Clear indication to continue anticoagulation.

Plan: continue warfarin with community INR monitoring; continue bisoprolol,
amlodipine and atorvastatin. Weight 78.0 kg. Next review in 12 months.

Kind regards,
Dr M. Ellison`,
  },
  {
    kind: "letter",
    id: "tia-clinic-001",
    encounterId: "enc-tia-clinic",
    title: "TIA Clinic — Assessment Letter",
    type: "Letter",
    department: "Stroke Medicine",
    author: "Banerjee, Ritu, MD",
    signedAt: "09/09/2024",
    body: `Dear colleague,

Thank you for the rapid-access referral. Mr Osborne presented with 25
minutes of right hand clumsiness and word-finding difficulty, fully resolved.
Examination normal. MRI brain: no acute infarct; small vessel change only.
Carotid Dopplers: no significant stenosis.

Diagnosis: TIA, presumed cardioembolic — he is in atrial fibrillation.

He was already on warfarin for AF; INR on the day was 2.4 (therapeutic).
We have counselled adherence and continued warfarin — with a previous TIA
his annual stroke risk off anticoagulation would be substantial. Atorvastatin
increased to 40 mg. Driving advice given (no driving for 1 month).

Kind regards,
Dr R. Banerjee, Stroke Medicine`,
  },
  {
    kind: "order",
    id: "refill-bisoprolol-001",
    encounterId: "enc-refill-bisoprolol",
    title: "Repeat Prescription — Bisoprolol",
    type: "Medication Order",
    department: "Primary Care",
    author: "Ellison, Margaret, MD",
    signedAt: "08/05/2026",
    body: `REPEAT PRESCRIPTION (issued electronically to community pharmacy)

Drug: Bisoprolol 5 mg tablets
Directions: Take ONE tablet each morning.
Quantity: 56 tablets (8 weeks).
Indication: Atrial fibrillation — rate control.

Last issue: 12/03/2026. Compliance good per pharmacy record. Pulse
rate-controlled at annual review 24/03/2026. Routine medication review due.`,
  },
  {
    kind: "order",
    id: "refill-amlodipine-001",
    encounterId: "enc-refill-amlodipine",
    title: "Repeat Prescription — Amlodipine",
    type: "Medication Order",
    department: "Primary Care",
    author: "Ellison, Margaret, MD",
    signedAt: "08/05/2026",
    body: `REPEAT PRESCRIPTION (issued electronically to community pharmacy)

Drug: Amlodipine 5 mg tablets
Directions: Take ONE tablet each morning.
Quantity: 56 tablets (8 weeks).
Indication: Essential hypertension.

Last issue: 12/03/2026. Compliance good per pharmacy record. BP within
target at annual review 24/03/2026. Routine medication review due 2027.`,
  },
];

/** Note-kind documents only — feeds the Notes activity and Chart Review > Notes. */
export const caseMesischaemia001Notes = caseMesischaemia001Documents.filter(
  (doc): doc is Extract<ClinicalDocument, { kind: "note" }> => doc.kind === "note",
);
