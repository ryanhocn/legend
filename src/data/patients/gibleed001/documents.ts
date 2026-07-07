import type { ClinicalDocument, LabFlag, LabRow } from "../../../types";
import { bloods } from "./bloods";

/** SI units for the admission panel, keyed by `bloods` test name. */
const ADMISSION_LAB_UNITS: Record<string, string> = {
  Hb: "g/L",
  MCV: "fL",
  WCC: "x10⁹/L",
  Platelets: "x10⁹/L",
  Urea: "mmol/L",
  Creatinine: "µmol/L",
  eGFR: "mL/min/1.73m²",
  Sodium: "mmol/L",
  Potassium: "mmol/L",
  CRP: "mg/L",
  Bilirubin: "µmol/L",
  ALT: "U/L",
  Albumin: "g/L",
  "hs-Troponin T": "ng/L",
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
 * Single source of truth for the synthetic upper-GI-bleed case (Whitfield,
 * Gordon, 72M): every clinical document, note-kind and report-kind, in one
 * list. Both views derive from it — the Notes activity (and Chart Review >
 * Notes sub-tab) filter to `kind: "note"`, while the Encounters timeline
 * resolves each row's primary document by `encounterId`.
 *
 * Note-kind documents drive the Notes/Trans browser: category tabs filter by
 * `category`, "Admission" by the `admission` flag and "Incomplete" by `status`.
 * The list sorts by `timestamp`. Report-kind documents (letters, the ECG,
 * orders, the admission summary) are reached only via their encounter row.
 *
 * CASE SHAPE — an UPPER GI BLEED anchored as "collapse ?vasovagal" for the
 * learner to unpick:
 *  - The presenting event is a bathroom collapse with a marked postural drop
 *    (118/74 -> 92/60), read from admission onward as vasovagal / dehydration.
 *  - The chart contradicts the label: Hb 141 (GP, 22/05) -> 96 on admission
 *    -> 89 this morning; urea 16.8 -> 19.4 against a NORMAL creatinine (the
 *    upper-GI marker); three days of black tarry stools charted by nursing.
 *  - The red herring: "dark stools — on ferrous sulfate" is written in the
 *    clerking and copied forward verbatim into this morning's ward round. The
 *    iron itself is a fossil — a 3-month post-bleed course from 2019 that was
 *    never stopped.
 *  - Buried history: the 14/09/2019 discharge letter documents a bleeding
 *    duodenal ulcer treated endoscopically, with written advice to avoid
 *    NSAIDs — and the 2021 cardiology letter repeats that advice when
 *    apixaban is started. A locum GP started naproxen on 12/06/2026 anyway.
 *  - Latent / system-factor hooks (NOT individual blame): ED asked the ward
 *    to confirm the stool appearance and it never happened; pharmacy flagged
 *    the NSAID + DOAC combination yesterday afternoon and nobody actioned it;
 *    both drugs were given again at 08:05 this morning; no group & save has
 *    ever been sent, no endoscopy referral made, and no Glasgow-Blatchford
 *    score is anywhere in the chart.
 *
 * All content is fabricated for education and simulation only. Not for clinical use.
 */
export const caseGibleed001Documents: ClinicalDocument[] = [
  {
    kind: "note",
    id: "note-hp-001",
    encounterId: "enc-admission",
    category: "H&P",
    noteType: "H&P",
    author: "Trevithick, Owen",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "(A) General Medicine — AMU",
    dateOfService: "05/07/26 1030",
    fileTime: "05/07/26 1112",
    timestamp: 1783247400,
    status: "signed",
    admission: true,
    body: `GENERAL MEDICINE ADMISSION CLERKING
Admission Date: 05/07/2026 — PCP: Fenwick, Alistair, MD

CC: Collapse in the bathroom with brief loss of consciousness.

HISTORY OF PRESENT ILLNESS:
Gordon Whitfield is a 72-year-old man who got up at ~05:30 to open his bowels
and, on standing from the toilet, felt light-headed ("the room closed in") and
collapsed. His wife heard the thud; loss of consciousness was brief (<1 minute
by her account), with no jerking, tongue-biting or incontinence and rapid
recovery. No head injury. He describes two or three similar dizzy spells on
standing over the last couple of days.

Appetite reduced this week and he "hasn't been drinking much" in the warm
weather. Bowels: stools have been "very dark, almost black" for ~3 days — he
takes ferrous sulfate, which darkens stool. No vomiting, no coffee-ground
material, no fresh rectal bleeding. Some indigestion since starting naproxen
for his knee ~3 weeks ago, settling with milk.

PAST MEDICAL HISTORY:
- Atrial fibrillation (2021) — on apixaban
- Essential hypertension
- Osteoarthritis, right knee
- Anaemia — on ferrous sulfate (details unclear; GP summary awaited)

MEDICATIONS (on admission):
- Apixaban 5 mg PO BD
- Naproxen 500 mg PO BD (started 12/06/2026 for knee OA flare)
- Ferrous sulfate 200 mg PO OD
- Bisoprolol 2.5 mg PO OD
- Ramipril 4 mg PO OD
- Atorvastatin 20 mg PO ON

ALLERGIES: No known drug allergies.

EXAMINATION:
- Alert, GCS 15. Looks mildly pale. No head wound.
- Lying/standing BP: LYING 118/74, HR 92 -> STANDING 92/60, HR 118, with
  symptomatic dizziness at 1 minute. Marked postural drop — ?dehydration.
- Heart: irregularly irregular, no murmur. Chest clear.
- Abdomen soft, mild epigastric tenderness, no peritonism.
- PR examination deferred — patient keen to rest; stools dark on history
  (on iron).

INVESTIGATIONS:
- Hb 96, MCV 88 — ?chronic (on iron); recheck in the morning.
- Urea 16.8, creatinine 88 — ?dehydration. Lactate 1.6.
- hs-Troponin 8 — negative. ECG: AF, rate 92, no acute ischaemic change.
- Glucose 6.1. CT head not indicated (no head injury, rapid full recovery).

IMPRESSION:
1. Collapse — vasovagal vs postural (orthostatic) hypotension, most likely
   volume depletion / dehydration. Cardiac syncope unlikely (troponin
   negative, rate-controlled AF, no red-flag features).
2. Anaemia — ?chronic, on ferrous sulfate. Recheck FBC in the morning.
3. Dark stools — on ferrous sulfate.

PLAN:
1. IV crystalloid 1 L over 4 hours, then reassess.
2. Repeat lying/standing BP this evening and tomorrow.
3. Repeat FBC and U&E with the morning bloods.
4. Continue regular medications, including apixaban and naproxen.
5. Falls precautions; physiotherapy review for mobility.
6. Anticipate discharge tomorrow if steady on his feet.
VTE assessment: already therapeutically anticoagulated (apixaban).`,
  },
  {
    kind: "note",
    id: "note-ed-001",
    encounterId: "enc-ed",
    category: "ED Notes",
    noteType: "ED Provider Note",
    author: "Sowerby, Jack",
    credential: "MD",
    authorRole: "*PHYSICIAN: FACULTY",
    service: "Emergency Department",
    dateOfService: "05/07/26 0730",
    fileTime: "05/07/26 0802",
    timestamp: 1783236600,
    status: "signed",
    admission: true,
    urgent: true,
    body: `EMERGENCY DEPARTMENT PROVIDER NOTE

Presenting complaint: collapse in the bathroom.

HPI: 72M brought by ambulance after collapsing on standing from the toilet at
~05:30. Brief LOC witnessed by wife, rapid recovery, GCS 15 with the crew. No
seizure markers, no chest pain, no palpitations preceding. Two to three dizzy
spells on standing over recent days. Reduced oral intake in the hot weather.

Mentions his stools have been dark for a few days — he attributes this to his
iron tablets. On apixaban (AF) and naproxen (knee, started by GP last month).

O/E: pale but well perfused. Irregular pulse. Abdomen soft, mild epigastric
tenderness. Lying/standing BP: 118/74 lying -> 92/60 standing with dizziness —
marked postural drop. PR not performed in the department (busy overnight) —
for the ward team to confirm stool appearance.

Investigations:
- ECG: AF, rate 92, no acute ischaemic change. hs-troponin 8 — negative.
- VBG: Hb 98, lactate 1.6. Formal bloods sent, resulted after referral.

Impression: syncope, likely vasovagal / orthostatic — ?volume depletion.
Refer General Medicine for fluids, lying/standing series and morning bloods.
NB: if the dark stools are true melaena rather than iron this needs a GI
workup — ward team to examine and review the formal Hb.`,
  },
  {
    kind: "note",
    id: "note-triage-001",
    encounterId: "enc-triage",
    category: "ED Notes",
    noteType: "ED Triage Note",
    author: "Adisa, Funmi",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "Emergency Department",
    dateOfService: "05/07/26 0620",
    fileTime: "05/07/26 0631",
    timestamp: 1783232400,
    status: "signed",
    admission: true,
    urgent: true,
    body: `ED TRIAGE NOTE

72M brought in by ambulance after a collapse in the bathroom at home. Wife
heard a thud and found him on the floor; he had come round by the time the
crew arrived. Pale and clammy looking on arrival, feels "washed out".

Obs: T 36.4, HR 96, BP 104/68, RR 18, SpO2 97% RA. NEWS2 = 3.
No known drug allergies — no band required.

Ambulance sheet: brief LOC, GCS 15 on arrival, BM 6.1, no head injury seen.
Triage category: Urgent. ECG requested per the collapse pathway; bloods and
VBG taken, IV access x1 sited. Moved to majors.`,
  },
  {
    kind: "note",
    id: "note-nurse-001",
    encounterId: "enc-admission",
    category: "Nursing",
    noteType: "Nursing Admission Assessment",
    author: "Costa, Mariana",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "(A) General Medicine — AMU",
    dateOfService: "05/07/26 1140",
    fileTime: "05/07/26 1204",
    timestamp: 1783251600,
    status: "signed",
    admission: true,
    body: `NURSING ADMISSION ASSESSMENT

72M admitted to AMU Bay 4 from ED following a collapse at home.

Obs on arrival: T 36.6, HR 94, BP 112/70, RR 16, SpO2 97% RA. NEWS2 = 2.
Looks pale. Denies pain other than the right knee (longstanding).

Risk assessments: falls — HIGH (collapse, postural dizziness) — falls bundle
commenced, bed lowered, call bell within reach, advised not to mobilise to the
bathroom unaccompanied. Pressure areas (Waterlow) — low. VTE — completed by
medical team (on apixaban).

Bowels: opened on the ward at 13:10 — stool BLACK, tarry and offensive.
Recorded on the stool chart and mentioned to the ward doctor (documented as
medication effect — patient takes iron). Stool chart continues.

One peripheral cannula (20G, left forearm) in situ; IV fluids running as
prescribed. Wife present and updated.`,
  },
  {
    kind: "note",
    id: "note-pharm-001",
    encounterId: "enc-admission",
    category: "Progress",
    noteType: "Best Poss Rx Hx",
    author: "Okonjo, Chidinma",
    credential: "PharmD",
    authorRole: ".PHARMACIST",
    service: "Pharmacy",
    dateOfService: "05/07/26 1420",
    fileTime: "05/07/26 1447",
    timestamp: 1783261200,
    status: "signed",
    admission: true,
    body: `BEST POSSIBLE MEDICATION HISTORY

Sources: patient interview, GP summary, community pharmacy record (2 sources).

Regular medications confirmed:
- Apixaban 5 mg PO BD (AF; started 2021). ACTIVE on the inpatient chart.
- Naproxen 500 mg PO BD (started 12/06/2026 by GP locum for knee OA flare —
  28-day supply). ACTIVE on the inpatient chart. No gastroprotection
  co-prescribed at any point.
- Ferrous sulfate 200 mg PO OD — on repeat since September 2019; per the GP
  record it was started after a hospital admission and appears to have been
  intended as a 3-month course that was never reviewed or stopped.
- Bisoprolol 2.5 mg PO OD, Ramipril 4 mg PO OD, Atorvastatin 20 mg PO ON.

Allergies: none known — confirmed with the patient.

PRESCRIBING FLAGS FOR THE TEAM:
1. NSAID + DOAC: naproxen and apixaban together substantially raise GI
   bleeding risk, with no PPI cover. In a patient reporting dark stools with
   an admission Hb of 96, recommend the team urgently review whether BOTH
   should continue — neither has been held or stopped as of this note.
2. Oral iron darkens stool and can mask melaena if the history alone is
   relied on — recommend the stool on the ward chart is reviewed / PR
   examination completed before dark stools are attributed to the iron.
3. Suggest confirming the original indication for the ferrous sulfate against
   the 2019 discharge correspondence on file.`,
  },
  {
    kind: "note",
    id: "note-wr-001",
    encounterId: "enc-ward-round",
    category: "Progress",
    noteType: "Post-Take Ward Round",
    author: "Harcourt, Miriam",
    credential: "MD",
    authorRole: "*PHYSICIAN: FACULTY",
    service: "(A) General Medicine — AMU",
    dateOfService: "05/07/26 1745",
    fileTime: "05/07/26 1806",
    timestamp: 1783273500,
    status: "signed",
    admission: true,
    body: `MEDICAL POST-TAKE WARD ROUND NOTE

Seen on the evening post-take round with the on-call team.

72M, collapse on standing from the toilet with brief LOC and a marked postural
drop in ED (118/74 -> 92/60). Rate-controlled AF, troponin negative, no
seizure markers. Reduced oral intake this week.

Feels better after 1 L crystalloid. Lying/standing repeated on the ward:
114/72 -> 98/62 — improved but still dropping.

Impression: orthostatic (postural) hypotension, likely volume depletion in
the warm weather; ?vasovagal component to the collapse itself.

Hb 96 noted — on iron; ?chronic anaemia. Recheck with the morning bloods and
compare against his GP baseline. Dark stools per history — on ferrous
sulfate; stool chart in progress.

Plan:
- Continue IV fluids overnight; encourage oral intake.
- Repeat FBC / U&E on the morning round; compare Hb with GP records.
- Repeat lying/standing BP tomorrow; falls precautions.
- Continue regular medications. Physio review.
- Home tomorrow if steady; GP to follow the anaemia if stable.`,
  },
  {
    kind: "note",
    id: "note-nurse-002",
    encounterId: "enc-admission",
    category: "Nursing",
    noteType: "Nursing Shift Note",
    author: "Nowak, Agnieszka",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "(A) General Medicine — AMU",
    dateOfService: "06/07/26 0640",
    fileTime: "06/07/26 0658",
    timestamp: 1783320000,
    status: "signed",
    body: `NURSING SHIFT NOTE (Night)

Two further bowel motions overnight — 02:30 and 05:45 — both BLACK, tarry and
offensive, recorded on the stool chart. Volumes moderate.

05:45 — patient dizzy standing to the commode, helped back to bed. Obs at the
time: HR 104, BP 102/64, RR 18, SpO2 96%. Settled lying flat. Advised again
not to mobilise unaccompanied — falls bundle in place.

Overnight obs otherwise: HR creeping upward through the night (92 -> 104),
apyrexial throughout. IV fluids completed as prescribed at 04:00.

06:30 — bloods taken with the phlebotomy round (repeat FBC / U&E as per
post-take plan) and sent.

Handover to day team: stool chart (x3 black stools now), overnight dizziness
and the repeat bloods all flagged for review on this morning's round.`,
  },
  {
    kind: "note",
    id: "note-wr-002",
    encounterId: "enc-ward-round-d2",
    category: "Progress",
    noteType: "Ward Round Note",
    author: "Farrant, Lucy",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "(A) General Medicine — AMU",
    dateOfService: "06/07/26 0840",
    fileTime: "06/07/26 0859",
    timestamp: 1783327200,
    status: "signed",
    body: `GENERAL MEDICINE WARD ROUND (SHO)

Day 2. Collapse — postural hypotension, treating as dehydration.

S: Feels "much better in myself". No further collapse. Nursing report some
dizziness standing to the commode overnight. Slept reasonably.

O: HR 104, BP 106/68, apyrexial, SpO2 96% RA. Alert, remains pale.
Abdomen soft, mild epigastric tenderness unchanged.
Dark stools — on ferrous sulfate.

Bloods (this morning): Hb 89 (96 yesterday) — ?dilutional after IV fluids.
Urea 19.4 — ?dehydration not yet corrected; creatinine normal (92).

Impression: postural collapse secondary to dehydration, improving.

Plan:
- Further 1 L IV crystalloid today; continue encouraging oral fluids.
- Mobilise with physiotherapy this morning.
- Repeat lying/standing BP this afternoon.
- Continue regular medications as charted.
- Home tomorrow if steady. For consultant review on this afternoon's round.`,
  },
  {
    kind: "encounterSummary",
    id: "admission-encounter-001",
    encounterId: "enc-admission",
    title: "Admission — ED to Hosp-Admission",
    type: "Hospital Encounter",
    department: "General Medicine",
    author: "Harcourt, Miriam, MD (Attending)",
    signedAt: "05/07/2026 09:30",
    body: `ADMISSION  [Current]
05/07/2026 09:30 — present       Mount Verdant Hospital
Admitting / Attending: Harcourt, Miriam, MD — General Medicine

PRINCIPAL PROBLEM:
Collapse — ?vasovagal / ?postural (orthostatic) hypotension.

ENCOUNTER NOTES:
- ED Provider Note — Sowerby, Jack, MD (Emergency Medicine)
- Medical Post-Take Ward Round — Harcourt, Miriam, MD (General Medicine)

HOSPITAL PROBLEM LIST:
◆ Collapse — ?vasovagal / ?postural hypotension — PRINCIPAL
- Anaemia — Hb 96 on admission (?chronic, on oral iron)
- Dark stools — ?medication effect (ferrous sulfate)
- Atrial fibrillation — rate controlled, on apixaban
- Osteoarthritis, right knee — on naproxen since 12/06/2026
- Essential hypertension

CARE TIMELINE:
05:52  Ambulance arrival, ED (collapse at home ~05:30)
06:20  Triage — pale, NEWS2 3; collapse pathway
07:30  Seen by ED provider; postural drop documented
09:30  Admitted — General Medicine, AMU Bay 4

EXPECTED MEDICATION LIST:
- Apixaban 5 mg PO BD — CONTINUED
- Naproxen 500 mg PO BD — CONTINUED
- Ferrous sulfate 200 mg PO OD — continued
- Bisoprolol 2.5 mg PO OD — continued
- Ramipril 4 mg PO OD — continued
- Atorvastatin 20 mg PO ON — continued
- Sodium chloride 0.9% IV — rehydration
- Paracetamol 1 g PO QDS PRN

ALLERGIES: No known drug allergies.
CODE STATUS: For escalation. ISOLATION: None.

All patient data are synthetic. For education and simulation only. Not for clinical use.`,
  },
  {
    kind: "report",
    id: "ecg-report-001",
    encounterId: "enc-ecg",
    title: "ECG — 12-Lead",
    type: "ECG Report",
    department: "Cardiac Physiology",
    author: "Vance, Toby (Cardiac Physiologist)",
    signedAt: "05/07/2026 07:10",
    body: `12-LEAD ECG — Emergency Department (collapse pathway)

Rhythm: atrial fibrillation, ventricular rate 92. No pauses captured.
Axis normal. QRS 88 ms. QTc 428 ms.
ST segments: no acute ST elevation or depression. T waves unremarkable.

Comparison: AF known since 2021 (prior trace on file, 18/03/2021 — AF, rate
104 at diagnosis). No new ischaemic change.

Impression: rate-controlled atrial fibrillation. No acute ischaemia. Does not
explain the collapse; clinical correlation with postural observations advised.`,
  },
  {
    kind: "letter",
    id: "dc-letter-2019-001",
    encounterId: "enc-dc-2019",
    title: "Discharge Letter — Upper GI Bleed",
    type: "Discharge Letter",
    department: "Gastroenterology",
    author: "Bramwell, Edward, MD (Gastroenterology)",
    signedAt: "14/09/2019",
    body: `Dear colleague,

Re: Mr Gordon Whitfield — admitted 10/09/2019, discharged 14/09/2019.

Mr Whitfield was admitted with melaena and pre-syncope. Haemoglobin on
admission was 84 g/L; he was transfused 2 units of red cells.

Gastroscopy (OGD) on 11/09/2019 showed a duodenal ulcer in the first part of
the duodenum with a visible adherent clot (Forrest IIb), treated with
adrenaline injection and two endoscopic clips. Good haemostasis. CLO test
positive — Helicobacter pylori eradication therapy completed in hospital.

Discharge plan:
- Omeprazole 40 mg once daily for 8 weeks, then review.
- Ferrous sulfate 200 mg once daily for THREE MONTHS for the post-bleed
  anaemia, then stop and recheck the full blood count.
- We have STRONGLY advised him to avoid NSAIDs (including over-the-counter
  ibuprofen) and aspirin in future without gastroprotection and prior
  discussion — his ulcer bled on a background of intermittent ibuprofen use.
- No routine repeat OGD required if he remains asymptomatic.

All patient data are synthetic. For education and simulation only. Not for clinical use.

Kind regards,
Mr E. Bramwell`,
  },
  {
    kind: "letter",
    id: "cardiology-letter-2021-001",
    encounterId: "enc-af-dx",
    title: "Cardiology Clinic — New Atrial Fibrillation",
    type: "Letter",
    department: "Cardiology",
    author: "Nakamura, Yuki, MD (Cardiology)",
    signedAt: "18/03/2021",
    body: `Dear colleague,

I reviewed Mr Whitfield in the arrhythmia clinic with newly diagnosed atrial
fibrillation (rate 104, confirmed on 12-lead and 24-hour tape). He is
asymptomatic apart from occasional palpitations.

Stroke and bleeding risk were discussed at length. CHA2DS2-VASc score is 3
(age, hypertension); his HAS-BLED score includes the significant upper GI
bleed of 2019 (duodenal ulcer, treated endoscopically, H. pylori eradicated).
On balance the stroke risk justifies anticoagulation, and we have started
APIXABAN 5 mg twice daily together with bisoprolol 2.5 mg once daily for rate
control.

We specifically counselled him that, while anticoagulated, he must avoid
NSAIDs — including over-the-counter ibuprofen — because of the combination of
bleeding risks with his previous ulcer. He understood.

Annual review arranged; ECG and renal function beforehand.

Kind regards,
Dr Y. Nakamura`,
  },
  {
    kind: "letter",
    id: "gp-af-review-001",
    encounterId: "enc-af-review",
    title: "Primary Care — AF / Hypertension Annual Review",
    type: "Letter",
    department: "Primary Care",
    author: "Fenwick, Alistair, MD",
    signedAt: "22/05/2026",
    body: `Dear colleague,

Annual atrial fibrillation and hypertension review for Mr Whitfield. He is
well, walking daily, with no palpitations, breathlessness or bleeding.

Examination: pulse irregularly irregular, rate 76. BP 138/82. No oedema.

Bloods today: Hb 141 with normal indices, urea 5.6, creatinine 84 (eGFR 72),
ferritin 74. Renal function satisfactory for continued apixaban 5 mg BD.

Plan:
- Continue apixaban 5 mg BD, bisoprolol 2.5 mg OD, ramipril 4 mg OD.
- Medication review note: ferrous sulfate remains on repeat — he tells me he
  takes it "for his blood" but is unsure why; flagged to confirm the original
  indication and consider stopping at his next appointment.
- Routine review in 12 months, bloods beforehand.

Kind regards,
Dr A. Fenwick`,
  },
  {
    kind: "letter",
    id: "gp-knee-letter-001",
    encounterId: "enc-gp-knee",
    title: "Primary Care — Knee Pain Review",
    type: "Letter",
    department: "Primary Care",
    author: "Prendergast, Hugo, MD",
    signedAt: "12/06/2026",
    body: `Dear colleague,

I saw Mr Whitfield today (locum appointment) with a flare of his right knee
osteoarthritis — pain on stairs and first thing in the morning, limiting his
daily walk. Examination shows a stable knee with medial joint-line tenderness
and crepitus; no effusion, no locking or giving way.

Plan:
- I have started NAPROXEN 500 mg twice daily with food, 28 days' supply, with
  review in four weeks.
- Continue paracetamol as needed.
- Physiotherapy referral made; weight and activity advice given.

Kind regards,
Dr H. Prendergast (locum)`,
  },
  {
    kind: "order",
    id: "rx-naproxen-001",
    encounterId: "enc-rx-naproxen",
    title: "Acute Prescription — Naproxen",
    type: "Medication Order",
    department: "Primary Care",
    author: "Prendergast, Hugo, MD",
    signedAt: "12/06/2026",
    body: `ACUTE PRESCRIPTION (issued electronically to community pharmacy)

Drug: Naproxen 500 mg tablets
Directions: Take ONE tablet twice daily with food.
Quantity: 56 tablets (28 days).
Indication: Osteoarthritis, right knee — flare.

Acute issue by locum; not added to repeat. Review booked in four weeks.
No gastroprotection co-prescribed at this issue.`,
  },
  {
    kind: "order",
    id: "rx-apixaban-001",
    encounterId: "enc-rx-apixaban",
    title: "Repeat Prescription — Apixaban",
    type: "Medication Order",
    department: "Primary Care",
    author: "Fenwick, Alistair, MD",
    signedAt: "20/04/2026",
    body: `REPEAT PRESCRIPTION (issued electronically to community pharmacy)

Drug: Apixaban 5 mg tablets
Directions: Take ONE tablet twice daily.
Quantity: 56 tablets (4 weeks).
Indication: Stroke prevention in atrial fibrillation (CHA2DS2-VASc 3).

Last issue: 23/03/2026. Compliance good per pharmacy record. Annual AF review
booked for May — renal function to be checked beforehand.`,
  },
  {
    kind: "order",
    id: "rx-ferrous-001",
    encounterId: "enc-rx-ferrous",
    title: "Repeat Prescription — Ferrous Sulfate",
    type: "Medication Order",
    department: "Primary Care",
    author: "Fenwick, Alistair, MD",
    signedAt: "20/04/2026",
    body: `REPEAT PRESCRIPTION (issued electronically to community pharmacy)

Drug: Ferrous sulfate 200 mg tablets
Directions: Take ONE tablet daily.
Quantity: 28 tablets (4 weeks).
Indication: Iron supplementation.

On repeat since 09/2019 — initiated following a hospital admission (original
plan: 3-month course, then stop and recheck FBC). Medication review overdue —
flagged for the next face-to-face appointment.`,
  },
  {
    kind: "lab",
    id: "lab-bloods-admit-001",
    encounterId: "enc-bloods-admit",
    title: "Admission Bloods — FBC, U&E, LFTs, CRP, Troponin",
    status: "Final",
    specimen: "Blood (serum + EDTA), venepuncture",
    collected: "05/07/2026 08:10",
    received: "05/07/2026 08:24",
    reportedAt: "05/07/2026 08:55",
    orderedBy: "Sowerby, Jack, MD (Emergency Medicine)",
    resultingLab: "LegendCare Clinical Laboratory, Mount Verdant Hospital",
    rows: admissionLabRows,
  },
  {
    kind: "lab",
    id: "lab-bloods-repeat-001",
    encounterId: "enc-bloods-repeat",
    title: "Repeat FBC + U&E — Morning Bloods",
    status: "Final",
    specimen: "Blood (serum + EDTA), venepuncture",
    collected: "06/07/2026 06:30",
    received: "06/07/2026 06:47",
    reportedAt: "06/07/2026 07:40",
    orderedBy: "Trevithick, Owen, MD (General Medicine)",
    resultingLab: "LegendCare Clinical Laboratory, Mount Verdant Hospital",
    rows: [
      { test: "Hb", value: "89", units: "g/L", range: "130–180", flag: "L" },
      { test: "MCV", value: "88", units: "fL", range: "80–100", flag: "" },
      { test: "WCC", value: "10.9", units: "x10⁹/L", range: "4.0–11.0", flag: "" },
      { test: "Platelets", value: "330", units: "x10⁹/L", range: "150–400", flag: "" },
      { test: "Urea", value: "19.4", units: "mmol/L", range: "2.5–7.8", flag: "H" },
      { test: "Creatinine", value: "92", units: "µmol/L", range: "60–110", flag: "" },
      { test: "eGFR", value: "68", units: "mL/min/1.73m²", range: ">60", flag: "" },
      { test: "Sodium", value: "137", units: "mmol/L", range: "135–145", flag: "" },
      { test: "Potassium", value: "4.4", units: "mmol/L", range: "3.5–5.3", flag: "" },
    ],
  },
  {
    kind: "lab",
    id: "lab-bloods-gp-001",
    encounterId: "enc-bloods-gp",
    title: "Annual Review Bloods — FBC, U&E, Ferritin, Lipids",
    status: "Final",
    specimen: "Blood (serum + EDTA), venepuncture",
    collected: "22/05/2026 09:20",
    received: "22/05/2026 09:34",
    reportedAt: "22/05/2026 09:45",
    orderedBy: "Fenwick, Alistair, MD (Primary Care)",
    resultingLab: "LegendCare Clinical Laboratory, Mount Verdant Hospital",
    rows: [
      { test: "Hb", value: "141", units: "g/L", range: "130–180", flag: "" },
      { test: "MCV", value: "89", units: "fL", range: "80–100", flag: "" },
      { test: "Platelets", value: "356", units: "x10⁹/L", range: "150–400", flag: "" },
      { test: "Urea", value: "5.6", units: "mmol/L", range: "2.5–7.8", flag: "" },
      { test: "Creatinine", value: "84", units: "µmol/L", range: "60–110", flag: "" },
      { test: "eGFR", value: "72", units: "mL/min/1.73m²", range: ">60", flag: "" },
      { test: "Ferritin", value: "74", units: "µg/L", range: "30–400", flag: "" },
      { test: "Total cholesterol", value: "4.6", units: "mmol/L", range: "<5.0", flag: "" },
    ],
  },
];

/** Note-kind documents only — feeds the Notes activity and Chart Review > Notes. */
export const caseGibleed001Notes = caseGibleed001Documents.filter(
  (doc): doc is Extract<ClinicalDocument, { kind: "note" }> => doc.kind === "note",
);
