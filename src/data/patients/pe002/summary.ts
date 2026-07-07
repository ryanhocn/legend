import type { CaseSummary } from "../../../types";

/**
 * Synthetic summary-dashboard content for the high-risk pulmonary embolism case
 * (Merrick, Joanne, 48F). The vitals trend tells the story the "?first seizure"
 * label does not: through the morning the blood pressure falls, the heart rate
 * climbs and the saturations sit low on air — a haemodynamic problem, not a
 * post-ictal one.
 */
export const casePe002Summary: CaseSummary = {
  workingDiagnosis:
    "collapse ?first seizure (triage label — under active challenge; obs point elsewhere)",

  /** Vitals across the morning: hypotension worsens, tachycardia climbs, sats stay low on air. */
  vitalsTrend: [
    { t: "08:00", sys: 100, dia: 64, hr: 112, resp: 22, spo2: 93, tempC: 36.7 },
    { t: "09:00", sys: 98, dia: 62, hr: 114, resp: 22, spo2: 92, tempC: 36.7 },
    { t: "10:00", sys: 92, dia: 58, hr: 118, resp: 24, spo2: 91, tempC: 36.8 },
    { t: "10:30", sys: 88, dia: 54, hr: 120, resp: 24, spo2: 91, tempC: 36.8 },
    { t: "11:00", sys: 90, dia: 56, hr: 122, resp: 25, spo2: 90, tempC: 36.9 },
    { t: "11:35", sys: 86, dia: 52, hr: 124, resp: 26, spo2: 90, tempC: 36.9 },
  ],

  activeProblems: [
    "Collapse with brief LOC and limb twitching — '?first seizure' label under review",
    "Hypotension with persistent tachycardia (BP 100/64 → 86/52, HR 112 → 124)",
    "Hypoxia — SpO2 90–93% on air, oxygen from 11:35",
    "ECG: sinus tachycardia, anterior T-wave inversion, ?S1Q3T3",
    "Total laparoscopic hysterectomy + BSO (16/06/2026, prolonged operation)",
    "Oral combined HRT (continued perioperatively)",
  ],

  ipMeds: [
    {
      medication: "Oxygen",
      conc: "2 L/min",
      method: "NC",
      freq: "Titrated to sats",
      lastDose: "07/07/2026 11:35",
    },
    {
      medication: "Sodium chloride 0.9%",
      conc: "250 ml",
      method: "IV",
      freq: "STAT",
      lastDose: "07/07/2026 10:45",
    },
    {
      medication: "Paracetamol",
      conc: "1 g",
      method: "PO",
      freq: "QDS PRN",
      lastDose: "Not given today",
    },
    {
      medication: "Estradiol / norethisterone",
      conc: "2 mg / 1 mg",
      method: "PO",
      freq: "OD (home HRT)",
      lastDose: "06/07/2026 08:00",
    },
  ],

  weights: [{ when: "07/07/2026 08:30", value: "78.6 kg" }],

  firstWeight: { when: "09/06/2026", value: "79.2 kg" },

  microbiology: [
    {
      date: "07/07/2026",
      time: "08:20",
      state: "No cultures sent — infection not suspected (CRP 6, apyrexial)",
    },
  ],

  linesDrains: [
    { label: "Peripheral cannula — R antecubital", kind: "line", days: 1, x: 66, y: 44 },
  ],

  diseaseReports: [
    "Home Meds",
    "History",
    "Problem List",
    "VTE Assessment",
    "Results Review",
    "Anticoagulation",
    "ECG",
    "Imaging",
    "Care Plan",
  ],
};
