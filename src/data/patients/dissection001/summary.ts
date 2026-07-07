import type { CaseSummary } from "../../../types";

/** Synthetic summary-dashboard content for the aortic dissection case. */
export const caseDissection001Summary: CaseSummary = {
  workingDiagnosis: "?renal colic (label on the chart — re-read the evidence)",

  /**
   * Vitals through the ED stay. Two stories run side by side: the pain "settles"
   * as opioid is escalated (codeine -> morphine), yet the systolic pressure sits
   * in the 180s–190s the entire time and nobody sets a target. The transient dip
   * at 06:40 is after codeine, not treatment of the hypertension.
   */
  vitalsTrend: [
    { t: "05:20", sys: 204, dia: 110, hr: 92, resp: 20, spo2: 96, tempC: 36.8 },
    { t: "05:45", sys: 196, dia: 106, hr: 96, resp: 20, spo2: 97, tempC: 36.9 },
    { t: "06:40", sys: 186, dia: 100, hr: 88, resp: 18, spo2: 97, tempC: 37.0 },
    { t: "07:20", sys: 196, dia: 106, hr: 84, resp: 18, spo2: 98, tempC: 36.9 },
    { t: "09:50", sys: 184, dia: 98, hr: 80, resp: 16, spo2: 98, tempC: 37.1 },
    { t: "10:20", sys: 190, dia: 102, hr: 78, resp: 16, spo2: 98, tempC: 37.0 },
  ],

  activeProblems: [
    "?Renal colic (working label — re-read the chart)",
    "Severe hypertension (180–190s systolic, unmanaged)",
    "CT KUB: dilated thoracic aorta — dedicated CT aortogram advised, not actioned",
    "Ex-smoker (~40 pack-years)",
  ],

  ipMeds: [
    {
      medication: "Morphine sulfate",
      conc: "2–4 mg",
      method: "IV",
      freq: "PRN (titrated)",
      lastDose: "06/07/2026 09:35",
    },
    {
      medication: "Codeine phosphate",
      conc: "60 mg",
      method: "PO",
      freq: "QDS PRN",
      lastDose: "06/07/2026 06:35",
    },
    {
      medication: "Paracetamol",
      conc: "1 g",
      method: "IV/PO",
      freq: "QDS PRN",
      lastDose: "06/07/2026 06:10",
    },
    {
      medication: "Metoclopramide",
      conc: "10 mg",
      method: "IV",
      freq: "TDS PRN",
      lastDose: "06/07/2026 07:20",
    },
    {
      medication: "Sodium chloride 0.9%",
      conc: "1 L",
      method: "IV",
      freq: "Cont.",
      lastDose: "06/07/2026 06:25",
    },
  ],

  weights: [
    { when: "06/07/2026 06:30", value: "88.0 kg" },
  ],

  firstWeight: { when: "20/06/2026", value: "88.5 kg" },

  microbiology: [
    {
      date: "06/07/2026",
      time: "06:15",
      state: "Urinalysis (dipstick) — NEGATIVE for blood; no nitrites/leucocytes",
    },
  ],

  // No lines or drains beyond peripheral cannulae for this presentation.
  linesDrains: [],

  diseaseReports: [
    "Home Meds",
    "History",
    "Problem List",
    "Cardiovascular Risk",
    "Results Review",
    "Imaging",
    "Blood Pressure Hx",
    "Anticoagulation",
    "Care Plan",
  ],
};
