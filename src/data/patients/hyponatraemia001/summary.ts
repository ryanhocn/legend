import type { CaseSummary } from "../../../types";

/**
 * Synthetic summary-dashboard content for the hyponatraemia case (Marsh,
 * Eileen, 71F). The vitals are deliberately unremarkable and the weight is
 * stable: the dashboard tells the same story as the biochemistry — this is not
 * a dehydrated patient, whatever the clerking label says. The drug chart is
 * the sting: both culprit medicines (indapamide, sertraline) were given at
 * 08:00 this morning and the second litre of 0.9% saline is still running.
 */
export const caseHyponatraemia001Summary: CaseSummary = {
  workingDiagnosis: "confusion with severe hyponatraemia — clerked overnight as ?dehydration",

  /** Overnight trend: haemodynamically boring throughout (against hypovolaemia). */
  vitalsTrend: [
    { t: "22:00", sys: 148, dia: 82, hr: 78, resp: 16, spo2: 96, tempC: 36.5 },
    { t: "00:00", sys: 144, dia: 80, hr: 74, resp: 16, spo2: 96, tempC: 36.4 },
    { t: "02:00", sys: 140, dia: 78, hr: 72, resp: 15, spo2: 96, tempC: 36.3 },
    { t: "04:00", sys: 138, dia: 76, hr: 70, resp: 15, spo2: 97, tempC: 36.2 },
    { t: "06:00", sys: 136, dia: 74, hr: 70, resp: 14, spo2: 97, tempC: 36.3 },
    { t: "08:00", sys: 134, dia: 72, hr: 68, resp: 14, spo2: 97, tempC: 36.4 },
  ],

  activeProblems: [
    "Severe hyponatraemia (Na 118 on admission)",
    "Confusion — improving this morning",
    "Fall at home — found on the floor by daughter",
    "Unexplained 'funny turn' on the ED trolley (21:30)",
    "Hypertension",
    "Low mood (bereavement, 02/2026)",
  ],

  ipMeds: [
    {
      medication: "Sodium chloride 0.9%",
      conc: "1 L",
      method: "IV",
      freq: "8-hourly",
      lastDose: "09/07/2026 07:00",
    },
    {
      medication: "Indapamide",
      conc: "2.5 mg",
      method: "PO",
      freq: "OD",
      lastDose: "09/07/2026 08:00",
    },
    {
      medication: "Sertraline",
      conc: "50 mg",
      method: "PO",
      freq: "OD",
      lastDose: "09/07/2026 08:00",
    },
    {
      medication: "Amlodipine",
      conc: "5 mg",
      method: "PO",
      freq: "OD",
      lastDose: "09/07/2026 08:00",
    },
    {
      medication: "Paracetamol",
      conc: "1 g",
      method: "PO",
      freq: "QDS PRN",
      lastDose: "08/07/2026 23:30",
    },
  ],

  weights: [
    { when: "09/07/2026 06:00", value: "61.2 kg" },
    { when: "08/07/2026 23:30", value: "61.0 kg" },
  ],

  firstWeight: { when: "12/02/2026", value: "61.5 kg" },

  // Afebrile, CRP 4, urine dip clean — no infective screen was indicated.
  microbiology: [],

  linesDrains: [{ label: "Peripheral cannula — L forearm (saline running)", kind: "line", days: 1 }],

  diseaseReports: [
    "Home Meds",
    "History",
    "Problem List",
    "Falls Assessment",
    "Results Review",
    "Medication Review",
    "Imaging",
    "Care Plan",
  ],
};
