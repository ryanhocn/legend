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
 * Single source of truth for the synthetic mislabelled-DVT case (Ashworth,
 * Colin, 59M): every clinical document, note-kind and report-kind, in one
 * list. Both views derive from it — the Notes activity (and Chart Review >
 * Notes sub-tab) filter to `kind: "note"`, while the Encounters timeline
 * resolves each row's primary document by `encounterId`.
 *
 * CASE SHAPE — a PROVOKED DVT anchored as "cellulitis" for the learner to
 * unpick on a day-3 progress round:
 *  - The red leg was labelled cellulitis in ED and started on IV
 *    flucloxacillin; three days on it is no better, and the chart never fit
 *    the label to begin with — afebrile throughout (NEWS2 1), WCC normal, CRP
 *    only mildly raised (28 -> 31), no portal of entry ever documented.
 *  - The chart quietly points at a clot instead: a HGV driver home from a
 *    long-haul flight on 18/06, obese (BMI 31.4), with a UNILATERAL tense
 *    swollen calf. The nursing admission chart recorded calf circumference
 *    L 41 cm / R 37 cm — a 4 cm difference nobody has read back.
 *  - The confounder: the GP letter of 03/2026 documents varicose veins and
 *    venous eczema — a chronically discoloured leg that makes "cellulitis"
 *    look plausible and lets the acute unilateral swelling hide in plain
 *    sight.
 *  - Latent / system hooks (NOT individual blame): a Wells score was never
 *    calculated, no D-dimer and no compression Doppler ultrasound were ever
 *    requested, and VTE prophylaxis was never prescribed on this admission.
 *    The day-2 plan proposes ADDING a second antibiotic — escalating the
 *    wrong treatment rather than questioning the diagnosis.
 *
 * All content is fabricated for education and simulation only. Not for clinical use.
 */
