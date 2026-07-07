import type { BloodRow } from "../../../types";

/**
 * Recent bloods shown on Summary and reused by the admission lab receipt in
 * documents.ts (single source, no drift). The texture is a BLEED, not sepsis:
 * apyrexial with a normal CRP, but Hb 96 against a GP baseline of 141 six
 * weeks ago, and a urea of 16.8 sitting disproportionately above a normal
 * creatinine — the signature of digested blood from an upper GI source. The
 * negative troponin and normal lactate are the "collapse mimics excluded"
 * texture that lets the vasovagal label survive unchallenged.
 */
export const bloods: BloodRow[] = [
  { test: "Hb", value: "96", range: "130–180", flag: "Low" },
  { test: "MCV", value: "88", range: "80–100", flag: "" },
  { test: "WCC", value: "11.6", range: "4.0–11.0", flag: "High (mild)" },
  { test: "Platelets", value: "342", range: "150–400", flag: "" },
  { test: "Urea", value: "16.8", range: "2.5–7.8", flag: "High" },
  { test: "Creatinine", value: "88", range: "60–110", flag: "" },
  { test: "eGFR", value: "71", range: ">60", flag: "" },
  { test: "Sodium", value: "138", range: "135–145", flag: "" },
  { test: "Potassium", value: "4.2", range: "3.5–5.3", flag: "" },
  { test: "CRP", value: "4", range: "<5", flag: "" },
  { test: "Bilirubin", value: "12", range: "<21", flag: "" },
  { test: "ALT", value: "22", range: "<40", flag: "" },
  { test: "Albumin", value: "38", range: "35–50", flag: "" },
  { test: "hs-Troponin T", value: "8", range: "<14", flag: "" },
  { test: "Lactate", value: "1.6", range: "<2.0", flag: "" },
];
