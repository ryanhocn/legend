import type { Report } from "../../../types";

/**
 * Placeholder report "files" for the synthetic cholangitis case. Encounter rows
 * reference these by id via `linkedReportId`; the right rail renders the selected one.
 */
export const caseCholangitis001: Record<string, Report> = {
  "ward-round-001": {
    id: "ward-round-001",
    title: "Surgical Ward Round Note",
    type: "Progress Note",
    department: "General Surgery",
    author: "Ms Green (Consultant)",
    body: `Seen on the post-take ward round.

64F admitted overnight with fever, right upper quadrant pain and jaundice.
Observations: T 38.6, HR 112, BP 98/60. Sepsis screen positive.

Impression: acute cholangitis, likely secondary to choledocholithiasis.

Plan:
- IV fluids and sepsis six bundle.
- Confirm blood cultures sent and IV antibiotics given.
- Discuss urgent ERCP with gastroenterology for biliary decompression.
- Repeat LFTs and lactate in 6 hours.`,
  },
  "ed-note-001": {
    id: "ed-note-001",
    title: "Emergency Department Note",
    type: "ED Note",
    department: "Emergency Department",
    author: "Dr Patel",
    signedAt: "Today 08:40",
    body: `Presenting complaint: fever, RUQ pain and jaundice for 24 hours.

Hypotensive and febrile on arrival. Tender RUQ with positive Murphy's sign.
Bloods show raised WCC, CRP and obstructive LFT picture.

Impression: biliary sepsis. Referred to surgery for senior review. Started on
IV fluids in the department.`,
  },
  "clinic-letter-001": {
    id: "clinic-letter-001",
    title: "Primary Care Clinic Letter",
    type: "Letter",
    department: "Primary Care",
    author: "Dr Shah",
    signedAt: "12/01/2026",
    body: `Dear colleague,

I reviewed this patient regarding intermittent right upper quadrant pain after
fatty meals. Symptoms are suggestive of biliary colic, possibly gallstones.

I have arranged an outpatient ultrasound and advised safety-netting. Please refer
to general surgery if symptoms escalate.`,
  },
  "med-order-001": {
    id: "med-order-001",
    title: "Medication Order — Piperacillin/Tazobactam",
    type: "Medication Order",
    department: "General Surgery",
    author: "Ms Green (Consultant)",
    body: `Drug: Piperacillin/Tazobactam 4.5 g
Route: Intravenous
Frequency: Three times daily
Indication: Acute cholangitis with sepsis physiology.

Note: patient has a documented penicillin allergy (rash). Reviewed: benefit
judged to outweigh risk; monitor closely and consider switch after culture results.`,
  },
};