export const caseDvt001Documents: ClinicalDocument[] = [
  {
    kind: "note",
    id: "note-wr-d3-001",
    encounterId: "enc-ward-round-d3",
    category: "Progress",
    noteType: "Ward Round Note",
    author: "Fairbrother, Nadia",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "(A) General Medicine — Ward 7B",
    dateOfService: "07/07/26 0830",
    fileTime: "07/07/26 0852",
    timestamp: 1783413000,
    status: "signed",
    body: `GENERAL MEDICINE WARD ROUND (SHO) — Day 3

S: Left leg "no better, if anything tighter". No fever, sleeping poorly with
the leg discomfort. Independent at home; keen to get back to work (drives HGV).

O: T 36.9, HR 88, BP 132/80, RR 16, SpO2 97% RA. NEWS2 1.
Left lower leg: warm, red from mid-calf down, tense and swollen; tender calf.
Right leg normal. No obvious break in the skin. Chest clear, HS normal.

Bloods this morning: CRP 31 (28 on admission), WCC 8.9 — both essentially
unchanged. Afebrile throughout the admission.

Impression: left leg cellulitis — slow to respond to IV flucloxacillin, day 3.

Plan:
- Continue IV flucloxacillin; discuss ADDING oral clindamycin if no better by
  tomorrow.
- Elevate leg, mark the erythema margin, continue emollient.
- Repeat CRP in 48h.
- Await consultant round this afternoon.`,
  },
  {
    kind: "note",
    id: "note-wr-d2-001",
    encounterId: "enc-ward-round-d2",
    category: "Progress",
    noteType: "Ward Round Note",
    author: "Okafor, Emeka",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "(A) General Medicine — Ward 7B",
    dateOfService: "06/07/26 0910",
    fileTime: "06/07/26 0934",
    timestamp: 1783326600,
    status: "signed",
    body: `GENERAL MEDICINE WARD ROUND — Day 2

S: Left leg pain ongoing, no systemic symptoms. Afebrile overnight.

O: HR 84, BP 134/82, RR 16, SpO2 97% RA, apyrexial. NEWS2 1.
Left calf remains swollen and tender, erythema stable at the marked margin.
Right calf normal.

Bloods (admission set reviewed): WCC 8.9 (normal), neutrophils 6.1, CRP 28.
Skin swab sent yesterday.

Impression: left lower leg cellulitis, early — inflammatory markers modest but
continue current treatment.

Plan:
- Continue IV flucloxacillin 2 g QDS (day 2).
- Analgesia, leg elevation, emollient to the venous eczema.
- Chase skin swab result.
- Review response tomorrow; consider oral switch vs escalation.`,
  },
  {
    kind: "note",
    id: "note-hp-001",
    encounterId: "enc-admission",
    category: "H&P",
    noteType: "Admission Clerking",
    author: "Sandhu, Priya",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "(A) General Medicine — Ward 7B",
    dateOfService: "04/07/26 2140",
    fileTime: "04/07/26 2218",
    timestamp: 1783198800,
    status: "signed",
    admission: true,
    body: `GENERAL MEDICINE ADMISSION CLERKING
Admission Date: 04/07/2026 — PCP: Adebayo, Femi, MD

CC: Red, swollen, painful left lower leg.

HISTORY OF PRESENT ILLNESS:
Colin Ashworth is a 59-year-old man referred by ED with a 4-day history of a
red, swollen, painful left lower leg. He first noticed tightness and aching in
the left calf about a week ago, with the redness developing over the following
days. No injury, no bite, no ulcer or obvious skin break that he can identify.

He is a long-distance HGV driver and returned on 18/06 from a holiday in
Australia (long-haul flight, ~22 hours' travel). Since then he has been back to
long driving shifts. He has known varicose veins on the left leg with some
chronic skin discolouration around the ankle, for which his GP prescribes
emollient.

No breathlessness, no chest pain, no haemoptysis. No fevers or rigors that he
has noticed.

PAST MEDICAL HISTORY:
- Essential hypertension
- Obesity (BMI 31.4)
- Varicose veins, left leg — with venous eczema (GP letter 03/2026)

MEDICATIONS (on admission):
- Amlodipine 10 mg PO OD
- Atorvastatin 20 mg PO ON
- Cetraben emollient — topical, as needed

ALLERGIES: No known drug allergies.

EXAMINATION:
- Comfortable, apyrexial. T 36.8, HR 86, BP 138/86, RR 16, SpO2 97% RA.
- Left lower leg: erythema from mid-calf to ankle, warm, tender. Calf tense and
  swollen compared with the right. Chronic haemosiderin staining at the medial
  ankle (venous). No fluctuance, no ulcer, no obvious portal of entry.
- Right leg: normal.
- Chest clear. Heart sounds normal, pulse regular.
- Abdomen soft, non-tender.

INVESTIGATIONS:
- Bloods: WCC 8.9, neutrophils 6.1, CRP 28. Hb 152. U&E normal.
- No imaging performed.

IMPRESSION:
1. Left lower leg cellulitis — on a background of chronic venous
   insufficiency / varicose eczema.

PLAN:
1. IV flucloxacillin 2 g QDS.
2. Analgesia; elevate the leg; emollient to the eczema.
3. Skin swab if any exudate.
4. Bloods in the morning; review response on the ward round.`,
  },
  {
    kind: "note",
    id: "note-ed-001",
    encounterId: "enc-ed",
    category: "ED Notes",
    noteType: "ED Provider Note",
    author: "Whitlock, Dominic",
    credential: "MD",
    authorRole: "*PHYSICIAN: FACULTY",
    service: "Emergency Department",
    dateOfService: "04/07/26 1820",
    fileTime: "04/07/26 1849",
    timestamp: 1783186800,
    status: "signed",
    admission: true,
    urgent: true,
    body: `EMERGENCY DEPARTMENT PROVIDER NOTE

Presenting complaint: red, swollen, painful left lower leg.

HPI: 59M, several days of an aching, tight, increasingly red left calf. No
trauma, no obvious skin breach. HGV driver, recently back from Australia. Known
varicose veins that side. No breathlessness or chest pain.

O/E: apyrexial, obs stable, NEWS2 1. Left calf swollen and tender with
erythema mid-calf to ankle; chronic venous skin changes at the ankle. Right
leg normal. Chest clear.

Bloods: WCC 8.9, CRP 28. Otherwise unremarkable.

Impression: left lower leg cellulitis. Note the leg is unilaterally swollen and
he has recent long-haul travel — if it fails to settle, the ward team should
consider a venous duplex to exclude a DVT. Referring to General Medicine for IV
antibiotics.

Plan: IV flucloxacillin, refer medicine, admit.`,
  },
  {
    kind: "note",
    id: "note-triage-001",
    encounterId: "enc-triage",
    category: "ED Notes",
    noteType: "ED Triage Note",
    author: "Beckett, Hannah",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "Emergency Department",
    dateOfService: "04/07/26 1655",
    fileTime: "04/07/26 1704",
    timestamp: 1783180500,
    status: "signed",
    admission: true,
    body: `ED TRIAGE NOTE

59M self-presented with a red, swollen, painful left lower leg, worsening over
several days. Walks in unaided. No fever reported.

Obs: T 36.7, HR 82, BP 140/88, RR 16, SpO2 98% RA. NEWS2 = 1.
No known drug allergies.

Left calf visibly larger than right, red and warm to touch, tender.
Triage category: Standard. Bloods and IV access obtained. Cellulitis pathway.`,
  },
  {
    kind: "note",
    id: "note-nurse-001",
    encounterId: "enc-admission",
    category: "Nursing",
    noteType: "Nursing Admission Assessment",
    author: "Dlamini, Thandi",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "(A) General Medicine — Ward 7B",
    dateOfService: "04/07/26 2310",
    fileTime: "04/07/26 2331",
    timestamp: 1783206600,
    status: "signed",
    admission: true,
    body: `NURSING ADMISSION ASSESSMENT

59M admitted to Ward 7B Bed 12 from ED with a red left leg.

Obs on arrival: T 36.8, HR 84, BP 136/84, RR 16, SpO2 97% RA. NEWS2 = 1.
Comfortable, apyrexial.

Left leg assessment: calf firm and swollen, skin red and shiny mid-calf to
ankle, warm to touch. Chronic brown staining and dry eczematous skin at the
inner ankle. No wound, ulcer or break in the skin seen. Leg elevated on a
pillow. Calf circumference measured at the widest point — LEFT 41 cm,
RIGHT 37 cm — recorded on the observation chart.

Risk assessments: falls — low. Pressure areas (Waterlow) — low. VTE assessment
form — not completed by the admitting team; flagged in handover. No mechanical
or pharmacological VTE prophylaxis prescribed as yet.

One peripheral cannula (18G, right forearm) sited; IV flucloxacillin
commenced. Patient comfortable, updated.`,
  },
  {
    kind: "note",
    id: "note-nurse-002",
    encounterId: "enc-ward-round-d2",
    category: "Nursing",
    noteType: "Nursing Shift Note",
    author: "Pereira, Anaïs",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "(A) General Medicine — Ward 7B",
    dateOfService: "06/07/26 2130",
    fileTime: "06/07/26 2144",
    timestamp: 1783366200,
    status: "signed",
    body: `NURSING SHIFT NOTE (Late)

Settled evening. Apyrexial throughout the shift; obs within normal limits,
NEWS2 1. IV flucloxacillin given as prescribed.

Patient reports the left calf feels "more swollen and tight" than on admission
and is uncomfortable at night. Leg kept elevated. Erythema margin marked by the
day team unchanged. Continues to ask whether the swelling could be "a clot from
the flight" — reassured that the doctors are reviewing.

Calf remains noticeably larger on the left. Mobilising slowly to the toilet
with the frame. No breathlessness or chest pain reported.`,
  },
  {
    kind: "encounterSummary",
    id: "admission-encounter-001",
    encounterId: "enc-admission",
    title: "Admission — ED to Hosp-Admission",
    type: "Hospital Encounter",
    department: "General Medicine",
    author: "Hollis, Margaret, MD (Attending)",
    signedAt: "04/07 21:00",
    body: `ADMISSION  [Current]
04/07/2026 21:00 — present       Mount Verdant Hospital
Admitting / Attending: Hollis, Margaret, MD — General Medicine

PRINCIPAL PROBLEM:
Left lower leg erythema and swelling — working label ?cellulitis.

ENCOUNTER NOTES:
- ED Provider Note — Whitlock, Dominic, MD (Emergency Medicine)
- Admission Clerking — Sandhu, Priya, MD (General Medicine)

HOSPITAL PROBLEM LIST:
◆ Left lower leg cellulitis (working) — PRINCIPAL
- Left calf swelling — L > R (charted on admission)
- Chronic venous insufficiency — varicose veins / venous eczema
- Recent long-haul air travel (18/06/2026)
- Essential hypertension
- Obesity (BMI 31.4)

CARE TIMELINE:
16:55  Triage — red left leg, NEWS2 1
18:20  Seen by ED provider; cellulitis pathway, IV antibiotics
21:00  Admitted — General Medicine, Ward 7B Bed 12

EXPECTED MEDICATION LIST:
- Flucloxacillin 2 g IV QDS — NEW (cellulitis)
- Amlodipine 10 mg PO OD — continued
- Atorvastatin 20 mg PO ON — continued
- Cetraben emollient TOP — continued
- Paracetamol 1 g PO QDS PRN

VTE ASSESSMENT: not completed at admission.
ALLERGIES: No known drug allergies.
CODE STATUS: For escalation. ISOLATION: None.

All patient data are synthetic. For education and simulation only. Not for clinical use.`,
  },
  {
    kind: "letter",
    id: "gp-veins-letter-001",
    encounterId: "enc-gp-veins",
    title: "Primary Care — Varicose Veins / Venous Eczema",
    type: "Letter",
    department: "Primary Care",
    author: "Adebayo, Femi, MD",
    signedAt: "14/03/2026",
    body: `Dear colleague,

Re: Mr Colin Ashworth — review of the left leg.

Mr Ashworth attends with longstanding varicose veins of the left leg and a
patch of dry, itchy, discoloured skin around the inner ankle. On examination
there are visible varicosities in the long saphenous distribution, with
haemosiderin staining and eczematous change at the medial malleolus — venous
eczema on a background of chronic venous insufficiency. No ulceration. Pedal
pulses present.

Plan:
- Regular emollient (Cetraben) and a mild topical steroid for flares.
- Compression hosiery advised; he finds these difficult with his job (HGV
  driver, long shifts seated).
- Weight loss and leg elevation advised.
- Routine referral to the vascular clinic for consideration of varicose vein
  treatment; non-urgent.

His blood pressure remains a little high at 146/90 — amlodipine continued.

All patient data are synthetic. For education and simulation only. Not for clinical use.

Kind regards,
Dr F. Adebayo`,
  },
  {
    kind: "lab",
    id: "lab-bloods-admit-001",
    encounterId: "enc-bloods-admit",
    title: "Admission Bloods — FBC, U&E, CRP",
    status: "Final",
    specimen: "Blood (serum + EDTA), venepuncture",
    collected: "04/07/2026 17:10",
    received: "04/07/2026 17:26",
    reportedAt: "04/07/2026 17:55",
    orderedBy: "Whitlock, Dominic, MD (Emergency Medicine)",
    resultingLab: "LegendCare Clinical Laboratory, Mount Verdant Hospital",
    rows: admissionLabRows,
  },
  {
    kind: "lab",
    id: "lab-bloods-d3-001",
    encounterId: "enc-bloods-d3",
    title: "Repeat FBC + CRP — Day 3 Bloods",
    status: "Final",
    specimen: "Blood (serum + EDTA), venepuncture",
    collected: "07/07/2026 07:20",
    received: "07/07/2026 07:38",
    reportedAt: "07/07/2026 08:05",
    orderedBy: "Okafor, Emeka, MD (General Medicine)",
    resultingLab: "LegendCare Clinical Laboratory, Mount Verdant Hospital",
    rows: [
      { test: "Hb", value: "150", units: "g/L", range: "130–180", flag: "" },
      { test: "WCC", value: "8.9", units: "x10⁹/L", range: "4.0–11.0", flag: "" },
      { test: "Neutrophils", value: "6.0", units: "x10⁹/L", range: "2.0–7.5", flag: "" },
      { test: "Platelets", value: "301", units: "x10⁹/L", range: "150–400", flag: "" },
      { test: "CRP", value: "31", units: "mg/L", range: "<5", flag: "H" },
      { test: "Sodium", value: "140", units: "mmol/L", range: "135–145", flag: "" },
      { test: "Potassium", value: "4.3", units: "mmol/L", range: "3.5–5.3", flag: "" },
      { test: "Urea", value: "5.6", units: "mmol/L", range: "2.5–7.8", flag: "" },
      { test: "Creatinine", value: "90", units: "µmol/L", range: "60–110", flag: "" },
    ],
  },
  {
    kind: "micro",
    id: "micro-swab-001",
    encounterId: "enc-swab",
    title: "Skin Swab — Left Leg",
    status: "Final",
    specimen: "Skin swab, left lower leg",
    collected: "05/07/2026 08:00",
    received: "05/07/2026 10:20",
    reportedAt: "06/07/2026 09:15",
    resultText:
      "No exudate present; swab taken from intact erythematous skin. Culture: mixed skin flora, no significant growth. No predominant pathogen isolated. Note: cellulitis is a clinical diagnosis and a swab of intact skin rarely yields the causative organism.",
    organisms: [],
  },
];

/** Note-kind documents only — feeds the Notes activity and Chart Review > Notes. */
export const caseDvt001Notes = caseDvt001Documents.filter(
  (doc): doc is Extract<ClinicalDocument, { kind: "note" }> => doc.kind === "note",
);
