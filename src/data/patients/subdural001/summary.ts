import type { CaseSummary } from "../../../types";

/**
 * Synthetic summary-dashboard content for the subdural case. The vitals trend is
 * deliberately quiet on the "sepsis" axes (afebrile, SpO2 fine) while the story
 * hides in plain sight: blood pressure creeping up and the heart rate drifting
 * down over the morning — an early pressure pattern that rewards actually
 * reading the trend, exactly like the GCS column on the obs chart.
 */
export const caseSubdural001Summary: CaseSummary = {
  workingDiagnosis: "?urinary tract infection / deconditioning (under review)",

  /** Vitals trend over the last few hours (one reading per timepoint). */
  vitalsTrend: [
    { t: "04:00", sys: 128, dia: 72, hr: 80, resp: 16, spo2: 96, tempC: 36.7 },
    { t: "06:00", sys: 132, dia: 74, hr: 76, resp: 16, spo2: 96, tempC: 36.8 },
    { t: "08:00", sys: 134, dia: 74, hr: 74, resp: 15, spo2: 96, tempC: 36.8 },
    { t: "10:00", sys: 138, dia: 76, hr: 70, resp: 15, spo2: 95, tempC: 36.9 },
    { t: "12:00", sys: 142, dia: 76, hr: 66, resp: 14, spo2: 95, tempC: 36.8 },
    { t: "14:00", sys: 144, dia: 78, hr: 64, resp: 14, spo2: 95, tempC: 36.9 },
  ],

  activeProblems: [
    "Fluctuating drowsiness — cause not established",
    "?UTI (dip trace leucocytes only)",
    "Fall with head strike 26/06 — on apixaban",
    "Atrial fibrillation",
    "Recurrent falls",
    "Hypertension",
  ],

  ipMeds: [
    {
      medication: "Apixaban",
      conc: "5 mg",
      method: "PO",
      freq: "BD",
      lastDose: "06/07/2026 08:00",
    },
    {
      medication: "Nitrofurantoin MR",
      conc: "100 mg",
      method: "PO",
      freq: "BD",
      lastDose: "06/07/2026 08:00",
    },
    {
      medication: "Bisoprolol",
      conc: "2.5 mg",
      method: "PO",
      freq: "OD",
      lastDose: "06/07/2026 08:00",
    },
    {
      medication: "Paracetamol",
      conc: "1 g",
      method: "PO",
      freq: "QDS PRN",
      lastDose: "06/07/2026 06:15",
    },
  ],

  weights: [
    { when: "06/07/2026 06:00", value: "56.4 kg" },
    { when: "05/07/2026 21:30", value: "56.6 kg" },
  ],

  firstWeight: { when: "21/04/2026", value: "57.9 kg" },

  microbiology: [
    {
      date: "06/07/2026",
      time: "10:05",
      state: "Urine culture — mixed growth, ?contamination (preliminary)",
    },
  ],

  // One peripheral cannula only — nothing else in or out.
  linesDrains: [],

  diseaseReports: [
    "Home Meds",
    "History",
    "Problem List",
    "Falls Bundle",
    "Results Review",
    "Anticoagulation",
    "Microbiology Hx",
    "Imaging",
    "Care Plan",
  ],
};
