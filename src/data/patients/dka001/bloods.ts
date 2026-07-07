import type { BloodRow } from "../../../types";

/**
 * Recent bloods shown on Summary and reused by the admission lab receipt in
 * documents.ts (single source, no drift). The pattern is DKA, not
 * gastroenteritis: marked hyperglycaemia with ketonaemia and a low bicarbonate,
 * a normal CRP in an afebrile patient (against an infective cause — the WCC
 * rise is the leucocytosis of DKA itself), haemoconcentration physiology with a
 * pre-renal creatinine, and an HbA1c that proves weeks of hyperglycaemia rather
 * than an acute stress response. Amylase only mildly raised — common in DKA,
 * not pancreatitis.
 */
export const bloods: BloodRow[] = [
  { test: "Glucose (serum)", value: "26.8", range: "3.5–7.8", flag: "High" },
  { test: "Ketones (BOHB)", value: "5.8", range: "<0.6", flag: "High" },
  { test: "Sodium", value: "131", range: "135–145", flag: "Low" },
  { test: "Potassium", value: "3.4", range: "3.5–5.3", flag: "Low" },
  { test: "Bicarbonate", value: "11", range: "22–29", flag: "Low" },
  { test: "Urea", value: "9.8", range: "2.5–7.8", flag: "High" },
  { test: "Creatinine", value: "118", range: "60–110", flag: "High" },
  { test: "WCC", value: "14.2", range: "4.0–11.0", flag: "High" },
  { test: "Neutrophils", value: "11.0", range: "2.0–7.5", flag: "High" },
  { test: "CRP", value: "4", range: "<5", flag: "" },
  { test: "Amylase", value: "138", range: "28–100", flag: "High (mild)" },
  { test: "HbA1c", value: "118", range: "20–41", flag: "High" },
  { test: "Platelets", value: "342", range: "150–400", flag: "" },
];
