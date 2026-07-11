import type {
  AuthoredEvent,
  ChronosIntent,
  ClinicalMicro,
  ClinicalNote,
  Encounter,
  RoundSpec,
  VitalsPoint,
} from "../../../types";

/**
 * Dynamic sim-events for the cholangitis case (Hart, Amelia, 64F). Revealed by
 * the server sim-clock (Model B): each AuthoredEvent folds via applyEvents once
 * simNow reaches its `at` (sim-offset seconds from the 16/06/2026 17:00 anchor).
 *
 * Content:
 *  - Staged blood-culture microbiology the static chart lacks: Gram-negative
 *    bacilli (~13h) -> E. coli identified (~35h) -> final sensitivities (~58h).
 *  - Two NPC ward-round notes (day 2, day 3) that materialise if the trainee
 *    advances past a round without writing it (spec §9). They are written to
 *    carry NONE of the day-1 rubric's answers (leak-safe, enforced in CI).
 *  - A post-ERCP vitals trend showing the expected recovery.
 *
 * Reveal `at` vs note timestamp: an NPC note is DATED the day it was written
 * (its `timestamp` = anchor + that day) but REVEALS at the following round's
 * `at`, i.e. once the trainee has moved past the round it covers.
 *
 * All content is synthetic. For education and simulation only. Not for clinical use.
 */

const ANCHOR = Date.UTC(2026, 5, 16, 17, 0) / 1000; // 1781629200, keep in sync with the registry entry

// --- Microbiology progression (new encounter row + micro receipt per stage) ---

const gramEncounter: Encounter = {
  id: "enc-micro-gram",
  date: "17/06/2026",
  time: "06:15",
  class: "inpatient",
  type: "Microbiology",
  specialty: "Microbiology",
  deptAbbrev: "MICRO",
  provider: "",
  description: "Blood culture flagged positive at ~24h: Gram-negative bacilli. ID and sensitivities to follow.",
  status: "Preliminary",
  location: "Lab",
};

const gramMicro: ClinicalMicro = {
  kind: "micro",
  id: "micro-cultures-002",
  encounterId: "enc-micro-gram",
  title: "Blood Culture — Preliminary (Gram stain)",
  status: "Preliminary",
  specimen: "Blood culture x2 sets (aerobic + anaerobic, separate sites); Urine (MSU)",
  collected: "16/06/2026 06:05",
  received: "16/06/2026 06:40",
  reportedAt: "17/06/2026 06:15",
  organisms: [{ name: "Gram-negative bacilli (awaiting identification)", gramStain: "Gram-negative bacilli" }],
  resultText: `BLOOD CULTURE (x2 sets) — PRELIMINARY
One aerobic bottle flagged positive at approximately 24 hours.
Gram stain: GRAM-NEGATIVE BACILLI. Species identification and susceptibilities to follow.
The second set and the anaerobic bottles show no growth to date.

URINE CULTURE (MSU) — no growth to date.`,
};

const idEncounter: Encounter = {
  id: "enc-micro-id",
  date: "18/06/2026",
  time: "05:30",
  class: "inpatient",
  type: "Microbiology",
  specialty: "Microbiology",
  deptAbbrev: "MICRO",
  provider: "",
  description: "Blood culture: Escherichia coli identified. Susceptibilities pending.",
  status: "Preliminary",
  location: "Lab",
};

const idMicro: ClinicalMicro = {
  kind: "micro",
  id: "micro-cultures-003",
  encounterId: "enc-micro-id",
  title: "Blood Culture — Organism identified",
  status: "Preliminary",
  specimen: "Blood culture x2 sets (aerobic + anaerobic, separate sites); Urine (MSU)",
  collected: "16/06/2026 06:05",
  received: "16/06/2026 06:40",
  reportedAt: "18/06/2026 05:30",
  organisms: [{ name: "Escherichia coli", gramStain: "Gram-negative bacilli" }],
  resultText: `BLOOD CULTURE (x2 sets) — PRELIMINARY
ESCHERICHIA COLI isolated from the aerobic bottle (1 of 2 sets).
Susceptibilities to follow. Anaerobic bottles: no growth to date.

URINE CULTURE (MSU) — no growth at 48 hours.`,
};

