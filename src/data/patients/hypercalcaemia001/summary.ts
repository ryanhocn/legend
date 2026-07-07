import type { CaseSummary } from "../../../types";

/** Synthetic summary-dashboard content for the hypercalcaemia ("off legs") case. */
export const caseHypercalcaemia001Summary: CaseSummary = {
  workingDiagnosis: "?social admission / ?UTI (label on the chart — read the chemistry)",

  /**
   * Vitals are unremarkable enough to have fed the "social admission" label: no
   * fever, a mildly high heart rate and a borderline low BP consistent with the
   * dehydration of hypercalcaemia rather than sepsis. The story is in the bloods,
   * not the obs.
   */
  vitalsTrend: [
    { t: "05/07 14:00", sys: 118, dia: 72, hr: 92, resp: 18, spo2: 96, tempC: 36.6 },
    { t: "05/07 20:00", sys: 112, dia: 68, hr: 96, resp: 18, spo2: 96, tempC: 36.8 },
    { t: "06/07 02:00", sys: 108, dia: 66, hr: 98, resp: 18, spo2: 95, tempC: 36.5 },
    { t: "06/07 06:00", sys: 110, dia: 68, hr: 94, resp: 18, spo2: 96, tempC: 36.7 },
    { t: "06/07 10:00", sys: 114, dia: 70, hr: 90, resp: 18, spo2: 96, tempC: 36.6 },
    { t: "06/07 14:00", sys: 116, dia: 72, hr: 88, resp: 17, spo2: 97, tempC: 36.7 },
  ],

  activeProblems: [
    "?Social admission — 'off legs' (clerking label)",
    "?UTI (urine dip weak-positive)",
    "Hypercalcaemia — adjusted calcium 3.18 (UNACTIONED)",
    "Acute kidney injury",
    "Normocytic anaemia, ESR 92 — myeloma screen pending",
    "Constipation",
    "Essential hypertension",
  ],

  ipMeds: [
    {
      medication: "Bendroflumethiazide",
      conc: "2.5 mg",
      method: "PO",
      freq: "OD",
      lastDose: "06/07/2026 08:00",
    },
    {
      medication: "Adcal-D3 (calcium carbonate/colecalciferol)",
      conc: "1 tab",
      method: "PO",
      freq: "BD",
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
      medication: "Trimethoprim",
      conc: "200 mg",
      method: "PO",
      freq: "BD",
      lastDose: "06/07/2026 08:00",
    },
    {
      medication: "Sodium chloride 0.9%",
      conc: "1 L",
      method: "IV",
      freq: "8-hourly",
      lastDose: "06/07/2026 09:20",
    },
  ],

  weights: [
    { when: "06/07/2026", value: "56.5 kg" },
    { when: "05/07/2026", value: "56.5 kg" },
  ],

  firstWeight: { when: "20/01/2026", value: "63.0 kg" },

  microbiology: [
    { date: "05/07", time: "18:40", state: "Urine culture — mixed growth, no significant bacteriuria (probable contaminant)" },
  ],

  // No lines, drains or wounds on this admission.
  linesDrains: [],

  diseaseReports: [
    "Home Meds",
    "History",
    "Problem List",
    "Results Review",
    "Bone Profile",
    "Renal",
    "Falls Assessment",
    "Imaging",
    "Care Plan",
  ],
};
