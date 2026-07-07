import type { BloodRow } from "../../../types";

/**
 * Recent bloods shown on Summary and reused by the admission lab receipt in
 * documents.ts (single source, no drift). Deliberately BLAND: no leucocytosis,
 * CRP only mildly raised, calcium normal, renal function near baseline. The
 * panel does not explain a fluctuating conscious level — which is the point.
 * Note the near-normal INR/APTT: standard clotting does NOT measure apixaban
 * effect, so "clotting normal" gives false reassurance in an anticoagulated
 * head injury.
 */
export const bloods: BloodRow[] = [
  { test: "Hb", value: "121", range: "115–165", flag: "" },
  { test: "WCC", value: "8.9", range: "4.0–11.0", flag: "" },
  { test: "Neutrophils", value: "6.7", range: "2.0–7.5", flag: "" },
  { test: "Platelets", value: "228", range: "150–400", flag: "" },
  { test: "CRP", value: "22", range: "<5", flag: "High (mild)" },
  { test: "Sodium", value: "132", range: "135–145", flag: "Low (mild)" },
  { test: "Potassium", value: "4.2", range: "3.5–5.3", flag: "" },
  { test: "Urea", value: "8.9", range: "2.5–7.8", flag: "High (mild)" },
  { test: "Creatinine", value: "84", range: "45–90", flag: "" },
  { test: "eGFR", value: "58", range: ">60", flag: "Low (mild)" },
  { test: "Glucose", value: "6.2", range: "4.0–7.8", flag: "" },
  { test: "Corrected calcium", value: "2.38", range: "2.20–2.60", flag: "" },
  { test: "INR", value: "1.1", range: "0.8–1.1", flag: "" },
  { test: "APTT", value: "31", range: "25–37", flag: "" },
];
