import type { CaseSummary } from "../../../types";

/** Synthetic summary-dashboard content for the NSTEMI-as-dyspepsia case. */
export const caseNstemi001Summary: CaseSummary = {
  workingDiagnosis:
    "presumed dyspepsia — under review (dynamic troponin rise, ?evolving NSTEMI)",

  /** Vitals since arrival: never septic, hypertensive throughout, a tachycardic blip with the 23:30 episode. */
  vitalsTrend: [
    { t: "18:00", sys: 158, dia: 94, hr: 92, resp: 18, spo2: 97, tempC: 36.8 },
    { t: "20:00", sys: 154, dia: 92, hr: 88, resp: 16, spo2: 97, tempC: 36.7 },
    { t: "23:30", sys: 148, dia: 86, hr: 104, resp: 20, spo2: 96, tempC: 36.6 },
    { t: "01:00", sys: 142, dia: 84, hr: 90, resp: 16, spo2: 97, tempC: 36.5 },
    { t: "05:00", sys: 138, dia: 82, hr: 86, resp: 16, spo2: 97, tempC: 36.6 },
    { t: "07:00", sys: 144, dia: 84, hr: 88, resp: 16, spo2: 97, tempC: 36.7 },
  ],

  activeProblems: [
    "Epigastric pain — ?dyspepsia / ?ACS (troponin rising)",
    "Type 2 diabetes mellitus",
    "AKI on CKD 3a — eGFR 28 (baseline 52)",
    "Essential hypertension",
    "Hyperlipidaemia",
  ],

  ipMeds: [
    {
      medication: "Gaviscon Advance",
      conc: "10 mL",
      method: "PO",
      freq: "QDS PRN",
      lastDose: "05/07/2026 23:35",
    },
    {
      medication: "Lansoprazole",
      conc: "30 mg",
      method: "PO",
      freq: "OD",
      lastDose: "06/07/2026 08:05",
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
      conc: "5 mg",
      method: "PO",
      freq: "OD",
      lastDose: "06/07/2026 08:05",
    },
    {
      medication: "Amlodipine",
      conc: "5 mg",
      method: "PO",
      freq: "OD",
      lastDose: "06/07/2026 08:05",
    },
    {
      medication: "Atorvastatin",
      conc: "40 mg",
      method: "PO",
      freq: "ON",
      lastDose: "05/07/2026 22:00",
    },
    {
      medication: "GTN spray",
      conc: "400 micrograms",
      method: "SL",
      freq: "PRN",
      lastDose: "Not given",
    },
  ],

  weights: [
    { when: "06/07/2026 06:00", value: "86.2 kg" },
    { when: "05/07/2026 21:00", value: "86.4 kg" },
  ],

  firstWeight: { when: "14/04/2026", value: "87.0 kg" },

  // No cultures sent — this is not an infective picture (CRP 4, apyrexial).
  microbiology: [],

  linesDrains: [
    { label: "Peripheral cannula — R forearm (20G)", kind: "line", days: 1, x: 27, y: 48 },
  ],

  diseaseReports: [
    "Home Meds",
    "History",
    "Problem List",
    "ACS Pathway",
    "Results Review",
    "Renal Function",
    "Allergy Review",
    "ECG Series",
    "Care Plan",
  ],
};
