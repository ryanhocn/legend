import type { CaseRubric } from "../../../types";

/**
 * Scoring rubric for a hospital-day-2 progress note on the hyponatraemia case
 * (Marsh, Eileen, 71F). Items reference facts that exist in the chart
 * (documents.ts / encounters.ts); triggers list the phrasings a student might
 * reasonably use. Weights: the three live safety catches heaviest (the saline
 * still running while the sodium climbs, the correction ceiling, the culprit
 * medicines given again this morning), then the re-diagnosis, then the
 * supporting findings.
 *
 * Trigger hygiene: the PROGRESS SmartText pastes the vitals line and every
 * bloods row into the note — including the tokens "sodium", "potassium",
 * "urea", "118" and the flag word "Low" (twice) — plus literal "IVF:" and
 * "Neuro -" lines. Every trigger below keeps at least one group that pasted
 * text cannot satisfy: interpretive verbs ("risen", "hold", "correction"),
 * unpasted values ("124", "137"), or diagnosis words the template never emits.
 *
 * All content is fabricated for education and simulation only. Not for clinical use.
 */
export const caseHyponatraemia001Rubric: CaseRubric = {
  caseId: "hyponatraemia001",
  noteType: "Progress Note",
  task: { code: "progress", label: "PROGRESS REVIEW", minGrade: "fy" },
  wordBand: { target: 180, max: 300 },
  sections: [
    ["impression", "assessment", "diagnosis"],
    ["plan"],
  ],
  items: [
    {
      id: "safety-stop-saline",
      label: "Stops the 0.9% saline that is still running",
      category: "safety",
      weight: 15,
      critical: true,
      triggers: [
        [
          ["saline", "sodium chloride", "crystalloid", "drip", "infusion", "iv fluids", "intravenous fluids"],
          [
            "stop",
            "stopped",
            "stopping",
            "hold",
            "held",
            "withhold",
            "withheld",
            "discontinue",
            "discontinued",
            "cease",
            "ceased",
            "pause",
            "paused",
            "slow",
            "slowed",
            "take down",
          ],
        ],
      ],
      explanation:
        "The 0.9% saline started in ED for '?dehydration' is still running — the second litre went up at 07:00 — while the sodium has already climbed 6 mmol/L in nine hours. In likely drug-induced hyponatraemia with restored intake, continuing saline is what drives overcorrection. The note must take the infusion down (or explicitly slow it pending senior review), not 'continue IV fluids'.",
      pdqi: ["up-to-date", "useful"],
    },
    {
      id: "safety-correction-rate",
      label: "Applies the correction ceiling (8–10 mmol/L per 24 h)",
      category: "safety",
      weight: 14,
      critical: true,
      triggers: [
        [
          ["correction", "correct", "corrected", "correcting", "corrects"],
          [
            "slow",
            "slowly",
            "rate",
            "rapid",
            "rapidly",
            "too fast",
            "fast",
            "limit",
            "limited",
            "ceiling",
            "target",
            "cap",
            "capped",
            "exceed",
            "exceeded",
            "controlled",
            "8 mmol",
            "10 mmol",
          ],
        ],
        [["osmotic demyelination", "demyelination", "central pontine", "myelinolysis", "ods"]],
        [
          [
            "overcorrection",
            "overcorrect",
            "overcorrected",
            "overcorrecting",
            "overshoot",
            "overshooting",
            "overshot",
          ],
        ],
      ],
      explanation:
        "Chronic (>48 h) hyponatraemia must not correct faster than 8–10 mmol/L in any 24-hour period — overshoot risks osmotic demyelination, which is irreversible. She is at 124 from 118 in nine hours with fluid still running: on this trajectory she blows through the ceiling by tonight. The correction maths, not the sodium itself, is today's danger.",
      pdqi: ["accurate", "useful"],
    },
    {
      id: "safety-hold-culprits",
      label: "Holds the culprit medicines (indapamide first among them)",
      category: "safety",
      weight: 12,
      critical: true,
      triggers: [
        [
          ["indapamide", "thiazide", "diuretic"],
          [
            "hold",
            "held",
            "holding",
            "stop",
            "stopped",
            "stopping",
            "withhold",
            "withheld",
            "suspend",
            "suspended",
            "omit",
            "omitted",
            "discontinue",
            "discontinued",
          ],
        ],
        [
          ["culprit", "offending", "sodium lowering", "implicated"],
          ["medication", "medications", "medicine", "medicines", "drug", "drugs", "meds"],
        ],
      ],
      explanation:
        "Indapamide (added 16/06/2026, safety bloods never done) is the classic thiazide-type cause of profound hyponatraemia, with sertraline as a contributing SSRI — and the drug chart shows both were given again at 08:00 this morning. A note that does not hold them leaves the cause being re-dosed daily; a restarted thiazide will crash the sodium again after discharge.",
      pdqi: ["accurate", "up-to-date"],
    },
    {
      id: "finding-seizure",
      label: "Recognises the ED 'funny turn' as a likely seizure",
      category: "findings",
      weight: 8,
      triggers: [
        [["seizure", "seizures", "convulsion", "convulsions", "ictal", "postictal", "post ictal"]],
        [["symptomatic"], ["hyponatraemia", "hyponatremia"]],
      ],
      explanation:
        "The ED note records 90 seconds unresponsive with lip-smacking and left-hand twitching, then 10 minutes of drowsiness — a post-ictal picture, filed as a '?vasovagal funny turn' and never mentioned in the clerking. A hyponatraemic seizure reclassifies this as SEVERELY symptomatic hyponatraemia (hypertonic saline territory at the time) and mandates seizure precautions now. It is only in the ED note: the chart rewards whoever reads it back.",
      pdqi: ["thorough", "accurate"],
    },
    {
      id: "finding-against-dehydration",
      label: "Challenges the '?dehydration' label with the chart evidence",
      category: "findings",
      weight: 8,
      triggers: [
        [
          ["dehydration", "dehydrated", "hypovolaemia", "hypovolaemic", "hypovolemia", "hypovolemic"],
          [
            "not",
            "against",
            "unlikely",
            "doesnt fit",
            "does not fit",
            "no evidence",
            "little evidence",
            "questionable",
            "challenge",
            "challenged",
            "wrong",
            "mislabelled",
            "mislabeled",
            "refuted",
            "doubt",
            "doubtful",
          ],
        ],
        [["euvolaemic", "euvolemic", "euvolaemia", "euvolemia", "normovolaemic", "normovolemic"]],
        [["stable weight", "weight stable", "normal urea", "low normal urea", "urea normal"]],
      ],
      explanation:
        "Urea 3.1 (low-normal), creatinine 58 with eGFR >90, a weight identical to February's and boringly normal haemodynamics overnight: nothing here supports volume depletion. 'Mucous membranes look dry' is the weakest sign in the book. The note must say the label does not fit — otherwise the saline keeps its justification.",
      pdqi: ["internally consistent", "synthesized"],
    },
    {
      id: "finding-na-trend",
      label: "Reads the sodium trajectory (118 → 124 in nine hours)",
      category: "findings",
      weight: 7,
      triggers: [
        [
          [
            "risen",
            "rising",
            "rise",
            "trending up",
            "uptrend",
            "trajectory",
            "rate of rise",
            "increased by",
            "risen by",
            "up from",
            "climbing",
          ],
          ["sodium", "na", "118", "124"],
        ],
        [["118 to 124", "118 124", "124 from 118", "from 118 to 124"]],
      ],
      explanation:
        "The 06:10 repeat sodium is 124 — up 6 mmol/L in roughly nine hours, most of the 24-hour allowance spent before breakfast. The absolute number looks like reassuring progress; the RATE is the finding. This is why hyponatraemia needs serial values read as a slope, not single results.",
      pdqi: ["up-to-date", "synthesized"],
    },
    {
      id: "finding-both-drugs",
      label: "Names both sodium-lowering medicines with their start dates",
      category: "findings",
      weight: 7,
      triggers: [[["indapamide", "thiazide"], ["sertraline", "ssri"]]],
      explanation:
        "Two culprits, not one: indapamide added at the 16/06 BP review (three weeks before admission, monitoring bloods still outstanding) on top of sertraline started 12/02 for bereavement low mood — with a documented normal sodium of 137 before either mattered. The GP letters and the pharmacist's history carry the whole timeline; the note should assemble it.",
      pdqi: ["thorough", "synthesized"],
    },
    {
      id: "assessment-hyponatraemia",
      label: "States the diagnosis: hyponatraemia (not 'dehydration')",
      category: "assessment",
      weight: 10,
      triggers: [[["hyponatraemia", "hyponatremia"]]],
      explanation:
        "The unifying diagnosis for the confusion, the fall and the trolley episode is severe hyponatraemia — the '?dehydration' clerking label is a description of somebody's guess at the cause, not a diagnosis. Naming it is what re-anchors the whole problem list.",
      pdqi: ["accurate", "synthesized"],
    },
    {
      id: "assessment-severity",
      label: "Grades it: severe (Na <120) and symptomatic",
      category: "assessment",
      weight: 6,
      triggers: [[["severe", "severely", "profound"], ["hyponatraemia", "hyponatremia", "118"]]],
      explanation:
        "Sodium 118 is biochemically severe (<120), and confusion plus a probable seizure makes it clinically severe too. Severity is what separates 'chase it in clinic' from 'this patient nearly needed hypertonic saline last night' — it sets the urgency of everything else in the plan.",
      pdqi: ["accurate", "synthesized"],
    },
    {
      id: "assessment-cause",
      label: "Attributes it to the medicines (thiazide + SSRI), not volume",
      category: "assessment",
      weight: 8,
      triggers: [
        [
          [
            "drug induced",
            "medication induced",
            "drug related",
            "medication related",
            "thiazide induced",
            "ssri induced",
            "iatrogenic",
          ],
        ],
        [
          [
            "indapamide",
            "thiazide",
            "sertraline",
            "ssri",
            "diuretic",
            "antidepressant",
            "medication",
            "medications",
            "medicines",
          ],
          [
            "cause",
            "caused",
            "causing",
            "culprit",
            "contributing",
            "contributor",
            "driver",
            "driving",
            "secondary to",
            "likely due",
            "attributable",
            "implicated",
            "precipitated",
            "precipitating",
          ],
        ],
        [["siadh"]],
      ],
      explanation:
        "A new thiazide-type diuretic three weeks in, an SSRI five months in, a normal baseline sodium in February and biochemistry against volume depletion: this is drug-induced hyponatraemia (with an SIADH-like physiology from the sertraline) until proven otherwise. Getting the mechanism right is what makes stopping the saline and holding the drugs coherent rather than arbitrary.",
      pdqi: ["accurate", "synthesized"],
    },
    {
      id: "plan-paired-osms",
      label: "Sends paired serum + urine osmolality and urine sodium",
      category: "plan",
      weight: 8,
      triggers: [
        [["osmolality", "osmolalities", "osmolarity", "osmolarities"]],
        [["urine sodium", "urinary sodium", "urine na", "urine electrolytes", "urine osmolality"]],
      ],
      explanation:
        "Nobody has sent the confirmatory workup: paired serum and urine osmolality with a urine sodium (the sticky note's 'sent, or assumed?'). Every hour on treatment makes the results harder to interpret — they should go now, with TFTs already normal in February and a 9 am cortisol worth adding. Assumed diagnoses are how the next mislabel happens.",
      pdqi: ["thorough", "useful"],
    },
    {
      id: "plan-recheck-na",
      label: "Rechecks the sodium at a defined short interval",
      category: "plan",
      weight: 7,
      triggers: [
        [
          [
            "recheck",
            "re check",
            "repeat",
            "serial",
            "2 hourly",
            "4 hourly",
            "6 hourly",
            "2 4 hourly",
            "4 6 hourly",
          ],
          ["sodium", "na", "u e", "u es", "electrolytes", "bloods", "chemistry"],
        ],
      ],
      explanation:
        "With the fluids coming down and the correction budget nearly spent, the sodium needs rechecking at a defined short interval (2–4 hours, then 4–6 hourly) — not 'repeat U&E in the morning' again. If it overshoots despite stopping fluids, seniors may need to re-lower it (dextrose ± desmopressin), and that decision hangs on timely numbers.",
      pdqi: ["useful", "up-to-date"],
    },
    {
      id: "plan-escalate",
      label: "Escalates today: registrar/consultant, ?renal input, ?HDU-level monitoring",
      category: "plan",
      weight: 7,
      triggers: [
        [
          [
            "senior",
            "registrar",
            "med reg",
            "medical registrar",
            "consultant",
            "nephrology",
            "endocrinology",
            "renal team",
            "endocrine team",
            "critical care",
            "hdu",
            "itu",
            "icu",
            "outreach",
          ],
          [
            "discuss",
            "discussed",
            "inform",
            "informed",
            "review",
            "reviewed",
            "escalate",
            "escalated",
            "aware",
            "refer",
            "referred",
            "referral",
            "contact",
            "contacted",
            "involve",
            "involved",
            "opinion",
            "advice",
            "input",
          ],
        ],
      ],
      explanation:
        "Severe symptomatic hyponatraemia correcting too fast is a today problem for a senior decision-maker — the registrar or consultant now, renal/endocrine input if it keeps climbing, and a conversation about HDU-level monitoring. An FY who recognises the trap and escalates it has done the job; an FY who quietly adjusts the drip rate alone has not.",
      pdqi: ["useful", "up-to-date"],
    },
    {
      id: "plan-neuro-falls",
      label: "Adds neuro obs and seizure/falls precautions",
      category: "plan",
      weight: 5,
      triggers: [
        [
          [
            "neuro obs",
            "neuro observations",
            "neurological observations",
            "seizure precautions",
            "falls precautions",
            "falls risk",
            "close observation",
          ],
        ],
      ],
      explanation:
        "She seized last night (probably), fell at home, and remains mildly confused: neuro obs with seizure precautions and the falls bundle already started by nursing need to continue on the medical plan, not just the nursing one. If she seizes again the response is different now that the cause is known.",
      pdqi: ["thorough", "useful"],
    },
    {
      id: "plan-potassium",
      label: "Replaces the potassium deliberately (it raises the sodium too)",
      category: "plan",
      weight: 4,
      triggers: [
        [
          [
            "replace potassium",
            "potassium replacement",
            "potassium supplementation",
            "supplement potassium",
            "replacing potassium",
            "correct potassium",
            "potassium correction",
            "sando k",
          ],
        ],
        [["hypokalaemia", "hypokalemia"]],
      ],
      explanation:
        "The thiazide took the potassium down with the sodium (3.4, now 3.6). It needs replacing — but potassium is osmotically active: replacing it raises the serum sodium as surely as saline does, and it counts against the same correction ceiling. Replace deliberately, with senior guidance, not reflexively.",
      pdqi: ["accurate", "thorough"],
    },
  ],
  modelNote: `PROGRESS REVIEW — General Medicine (hospital day 2)

71F admitted overnight after a fall with confusion, clerked as ?dehydration. The chart argues against that label: urea 3.1 with normal creatinine, weight identical to February, haemodynamically unremarkable — clinically euvolaemic. The ED episode at 21:30 (90 seconds unresponsive, lip-smacking, left-hand twitching, then drowsy) was likely a seizure, not a funny turn.

Two culprit medicines: indapamide added 16/06 (monitoring bloods never done) and sertraline since 12/02; baseline sodium 137 in February. Repeat sodium 124 at 06:10 — risen 6 mmol in nine hours with the second litre of 0.9% saline running and both drugs given again at 08:00.

Impression
Severe symptomatic hyponatraemia (118 on admission), drug-induced — thiazide plus SSRI with SIADH-type physiology — not dehydration. Now correcting too fast.

Plan
1. STOP the saline now. Correction must not exceed 8 mmol/L in 24 h (osmotic demyelination risk) — 6 of that is already spent.
2. Hold indapamide and sertraline; amlodipine alone for blood pressure today.
3. Send paired serum and urine osmolality plus urine sodium before further treatment; add a 9 am cortisol (TFTs normal in February).
4. Recheck U&E at 2–4 hours then 4–6 hourly; discuss with the medical registrar now — nephrology input and HDU-level monitoring if it keeps climbing, and senior decision on re-lowering if we overshoot.
5. Neuro obs with seizure precautions; falls precautions continue.
6. Replace potassium cautiously — it raises the serum sodium and counts against the same ceiling.`,
};
