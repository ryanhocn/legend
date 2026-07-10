import type { CaseSummary } from "../../../types";

/**
 * Summary-dashboard content for the blank TestList patient (Test, Test). Vitals
 * are flat and normal; problem/med lists are placeholders. This case is a
 * fixture for prod note-persistence checks, not a teaching case.
 *
 * All patient data are synthetic. For education and simulation only. Not for
 * clinical use.
 */
export const caseTest001Summary: CaseSummary = {
  workingDiagnosis: "none — placeholder test patient for prod persistence checks",

  vitalsTrend: [
    { t: "08:00", sys: 120, dia: 80, hr: 70, resp: 14, spo2: 98, tempC: 36.7 },
    { t: "12:00", sys: 122, dia: 78, hr: 72, resp: 14, spo2: 98, tempC: 36.8 },
  ],

  activeProblems: ["Placeholder test patient — no active clinical problems"],

  ipMeds: [],

  weights: [{ when: "01/01/2026 08:00", value: "75.0 kg" }],

  firstWeight: { when: "01/01/2026", value: "75.0 kg" },

  microbiology: [],

  linesDrains: [],

  diseaseReports: ["Problem List", "Results Review"],
};
