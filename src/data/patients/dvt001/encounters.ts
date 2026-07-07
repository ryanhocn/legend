import type { Encounter } from "../../../types";

/**
 * Chart Review > Encounters timeline for the mislabelled-DVT case (Ashworth,
 * Colin, 59M). Newest first, grouped by recency like Epic's Chart Review. A
 * row resolves its primary document by `encounterId` (see documents.ts) and
 * opens it in the right rail.
 *
 * Array order is the timeline's source of truth; the recency buckets are
 * hand-curated. The current date for this case is 07/07/2026; the admission
 * was on 04/07/2026 (day 3 of IV flucloxacillin this morning).
 *
 * `class` drives the filter bar (inpatient / outpatient / ed); `admission` is
 * set only on the admission event itself. `provider`, `deptAbbrev` and
 * `specialty` are hardcoded display metadata for this synthetic case.
 *
 * All content is synthetic. For education and simulation only. Not for clinical use.
 */
export const caseDvt001Encounters: Encounter[] = [
  {
    id: "enc-ward-round-d3",
    date: "07/07/2026",
    time: "08:30",
    class: "inpatient",
    type: "Ward Round",
    specialty: "General Medicine",
    deptAbbrev: "GMED",
    provider: "Fairbrother, Nadia, MD",
    description:
      "Day 3 SHO round: left leg 'no better, tighter'. Read as slow-to-respond cellulitis; plan to ADD a second antibiotic. Afebrile, CRP static.",
    status: "Signed",
    location: "Ward 7B",
  },
  {
    id: "enc-bloods-d3",
    date: "07/07/2026",
    time: "07:20",
    class: "inpatient",
    type: "Bloods",
    specialty: "Clinical Biochemistry",
    deptAbbrev: "LAB",
    provider: "",
    description:
      "Repeat FBC + CRP: WCC 8.9 (normal), CRP 31 (28 on admission). No inflammatory response to explain a cellulitis failing treatment.",
    status: "Final",
    location: "Lab",
  },
  {
    id: "enc-ward-round-d2",
    group: "Yesterday",
    date: "06/07/2026",
    time: "09:10",
    class: "inpatient",
    type: "Ward Round",
    specialty: "General Medicine",
    deptAbbrev: "GMED",
    provider: "Okafor, Emeka, MD",
    description:
      "Day 2 round: calf still swollen and tender, erythema stable, afebrile. Continue IV flucloxacillin; chase skin swab.",
    status: "Signed",
    location: "Ward 7B",
  },
  {
    id: "enc-swab",
    date: "06/07/2026",
    time: "09:15",
    class: "inpatient",
    type: "Microbiology",
    specialty: "Microbiology",
    deptAbbrev: "MICRO",
    provider: "",
    description:
      "Skin swab (left leg): mixed skin flora, no significant growth. Swab of intact skin — non-diagnostic.",
    status: "Final",
    location: "Lab",
  },
  {
    id: "enc-admission",
    group: "3 Days Ago",
    date: "04/07/2026",
    time: "21:00",
    class: "inpatient",
    type: "Admission (Current)",
    specialty: "General Medicine",
    deptAbbrev: "GMED",
    provider: "Hollis, Margaret, MD",
    description:
      "Admitted from ED with a red, swollen left leg. Working label: ?cellulitis. Ward 7B Bed 12.",
    status: "Admitted",
    location: "Ward 7B",
    principalProblem: "Left lower leg erythema / swelling — ?cellulitis",
    admission: true,
  },
  {
    id: "enc-ed",
    date: "04/07/2026",
    time: "18:20",
    class: "ed",
    type: "ED Note",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Whitlock, Dominic, MD",
    description:
      "Red left leg, several days. Labelled cellulitis, IV flucloxacillin started. Notes unilateral swelling + recent long-haul flight — suggested ward consider duplex if not settling.",
    status: "Signed",
    location: "ED",
  },
  {
    id: "enc-bloods-admit",
    date: "04/07/2026",
    time: "17:10",
    class: "ed",
    type: "Bloods",
    specialty: "Clinical Biochemistry",
    deptAbbrev: "LAB",
    provider: "",
    description:
      "Admission bloods: WCC 8.9, neutrophils 6.1, CRP 28. Hb 152, U&E normal. Modest markers for a 'cellulitis'.",
    status: "Final",
    location: "ED",
  },
  {
    id: "enc-triage",
    date: "04/07/2026",
    time: "16:55",
    class: "ed",
    type: "ED Triage",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Beckett, Hannah, RN",
    description:
      "Self-presented with a red, swollen, painful left leg. Afebrile, NEWS2 1. Left calf visibly larger than right. Cellulitis pathway.",
    status: "Signed",
    location: "ED",
  },
  {
    id: "enc-gp-veins",
    group: "4 Months Ago",
    date: "14/03/2026",
    time: "11:20",
    class: "outpatient",
    type: "Appointment",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Adebayo, Femi, MD",
    description:
      "Varicose veins / venous eczema, left leg. Emollient + compression advised; routine vascular referral. The chronic red leg that makes 'cellulitis' look plausible.",
    status: "Signed",
    location: "GP",
  },
];
