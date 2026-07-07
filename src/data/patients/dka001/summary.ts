import type { CaseSummary } from "../../../types";

/** Synthetic summary-dashboard content for the DKA case. */
export const caseDka001Summary: CaseSummary = {
  workingDiagnosis: "diabetic ketoacidosis — new presentation of type 1 diabetes",

  /**
   * Vitals over the morning in ED. The story is the tachycardia that never
   * settles with the "oral fluids trial" (04:55 → 08:15), the high respiratory
   * rate of Kussmaul compensation in an afebrile patient, and the improvement
   * only after fixed-rate insulin and IV fluids start at 08:50.
   */
  vitalsTrend: [
    { t: "04:55", sys: 104, dia: 62, hr: 118, resp: 24, spo2: 99, tempC: 36.9 },
    { t: "05:35", sys: 102, dia: 60, hr: 120, resp: 26, spo2: 99, tempC: 36.8 },
    { t: "06:30", sys: 100, dia: 58, hr: 122, resp: 26, spo2: 99, tempC: 36.8 },
    { t: "08:15", sys: 98, dia: 56, hr: 124, resp: 28, spo2: 99, tempC: 36.7 },
    { t: "09:40", sys: 106, dia: 62, hr: 112, resp: 22, spo2: 99, tempC: 36.9 },
    { t: "11:00", sys: 110, dia: 66, hr: 102, resp: 20, spo2: 99, tempC: 37.0 },
  ],

  activeProblems: [
    "Diabetic ketoacidosis (pH 7.18, ketones 5.8)",
    "Type 1 diabetes — new diagnosis (HbA1c 118)",
    "Hypokalaemia risk on insulin (K+ 3.4 — replacement running)",
    "Dehydration — pre-renal AKI (creatinine 118)",
    "Initial '?viral gastroenteritis' label — revised 08:15",
  ],

  ipMeds: [
    {
      medication: "Insulin (soluble) — fixed rate",
      conc: "6 units/hr",
      method: "IV",
      freq: "Cont. (0.1 units/kg/hr)",
      lastDose: "Running since 08:50",
    },
    {
      medication: "Sodium chloride 0.9% + KCl 40 mmol/L",
      conc: "1 L",
      method: "IV",
      freq: "Cont.",
      lastDose: "06/07/2026 09:55",
    },
    {
      medication: "Glucose 10%",
      conc: "1 L",
      method: "IV",
      freq: "When CBG <14",
      lastDose: "Not yet started",
    },
    {
      medication: "Ondansetron",
      conc: "4 mg",
      method: "IV",
      freq: "TDS PRN",
      lastDose: "06/07/2026 06:12",
    },
  ],

  weights: [{ when: "06/07/2026 09:00", value: "61.5 kg" }],

  firstWeight: { when: "25/05/2026", value: "68.4 kg" },

  microbiology: [
    {
      date: "06/07/2026",
      time: "05:00",
      state: "Stool culture — requested at triage (?gastroenteritis); never sent, stood down 08:15",
    },
  ],

  // Peripheral cannulae only for this presentation — no lines, drains, or wounds.
  linesDrains: [],

  diseaseReports: [
    "Home Meds",
    "History",
    "Problem List",
    "DKA Pathway",
    "Results Review",
    "Fluid Balance",
    "Diabetes Education",
    "Microbiology Hx",
    "Care Plan",
  ],
};
