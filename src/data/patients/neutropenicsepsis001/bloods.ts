import type { BloodRow } from "../../../types";

/**
 * Admission bloods shown on Summary and reused by the admission lab receipt in
 * documents.ts (single source, no drift). This is the smoking gun the "viral"
 * triage label ignores: a profound neutropenia (0.3) on day 10 post
 * chemotherapy, with a rising CRP, borderline lactate and an early AKI — the
 * biochemistry of neutropenic sepsis, not a self-limiting viral illness.
 */
export const bloods: BloodRow[] = [
  { test: "WCC", value: "1.1", range: "4.0–11.0", flag: "Low" },
  { test: "Neutrophils", value: "0.3", range: "2.0–7.5", flag: "Low" },
  { test: "Lymphocytes", value: "0.6", range: "1.0–3.0", flag: "Low" },
  { test: "Haemoglobin", value: "104", range: "115–160", flag: "Low" },
  { test: "Platelets", value: "112", range: "150–400", flag: "Low" },
  { test: "CRP", value: "88", range: "<5", flag: "High" },
  { test: "Lactate", value: "2.1", range: "<2.0", flag: "High" },
  { test: "Urea", value: "8.9", range: "2.5–7.8", flag: "High" },
  { test: "Creatinine", value: "96", range: "45–90", flag: "High" },
  { test: "Sodium", value: "134", range: "135–145", flag: "Low" },
  { test: "Potassium", value: "4.0", range: "3.5–5.3", flag: "" },
  { test: "Bilirubin", value: "9", range: "<21", flag: "" },
  { test: "ALT", value: "22", range: "<40", flag: "" },
  { test: "Albumin", value: "33", range: "35–50", flag: "Low" },
];
