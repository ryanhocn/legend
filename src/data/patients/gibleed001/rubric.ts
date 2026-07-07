import type { CaseRubric } from "../../../types";

/**
 * Scoring rubric for a day-2 ward-round / progress note on the
 * GI-bleed-as-collapse case. Items reference facts that exist in the chart
 * (documents.ts / encounters.ts); triggers list the phrasings a student might
 * reasonably use. Weights: safety catches heaviest (the DOAC and NSAID still
 * running on a bleeding patient, the never-sent group & save, the melaena
 * mislabelled as iron, the missing endoscopy referral), then diagnosis and
 * disposition, then supporting findings.
 *
 * All content is fabricated for education and simulation only. Not for clinical use.
 */
export const caseGibleed001Rubric: CaseRubric = {
  caseId: "gibleed001",
  noteType: "Progress Note",
  task: { code: "ward", label: "WARD ROUND REVIEW", minGrade: "fy" },
  wordBand: { target: 150, max: 250 },
  sections: [
    ["impression", "assessment", "diagnosis"],
    ["plan"],
  ],
  items: [
    {
      id: "safety-hold-apixaban",
      label: "Holds the apixaban (anticoagulant running on an active bleed)",
      category: "safety",
      weight: 15,
      critical: true,
      triggers: [
        [
          ["apixaban"],
          [
            "hold",
            "held",
            "holding",
            "stop",
            "stopped",
            "withhold",
            "withheld",
            "suspend",
            "suspended",
            "omit",
            "omitted",
          ],
        ],
        [
          ["anticoagulation", "anticoagulant", "doac"],
          [
            "hold",
            "held",
            "holding",
            "stop",
            "stopped",
            "withhold",
            "withheld",
            "suspend",
            "suspended",
            "omit",
            "omitted",
          ],
        ],
      ],
      explanation:
        "Apixaban is still active on the inpatient chart — given again at 08:05 this morning — in a man with three charted black stools and an Hb of 89 from 141. Pharmacy flagged the combination yesterday afternoon and nobody acted. Every further dose deepens the bleed; the note must document the hold (and that re-anticoagulation for his AF is a deliberate, senior decision once haemostasis is secured).",
      pdqi: ["accurate", "up-to-date", "useful"],
    },
    {
      id: "safety-hold-naproxen",
      label: "Stops the naproxen (NSAID on a bleeding ulcer, against 2019 advice)",
      category: "safety",
      weight: 12,
      critical: true,
      triggers: [
        [
          ["naproxen", "nsaid", "nsaids"],
          [
            "hold",
            "held",
            "holding",
            "stop",
            "stopped",
            "withhold",
            "withheld",
            "discontinue",
            "discontinued",
            "suspend",
            "suspended",
            "omit",
            "omitted",
          ],
        ],
      ],
      explanation:
        "A locum started naproxen on 12/06 for a knee flare — with no gastroprotection, on top of apixaban, in a patient whose 2019 discharge letter says in writing to avoid NSAIDs after his duodenal ulcer bled. It too was given at 08:05 this morning. The note must stop it explicitly; 'continue regular medications' is how the error propagates.",
      pdqi: ["accurate", "useful"],
    },
    {
      id: "safety-melaena-not-iron",
      label: "Calls the dark stools melaena — rejects the ferrous sulfate explanation",
      category: "safety",
      weight: 10,
      critical: true,
      triggers: [[["melaena", "melena"]]],
      explanation:
        "'Dark stools — on ferrous sulfate' was written in the clerking and copied forward verbatim into this morning's round, while the nursing stool chart accumulated three black, tarry, offensive stools. Iron darkens stool but does not drop the Hb by 50 g/L or push the urea to 19.4. Committing the word 'melaena' to the note is the step that makes the bleed undeniable to the next reader.",
      pdqi: ["accurate", "internally consistent", "synthesized"],
    },
    {
      id: "safety-group-save",
      label: "Sends a group & save / crossmatch (never done)",
      category: "safety",
      weight: 10,
      critical: true,
      triggers: [
        [
          [
            "group and save",
            "group save",
            "g s",
            "crossmatch",
            "cross match",
            "x match",
            "xmatch",
            "transfusion",
            "transfuse",
          ],
        ],
      ],
      explanation:
        "No group & save has been sent at any point in this admission — a bleeding patient on an anticoagulant has no blood available if he decompensates. Transfusion-readiness (G&S, crossmatch if the Hb keeps falling, a stated threshold) has to be in today's plan, not discovered at the emergency.",
      pdqi: ["useful", "thorough"],
    },
    {
      id: "plan-endoscopy",
      label: "Refers for urgent endoscopy (OGD)",
      category: "plan",
      weight: 12,
      critical: true,
      triggers: [
        [["ogd", "endoscopy", "gastroscopy"]],
        [
          ["gastroenterology", "gastro"],
          ["refer", "referral", "referred", "discuss", "discussed", "review"],
        ],
      ],
      explanation:
        "An upper GI bleed with a falling Hb on a DOAC needs inpatient endoscopy — source control, exactly as his 2019 bleed was controlled. No referral exists anywhere in the chart; the current plan is physiotherapy and discharge tomorrow. The note must make the OGD referral today and keep him appropriately fasted.",
      pdqi: ["useful", "up-to-date"],
    },
    {
      id: "finding-hb-drop",
      label: "Tracks the Hb against the GP baseline (141 → 96 → 89)",
      category: "findings",
      weight: 8,
      triggers: [
        [["hb", "haemoglobin", "hemoglobin"], ["141"]],
        [
          ["hb", "haemoglobin", "hemoglobin"],
          ["drop", "dropped", "fall", "fallen", "falling", "fell", "trend", "trending", "down"],
        ],
        [["96"], ["89"]],
      ],
      explanation:
        "The GP annual-review bloods of 22/05 sit in the chart: Hb 141 six weeks ago, 96 on admission, 89 this morning. This morning's note read the fall as 'dilutional' — but the post-take round explicitly asked for comparison with the GP baseline, and against 141 this is a 50 g/L real loss, not fluid.",
      pdqi: ["accurate", "up-to-date", "thorough"],
    },
    {
      id: "finding-urea-pattern",
      label: "Reads the disproportionate urea as an upper GI marker",
      category: "findings",
      weight: 8,
      triggers: [
        [["urea"], ["disproportionate", "disproportionately", "out of proportion", "ratio"]],
        [
          ["urea"],
          ["raised", "elevated", "rising", "high"],
          ["creatinine", "creat"],
          ["normal", "preserved"],
        ],
        [["urea"], ["digested blood", "upper gi marker"]],
      ],
      explanation:
        "Urea 16.8 then 19.4 against a creatinine of 88–92 (baseline urea 5.6): dehydration raises both together, whereas digested blood loads the gut with protein and drives urea up alone. The disproportionate urea:creatinine ratio is the biochemical signature of an upper GI bleed, and it was filed under '?dehydration' twice.",
      pdqi: ["accurate", "synthesized"],
    },
    {
      id: "finding-postural-drop",
      label: "Reports the postural drop — and reads it as volume loss",
      category: "findings",
      weight: 6,
      triggers: [
        [["postural", "orthostatic", "lying standing", "lying and standing"]],
      ],
      explanation:
        "Lying 118/74 → standing 92/60 with a rate rise to 118 is a marked postural drop — real hypovolaemia, correctly measured and then attributed to the wrong fluid. The finding belongs in the note with the right cause attached: blood loss, not the warm weather.",
      pdqi: ["thorough", "accurate"],
    },
    {
      id: "finding-ulcer-history",
      label: "Surfaces the 2019 duodenal ulcer from the discharge letter",
      category: "findings",
      weight: 8,
      triggers: [
        [["duodenal", "peptic"], ["ulcer"]],
        [["ulcer"], ["2019", "previous", "prior", "known", "history", "old"]],
      ],
      explanation:
        "The clerking records 'Anaemia — on ferrous sulfate (details unclear)'; the details are in the 14/09/2019 discharge letter: a duodenal ulcer that bled, was clipped at OGD, and came with written advice to avoid NSAIDs. The iron is a fossil of that bleed — a 3-month course never stopped. The pre-test probability for this admission lives in that letter.",
      pdqi: ["thorough", "synthesized"],
    },
    {
      id: "finding-stool-chart",
      label: "Uses the nursing stool chart (three black stools charted)",
      category: "findings",
      weight: 5,
      triggers: [
        [["stool chart"]],
        [["overnight", "further"], ["black", "tarry"], ["stool", "stools"]],
      ],
      explanation:
        "Nursing charted a black, tarry, offensive stool at 13:10 yesterday and two more overnight (02:30, 05:45), and handed all three over for review this morning. The evidence was collected and documented by the nurses; the medical notes just never looked at it.",
      pdqi: ["up-to-date", "thorough"],
    },
    {
      id: "assessment-ugib",
      label: "States the diagnosis: upper GI bleed",
      category: "assessment",
      weight: 10,
      triggers: [
        [
          [
            "upper gi bleed",
            "upper gi bleeding",
            "upper gastrointestinal bleed",
            "upper gastrointestinal bleeding",
            "ugib",
            "gi bleed",
            "gi bleeding",
          ],
        ],
      ],
      explanation:
        "Melaena + Hb 141→89 + disproportionate urea + an NSAID-on-DOAC combination + a previously bleeding duodenal ulcer = upper GI bleed. Every element is already in the chart; no single note has put them together.",
      pdqi: ["accurate", "synthesized"],
    },
    {
      id: "assessment-blatchford",
      label: "Risk-stratifies with a Glasgow-Blatchford score",
      category: "assessment",
      weight: 6,
      triggers: [[["blatchford", "glasgow blatchford", "gbs"]]],
      explanation:
        "The Glasgow-Blatchford score is the standard pre-endoscopy risk stratification for an upper GI bleed — his urea alone scores heavily, before the Hb, the syncope and the tachycardia are added. It has not been considered anywhere in this chart; naming it is what converts 'unwell' into a triaged urgency.",
      pdqi: ["synthesized", "useful"],
    },
    {
      id: "assessment-not-vasovagal",
      label: "Retires the vasovagal / dehydration label explicitly",
      category: "assessment",
      weight: 6,
      triggers: [
        [
          ["vasovagal", "dehydration", "postural", "orthostatic"],
          [
            "not",
            "never",
            "unlikely",
            "against",
            "rather than",
            "mislabelled",
            "mislabeled",
            "reject",
            "rejected",
            "retire",
            "retired",
          ],
        ],
        [
          ["blood loss", "hypovolaemia", "hypovolemia", "haemorrhage", "hemorrhage"],
          ["collapse", "syncope", "faint", "fainted", "postural", "drop"],
        ],
      ],
      explanation:
        "A syncopal patient bleeds somewhere until proven otherwise — the question the clerking never asked is what he was losing when he fainted. '?vasovagal, ?postural — dehydration' has been copied forward through three notes; unless today's note explicitly retires it, the next shift inherits it and discharges him.",
      pdqi: ["synthesized", "internally consistent"],
    },
    {
      id: "plan-ppi",
      label: "Starts a proton pump inhibitor",
      category: "plan",
      weight: 6,
      triggers: [
        [["ppi", "omeprazole", "pantoprazole", "esomeprazole", "proton pump"]],
      ],
      explanation:
        "An IV proton pump inhibitor belongs in the plan for a suspected bleeding peptic ulcer, pending endoscopy — and note he has been on no gastroprotection at all since the naproxen was started.",
      pdqi: ["useful", "up-to-date"],
    },
    {
      id: "plan-resus-monitoring",
      label: "Continues resuscitation with tightened monitoring and escalation",
      category: "plan",
      weight: 5,
      triggers: [
        [["iv fluids", "fluid resuscitation", "crystalloid", "fluids"]],
        [["hourly", "monitoring", "monitored", "escalate", "escalation", "news"]],
        [["senior", "registrar", "consultant"], ["review", "informed", "discussed", "aware"]],
      ],
      explanation:
        "He is quietly decompensating on 4-hourly obs — HR 92 → 108 overnight while the BP drifts down. The plan needs IV access and fluids, hourly observations with explicit escalation triggers (further melaena, tachycardia, hypotension), and the senior team informed this morning, not at the afternoon round.",
      pdqi: ["useful", "thorough"],
    },
  ],
  modelNote: `WARD REVIEW — General Medicine (day 2)

72M admitted after collapsing in the bathroom, labelled ?vasovagal / postural hypotension from dehydration. The chart disagrees: three days of black tarry stools — two further overnight on the stool chart — recorded as "dark stools, on ferrous sulfate", but iron does not explain the numbers. Hb 141 at the GP in May, 96 on admission, 89 today: a real fall, not dilution. Urea 19.4 is disproportionately raised against a normal creatinine (92) — digested blood. The 2019 discharge letter documents a bleeding duodenal ulcer with written advice to avoid NSAIDs; a locum started naproxen on 12/06, on top of apixaban for AF, and both were given again this morning. The postural drop (118/74 → 92/60) and the collapse reflect blood loss, not simple dehydration.

Impression
Upper GI bleed — melaena, likely recurrent duodenal ulcer on NSAID + DOAC. Glasgow-Blatchford well above low risk; this was never a vasovagal faint.

Plan
1. HOLD apixaban and STOP naproxen — correct the drug chart now; re-anticoagulation is a senior decision once haemostasis is secured.
2. Group & save + crossmatch 2 units; repeat FBC this afternoon.
3. Urgent OGD — refer gastroenterology today; NBM from midday.
4. IV PPI (pantoprazole).
5. IV fluids; hourly obs with escalation for further melaena, tachycardia or hypotension; registrar informed this morning.`,
};
