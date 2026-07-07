import type { BloodRow } from "../../../types";

/**
 * Admission bloods (Sat 04/07/2026) shown on Summary and reused by the
 * admission lab receipt in documents.ts (single source, no drift). Deliberately
 * UNDERWHELMING: WCC 11.9 and CRP 46 are easy to wave away as "constipation /
 * ?viral" — the teaching point is the TREND, not this snapshot. The serial
 * panels in documents.ts (05/07: WCC 14.6, CRP 118; 06/07: WCC 17.8, CRP 203)
 * are hand-authored and show where the chart parts company with the label.
 *
 * The creatinine of 92 already sits above her documented baseline of 76
 * (annual diabetes bloods, 02/04/2026) — the start of the AKI that makes the
 * continued metformin (and any contrast CT) a live safety issue.
 *
 * LFTs and amylase are normal: no biliary or pancreatic story here.
 */
export const bloods: BloodRow[] = [
  { test: "WCC", value: "11.9", range: "4.0–11.0", flag: "High (mild)" },
  { test: "Neutrophils", value: "9.8", range: "2.0–7.5", flag: "High" },
  { test: "CRP", value: "46", range: "<5", flag: "High" },
  { test: "Hb", value: "126", range: "115–160", flag: "Normal" },
  { test: "Platelets", value: "342", range: "150–400", flag: "Normal" },
  { test: "Sodium", value: "134", range: "135–145", flag: "Low" },
  { test: "Potassium", value: "4.6", range: "3.5–5.3", flag: "Normal" },
  { test: "Urea", value: "8.9", range: "2.5–7.8", flag: "High" },
  { test: "Creatinine", value: "92", range: "45–90", flag: "High (mild)" },
  { test: "eGFR", value: "52", range: ">60", flag: "Low" },
  { test: "Glucose (random)", value: "9.6", range: "4.0–7.8", flag: "High" },
  { test: "Bilirubin", value: "12", range: "<21", flag: "Normal" },
  { test: "ALP", value: "88", range: "30–130", flag: "Normal" },
  { test: "ALT", value: "22", range: "<40", flag: "Normal" },
  { test: "Amylase", value: "42", range: "28–100", flag: "Normal" },
];