const sensEncounter: Encounter = {
  id: "enc-micro-sens",
  date: "19/06/2026",
  time: "06:00",
  class: "inpatient",
  type: "Microbiology",
  specialty: "Microbiology",
  deptAbbrev: "MICRO",
  provider: "",
  description: "Blood culture: E. coli, susceptibilities reported. Oral step-down options available.",
  status: "Final",
  location: "Lab",
};

const sensMicro: ClinicalMicro = {
  kind: "micro",
  id: "micro-cultures-004",
  encounterId: "enc-micro-sens",
  title: "Blood Culture — Escherichia coli, susceptibilities",
  status: "Final",
  specimen: "Blood culture x2 sets (aerobic + anaerobic, separate sites); Urine (MSU)",
  collected: "16/06/2026 06:05",
  received: "16/06/2026 06:40",
  reportedAt: "19/06/2026 06:00",
  organisms: [
    {
      name: "Escherichia coli",
      gramStain: "Gram-negative bacilli",
      sensitivities: [
        { drug: "Amoxicillin", interpretation: "R" },
        { drug: "Co-amoxiclav", mic: "4", interpretation: "S" },
        { drug: "Ciprofloxacin", mic: "0.06", interpretation: "S" },
        { drug: "Gentamicin", mic: "0.5", interpretation: "S" },
        { drug: "Trimethoprim", interpretation: "R" },
        { drug: "Piperacillin/tazobactam", mic: "2", interpretation: "S" },
      ],
    },
  ],
  resultText: `BLOOD CULTURE (x2 sets) — FINAL
Escherichia coli, susceptibilities as tabulated.
An oral agent to which the isolate is susceptible is available for step-down.

URINE CULTURE (MSU) — no growth (final).`,
};

// --- NPC ward-round notes (leak-safe: carry none of the day-1 rubric answers) ---

const npcDay2Note: ClinicalNote = {
  kind: "note",
  id: "npc-prog-d2",
  encounterId: "enc-ward-round-d2",
  category: "Progress",
  noteType: "Progress Note",
  author: "Sowande, Bisi",
  credential: "MD",
  authorId: "d271044",
  authorRole: "*PHYSICIAN: RESIDENT",
  service: "(A) General Surgery — AMU",
  dateOfService: "17/06/26 0800",
  fileTime: "17/06/26 0812",
  timestamp: ANCHOR + 54000,
  status: "signed",
  body: `SURGICAL PROGRESS NOTE (Day 2)

Reviewed on the morning round. Comfortable overnight, afebrile, haemodynamically stable. Tolerating a light diet, mobilising with physiotherapy. Passing urine; bowels not yet open.

Obs: T 36.9, HR 78, BP 122/74, RR 16, SpO2 98% on air.

Inflammatory markers falling and bilirubin down from admission. Renal function back to baseline.

Impression: recovering well after the biliary procedure. Infection markers improving on the current antimicrobial.

Plan:
- Continue the antimicrobial as charted; microbiology to advise on step-down once susceptibilities are available.
- Encourage oral intake, remove the catheter, continue thromboprophylaxis.
- Diabetes medication to be reviewed by the team before any restart.
- Chase the outstanding microbiology. Consultant round this afternoon.`,
};

const npcDay3Note: ClinicalNote = {
  kind: "note",
  id: "npc-prog-d3",
  encounterId: "enc-ward-round-d3",
  category: "Progress",
  noteType: "Progress Note",
  author: "Whitlock, Grace",
  credential: "MD",
  authorId: "d193882",
  authorRole: "*PHYSICIAN: FACULTY",
  service: "(A) General Surgery — AMU",
  dateOfService: "18/06/26 0800",
  fileTime: "18/06/26 0815",
  timestamp: ANCHOR + 140400,
  status: "signed",
  body: `SURGICAL PROGRESS NOTE (Day 3)

Continues to improve. Afebrile, eating and drinking, independently mobile. Cannula resited yesterday. No abdominal pain.

Obs: T 36.8, HR 72, BP 126/76, RR 15, SpO2 99% on air.

Microbiology: an organism has been identified on the blood specimen; susceptibilities are awaited and the antimicrobial plan will be finalised with the microbiologist today.

Impression: good recovery after the biliary intervention.

Plan:
- Step down to an oral antimicrobial once the specimen susceptibilities return.
- Restart routine home medication as oral intake is established, and document the decision.
- Arrange interval outpatient surgical follow-up.
- Likely fit for discharge in the next 24 to 48 hours pending the microbiology plan.`,
};

