import type { CaseSummary } from "../../../types";

/** Synthetic summary-dashboard content for the delirium ("dementia getting worse") case. */
export const caseDelirium001Summary: CaseSummary = {
  workingDiagnosis:
    "?dementia progression ?UTI (label on the chart — the collateral says otherwise)",

  /**
   * Vitals tell the delirium story, not a sepsis one: afebrile throughout, with a
   * hypertensive, tachycardic spike in the small hours when he was agitated and
   * climbing over the bed rails, settling towards morning. Nothing here supports
   * the "?UTI" framing — the abnormal organ is the brain, and the drivers are on
   * the drug chart and in the bladder.
   */
  vitalsTrend: [
    { t: "05/07 18:30", sys: 142, dia: 82, hr: 96, resp: 18, spo2: 96, tempC: 37.2 },
    { t: "05/07 22:00", sys: 138, dia: 80, hr: 92, resp: 18, spo2: 96, tempC: 37.0 },
    { t: "06/07 02:30", sys: 148, dia: 84, hr: 104, resp: 20, spo2: 95, tempC: 37.3 },
    { t: "06/07 06:00", sys: 140, dia: 80, hr: 98, resp: 18, spo2: 96, tempC: 37.1 },
    { t: "06/07 10:00", sys: 136, dia: 78, hr: 92, resp: 18, spo2: 96, tempC: 36.9 },
    { t: "06/07 14:00", sys: 138, dia: 78, hr: 94, resp: 18, spo2: 96, tempC: 37.0 },
  ],

  activeProblems: [
    "?Dementia progression (clerking label — collateral contradicts)",
    "?UTI (dip positive, nitrites negative — culture mixed growth)",
    "Acute agitation and confusion over 48 h — 4AT NOT completed",
    "?Urinary retention — suprapubic fullness + dribbling; bladder scan NOT done",
    "High anticholinergic burden — oxybutynin (new 15/06), amitriptyline, codeine",
    "Constipation — no bowels open 5 days (stool chart)",
    "AKI — creatinine 142 (baseline 88, 02/2026)",
    "Parkinson's disease — haloperidol PRN added overnight, unreviewed",
  ],

  ipMeds: [
    {
      medication: "Co-careldopa 25/100",
      conc: "1 tab",
      method: "PO",
      freq: "TDS (time-critical)",
      lastDose: "06/07/2026 13:00",
    },
    {
      medication: "Oxybutynin",
      conc: "5 mg",
      method: "PO",
      freq: "BD",
      lastDose: "06/07/2026 08:00",
    },
    {
      medication: "Amitriptyline",
      conc: "10 mg",
      method: "PO",
      freq: "ON",
      lastDose: "05/07/2026 22:00",
    },
    {
      medication: "Codeine",
      conc: "30 mg",
      method: "PO",
      freq: "QDS PRN",
      lastDose: "06/07/2026 08:10",
    },
    {
      medication: "Tamsulosin",
      conc: "400 micrograms",
      method: "PO",
      freq: "OD",
      lastDose: "06/07/2026 08:00",
    },
    {
      medication: "Cefalexin",
      conc: "500 mg",
      method: "PO",
      freq: "TDS",
      lastDose: "06/07/2026 12:00",
    },
    {
      medication: "Haloperidol",
      conc: "0.5 mg",
      method: "PO/IM",
      freq: "PRN (added overnight)",
      lastDose: "06/07/2026 03:10",
    },
    {
      medication: "Amlodipine",
      conc: "5 mg",
      method: "PO",
      freq: "OD",
      lastDose: "06/07/2026 08:00",
    },
  ],

  weights: [
    { when: "06/07/2026", value: "71.0 kg" },
    { when: "05/07/2026", value: "71.2 kg" },
  ],

  firstWeight: { when: "14/10/2025", value: "73.5 kg" },

  microbiology: [
    {
      date: "06/07",
      time: "09:20",
      state: "Urine culture — mixed growth, no significant bacteriuria (probable contaminant)",
    },
  ],

  // No catheter, lines or drains — the absent catheter is part of the story.
  linesDrains: [],

  diseaseReports: [
    "Home Meds",
    "History",
    "Problem List",
    "Results Review",
    "Delirium Screen",
    "Renal",
    "Falls Assessment",
    "Imaging",
    "Care Plan",
  ],
};
