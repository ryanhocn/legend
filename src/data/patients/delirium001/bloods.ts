import type { BloodRow } from "../../../types";

/**
 * Recent bloods shown on Summary and reused by the admission lab receipt in
 * documents.ts (single source, no drift). The panel's job is to be QUIETLY
 * REASSURING: the adjusted calcium is NORMAL (2.41), glucose and TSH are normal,
 * the white count is normal and the CRP is only trivially raised — nothing here
 * supports "sepsis" or a metabolic zebra. The one real signal is renal: a
 * creatinine of 142 against a documented baseline of 88 (neurology letter,
 * 02/2026) with urea 13.6 — an AKI that fits post-renal obstruction from
 * urinary retention, not infection.
 *
 * All content is fabricated for education and simulation only. Not for clinical use.
 */
export const bloods: BloodRow[] = [
  { test: "Hb", value: "132", range: "130–180", flag: "Normal" },
  { test: "WCC", value: "8.9", range: "4.0–11.0", flag: "Normal" },
  { test: "Neutrophils", value: "6.4", range: "2.0–7.5", flag: "Normal" },
  { test: "Platelets", value: "236", range: "150–400", flag: "Normal" },
  { test: "CRP", value: "11", range: "<5", flag: "High (mild)" },
  { test: "Sodium", value: "134", range: "135–145", flag: "Low (mild)" },
  { test: "Potassium", value: "4.9", range: "3.5–5.3", flag: "Normal" },
  { test: "Urea", value: "13.6", range: "2.5–7.8", flag: "High" },
  { test: "Creatinine", value: "142", range: "60–110", flag: "High" },
  { test: "eGFR", value: "38", range: ">60", flag: "Low" },
  { test: "Adjusted calcium", value: "2.41", range: "2.20–2.60", flag: "Normal" },
  { test: "Glucose (random)", value: "6.2", range: "4.0–7.8", flag: "Normal" },
  { test: "TSH", value: "2.1", range: "0.30–4.20", flag: "Normal" },
  { test: "ALT", value: "22", range: "<40", flag: "Normal" },
];
