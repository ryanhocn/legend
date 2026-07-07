import type { Encounter } from "../../../types";

/**
 * Chart Review > Encounters timeline for the recurrent-aspiration /
 * ceiling-of-care case (Pemberton, Arthur, 89M). Newest first, grouped by
 * recency like Epic's Chart Review. A row resolves its primary document by
 * `encounterId` (see documents.ts) and opens it in the right rail.
 *
 * Array order is the timeline's source of truth; the recency buckets are
 * hand-curated. The current date for this case is 07/07/2026; he was clerked
 * overnight and is being seen on the morning post-take round.
 *
 * `class` drives the filter bar (inpatient / outpatient / ed); `admission` is
 * set only on the admission event itself. `provider`, `deptAbbrev` and
 * `specialty` are hardcoded display metadata for this synthetic case.
 *
 * All content is synthetic. For education and simulation only. Not for clinical use.
 */
export const caseAspiration001Encounters: Encounter[] = [
  {
    id: "enc-ptwr",
    date: "07/07/2026",
    time: "08:20",
    class: "inpatient",
    type: "Ward Round",
    specialty: "Care of the Elderly",
    deptAbbrev: "COTE",
    provider: "Osei, Kwame, MD",
    description:
      "Post-take SHO round: aspiration pneumonia, slow response. Plan continues IV abx + fluids and 'consider NG feeding'. Ceiling of care not addressed.",
    status: "Signed",
    location: "Ward 11",
  },
  {
    id: "enc-admission",
    date: "07/07/2026",
    time: "01:20",
    class: "inpatient",
    type: "Admission (Current)",
    specialty: "Care of the Elderly",
    deptAbbrev: "COTE",
    provider: "Nair, Priya, MD",
    description:
      "Admitted overnight from ED with a third aspiration pneumonia. Full escalation by default — no DNACPR/ReSPECT on file. Ward 11 Bay 1.",
    status: "Admitted",
    location: "Ward 11",
    principalProblem: "Aspiration pneumonia (third episode) — advanced dementia",
    admission: true,
  },
  {
    id: "enc-cxr",
    group: "Yesterday",
    date: "06/07/2026",
    time: "23:05",
    class: "ed",
    type: "Imaging",
    specialty: "Radiology",
    deptAbbrev: "XR",
    provider: "Volkov, Irina, MD",
    description: "Portable CXR: right basal consolidation — aspiration pneumonia.",
    status: "Final",
    location: "ED",
  },
  {
    id: "enc-ed",
    date: "06/07/2026",
    time: "22:40",
    class: "ed",
    type: "ED Note",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Marsden, Eleanor, MD",
    description:
      "Aspiration at lunch, septic, NEWS2 5. Daughter (RGN, NOK) raised ceiling of care and DNACPR — nothing documented on system; ward asked to lead the conversation.",
    status: "Signed",
    location: "ED",
  },
  {
    id: "enc-bloods-admit",
    date: "06/07/2026",
    time: "21:55",
    class: "ed",
    type: "Bloods",
    specialty: "Clinical Biochemistry",
    deptAbbrev: "LAB",
    provider: "",
    description:
      "WCC 14.2, CRP 168 (sepsis). Sodium 149, urea 12.8, creatinine 118, eGFR 48 (AKI). Albumin 24. Lactate 2.2.",
    status: "Final",
    location: "ED",
  },
  {
    id: "enc-triage",
    date: "06/07/2026",
    time: "21:30",
    class: "ed",
    type: "ED Triage",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Kaur, Simran, RN",
    description:
      "89M, dementia, aspiration at lunch with fever and drowsiness. NEWS2 5. Daughter following. Urgent.",
    status: "Signed",
    location: "ED",
  },
  {
    id: "enc-salt",
    group: "3 Weeks Ago",
    date: "12/06/2026",
    time: "14:00",
    class: "outpatient",
    type: "Therapy Review",
    specialty: "Speech & Language Therapy",
    deptAbbrev: "SALT",
    provider: "Redmond, Ciara, SLT",
    description:
      "Community swallow review: END-STAGE dysphagia. No safe oral consistency. Advises risk-feeding for comfort; tube feeding NOT recommended. Trigger to revisit ceiling of care.",
    status: "Signed",
    location: "Nursing Home",
  },
  {
    id: "enc-dc-may",
    group: "6 Weeks Ago",
    date: "24/05/2026",
    time: "11:30",
    class: "inpatient",
    type: "Discharge",
    specialty: "Care of the Elderly",
    deptAbbrev: "COTE",
    provider: "Achebe, Ngozi, MD",
    description:
      "Second aspiration pneumonia. Recommended CONSIDER a ceiling of care + advance care planning at next opportunity — not completed this admission.",
    status: "Closed",
    location: "Ward 11",
  },
  {
    id: "enc-dc-mar",
    group: "4 Months Ago",
    date: "15/03/2026",
    time: "12:15",
    class: "inpatient",
    type: "Discharge",
    specialty: "Care of the Elderly",
    deptAbbrev: "COTE",
    provider: "Achebe, Ngozi, MD",
    description:
      "First documented aspiration pneumonia. Advance care planning / ceiling of care suggested for a future review. Not commenced.",
    status: "Closed",
    location: "Ward 11",
  },
];
