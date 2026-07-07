import type { CaseSummary } from "../../../types";

/** Synthetic summary-dashboard content for the pulmonary embolism case. */
export const casePe001Summary: CaseSummary = {
  workingDiagnosis:
    "infective exacerbation of COPD (working label — poor response to treatment)",

  /** Vitals trend since last night: the tachycardia never settles, the sats never climb. */
  vitalsTrend: [
    { t: "22:00", sys: 128, dia: 76, hr: 110, resp: 24, spo2: 89, tempC: 37.2 },
    { t: "02:00", sys: 124, dia: 74, hr: 112, resp: 24, spo2: 88, tempC: 37.1 },
    { t: "06:00", sys: 126, dia: 74, hr: 108, resp: 22, spo2: 89, tempC: 37.0 },
    { t: "08:00", sys: 122, dia: 72, hr: 106, resp: 23, spo2: 90, tempC: 37.2 },
    { t: "10:00", sys: 124, dia: 74, hr: 112, resp: 26, spo2: 88, tempC: 37.3 },
    { t: "12:00", sys: 126, dia: 76, hr: 110, resp: 24, spo2: 89, tempC: 37.1 },
  ],

  activeProblems: [
    "?Infective exacerbation of COPD — poor response to treatment",
    "Hypoxia — disproportionate to CXR findings",
    "Persistent sinus tachycardia",
    "COPD (FEV1 52% predicted, 03/2026)",
    "Right total knee arthroplasty (15/06/2026)",
    "Essential hypertension",
  ],

  ipMeds: [
    {
      medication: "Salbutamol",
      conc: "2.5 mg",
      method: "NEB",
      freq: "QDS + PRN",
      lastDose: "06/07/2026 10:00",
    },
    {
      medication: "Ipratropium",
      conc: "500 micrograms",
      method: "NEB",
      freq: "QDS",
      lastDose: "06/07/2026 06:00",
    },
    {
      medication: "Prednisolone",
      conc: "30 mg",
      method: "PO",
      freq: "OD",
      lastDose: "06/07/2026 08:00",
    },
    {
      medication: "Doxycycline",
      conc: "100 mg",
      method: "PO",
      freq: "OD",
      lastDose: "06/07/2026 08:00",
    },
    {
      medication: "Amlodipine",
      conc: "5 mg",
      method: "PO",
      freq: "OD",
      lastDose: "06/07/2026 08:00",
    },
    {
      medication: "Paracetamol",
      conc: "1 g",
      method: "PO",
      freq: "QDS PRN",
      lastDose: "05/07/2026 22:00",
    },
  ],

  weights: [
    { when: "06/07/2026 06:00", value: "78.0 kg" },
    { when: "05/07/2026 21:00", value: "78.2 kg" },
  ],

  firstWeight: { when: "15/06/2026", value: "79.5 kg" },

  microbiology: [
    {
      date: "06/07/2026",
      time: "08:00",
      state: "Sputum — poor-quality (salivary) sample; no significant growth",
    },
  ],

  linesDrains: [
    { label: "Peripheral cannula — L forearm", kind: "line", days: 1, x: 34, y: 44 },
  ],

  diseaseReports: [
    "Home Meds",
    "History",
    "Problem List",
    "VTE Assessment",
    "Results Review",
    "Anticoagulation",
    "Microbiology Hx",
    "Imaging",
    "Care Plan",
  ],
};
