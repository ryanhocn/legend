import type { BloodRow } from "../../../types";

/**
 * Deliberately unremarkable bloods for the blank TestList patient (Test, Test).
 * Every row is in range with no flag: this case exists only to exercise
 * server-side note persistence in prod, so there is no clinical signal here and
 * nothing for a rubric trigger to catch. Reused by the admission lab receipt in
 * documents.ts (single source, no drift).
 *
 * All patient data are synthetic. For education and simulation only. Not for
 * clinical use.
 */
export const bloods: BloodRow[] = [
  { test: "Hb", value: "145", range: "130–180", flag: "" },
  { test: "WCC", value: "7.0", range: "4.0–11.0", flag: "" },
  { test: "Platelets", value: "250", range: "150–400", flag: "" },
  { test: "Sodium", value: "140", range: "135–145", flag: "" },
  { test: "Potassium", value: "4.2", range: "3.5–5.3", flag: "" },
  { test: "Creatinine", value: "80", range: "60–110", flag: "" },
];
