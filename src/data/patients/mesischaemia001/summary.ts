import type { CaseSummary } from "../../../types";

/** Synthetic summary-dashboard content for the mesenteric ischaemia case. */
export const caseMesischaemia001Summary: CaseSummary = {
  workingDiagnosis: "?viral gastroenteritis with dehydration (per admission clerking)",

  /** Vitals trend overnight — quietly the wrong direction while "comfortable". */
  vitalsTrend: [
    { t: "22:00", sys: 138, dia: 82, hr: 108, resp: 18, spo2: 96, tempC: 36.9 },
    { t: "00:00", sys: 130, dia: 78, hr: 112, resp: 18, spo2: 96, tempC: 37.0 },
    { t: "02:00", sys: 122, dia: 74, hr: 116, resp: 20, spo2: 95, tempC: 37.1 },
    { t: "04:00", sys: 112, dia: 70, hr: 118, resp: 22, spo2: 95, tempC: 37.2 },
    { t: "06:00", sys: 104, dia: 68, hr: 122, resp: 22, spo2: 95, tempC: 37.3 },
    { t: "08:00", sys: 98, dia: 60, hr: 126, resp: 24, spo2: 94, tempC: 37.4 },
  ],

  activeProblems: [
    "?Gastroenteritis (working label — under review)",
    "Acute severe generalised abdominal pain",
    "Atrial fibrillation — NOT currently anticoagulated",
    "Previous TIA (09/2024)",
    "Essential hypertension",
  ],

  ipMeds: [
    {
      medication: "Morphine sulfate",
      conc: "10 mg",
      method: "IV/SC",
      freq: "2-hourly PRN",
      lastDose: "06/07/2026 08:30",
    },
    {
      medication: "Cyclizine",
      conc: "50 mg",
      method: "IV",
      freq: "TDS PRN",
      lastDose: "06/07/2026 04:50",
    },
    {
      medication: "Sodium chloride 0.9%",
      conc: "1 L",
      method: "IV",
      freq: "Cont.",
      lastDose: "06/07/2026 07:30",
    },
    {
      medication: "Paracetamol",
      conc: "1 g",
      method: "IV/PO",
      freq: "QDS PRN",
      lastDose: "06/07/2026 06:00",
    },
    {
      medication: "Bisoprolol",
      conc: "5 mg",
      method: "PO",
      freq: "OD",
      lastDose: "06/07/2026 08:00",
    },
  ],

  weights: [
    { when: "06/07/2026 06:00", value: "76.2 kg" },
    { when: "05/07/2026 22:00", value: "76.8 kg" },
  ],

  firstWeight: { when: "24/03/2026", value: "78.0 kg" },

  microbiology: [
    {
      date: "06/07/2026",
      time: "06:15",
      state: "Stool culture + C. difficile — no pathogens isolated to date (pending)",
    },
  ],

  // Pain-and-fluids patient so far — no lines, drains, or wounds charted.
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
