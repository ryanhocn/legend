import type { BloodRow } from "../../../types";

/**
 * Recent bloods shown on Summary and reused by the admission lab receipt in
 * documents.ts (single source, no drift). The panel argues AGAINST infection —
 * normal white count, CRP only mildly raised — while the markedly raised
 * D-dimer (added in ED, never actioned) and mildly positive hs-troponin sit
 * quietly in the middle of the list.
 */
export const bloods: BloodRow[] = [
  { test: "Hb", value: "151", range: "130–180", flag: "" },
  { test: "WCC", value: "9.8", range: "4.0–11.0", flag: "" },
  { test: "Neutrophils", value: "7.2", range: "2.0–7.5", flag: "" },
  { test: "Platelets", value: "242", range: "150–400", flag: "" },
  { test: "CRP", value: "18", range: "<5", flag: "High (mild)" },
  { test: "Sodium", value: "138", range: "135–145", flag: "" },
  { test: "Potassium", value: "4.3", range: "3.5–5.3", flag: "" },
  { test: "Urea", value: "6.4", range: "2.5–7.8", flag: "" },
  { test: "Creatinine", value: "88", range: "60–110", flag: "" },
  { test: "D-dimer", value: "4.2", range: "<0.50", flag: "High" },
  { test: "Troponin I (hs)", value: "48", range: "<34", flag: "High (mild)" },
  { test: "Lactate", value: "1.6", range: "<2.0", flag: "" },
  { test: "Glucose", value: "7.9", range: "3.5–7.8", flag: "High (mild)" },
];
