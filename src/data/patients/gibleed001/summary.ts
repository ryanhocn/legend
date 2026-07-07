import type { CaseSummary } from "../../../types";

/** Synthetic summary-dashboard content for the GI-bleed-as-collapse case. */
export const caseGibleed001Summary: CaseSummary = {
  workingDiagnosis:
    "presumed vasovagal / postural collapse — under review (Hb falling, ?source of dark stools)",

  /** Never febrile — the story is volume: BP drifting down and HR climbing despite "rehydration". */
  vitalsTrend: [
    { t: "12:00", sys: 118, dia: 74, hr: 92, resp: 16, spo2: 97, tempC: 36.6 },
    { t: "18:00", sys: 116, dia: 72, hr: 94, resp: 16, spo2: 97, tempC: 36.5 },
    { t: "22:00", sys: 112, dia: 70, hr: 96, resp: 16, spo2: 97, tempC: 36.5 },
    { t: "02:00", sys: 110, dia: 68, hr: 98, resp: 18, spo2: 96, tempC: 36.4 },
    { t: "06:00", sys: 106, dia: 66, hr: 104, resp: 18, spo2: 96, tempC: 36.4 },
    { t: "10:00", sys: 104, dia: 64, hr: 108, resp: 18, spo2: 96, tempC: 36.5 },
  ],

  activeProblems: [
    "Collapse — ?vasovagal / ?postural hypotension",
    "Dark stools — attributed to oral iron (review)",
    "Anaemia — Hb 89 (141 in May)",
    "Atrial fibrillation (on apixaban)",
    "Osteoarthritis, right knee (on naproxen)",
    "Essential hypertension",
  ],

  ipMeds: [
    {
      medication: "Apixaban",
      conc: "5 mg",
      method: "PO",
      freq: "BD",
      lastDose: "06/07/2026 08:05",
    },
    {
      medication: "Naproxen",
      conc: "500 mg",
      method: "PO",
      freq: "BD",
      lastDose: "06/07/2026 08:05",
    },
    {
      medication: "Ferrous sulfate",
      conc: "200 mg",
      method: "PO",
      freq: "OD",
      lastDose: "06/07/2026 08:05",
    },
    {
      medication: "Bisoprolol",
      conc: "2.5 mg",
      method: "PO",
      freq: "OD",
      lastDose: "06/07/2026 08:05",
    },
    {
      medication: "Ramipril",
      conc: "4 mg",
      method: "PO",
      freq: "OD",
      lastDose: "06/07/2026 08:05",
    },
    {
      medication: "Atorvastatin",
      conc: "20 mg",
      method: "PO",
      freq: "ON",
      lastDose: "05/07/2026 22:00",
    },
    {
      medication: "Sodium chloride 0.9%",
      conc: "1 L",
      method: "IV",
      freq: "Cont.",
      lastDose: "06/07/2026 09:15",
    },
    {
      medication: "Paracetamol",
      conc: "1 g",
      method: "PO",
      freq: "QDS PRN",
      lastDose: "05/07/2026 20:10",
    },
  ],

  weights: [
    { when: "06/07/2026 06:00", value: "78.2 kg" },
    { when: "05/07/2026 12:00", value: "78.6 kg" },
  ],

  firstWeight: { when: "22/05/2026", value: "79.6 kg" },

  // No cultures sent — apyrexial, CRP 4; this is not an infective picture.
  microbiology: [],

  linesDrains: [
    { label: "Peripheral cannula — L forearm (20G)", kind: "line", days: 1, x: 73, y: 48 },
  ],

  diseaseReports: [
    "Home Meds",
    "History",
    "Problem List",
    "Results Review",
    "Anticoagulation",
    "Falls Bundle",
    "Stool Chart",
    "Care Plan",
  ],
};
