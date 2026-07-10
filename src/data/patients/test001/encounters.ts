import type { Encounter } from "../../../types";

/**
 * Chart Review > Encounters timeline for the blank TestList patient (Test,
 * Test). One admission event plus its bloods row — enough for the chart to open
 * cleanly. Array order is the display order, newest first.
 *
 * All content is synthetic. For education and simulation only. Not for clinical
 * use.
 */
export const caseTest001Encounters: Encounter[] = [
  {
    id: "enc-admission",
    group: "Today",
    date: "01/01/2026",
    time: "09:00",
    class: "inpatient",
    type: "Admission (Current)",
    specialty: "TestList",
    deptAbbrev: "TEST",
    provider: "Consultant, Test, MD",
    description:
      "Placeholder admission for a synthetic test patient. Not a clinical case — used to verify prod note persistence.",
    status: "Admitted",
    location: "Ward T Bay 1",
    principalProblem: "None — placeholder test patient",
    admission: true,
  },
  {
    id: "enc-bloods-admit",
    date: "01/01/2026",
    time: "08:30",
    class: "inpatient",
    type: "Bloods",
    specialty: "Clinical Biochemistry",
    deptAbbrev: "LAB",
    provider: "",
    description: "Routine admission bloods — all within range. Placeholder data.",
    status: "Final",
    location: "Lab",
  },
];
