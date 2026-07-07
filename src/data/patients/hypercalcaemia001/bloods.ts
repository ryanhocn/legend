import type { BloodRow } from "../../../types";

/**
 * Recent bloods shown on Summary and reused by the admission lab receipt in
 * documents.ts (single source, no drift). The chart's headline is buried in
 * plain sight: an ADJUSTED (albumin-corrected) calcium of 3.18 mmol/L with an
 * AKI on the background of a normocytic anaemia, a very high ESR and a wide
 * globulin gap (total protein 92 against albumin 30) — the biochemical shape of
 * hypercalcaemia of malignancy, most likely myeloma, in a patient the clerking
 * team labelled a social admission.
 *
 * CRP is near-normal, which argues against the "?UTI / sepsis" framing.
 */
export const bloods: BloodRow[] = [
  { test: "Adjusted calcium", value: "3.18", range: "2.20–2.60", flag: "High" },
  { test: "Calcium (uncorrected)", value: "3.03", range: "2.20–2.60", flag: "High" },
  { test: "Albumin", value: "30", range: "35–50", flag: "Low" },
  { test: "Phosphate", value: "0.72", range: "0.80–1.50", flag: "Low" },
  { test: "Creatinine", value: "158", range: "45–90", flag: "High" },
  { test: "Urea", value: "15.2", range: "2.5–7.8", flag: "High" },
  { test: "eGFR", value: "28", range: ">60", flag: "Low" },
  { test: "Potassium", value: "3.4", range: "3.5–5.3", flag: "Low" },
  { test: "Sodium", value: "146", range: "135–145", flag: "High" },
  { test: "Total protein", value: "92", range: "60–80", flag: "High" },
  { test: "Hb", value: "98", range: "115–160", flag: "Low" },
  { test: "MCV", value: "89", range: "80–100", flag: "Normal" },
  { test: "WCC", value: "7.8", range: "4.0–11.0", flag: "Normal" },
  { test: "Platelets", value: "196", range: "150–400", flag: "Normal" },
  { test: "ESR", value: "92", range: "<20", flag: "High" },
  { test: "CRP", value: "8", range: "<5", flag: "High (mild)" },
];
