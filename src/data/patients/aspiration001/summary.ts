import type { CaseSummary } from "../../../types";

/** Synthetic summary-dashboard content for the recurrent-aspiration /
 * ceiling-of-care case (Pemberton, Arthur, 89M). The numbers tell the story
 * the chart keeps declining to read: a man in the terminal phase of advanced
 * dementia, not simply a man with a treatable chest infection. */
export const caseAspiration001Summary: CaseSummary = {
  workingDiagnosis:
    "aspiration pneumonia (third episode in four months) on a background of advanced dementia and end-stage dysphagia",

  /** Vitals trend overnight into the post-take round: septic physiology
   * (febrile, tachypnoeic, hypoxic on oxygen), only partly responsive. */
  vitalsTrend: [
    { t: "22:00", sys: 112, dia: 64, hr: 108, resp: 28, spo2: 89, tempC: 38.6 },
    { t: "00:00", sys: 108, dia: 62, hr: 106, resp: 26, spo2: 91, tempC: 38.4 },
    { t: "02:00", sys: 106, dia: 60, hr: 104, resp: 26, spo2: 91, tempC: 38.2 },
    { t: "04:00", sys: 110, dia: 62, hr: 102, resp: 24, spo2: 92, tempC: 38.0 },
    { t: "06:00", sys: 108, dia: 62, hr: 104, resp: 26, spo2: 91, tempC: 38.3 },
    { t: "08:00", sys: 106, dia: 60, hr: 106, resp: 26, spo2: 90, tempC: 38.4 },
  ],

  activeProblems: [
    "Aspiration pneumonia — third episode in four months (PRINCIPAL)",
    "Advanced dementia (Alzheimer's type) — Clinical Frailty Scale 8",
    "End-stage oropharyngeal dysphagia — SALT review 12/06/2026",
    "Progressive weight loss / malnutrition (albumin 24, BMI 17.8)",
    "Hypernatraemic dehydration with acute kidney injury",
    "No DNACPR / ReSPECT documented — full escalation by default",
  ],

  ipMeds: [
    {
      medication: "Co-amoxiclav",
      conc: "1.2 g",
      method: "IV",
      freq: "TDS",
      lastDose: "07/07/2026 06:00",
    },
    {
      medication: "Sodium chloride 0.9%",
      conc: "1 L / 10h",
      method: "IV",
      freq: "Continuous",
      lastDose: "Running",
    },
    {
      medication: "Paracetamol",
      conc: "500 mg",
      method: "IV",
      freq: "QDS PRN",
      lastDose: "07/07/2026 06:10",
    },
    {
      medication: "Donepezil",
      conc: "10 mg",
      method: "PO",
      freq: "ON (withheld — NBM)",
      lastDose: "Not given",
    },
    {
      medication: "Amlodipine",
      conc: "5 mg",
      method: "PO",
      freq: "OD (withheld — NBM)",
      lastDose: "Not given",
    },
  ],

  weights: [
    { when: "07/07/2026 07:00", value: "51.0 kg" },
    { when: "10/06/2026", value: "53.2 kg" },
  ],

  firstWeight: { when: "12/03/2026", value: "55.9 kg" },

  microbiology: [
    {
      date: "07/07/2026",
      time: "05:30",
      state: "Sputum — not obtained (unable to expectorate; poor cough)",
    },
    {
      date: "20/05/2026",
      time: "—",
      state: "Sputum (prior admission) — mixed oral/respiratory flora",
    },
  ],

  linesDrains: [
    { label: "Peripheral cannula — L hand", kind: "line", days: 1, x: 34, y: 46 },
  ],

  diseaseReports: [
    "Home Meds",
    "History",
    "Problem List",
    "Advance Care Planning",
    "Results Review",
    "Nutrition / SALT",
    "Microbiology Hx",
    "Imaging",
    "Care Plan",
  ],
};