// --- Vitals trend (post-ERCP recovery) ---

const vitalsD1Evening: VitalsPoint = { t: "18:00", sys: 118, dia: 74, hr: 82, resp: 16, spo2: 97, tempC: 37.4 };
const vitalsD2: VitalsPoint = { t: "D2 07:00", sys: 122, dia: 76, hr: 78, resp: 15, spo2: 98, tempC: 36.9 };
const vitalsD3: VitalsPoint = { t: "D3 06:00", sys: 126, dia: 76, hr: 72, resp: 15, spo2: 99, tempC: 36.8 };

/**
 * Authored reveal timeline. `seq` is monotonic with `at`; on an `at` tie the
 * encounter.append precedes its result.release so the row exists when the
 * receipt folds. NPC notes reveal at the FOLLOWING round's `at` (once the
 * trainee has moved past the round they cover).
 */
export const cholangitis001Events: AuthoredEvent[] = [
  { at: 3600, seq: 1, event: { kind: "vitals.append", point: vitalsD1Evening } },
  { at: 46800, seq: 2, dedupeKey: "micro-gram-enc", event: { kind: "encounter.append", encounter: gramEncounter } },
  { at: 46800, seq: 3, dedupeKey: "micro-gram", event: { kind: "result.release", document: gramMicro } },
  { at: 50400, seq: 4, event: { kind: "vitals.append", point: vitalsD2 } },
  { at: 126000, seq: 5, dedupeKey: "micro-id-enc", event: { kind: "encounter.append", encounter: idEncounter } },
  { at: 126000, seq: 6, dedupeKey: "micro-id", event: { kind: "result.release", document: idMicro } },
  { at: 133200, seq: 7, event: { kind: "vitals.append", point: vitalsD3 } },
  { at: 140400, seq: 8, dedupeKey: "npc-d2", event: { kind: "note.create", note: npcDay2Note } },
  { at: 208800, seq: 9, dedupeKey: "micro-sens-enc", event: { kind: "encounter.append", encounter: sensEncounter } },
  { at: 208800, seq: 10, dedupeKey: "micro-sens", event: { kind: "result.release", document: sensMicro } },
  { at: 208800, seq: 11, dedupeKey: "npc-d3", event: { kind: "note.create", note: npcDay3Note } },
];

/**
 * Round schedule. Round 0 (day-1 post-take ward round) is the trainee's
 * rubric-scored task and reuses enc-admission (as trainee notes do today). The
 * day-2/day-3 rounds carry their own encounter ids so a trainee note written at
 * that round suppresses the matching NPC note.
 */
export const cholangitis001Rounds: RoundSpec[] = [
  { at: 0, encounterId: "enc-admission", label: "Post-take ward round (day 1)" },
  { at: 54000, encounterId: "enc-ward-round-d2", label: "Progress note (day 2)", npcNoteId: "npc-prog-d2" },
  { at: 140400, encounterId: "enc-ward-round-d3", label: "Progress note (day 3)", npcNoteId: "npc-prog-d3" },
];

/**
 * Chronos intents (spec §8). Asking about the cultures / susceptibilities /
 * which antibiotic pulls the final sensitivities reveal (at 208800) forward and
 * lets the intervening rounds' NPC notes materialise on catch-up.
 */
export const cholangitis001Chronos: ChronosIntent[] = [
  {
    triggers: [
      [["culture", "cultures", "sensitivity", "sensitivities", "micro", "microbiology"]],
      [["organism", "organisms", "bug", "bugs", "coli"]],
      [
        ["antibiotic", "antibiotics", "abx", "antimicrobial", "antimicrobials"],
        ["which", "what", "narrow", "de-escalate", "deescalate", "step", "target", "targeted", "change"],
      ],
    ],
    targetAt: 208800,
    reply:
      "Micro expedited by Hermes: blood cultures are back. Escherichia coli, susceptibilities attached (sensitive to co-amoxiclav, ciprofloxacin and gentamicin). De-escalate to a targeted agent per the susceptibilities and stewardship. Note that advancing to this result also moved the ward clock forward, so the team's intervening notes are now filed.",
  },
];
