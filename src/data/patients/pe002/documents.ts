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
  "hs-Troponin I": "ng/L",
  "Glucose (serum)": "mmol/L",
  "Lactate (venous)": "mmol/L",
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
 * Single source of truth for the synthetic high-risk PE case (Merrick, Joanne,
 * 48F): every clinical document, note-kind and report-kind, in one list. Both
 * views derive from it — the Notes activity (and Chart Review > Notes sub-tab)
 * filter to `kind: "note"`, while the Encounters timeline resolves each row's
 * primary document by `encounterId`.
 *
 * CASE SHAPE — massive (high-risk) PE presenting as syncope, triaged down the
 * "?first seizure" pathway (symptom-to-specialty reflex, not label-anchoring):
 *  - Collapse at work with brief LOC and a few limb jerks → "?first fit, refer
 *    neurology, CT head". But the AMBULANCE collateral refutes an ictal event:
 *    no tongue-biting, no incontinence, no post-ictal phase — talking within a
 *    minute, complaining of breathlessness and chest tightness. Convulsive
 *    syncope, not epilepsy.
 *  - The chart contradicts the pathway all morning: BP 100/64 → 86/52, HR
 *    112 → 124, SpO2 90–93% on air — charted, never revisited. The ECG shows
 *    sinus tachycardia with TWI V1–V4 and ?S1Q3T3, read as "nonspecific".
 *  - VTE substrate lives in old encounters: TLH+BSO 3 weeks ago (3 h 50 op,
 *    prophylaxis stopped at discharge) and oral combined HRT continued
 *    perioperatively; the GP saw exertional breathlessness and calf cramp five
 *    days before the collapse and called it deconditioning.
 *  - Severity signals: hs-troponin 89, venous lactate 3.4, respiratory
 *    alkalosis on the gas. CT head normal.
 *  - Latent/system hooks (NOT individual blame): the neurology referral sat
 *    unanswered for hours (registrar in clinic); the ED registrar (the player,
 *    Kaur, d165927) was pulled into a trauma call mid-review; the midday
 *    consultant board round finally names the mismatch and moves her to resus.
 *  - The ST3 task: reject the seizure label, risk-stratify as HIGH-RISK PE
 *    (hypotension + RV strain), assess for thrombolysis with a contraindication
 *    screen (3 weeks post-surgery), image (CTPA vs bedside echo if too unstable
 *    to travel), start UFH, and escalate — not "await neurology".
 *
 * All content is fabricated for education and simulation only. Not for clinical use.
 */
