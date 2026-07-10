import type { BloodRow } from "../../../types";

/**
 * Recent bloods shown on Summary and reused by the admission lab receipt in
 * documents.ts (single source, no drift). Severe hyponatraemia (Na 118) with a
 * LOW-NORMAL urea and normal creatinine — biochemistry that argues against the
 * "dehydration" label the clerking gave it. Glucose and calcium are normal
 * (excluding the easy metabolic mimics of confusion), the inflammatory markers
 * are quiet, and no serum osmolality was requested with the panel.
 */
export const bloods: BloodRow[] = [
  { test: "Sodium", value: "118", range: "135–145", flag: "Low" },
  { test: "Potassium", value: "3.4", range: "3.5–5.3", flag: "Low" },
  { test: "Urea", value: "3.1", range: "2.5–7.8", flag: "" },
  { test: "Creatinine", value: "58", range: "45–90", flag: "" },
  { test: "eGFR", value: ">90", range: ">60", flag: "" },
  { test: "Glucose (random)", value: "5.6", range: "4.0–7.8", flag: "" },
  { test: "Adjusted calcium", value: "2.38", range: "2.20–2.60", flag: "" },
  { test: "CRP", value: "4", range: "<5", flag: "" },
  { test: "WCC", value: "8.9", range: "4.0–11.0", flag: "" },
  { test: "Hb", value: "129", range: "115–160", flag: "" },
  { test: "Platelets", value: "246", range: "150–400", flag: "" },
  { test: "ALT", value: "22", range: "<40", flag: "" },
];
