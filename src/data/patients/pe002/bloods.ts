import type { BloodRow } from "../../../types";

/**
 * Recent bloods shown on Summary and reused by the admission lab receipt in
 * documents.ts (single source, no drift). The pattern refutes the "?first
 * seizure" label rather than supporting it: a raised hs-troponin and venous
 * lactate in a hypotensive, hypoxic patient point at right-heart strain and
 * shock physiology, while the near-normal CRP and only modest neutrophilia
 * argue against sepsis. Nothing here belongs to a neurology pathway.
 */
export const bloods: BloodRow[] = [
  { test: "Hb", value: "124", range: "115–160", flag: "" },
  { test: "WCC", value: "12.6", range: "4.0–11.0", flag: "High (mild)" },
  { test: "Neutrophils", value: "10.1", range: "2.0–7.5", flag: "High" },
  { test: "Platelets", value: "301", range: "150–400", flag: "" },
  { test: "CRP", value: "6", range: "<5", flag: "High (mild)" },
  { test: "Sodium", value: "138", range: "135–145", flag: "" },
  { test: "Potassium", value: "4.2", range: "3.5–5.3", flag: "" },
  { test: "Urea", value: "7.1", range: "2.5–7.8", flag: "" },
  { test: "Creatinine", value: "84", range: "45–90", flag: "" },
  { test: "hs-Troponin I", value: "89", range: "<16", flag: "High" },
  { test: "Glucose (serum)", value: "8.2", range: "3.5–7.8", flag: "High (mild)" },
  { test: "Lactate (venous)", value: "3.4", range: "<2.0", flag: "High" },
];
