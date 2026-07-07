import type { Encounter } from "../../../types";

/**
 * Chart Review > Encounters timeline for the high-risk pulmonary embolism case
 * (Merrick, Joanne, 48F). Newest first, grouped by recency like Epic's Chart
 * Review. A row resolves its primary document by `encounterId` (see
 * documents.ts) and opens it in the right rail.
 *
 * Array order is the timeline's source of truth: the recency buckets are
 * hand-curated and not reproducible by date math, so the rows are kept in
 * display order rather than sorted. The current date for this case is
 * 07/07/2026 (what used to read "Today"); the whole ED presentation runs across
 * the morning of 07/07/2026, from the 06:45 collapse to the 11:50 board round.
 *
 * `class` drives the filter bar (inpatient / outpatient / ed); `admission` is
 * set only on the index ED attendance itself. `provider`, `deptAbbrev` and
 * `specialty` are hardcoded display metadata for this synthetic case.
 *
 * All content is synthetic. For education and simulation only. Not for clinical use.
 */
export const casePe002Encounters: Encounter[] = [
  {
    id: "enc-board",
    date: "07/07/2026",
    time: "11:50",
    class: "ed",
    type: "Consultant Review",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Sinclair, Rachel, MD",
    description:
      "Midday board round. A first-fit patient should be well between events — this one is hypotensive, hypoxic and tachycardic. Moved to resus; ED registrar to reassess, do not wait for neurology.",
    status: "Signed",
    location: "ED",
  },
  {
    id: "enc-nursing-escalation",
    date: "07/07/2026",
    time: "11:40",
    class: "ed",
    type: "Nursing",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Nowak, Agata, RN",
    description:
      "Escalation. BP 86/52 after 250 ml bolus, HR 124, SpO2 90% RA — oxygen started. Near-faint on sitting up. Nearly 2 h on the neurology list with no review; flagged for the board round.",
    status: "Signed",
    location: "ED",
  },
  {
    id: "enc-reg-review",
    date: "07/07/2026",
    time: "10:40",
    class: "ed",
    type: "Inpatient Review",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDRES",
    provider: "Kaur, Simran, MD",
    description:
      "ED registrar interim entry — brief review only, committed to a trauma call in resus. Fluid bolus and 15-minute obs requested; full reassessment to follow when freed.",
    status: "Signed",
    location: "Resus",
  },
  {
    id: "enc-nursing-obs",
    date: "07/07/2026",
    time: "10:30",
    class: "ed",
    type: "Nursing",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Nowak, Agata, RN",
    description:
      "Neuro obs GCS 15 throughout, no further jerking. BP trending down 100/64 → 88/54, HR 118–122, SpO2 91% RA, 'puffed' talking. Doctor informed; registrar asked to review.",
    status: "Signed",
    location: "ED",
  },
  {
    id: "enc-cthead",
    date: "07/07/2026",
    time: "10:15",
    class: "ed",
    type: "Imaging",
    specialty: "Radiology",
    deptAbbrev: "RADCT",
    provider: "Fenwick, Laura, MD",
    description:
      "CT head (non-contrast): normal study. No haemorrhage, infarct, mass or midline shift. No intracranial cause for the presentation.",
    status: "Final",
    location: "Radiology",
  },
  {
    id: "enc-neuro-referral",
    date: "07/07/2026",
    time: "09:45",
    class: "ed",
    type: "Referral",
    specialty: "Neurology",
    deptAbbrev: "NEUROL",
    provider: "Adeoye, Tobi, MD",
    description:
      "Referral to neurology on the first-seizure pathway. Switchboard messaged; registrar in clinic until early afternoon — 'will attend when able'. Awaiting review.",
    status: "Awaiting review",
    location: "ED",
  },
  {
    id: "enc-ed",
    date: "07/07/2026",
    time: "09:15",
    class: "ed",
    type: "ED Note",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Adeoye, Tobi, MD",
    description:
      "ED clerking ?first seizure. Chest tightness and breathlessness at rest, no tongue trauma or incontinence. ECG anterior T-wave changes read as nonspecific. For CT head + neurology.",
    status: "Signed",
    location: "ED",
  },
  {
    id: "enc-ecg",
    date: "07/07/2026",
    time: "08:30",
    class: "ed",
    type: "ECG",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Adeoye, Tobi, MD",
    description:
      "12-lead ECG: sinus tachycardia 118, rightward axis, T-wave inversion V1–V4, ?S1Q3T3. No ST elevation. Reviewer comment: anterior T-wave changes ?nonspecific.",
    status: "Final",
    location: "ED",
  },
  {
    id: "enc-bloods-admit",
    date: "07/07/2026",
    time: "08:20",
    class: "ed",
    type: "Bloods",
    specialty: "Clinical Biochemistry",
    deptAbbrev: "LAB",
    provider: "",
    description:
      "FBC/U&E broadly unremarkable, CRP 6, only modest neutrophilia. hs-Troponin I 89 ng/L (H). Glucose 8.2. Not an infective panel.",
    status: "Final",
    location: "Lab",
  },
  {
    id: "enc-vbg",
    date: "07/07/2026",
    time: "08:10",
    class: "ed",
    type: "Blood Gas",
    specialty: "Emergency Medicine",
    deptAbbrev: "POCT",
    provider: "",
    description:
      "Venous blood gas: respiratory alkalosis (pH 7.48, pCO2 3.4) with venous lactate 3.4 (H). Blowing off CO2 and hypoperfused, not retaining.",
    status: "Final",
    location: "ED",
  },
  {
    id: "enc-triage",
    date: "07/07/2026",
    time: "08:05",
    class: "ed",
    type: "ED Triage",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Pritchard, Carys, RN",
    description:
      "Triaged ?first fit per ambulance handover. GCS 15, felt 'dizzy and out of breath' before collapse, no tongue bite seen. HR 112, BP 100/64, SpO2 93% RA. NEWS2 6. Placed Majors 9.",
    status: "Signed",
    location: "ED",
  },
  {
    id: "enc-admission",
    date: "07/07/2026",
    time: "07:58",
    class: "ed",
    type: "ED Attendance (Current)",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Sinclair, Rachel, MD",
    description:
      "Index ED attendance. Principal problem: collapse ?cause — '?first seizure' triage label under review. Mount Verdant ED.",
    status: "In department",
    location: "ED",
    principalProblem: "Collapse with brief LOC and limb twitching — '?first seizure' label under review",
    admission: true,
  },
  {
    id: "enc-ambulance",
    date: "07/07/2026",
    time: "07:20",
    class: "ed",
    type: "Pre-Hospital",
    specialty: "Ambulance Service",
    deptAbbrev: "AMBU",
    provider: "Hughes, Dylan, Paramedic",
    description:
      "Ambulance record. Witnessed collapse ~06:45; few seconds of arm jerking, NO tongue-biting or incontinence, talking normally within a minute. Breathless. SpO2 89% RA → 94% on O2.",
    status: "Signed",
    location: "Pre-hospital",
  },
  {
    id: "enc-gp-postop",
    group: "Last Week",
    date: "02/07/2026",
    time: "11:10",
    class: "outpatient",
    type: "Letter",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Rowlands, Gareth, MD",
    description:
      "Post-operative check. Reports 4–5 days of exertional breathlessness with chest tightness and right calf cramp — attributed to post-op deconditioning. Graded return to activity advised.",
    status: "Signed",
    location: "GP",
  },
  {
    id: "enc-gynae-dc",
    group: "3 Weeks Ago",
    date: "18/06/2026",
    time: "14:00",
    class: "inpatient",
    type: "Discharge Summary",
    specialty: "Gynaecology",
    deptAbbrev: "GYNAE",
    provider: "Ashcroft, Helena, MD",
    description:
      "TLH + BSO 16/06 for fibroids — prolonged 3 h 50 operation, uncomplicated recovery. Inpatient dalteparin + stockings; extended post-discharge prophylaxis NOT prescribed. HRT continued throughout.",
    status: "Discharged",
    location: "Gynaecology Ward",
  },
  {
    id: "enc-preop",
    group: "4 Weeks Ago",
    date: "09/06/2026",
    time: "10:20",
    class: "outpatient",
    type: "Letter",
    specialty: "Pre-Operative Assessment",
    deptAbbrev: "PREOP",
    provider: "Vaughan, Bethan, RN",
    description:
      "Pre-op assessment for TLH + BSO. ASA II. VTE risk of oestrogen-containing HRT discussed; patient elected to CONTINUE HRT through the perioperative period. Mechanical + inpatient dalteparin planned.",
    status: "Signed",
    location: "Pre-Op Clinic",
  },
  {
    id: "enc-hrt-refill",
    group: "2 Months Ago",
    date: "15/05/2026",
    time: "09:30",
    class: "outpatient",
    type: "Refill",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Rowlands, Gareth, MD",
    description:
      "Repeat prescription: estradiol 2 mg / norethisterone 1 mg OD (combined HRT), 12-week supply. Compliance good; annual review symptoms controlled.",
    status: "Dispensed",
    location: "Community Pharmacy",
  },
  {
    id: "enc-gynae-clinic",
    group: "3 Months Ago",
    date: "28/04/2026",
    time: "11:15",
    class: "outpatient",
    type: "Letter",
    specialty: "Gynaecology",
    deptAbbrev: "GYNAE",
    provider: "Ashcroft, Helena, MD",
    description:
      "Gynaecology clinic. Fibroid uterus with menorrhagia, mild iron-deficiency anaemia. Listed for TLH + BSO; keen to continue HRT afterwards. Consent taken, VTE among risks discussed.",
    status: "Signed",
    location: "Gynaecology Clinic",
  },
  {
    id: "enc-gp-hrt",
    group: "Over a Year Ago",
    date: "11/03/2025",
    time: "09:50",
    class: "outpatient",
    type: "Letter",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Rowlands, Gareth, MD",
    description:
      "HRT initiation for perimenopausal vasomotor symptoms. Combined oral estradiol/norethisterone started; small oral-preparation VTE risk discussed. Never-smoker, no VTE history.",
    status: "Signed",
    location: "GP",
  },
];