export const casePe002Documents: ClinicalDocument[] = [
  {
    kind: "note",
    id: "note-triage-001",
    encounterId: "enc-triage",
    category: "ED Notes",
    noteType: "ED Triage Note",
    author: "Pritchard, Carys",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "Emergency Department",
    dateOfService: "07/07/26 0805",
    fileTime: "07/07/26 0816",
    timestamp: 1783411500,
    status: "signed",
    admission: true,
    urgent: true,
    body: `ED TRIAGE NOTE

48F BIBA — collapsed at work ~06:45 with brief LOC and "shaking of the arms"
witnessed by a colleague. ?First fit. Handover per ambulance sheet (attached to
chart). GCS 15 on arrival, orientated. Denies headache. Says she felt "dizzy
and out of breath" just before going down. No tongue bite seen on inspection.

Obs: T 36.7, HR 112, BP 100/64, RR 22, SpO2 93% RA. NEWS2 = 6.
No known drug allergies.

Plan per first-seizure pathway: majors cubicle, neuro obs commenced, ECG and
bloods, CT head to be requested by doctor, anticipate neurology referral.
Triage category: urgent. Placed Majors 9.`,
  },
  {
    kind: "note",
    id: "note-ed-001",
    encounterId: "enc-ed",
    category: "ED Notes",
    noteType: "ED Clerking Note",
    author: "Adeoye, Tobi",
    credential: "MD",
    authorId: "d418362",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "Emergency Department",
    dateOfService: "07/07/26 0915",
    fileTime: "07/07/26 0938",
    timestamp: 1783415700,
    status: "signed",
    admission: true,
    urgent: true,
    body: `ED CLERKING — ?FIRST SEIZURE

PC: collapse at work with LOC and limb twitching.

HPI: 48F office manager. Witnessed collapse ~06:45 walking to a meeting —
colleague says she "went down without warning" with a few seconds of jerking
of the arms. LOC <1 minute. She recalls sudden dizziness and feeling short of
breath on standing from her desk, then waking on the floor. Since arrival
describes ongoing chest tightness "like a band", worse on a deep breath, and
feels breathless at rest. No headache, no aura, no previous fits or faints.

PMH: total laparoscopic hysterectomy + BSO 16/06/2026 (fibroids/menorrhagia).
Perimenopausal — on HRT. Otherwise well.
DH: estradiol 2 mg / norethisterone 1 mg PO OD (HRT); paracetamol PRN. NKDA.

O/E: alert, GCS 15, orientated. HR 114 regular, BP 96/60, RR 22, SpO2 92% RA,
afebrile. Chest clear, heart sounds normal. Abdomen: laparoscopic port sites
healing well. Calves soft — mentions a right calf ache "since the op", no
obvious swelling. Neuro: PEARL, no focal deficit, normal speech, no tongue
trauma, no incontinence reported.

ECG: sinus tachycardia, some anterior T-wave changes — no ST elevation,
?nonspecific. Sats 92% — ?hyperventilation during recovery.

Impression: ?first seizure (witnessed convulsive activity).

Plan:
- CT head (requested).
- Bloods + VBG sent.
- Refer neurology — first-seizure pathway.
- Neuro obs, monitor in majors. Nil by mouth until reviewed.
- Seizure safety and driving advice to be covered by neurology.`,
  },
  {
    kind: "note",
    id: "note-nurse-001",
    encounterId: "enc-nursing-obs",
    category: "Nursing",
    noteType: "Nursing Note — Observations",
    author: "Nowak, Agata",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "Emergency Department",
    dateOfService: "07/07/26 1030",
    fileTime: "07/07/26 1041",
    timestamp: 1783420200,
    status: "signed",
    admission: true,
    body: `ED NURSING NOTE

Neuro obs continue — GCS 15 throughout, pupils equal and reacting. No further
jerking or twitching observed.

However BP trending down: 100/64 at triage → 92/58 at 10:00 → 88/54 now.
HR 118–122. SpO2 91% on air — she says she is "puffed" just talking. RR 24.
Looks pale. C/o chest tightness on deep breaths.

Awaiting CT head report and neurology review (referral placed 09:45).
Doctor informed of obs — ED registrar asked to review.`,
  },
  {
    kind: "note",
    id: "note-reg-001",
    encounterId: "enc-reg-review",
    category: "ED Notes",
    noteType: "ED Registrar — Interim Entry",
    author: "Kaur, Simran",
    credential: "MD",
    authorId: "d165927",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "Emergency Department",
    dateOfService: "07/07/26 1040",
    fileTime: "07/07/26 1047",
    timestamp: 1783420800,
    status: "signed",
    body: `ED REGISTRAR — INTERIM ENTRY

Asked by nursing staff to review re: falling BP (92/58 → 88/54). Currently
committed in resus with a trauma call — brief review only.

Alert, GCS 15, talking in full sentences but says she feels "washed out" and
faint when she sits up. Warm peripheries.

Asked for:
- Sodium chloride 0.9% 250 ml IV bolus, reassess.
- Obs every 15 minutes; escalate to me or the EM consultant if NEWS2 rises
  or systolic <90 again.
- Chase CT head report and the neurology referral.

Will return to complete a full assessment as soon as I am freed from resus.`,
  },
  {
    kind: "note",
    id: "note-nurse-002",
    encounterId: "enc-nursing-escalation",
    category: "Nursing",
    noteType: "Nursing Note — Escalation",
    author: "Nowak, Agata",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "Emergency Department",
    dateOfService: "07/07/26 1140",
    fileTime: "07/07/26 1148",
    timestamp: 1783424400,
    status: "signed",
    urgent: true,
    body: `ED NURSING NOTE — ESCALATION

11:35 obs: BP 86/52 (after the 250 ml bolus), HR 124, RR 26, SpO2 90% RA —
oxygen 2 L/min via nasal cannulae commenced, SpO2 92%. T 36.9. NEWS2 = 8.

Went grey and clammy sitting forward onto the commode — near-faint, settled
lying flat. Remains GCS 15.

Neurology: switchboard called x2 (09:45, 11:35) — registrar in clinic until
early afternoon, no review yet. Patient has now been on the referral list
nearly 2 hours with worsening obs.

ED registrar informed (in resus); EM consultant reviewing the department at
the midday board round — flagged for immediate discussion.`,
  },
  {
    kind: "note",
    id: "note-cons-001",
    encounterId: "enc-board",
    category: "ED Notes",
    noteType: "EM Consultant Board Round",
    author: "Sinclair, Rachel",
    credential: "MD",
    authorId: "d073418",
    authorRole: "*PHYSICIAN: FACULTY",
    service: "Emergency Department",
    dateOfService: "07/07/26 1150",
    fileTime: "07/07/26 1158",
    timestamp: 1783425000,
    status: "signed",
    urgent: true,
    body: `EMERGENCY MEDICINE CONSULTANT — MIDDAY BOARD ROUND

Majors 9 flagged: "?first seizure, awaiting neurology" — on the referral list
since 09:45 with no review, while the obs chart has moved: BP 100/64 → 86/52,
HR 112 → 124, SpO2 90–91% on air (now on 2 L). CT head reported normal at
10:15.

A patient on a first-fit pathway should be well between events. This one is
not: hypotensive, hypoxic and persistently tachycardic. That is a haemodynamic
problem until proven otherwise, and it is not explained by a normal CT head or
a post-ictal state — the ambulance sheet documents there wasn't one.

Actions:
- Move to RESUS now.
- Allocated to ED registrar (Kaur) for immediate full reassessment and a
  diagnosis-level rethink — do not wait for neurology.
- I am in the department and available.`,
  },
  {
    kind: "encounterSummary",
    id: "ed-encounter-001",
    encounterId: "enc-admission",
    title: "ED Attendance — Emergency Department",
    type: "Hospital Encounter",
    department: "Emergency Medicine",
    author: "Sinclair, Rachel, MD (Attending)",
    signedAt: "07/07/2026 07:58",
    body: `ED ATTENDANCE  [Current]
07/07/2026 07:58 — present   Mount Verdant Hospital
Attending: Sinclair, Rachel, MD — Emergency Medicine

PRINCIPAL PROBLEM:
Collapse ?cause — "?first seizure" triage label under review.

ENCOUNTER NOTES:
- ED Clerking Note — Adeoye, Tobi, MD (Emergency Medicine)
- EM Consultant Board Round — Sinclair, Rachel, MD (Emergency Medicine)

HOSPITAL PROBLEM LIST:
◆ Collapse with brief LOC and limb twitching — PRINCIPAL
- Hypotension with persistent tachycardia (BP 100/64 → 86/52)
- Hypoxia — SpO2 90–93% on air, on oxygen from 11:35
- ECG: sinus tachycardia, TWI V1–V4, ?S1Q3T3
- Total laparoscopic hysterectomy + BSO 16/06/2026 (3 weeks ago)
- Oral combined HRT (continued perioperatively)

CARE TIMELINE:
06:45  Witnessed collapse at work — brief LOC, few seconds of limb jerking
07:20  Ambulance on scene — talking, breathless; SpO2 89% RA
07:58  Arrived ED; 08:05 triage "?first fit" — first-seizure pathway
08:30  ECG — read as "nonspecific" anterior T-wave changes
09:15  ED clerking — CT head + neurology referral (placed 09:45)
10:15  CT head normal. Obs deteriorating through the morning
11:35  BP 86/52, SpO2 90% RA — nursing escalation; still no neurology review
11:50  EM consultant board round — moved to resus, ED registrar allocated

EXPECTED MEDICATION LIST:
- Oxygen — titrated to saturations (2 L/min nasal cannulae from 11:35)
- Sodium chloride 0.9% 250 ml IV bolus (given 10:45) — reassess
- Paracetamol 1 g PO PRN
- Estradiol 2 mg / norethisterone 1 mg PO OD — home HRT, not given today

ALLERGIES: No known drug allergies.
CODE STATUS: For escalation. ISOLATION: None.

All patient data are synthetic. For education and simulation only. Not for clinical use.`,
  },
  {
    kind: "report",
    id: "ambulance-001",
    encounterId: "enc-ambulance",
    title: "Ambulance Patient Record",
    type: "Pre-Hospital Record",
    department: "Ambulance Service",
    author: "Hughes, Dylan (Paramedic)",
    signedAt: "07/07/2026 07:52",
    body: `AMBULANCE PATIENT RECORD — EMERGENCY CALL 06:52

48F, witnessed collapse at her workplace ~06:45.

WITNESS ACCOUNT (colleague, spoke to crew on scene): walking to a meeting,
"went very pale, said she felt dizzy, and went down". A few seconds of jerking
of both arms after she fell. NO tongue-biting seen. NO incontinence. She came
round within a minute and was TALKING TO US NORMALLY when we arrived — no
confusion or drowsiness at any point. Kept saying she couldn't catch her
breath and her chest felt tight.

ON SCENE: GCS 15, orientated. Pale, sweaty. Denies headache.
Obs 07:20: HR 122, BP 92/58, RR 26, SpO2 89% RA → 94% on O2 4 L/min.
BM 6.8. Temp 36.6. ECG (3-lead): sinus tachycardia.

HISTORY FROM PATIENT: hysterectomy three weeks ago; on HRT. Has felt "puffed"
climbing stairs for about a week. No previous fits or faints.

Handover to ED triage 07:58: witnessed collapse with some shaking — ?first
fit vs faint. Obs as above. Crew impression documented verbatim.`,
  },
  {
    kind: "report",
    id: "ecg-report-001",
    encounterId: "enc-ecg",
    title: "12-Lead ECG",
    type: "ECG Report",
    department: "Emergency Department",
    author: "Reviewed: Adeoye, Tobi, MD",
    signedAt: "07/07/2026 08:30",
    body: `12-LEAD ECG — 07/07/2026 08:30

Rate 118 bpm. Rhythm: sinus tachycardia.
Axis: rightward shift compared with age-expected normal.

Machine interpretation: ABNORMAL ECG —
- T-wave inversion V1–V4.
- Prominent S wave in lead I; Q wave with T-wave inversion in lead III
  (?S1Q3T3 pattern).
- No ST-segment elevation. QTc 412 ms.

Reviewing clinician comment (08:35): no ST elevation — anterior T-wave
changes ?nonspecific. For troponin as sent.`,
  },
  {
    kind: "report",
    id: "ct-head-001",
    encounterId: "enc-cthead",
    title: "CT Head (Non-Contrast)",
    type: "Radiology Report",
    department: "Radiology",
    author: "Fenwick, Laura, MD (Radiology)",
    signedAt: "07/07/2026 10:15",
    body: `EXAMINATION: CT head without contrast.
CLINICAL DETAILS: Witnessed collapse with brief LOC and limb jerking.
?First seizure. ?Intracranial cause.

FINDINGS:
- No acute intracranial haemorrhage. No extra-axial collection.
- No established or acute territorial infarct. Grey-white differentiation
  preserved.
- No mass, mass effect or midline shift. Ventricles and basal cisterns normal.
- Bones: no fracture.

IMPRESSION:
Normal study. No acute intracranial abnormality to explain the presentation.`,
  },
  {
    kind: "order",
    id: "neuro-referral-001",
    encounterId: "enc-neuro-referral",
    title: "Referral — Neurology (First Seizure)",
    type: "Referral Order",
    department: "Emergency Department",
    author: "Adeoye, Tobi, MD",
    signedAt: "07/07/2026 09:45",
    body: `REFERRAL — NEUROLOGY (FIRST-SEIZURE PATHWAY)

Reason: 48F witnessed collapse with brief LOC and limb jerking — ?first fit.
CT head requested. For neurology review and first-fit workup / driving advice.

Obs at referral: HR 114, BP 96/60, RR 22, SpO2 92% RA.

STATUS: AWAITING NEUROLOGY REVIEW.
09:45 — switchboard message left for neurology registrar (Iqbal).
11:35 — chased by nursing staff: registrar in clinic until early afternoon,
        will attend "when able".`,
  },
  {
    kind: "lab",
    id: "lab-vbg-001",
    encounterId: "enc-vbg",
    title: "Venous Blood Gas (POC)",
    status: "Final",
    specimen: "Venous blood, gas syringe (point-of-care)",
    collected: "07/07/2026 08:10",
    reportedAt: "07/07/2026 08:15",
    orderedBy: "Adeoye, Tobi, MD (Emergency Medicine)",
    resultingLab: "ED blood gas analyser (POCT), Mount Verdant Hospital",
    rows: [
      { test: "pH", value: "7.48", units: "", range: "7.35–7.45", flag: "H" },
      { test: "pCO2", value: "3.4", units: "kPa", range: "4.7–6.0", flag: "L" },
      { test: "HCO3-", value: "20", units: "mmol/L", range: "22–26", flag: "L" },
      { test: "Base excess", value: "-3.2", units: "mmol/L", range: "-2 – +2", flag: "L" },
      { test: "Lactate", value: "3.4", units: "mmol/L", range: "0.5–2.2", flag: "H" },
      { test: "Glucose", value: "8.2", units: "mmol/L", range: "3.5–7.8", flag: "H" },
      { test: "Sodium", value: "138", units: "mmol/L", range: "135–145", flag: "" },
      { test: "Potassium", value: "4.2", units: "mmol/L", range: "3.5–5.3", flag: "" },
    ],
  },
  {
    kind: "lab",
    id: "lab-bloods-admit-001",
    encounterId: "enc-bloods-admit",
    title: "Admission Bloods — FBC, U&E, CRP, Troponin, Glucose",
    status: "Final",
    specimen: "Blood (serum + EDTA), venepuncture",
    collected: "07/07/2026 08:20",
    received: "07/07/2026 08:34",
    reportedAt: "07/07/2026 09:35",
    orderedBy: "Adeoye, Tobi, MD (Emergency Medicine)",
    resultingLab: "LegendCare Clinical Laboratory, Mount Verdant Hospital",
    rows: admissionLabRows,
  },
  {
    kind: "letter",
    id: "gp-postop-001",
    encounterId: "enc-gp-postop",
    title: "Primary Care — Post-Operative Check",
    type: "Letter",
    department: "Primary Care",
    author: "Rowlands, Gareth, MD",
    signedAt: "02/07/2026",
    body: `Dear colleague,

I reviewed Mrs Merrick for her post-operative check, 2+ weeks after her
laparoscopic hysterectomy and bilateral salpingo-oophorectomy. Port sites are
healing well with no sign of infection.

She reports feeling more tired than expected and, for the past four or five
days, breathless climbing the stairs with a "tight" chest at the top — she has
not regained her usual fitness and has been resting at home more than advised.
She also mentions cramping in the right calf at night. Examination today:
chest clear, HR 92, SpO2 not recorded; calves soft, no overt swelling or
tenderness on the day.

Impression: post-operative deconditioning; possible mild anaemia contributing
(Hb 118 on discharge bloods). Advised a graded return to activity and daily
walks. HRT repeats issued as before. Review in two weeks, sooner if worse.

Kind regards,
Dr G. Rowlands`,
  },
  {
    kind: "report",
    id: "gynae-discharge-001",
    encounterId: "enc-gynae-dc",
    title: "Gynaecology — Discharge Summary",
    type: "Discharge Summary",
    department: "Gynaecology",
    author: "Ashcroft, Helena, MD (Gynaecology)",
    signedAt: "18/06/2026",
    body: `GYNAECOLOGY DISCHARGE SUMMARY

Admission: 16/06/2026 — elective. Discharged: 18/06/2026 (day 2).

Procedure (16/06/2026): total laparoscopic hysterectomy + bilateral
salpingo-oophorectomy for fibroid uterus / menorrhagia. Operative time
PROLONGED at 3 h 50 min (dense adhesions, difficult access; completed
laparoscopically). EBL 400 ml. Histology: benign leiomyomata.

Post-operative course: uncomplicated. Mobilising with physiotherapy day 1.
Hb 118 on day-2 bloods — no transfusion indicated.

VTE prophylaxis: anti-embolism stockings + dalteparin 5000 units s/c OD while
an inpatient. Extended (post-discharge) pharmacological prophylaxis NOT
prescribed — benign indication, laparoscopic approach, per local protocol.
Advised to mobilise regularly at home.

Medications on discharge: paracetamol PRN; ibuprofen PRN with food; estradiol
2 mg / norethisterone 1 mg OD (HRT — continued throughout admission per
pre-operative plan).

Follow-up: GP wound check at 2 weeks; gynaecology clinic 6/52.
Safety-netting: return if fever, wound concerns, heavy bleeding, unilateral
leg swelling, chest pain or breathlessness.`,
  },
  {
    kind: "letter",
    id: "preop-letter-001",
    encounterId: "enc-preop",
    title: "Pre-Operative Assessment Clinic",
    type: "Letter",
    department: "Pre-Operative Assessment",
    author: "Vaughan, Bethan, RN (Pre-Op Assessment)",
    signedAt: "09/06/2026",
    body: `PRE-OPERATIVE ASSESSMENT — TLH + BSO (16/06/2026)

48F. ASA II. BMI 27.4 (weight 79.2 kg). Observations normal. Bloods
satisfactory. Anaesthetic history: nil of note. NKDA.

Medications: estradiol 2 mg / norethisterone 1 mg PO OD (oral combined HRT);
paracetamol PRN.

VTE risk discussed: oestrogen-containing HRT increases perioperative venous
thromboembolism risk, and guidance to consider stopping 4 weeks before major
surgery was explained. After discussion (significant vasomotor symptoms on a
previous break in treatment) the patient ELECTED TO CONTINUE HRT through the
perioperative period. Plan accepted by the surgical team: mechanical
prophylaxis + inpatient dalteparin, early mobilisation.

Cleared for surgery. Fasting and admission instructions given.`,
  },
  {
    kind: "order",
    id: "hrt-refill-001",
    encounterId: "enc-hrt-refill",
    title: "Repeat Prescription — HRT",
    type: "Medication Order",
    department: "Primary Care",
    author: "Rowlands, Gareth, MD",
    signedAt: "15/05/2026",
    body: `REPEAT PRESCRIPTION (issued electronically to community pharmacy)

Drug: Estradiol 2 mg / norethisterone acetate 1 mg tablets (combined HRT)
Directions: Take ONE tablet daily.
Quantity: 84 tablets (12 weeks).
Indication: Perimenopausal vasomotor symptoms.

Last issue: 20/02/2026. Compliance good per pharmacy record. Annual review
done 03/2026 — symptoms well controlled, BP within range.`,
  },
  {
    kind: "letter",
    id: "gynae-clinic-001",
    encounterId: "enc-gynae-clinic",
    title: "Gynaecology Clinic — Menorrhagia / Fibroids",
    type: "Letter",
    department: "Gynaecology",
    author: "Ashcroft, Helena, MD (Gynaecology)",
    signedAt: "28/04/2026",
    body: `Dear colleague,

Thank you for referring Mrs Merrick, who I saw in clinic with worsening
menorrhagia despite medical management. Ultrasound confirms a fibroid uterus
(largest 6 cm intramural). Hb 112 — mild iron-deficiency anaemia, on ferrous
sulfate.

We discussed the options; she has completed her family and wishes definitive
treatment. I have listed her for a total laparoscopic hysterectomy with
bilateral salpingo-oophorectomy. Given the BSO she is keen to continue her
HRT afterwards, which is reasonable; the pre-operative assessment team will
cover perioperative medication planning, including her oral HRT.

She will receive a date for late June. Consent taken today, risks discussed
including bleeding, infection, visceral injury, conversion to open surgery
and venous thromboembolism.

Kind regards,
Miss H. Ashcroft`,
  },
  {
    kind: "letter",
    id: "gp-hrt-001",
    encounterId: "enc-gp-hrt",
    title: "Primary Care — HRT Initiation",
    type: "Letter",
    department: "Primary Care",
    author: "Rowlands, Gareth, MD",
    signedAt: "11/03/2025",
    body: `Dear colleague,

Mrs Merrick attended with troublesome perimenopausal vasomotor symptoms —
flushes and night sweats affecting sleep and work. Periods remain heavy (see
separate referral). BP 124/78, BMI 27. Never-smoker. No personal or family
history of venous thromboembolism or breast cancer.

After discussion of benefits and risks — including the small increase in VTE
risk with oral preparations — we started combined oral HRT (estradiol 2 mg /
norethisterone acetate 1 mg daily). Transdermal options discussed; she
preferred tablets. Review at 3 months, then annually.

Kind regards,
Dr G. Rowlands`,
  },
];

/** Note-kind documents only — feeds the Notes activity and Chart Review > Notes. */
export const casePe002Notes = casePe002Documents.filter(
  (doc): doc is Extract<ClinicalDocument, { kind: "note" }> => doc.kind === "note",
);
