import type { BloodRow } from "../../../types";

/**
 * Recent bloods shown on Summary and reused by the admission lab receipt in
 * documents.ts (single source, no drift). Early mesenteric ischaemia pattern:
 * neutrophilia with an UNIMPRESSIVE CRP (the pain is hours old), mild
 * haemoconcentration, an amylase that is only mildly raised (recognised in gut
 * ischaemia, well short of pancreatitis), a lactate already nudging up on
 * arrival — and a quietly normal INR in a man whose chart says AF on warfarin.
 */
export const bloods: BloodRow[] = [
  { test: "Hb", value: "168", range: "130–175", flag: "High (mild)" },
  { test: "WCC", value: "15.8", range: "4.0–11.0", flag: "High" },
  { test: "Neutrophils", value: "13.6", range: "2.0–7.5", flag: "High" },
  { test: "Platelets", value: "289", range: "150–400", flag: "" },
  { test: "CRP", value: "18", range: "<5", flag: "High (mild)" },
  { test: "Sodium", value: "136", range: "135–145", flag: "" },
  { test: "Potassium", value: "4.9", range: "3.5–5.0", flag: "" },
  { test: "Urea", value: "11.8", range: "2.5–7.8", flag: "High" },
  { test: "Creatinine", value: "118", range: "60–110", flag: "High" },
  { test: "Amylase", value: "142", range: "28–100", flag: "High (mild)" },
  { test: "ALT", value: "28", range: "<40", flag: "" },
  { test: "Bilirubin", value: "14", range: "<21", flag: "" },
  { test: "Lactate", value: "2.1", range: "<2.0", flag: "High" },
  { test: "INR", value: "1.0", range: "0.8–1.1", flag: "" },
];
