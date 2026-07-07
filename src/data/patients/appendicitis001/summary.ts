import type { CaseSummary } from "../../../types";

/** Synthetic summary-dashboard content for the atypical appendicitis case. */
export const caseAppendicitis001Summary: CaseSummary = {
  workingDiagnosis:
    "constipation with faecal loading (admission label — serial bloods and obs are trending against it)",

  /** Vitals trend across the admission (twice/thrice daily): a slow, insidious drift, not a crash. */
  vitalsTrend: [
    { t: "Sat 22:00", sys: 138, dia: 78, hr: 84, resp: 16, spo2: 97, tempC: 37.5 },
    { t: "Sun 06:00", sys: 132, dia: 76, hr: 88, resp: 16, spo2: 97, tempC: 37.6 },
    { t: "Sun 14:00", sys: 128, dia: 74, hr: 92, resp: 18, spo2: 96, tempC: 37.8 },
    { t: "Sun 20:00", sys: 124, dia: 72, hr: 96, resp: 18, spo2: 96, tempC: 37.9 },
    { t: "Mon 02:00", sys: 120, dia: 70, hr: 98, resp: 20, spo2: 95, tempC: 38.0 },
    { t: "Mon 05:30", sys: 118, dia: 70, hr: 102, resp: 20, spo2: 95, tempC: 38.1 },
  ],

  activeProblems: [
    "Constipation (?faecal loading) — admission label",
    "Right iliac fossa discomfort — cause not established",
    "Rising inflammatory markers — not yet reviewed",
    "AKI — creatinine 148 (baseline 76)",
    "Type 2 diabetes mellitus (metformin — continued)",
    "Essential hypertension",
  ],

  ipMeds: [
    {
      medication: "Senna",
      conc: "15 mg",
      method: "PO",
      freq: "ON",
      lastDose: "05/07/2026 22:00",
    },
    {
      medication: "Macrogol",
      conc: "1 sachet",
      method: "PO",
      freq: "BD",
      lastDose: "06/07/2026 08:00",
    },
    {
      medication: "Phosphate enema",
      conc: "128 mL",
      method: "PR",
      freq: "PRN",
      lastDose: "05/07/2026 10:30",
    },
    {
      medication: "Paracetamol",
      conc: "1 g",
      method: "PO",
      freq: "QDS",
      lastDose: "06/07/2026 06:00",
    },
    {
      medication: "Codeine phosphate",
      conc: "30 mg",
      method: "PO",
      freq: "QDS",
      lastDose: "06/07/2026 06:00",
    },
    {
      medication: "Metformin",
      conc: "1 g",
      method: "PO",
      freq: "BD",
      lastDose: "06/07/2026 08:05",
    },
    {
      medication: "Ramipril",
      conc: "2.5 mg",
      method: "PO",
      freq: "OD",
      lastDose: "06/07/2026 08:05",
    },
  ],

  weights: [
    { when: "06/07/2026 06:00", value: "71.2 kg" },
    { when: "Sat 04/07 22:00", value: "71.8 kg" },
  ],

  firstWeight: { when: "02/04/2026", value: "73.5 kg" },

  // No microbiology sent this admission — itself a gap the day-3 note should close.
  microbiology: [],

  // Oral meds only so far; no lines, drains or wounds.
  linesDrains: [],

  diseaseReports: [
    "Home Meds",
    "History",
    "Problem List",
    "Sepsis Bundle",
    "Results Review",
    "Anticoagulation",
    "Microbiology Hx",
    "Imaging",
    "Care Plan",
  ],
};
