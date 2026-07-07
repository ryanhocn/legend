import type { CaseSummary } from "../../../types";

/** Synthetic summary-dashboard content for the mislabelled-DVT case. */
export const caseDvt001Summary: CaseSummary = {
  workingDiagnosis:
    "left leg cellulitis (working label — not improving on IV flucloxacillin, day 3)",

  /** Vitals trend today: stubbornly normal — afebrile with a NEWS2 of 1. */
  vitalsTrend: [
    { t: "22:00", sys: 138, dia: 86, hr: 82, resp: 16, spo2: 97, tempC: 37.2 },
    { t: "02:00", sys: 136, dia: 84, hr: 84, resp: 16, spo2: 97, tempC: 37.0 },
    { t: "06:00", sys: 134, dia: 82, hr: 86, resp: 16, spo2: 97, tempC: 36.8 },
    { t: "08:00", sys: 130, dia: 80, hr: 90, resp: 16, spo2: 98, tempC: 36.9 },
    { t: "10:00", sys: 132, dia: 82, hr: 88, resp: 16, spo2: 97, tempC: 37.1 },
    { t: "12:00", sys: 132, dia: 80, hr: 88, resp: 16, spo2: 97, tempC: 36.9 },
  ],

  activeProblems: [
    "?Left leg cellulitis — not improving on IV flucloxacillin (day 3)",
    "Left calf swelling — L > R (charted on admission)",
    "Chronic venous insufficiency — varicose veins / venous eczema",
    "Recent long-haul air travel (18/06/2026)",
    "Essential hypertension",
    "Obesity (BMI 31.4)",
  ],

  ipMeds: [
    {
      medication: "Flucloxacillin",
      conc: "2 g",
      method: "IV",
      freq: "QDS",
      lastDose: "07/07/2026 12:00",
    },
    {
      medication: "Paracetamol",
      conc: "1 g",
      method: "PO",
      freq: "QDS PRN",
      lastDose: "07/07/2026 06:10",
    },
    {
      medication: "Amlodipine",
      conc: "10 mg",
      method: "PO",
      freq: "OD",
      lastDose: "07/07/2026 08:00",
    },
    {
      medication: "Atorvastatin",
      conc: "20 mg",
      method: "PO",
      freq: "ON",
      lastDose: "06/07/2026 22:00",
    },
    {
      medication: "Cetraben emollient",
      conc: "liberal",
      method: "TOP",
      freq: "BD",
      lastDose: "07/07/2026 08:30",
    },
  ],

  weights: [
    { when: "07/07/2026 06:00", value: "96.4 kg" },
    { when: "06/07/2026 06:00", value: "96.2 kg" },
  ],

  firstWeight: { when: "04/07/2026", value: "96.0 kg" },

  microbiology: [
    {
      date: "06/07/2026",
      time: "08:00",
      state: "Skin swab (left leg) — mixed skin flora, no significant growth",
    },
  ],

  linesDrains: [
    { label: "Peripheral cannula — R forearm", kind: "line", days: 3, x: 66, y: 44 },
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
