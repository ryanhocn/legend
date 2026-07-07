import type { BloodRow } from "../../../types";

/**
 * Recent bloods shown on Summary and reused by the admission lab receipt in
 * documents.ts (single source, no drift). The panel is quietly unremarkable
 * for "cellulitis": white count and neutrophils normal, CRP only mildly
 * raised — and, crucially, there is NO D-dimer row, because nobody has ever
 * requested one. The absence is the teaching point, not a value.
 */
export const bloods: BloodRow[] = [
  { test: "Hb", value: "152", range: "130–180", flag: "" },
  { test: "WCC", value: "8.9", range: "4.0–11.0", flag: "" },
  { test: "Neutrophils", value: "6.1", range: "2.0–7.5", flag: "" },
  { test: "Platelets", value: "288", range: "150–400", flag: "" },
  { test: "CRP", value: "28", range: "<5", flag: "High (mild)" },
  { test: "Sodium", value: "139", range: "135–145", flag: "" },
  { test: "Potassium", value: "4.4", range: "3.5–5.3", flag: "" },
  { test: "Urea", value: "5.8", range: "2.5–7.8", flag: "" },
  { test: "Creatinine", value: "92", range: "60–110", flag: "" },
  { test: "Glucose", value: "6.4", range: "3.5–7.8", flag: "" },
];
