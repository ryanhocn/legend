import type { Encounter } from "../../../types";

/**
 * Chart Review > Encounters timeline for the GI-bleed-as-collapse case
 * (Whitfield, Gordon, 72M). Newest first, grouped by recency like Epic's
 * Chart Review. A row resolves its primary document by `encounterId` (see
 * documents.ts) and opens it in the right rail.
 *
 * Array order is the timeline's source of truth: the recency buckets are
 * hand-curated (the 20/04 entries sit under "2 Months Ago") and not
 * reproducible by date math, so the rows are kept in display order rather
 * than sorted. The current date for this case is 06/07/2026; the admission
 * was yesterday morning, 05/07/2026.
 *
 * `class` drives the filter bar (inpatient / outpatient / ed); `admission` is
 * set only on the admission event itself. `provider`, `deptAbbrev` and
 * `specialty` are hardcoded display metadata for this synthetic case.
 *
 * All content is synthetic. For education and simulation only. Not for clinical use.
 */
export const caseGibleed001Encounters: Encounter[] = [
  {
    id: "enc-ward-round-d2",
    date: "06/07/2026",
    time: "08:40",
    class: "inpatient",
    type: "Ward Round",
    specialty: "General Medicine",
    deptAbbrev: "GMAMU",
    provider: "Farrant, Lucy, MD",
    description:
      "Day 2 SHO round: postural collapse 'improving with fluids'. Dark stools attributed to ferrous sulfate; Hb 89 read as dilutional.",
    status: "Signed",
    location: "AMU",
  },
  {
    id: "enc-bloods-repeat",
    date: "06/07/2026",
    time: "07:40",
    class: "inpatient",
    type: "Bloods",
    specialty: "Clinical Biochemistry",
    deptAbbrev: "LAB",
    provider: "",
    description:
      "Repeat bloods: Hb 89 (96 on admission; 141 at GP in May). Urea 19.4 with creatinine 92.",
    status: "Final",
    location: "Lab",
  },
  {
    id: "enc-ward-round",
    group: "Yesterday",
    date: "05/07/2026",
    time: "17:45",
    class: "inpatient",
    type: "Ward Round",
    specialty: "General Medicine",
    deptAbbrev: "GMAMU",
    provider: "Harcourt, Miriam, MD",
    description:
      "Post-take: orthostatic hypotension, ?volume depletion. Fluids, recheck Hb in AM vs GP baseline, home if steady.",
    status: "Signed",
    location: "AMU",
  },
  {
    id: "enc-admission",
    date: "05/07/2026",
    time: "09:30",
    class: "inpatient",
    type: "Admission (Current)",
    specialty: "General Medicine",
    deptAbbrev: "GMAMU",
    provider: "Harcourt, Miriam, MD",
    description:
      "Admitted from ED after collapse. Working label: ?vasovagal / ?postural hypotension. AMU Bay 4.",
    status: "Admitted",
    location: "AMU",
    principalProblem: "Collapse — ?vasovagal / ?postural hypotension",
    admission: true,
  },
  {
    id: "enc-bloods-admit",
    date: "05/07/2026",
    time: "08:55",
    class: "inpatient",
    type: "Bloods",
    specialty: "Clinical Biochemistry",
    deptAbbrev: "LAB",
    provider: "",
    description:
      "Hb 96, MCV 88. Urea 16.8 with creatinine 88. Troponin negative, lactate 1.6, CRP 4.",
    status: "Final",
    location: "Lab",
  },
  {
    id: "enc-ed",
    date: "05/07/2026",
    time: "07:30",
    class: "ed",
    type: "ED Note",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Sowerby, Jack, MD",
    description:
      "Collapse on standing from the toilet; postural drop 118/74 → 92/60. ?vasovagal/?orthostatic. Dark stools — patient attributes to iron. Refer medicine.",
    status: "Signed",
    location: "ED",
  },
  {
    id: "enc-ecg",
    date: "05/07/2026",
    time: "07:10",
    class: "ed",
    type: "ECG",
    specialty: "Cardiac Physiology",
    deptAbbrev: "ECG",
    provider: "",
    description: "12-lead: AF, rate 92, no acute ischaemic change. Does not explain the collapse.",
    status: "Final",
    location: "ED",
  },
  {
    id: "enc-triage",
    date: "05/07/2026",
    time: "06:20",
    class: "ed",
    type: "ED Triage",
    specialty: "Emergency Medicine",
    deptAbbrev: "EDMAJ",
    provider: "Adisa, Funmi, RN",
    description:
      "Brought by ambulance after collapse in the bathroom. Pale and clammy on arrival. NEWS2 = 3.",
    status: "Signed",
    location: "ED",
  },
  {
    id: "enc-gp-knee",
    group: "3 Weeks Ago",
    date: "12/06/2026",
    time: "15:40",
    class: "outpatient",
    type: "Appointment",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Prendergast, Hugo, MD",
    description:
      "Right knee OA flare (locum). Naproxen 500 mg BD started — 28 days, review in four weeks. Physio referral.",
    status: "Signed",
    location: "GP",
  },
  {
    id: "enc-rx-naproxen",
    date: "12/06/2026",
    time: "15:55",
    class: "outpatient",
    type: "Refill",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Prendergast, Hugo, MD",
    description: "Naproxen 500 mg PO BD — 56 tablets (28 days). Acute issue, no gastroprotection.",
    status: "Dispensed",
    location: "Community Pharmacy",
  },
  {
    id: "enc-af-review",
    group: "6 Weeks Ago",
    date: "22/05/2026",
    time: "10:30",
    class: "outpatient",
    type: "Appointment",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Fenwick, Alistair, MD",
    description:
      "AF / hypertension annual review. Well. Hb 141. Ferrous sulfate repeat flagged for review — indication unclear.",
    status: "Signed",
    location: "GP",
  },
  {
    id: "enc-bloods-gp",
    date: "22/05/2026",
    time: "09:20",
    class: "outpatient",
    type: "Bloods",
    specialty: "Clinical Biochemistry",
    deptAbbrev: "LAB",
    provider: "",
    description: "Hb 141, MCV 89. Urea 5.6, creatinine 84 (eGFR 72). Ferritin 74.",
    status: "Final",
    location: "Lab",
  },
  {
    id: "enc-rx-apixaban",
    group: "2 Months Ago",
    date: "20/04/2026",
    time: "09:05",
    class: "outpatient",
    type: "Refill",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Fenwick, Alistair, MD",
    description: "Apixaban 5 mg PO BD — 56 tablets. Repeat issued.",
    status: "Dispensed",
    location: "Community Pharmacy",
  },
  {
    id: "enc-rx-ferrous",
    date: "20/04/2026",
    time: "09:05",
    class: "outpatient",
    type: "Refill",
    specialty: "Primary Care",
    deptAbbrev: "GPSURG",
    provider: "Fenwick, Alistair, MD",
    description:
      "Ferrous sulfate 200 mg PO OD — 28 tablets. On repeat since 09/2019; medication review overdue.",
    status: "Dispensed",
    location: "Community Pharmacy",
  },
  {
    id: "enc-af-dx",
    group: "5 Years Ago",
    date: "18/03/2021",
    time: "14:15",
    class: "outpatient",
    type: "Appointment",
    specialty: "Cardiology",
    deptAbbrev: "CARD",
    provider: "Nakamura, Yuki, MD",
    description:
      "New AF. Apixaban started (CHA2DS2-VASc 3). Counselled to AVOID NSAIDs given the 2019 GI bleed.",
    status: "Signed",
    location: "Cardiology Clinic",
  },
  {
    id: "enc-dc-2019",
    group: "6 Years Ago",
    date: "14/09/2019",
    time: "11:00",
    class: "inpatient",
    type: "Discharge",
    specialty: "Gastroenterology",
    deptAbbrev: "GASTRO",
    provider: "Bramwell, Edward, MD",
    description:
      "Discharged after upper GI bleed: duodenal ulcer (Forrest IIb) clipped at OGD, H. pylori eradicated. Advised to avoid NSAIDs.",
    status: "Closed",
    location: "Ward 9",
  },
];
