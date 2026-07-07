import type { BloodRow } from "../../../types";

/**
 * Recent bloods shown on Summary and reused by the admission lab receipt in
 * documents.ts (single source, no drift). The texture is the OPPOSITE of a
 * septic abdomen: normal white count and CRP, no cholestasis — but a first
 * hs-troponin already above the reference limit, a diabetic glucose/HbA1c,
 * and renal impairment (eGFR 28, worse than the April baseline of 52) that
 * must inform any ACS drug dosing.
 */
export const bloods: BloodRow[] = [
  { test: "Hb", value: "129", range: "115–165", flag: "" },
  { test: "WCC", value: "9.2", range: "4.0–11.0", flag: "" },
  { test: "Platelets", value: "264", range: "150–400", flag: "" },
  { test: "CRP", value: "4", range: "<5", flag: "" },
  { test: "Sodium", value: "137", range: "135–145", flag: "" },
  { test: "Potassium", value: "4.9", range: "3.5–5.3", flag: "" },
  { test: "Urea", value: "12.1", range: "2.5–7.8", flag: "High" },
  { test: "Creatinine", value: "168", range: "45–90", flag: "High" },
  { test: "eGFR", value: "28", range: ">60", flag: "Low" },
  { test: "Glucose (random)", value: "13.4", range: "4.0–7.8", flag: "High" },
  { test: "HbA1c", value: "61", range: "20–41", flag: "High" },
  { test: "hs-Troponin T", value: "38", range: "<14", flag: "High (mild)" },
  { test: "Total cholesterol", value: "5.8", range: "<5.0", flag: "High" },
];
