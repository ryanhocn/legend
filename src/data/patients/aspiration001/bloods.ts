import type { BloodRow } from "../../../types";

/**
 * Recent bloods shown on Summary and reused by the admission lab receipt in
 * documents.ts (single source, no drift). Infection markers of a third
 * aspiration pneumonia, on a background of chronic malnutrition (albumin 24,
 * falling weight) and hypernatraemic dehydration with a mild AKI — the
 * laboratory picture of a man in the terminal phase of advanced dementia, not
 * just a man with a chest infection.
 */
export const bloods: BloodRow[] = [
  { test: "WCC", value: "14.2", range: "4.0–11.0", flag: "High" },
  { test: "Neutrophils", value: "12.1", range: "2.0–7.5", flag: "High" },
  { test: "CRP", value: "168", range: "<5", flag: "High" },
  { test: "Hb", value: "102", range: "130–180", flag: "Low" },
  { test: "Albumin", value: "24", range: "35–50", flag: "Low" },
  { test: "Sodium", value: "149", range: "135–145", flag: "High" },
  { test: "Urea", value: "12.8", range: "2.5–7.8", flag: "High" },
  { test: "Creatinine", value: "118", range: "60–110", flag: "High" },
  { test: "eGFR", value: "48", range: ">60", flag: "Low" },
  { test: "Lactate", value: "2.2", range: "<2.0", flag: "High (mild)" },
];
