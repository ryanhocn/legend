import type { BloodRow } from "../../../types";

/**
 * Recent bloods shown on Summary and reused by the admission lab receipt in
 * documents.ts (single source, no drift). The panel is a renal-colic workup:
 * unremarkable enough to be reassuring at a glance, EXCEPT for a raised D-dimer
 * and a mild creatinine rise — quiet pointers that argue against a simple
 * ureteric stone and toward an aortic catastrophe. Troponin is not raised (an
 * ECG/ACS distractor already excluded), keeping the pull toward "just colic".
 */
export const bloods: BloodRow[] = [
  { test: "WCC", value: "12.1", range: "4.0–11.0", flag: "High" },
  { test: "Hb", value: "134", range: "130–170", flag: "" },
  { test: "Platelets", value: "244", range: "150–400", flag: "" },
  { test: "CRP", value: "18", range: "<5", flag: "High" },
  { test: "D-dimer", value: "1180", range: "<500", flag: "High" },
  { test: "Creatinine", value: "118", range: "60–110", flag: "High" },
  { test: "eGFR", value: "55", range: ">60", flag: "Low" },
  { test: "Urea", value: "7.9", range: "2.5–7.8", flag: "High" },
  { test: "Sodium", value: "139", range: "135–145", flag: "" },
  { test: "Potassium", value: "4.3", range: "3.5–5.3", flag: "" },
  { test: "Troponin T", value: "12", range: "<14", flag: "" },
  { test: "Lactate", value: "1.9", range: "<2.0", flag: "" },
  { test: "INR", value: "1.0", range: "0.8–1.1", flag: "" },
];
