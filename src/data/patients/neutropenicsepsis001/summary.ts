import type { CaseSummary } from "../../../types";

/** Synthetic summary-dashboard content for the neutropenic sepsis case. */
export const caseNeutropenicsepsis001Summary: CaseSummary = {
  workingDiagnosis: "neutropenic sepsis, day 10 post-chemotherapy",

  /**
   * Vitals over the morning in ED. Note the 07:45 reading after paracetamol at
   * triage: the temperature transiently normalises (the false reassurance that
   * kept her in the waiting room) before the observations trend frankly septic.
   */
  vitalsTrend: [
    { t: "07:10", sys: 118, dia: 74, hr: 96, resp: 18, spo2: 97, tempC: 38.2 },
    { t: "07:45", sys: 116, dia: 72, hr: 98, resp: 18, spo2: 98, tempC: 37.4 },
    { t: "09:15", sys: 104, dia: 64, hr: 108, resp: 20, spo2: 96, tempC: 37.9 },
    { t: "10:00", sys: 98, dia: 58, hr: 116, resp: 22, spo2: 95, tempC: 38.6 },
    { t: "11:00", sys: 95, dia: 56, hr: 118, resp: 22, spo2: 95, tempC: 38.4 },
    { t: "12:30", sys: 108, dia: 66, hr: 104, resp: 20, spo2: 96, tempC: 37.9 },
  ],

  activeProblems: [
    "?Neutropenic sepsis",
    "Severe neutropenia (0.3)",
    "Breast cancer — adjuvant docetaxel (cycle 2, day 10)",
    "Penicillin anaphylaxis",
    "?Source — oral mucositis / pharyngitis",
  ],

  ipMeds: [
    {
      medication: "Aztreonam",
      conc: "2 g",
      method: "IV",
      freq: "TDS",
      lastDose: "06/07/2026 11:25",
    },
    {
      medication: "Vancomycin",
      conc: "1.25 g",
      method: "IV",
      freq: "BD (levels)",
      lastDose: "06/07/2026 11:30",
    },
    {
      medication: "Gentamicin",
      conc: "5 mg/kg",
      method: "IV",
      freq: "OD",
      lastDose: "06/07/2026 11:35",
    },
    {
      medication: "Sodium chloride 0.9%",
      conc: "1 L",
      method: "IV",
      freq: "Cont.",
      lastDose: "06/07/2026 10:10",
    },
    {
      medication: "Paracetamol",
      conc: "1 g",
      method: "IV/PO",
      freq: "QDS PRN",
      lastDose: "06/07/2026 07:20",
    },
  ],

  weights: [
    { when: "06/07/2026 08:40", value: "68.5 kg" },
    { when: "26/06/2026", value: "69.2 kg" },
  ],

  firstWeight: { when: "18/03/2026", value: "72.0 kg" },

  microbiology: [
    { date: "06/07/2026", time: "09:25", state: "Blood cultures x2 — no growth to date (pending)" },
  ],

  // No lines or drains beyond peripheral cannulae for this presentation.
  linesDrains: [],

  diseaseReports: [
    "Home Meds",
    "Oncology History",
    "Problem List",
    "Neutropenic Sepsis Pathway",
    "Results Review",
    "Chemotherapy Record",
    "Microbiology Hx",
    "Imaging",
    "Care Plan",
  ],
};
