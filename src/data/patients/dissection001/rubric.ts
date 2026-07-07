import type { CaseRubric } from "../../../types";

/**
 * Scoring rubric for a day-1 ED review / assessment note on the aortic
 * dissection case. Items reference facts that exist in the chart (documents.ts /
 * encounters.ts); triggers list the phrasings a student might reasonably use.
 * Weights: safety catches heaviest (the unactioned aortogram, the unmanaged
 * hypertension and the un-revisited label), then the diagnosis and disposition,
 * then supporting findings.
 *
 * All content is fabricated for education and simulation only. Not for clinical use.
 */
export const caseDissection001Rubric: CaseRubric = {
  caseId: "dissection001",
  noteType: "Progress Note",
  task: { code: "ed", label: "ED REVIEW", minGrade: "st3" },
  wordBand: { target: 180, max: 280 },
  sections: [
    ["impression", "assessment", "diagnosis"],
    ["plan"],
  ],
  items: [
    {
      id: "safety-ct-aortogram",
      label: "Actions the recommended CT aortogram",
      category: "safety",
      weight: 15,
      critical: true,
      triggers: [
        [
          [
            "aortogram",
            "ct aortogram",
            "ct aortography",
            "aortography",
            "ct angiogram",
            "cta aorta",
            "ct aorta",
            "dedicated ct aorta",
          ],
        ],
      ],
      explanation:
        "The CT KUB report explicitly recommends a dedicated CT aortogram for the incidentally dilated thoracic aorta, and that recommendation was never actioned — the renal colic label was carried forward instead. In a possible dissection the definitive test is urgent CT aortography; leaving the recommendation unactioned is the central, potentially fatal omission.",
      pdqi: ["accurate", "useful"],
    },
    {
      id: "safety-bp-target",
      label: "Controls the blood pressure / sets an arterial-pressure target",
      category: "safety",
      weight: 12,
      critical: true,
      triggers: [
        [
          ["bp", "blood pressure", "systolic", "hypertension", "hypertensive", "pressure"],
          [
            "control",
            "controlled",
            "lower",
            "lowering",
            "reduce",
            "reduction",
            "target",
            "manage",
            "management",
            "labetalol",
            "esmolol",
            "gtn",
            "beta blocker",
            "beta-blocker",
          ],
        ],
      ],
      explanation:
        "The systolic pressure sat in the 180s–190s throughout (204/110 pre-hospital) and no one set a target or started treatment. In a possible dissection, urgent impulse and blood-pressure control (target systolic ~100–120 mmHg, e.g. IV labetalol) limits propagation. Leaving it untreated is a genuine harm, not a loose end.",
      pdqi: ["accurate", "useful"],
    },
    {
      id: "safety-reconsider-diagnosis",
      label: "Does not accept the handed-down label; recognises the diagnosis was never revisited",
      category: "safety",
      weight: 12,
      critical: true,
      triggers: [
        [
          [
            "anchor",
            "anchored",
            "anchoring",
            "premature closure",
            "handed down",
            "handed-down",
          ],
        ],
        [
          ["diagnosis", "label"],
          [
            "never revisited",
            "not revisited",
            "not reconsidered",
            "unquestioned",
            "not challenged",
            "revisit",
            "reconsider",
            "reconsidered",
          ],
        ],
        [
          ["pain"],
          ["controlled", "settling", "settled", "improved"],
          ["does not exclude", "not exclude", "not reassuring", "reassure", "reassured"],
        ],
      ],
      explanation:
        "Opioid analgesia was titrated up (codeine, then morphine) and 'pain controlled' was treated as reassurance while the renal colic diagnosis was never re-examined — even as the chart accumulated contradicting evidence. Naming this anchoring / premature closure is what stops the next reader from repeating it. Analgesic response does not confirm a benign cause.",
      pdqi: ["synthesized", "internally consistent"],
    },
    {
      id: "assessment-dissection",
      label: "States the working diagnosis: aortic dissection",
      category: "assessment",
      weight: 10,
      triggers: [
        [["dissection"]],
        [["aortic", "aorta"], ["dissection", "rupture", "aneurysm", "emergency"]],
      ],
      explanation:
        "Sudden tearing loin-to-back pain maximal at onset, an inter-arm BP differential, a new aortic-regurgitation murmur and a dilated thoracic aorta on CT is aortic dissection until proven otherwise. Naming it converts a benign 'colic' into a time-critical vascular emergency.",
      pdqi: ["accurate", "synthesized"],
    },
    {
      id: "finding-bp-differential",
      label: "Reports the inter-arm blood-pressure differential",
      category: "findings",
      weight: 9,
      triggers: [
        [
          ["bp", "blood pressure", "pressure"],
          [
            "arm",
            "arms",
            "differential",
            "asymmetry",
            "asymmetric",
            "difference",
            "different",
            "differs",
            "between",
            "inter-arm",
            "interarm",
          ],
        ],
        [["right arm", "left arm"]],
      ],
      explanation:
        "Nursing recorded the pressure in both arms (right 196/104, left 158/92, >30 mmHg difference) and no one acted on it. A significant inter-arm differential is a red flag for dissection; the note must surface it.",
      pdqi: ["thorough", "accurate"],
    },
    {
      id: "finding-tearing-onset",
      label: "Names the tearing pain, maximal at onset",
      category: "findings",
      weight: 8,
      triggers: [
        [["tearing", "ripping", "tore"]],
        [["sudden", "abrupt", "instant", "instantaneous"], ["onset", "maximal", "worst", "immediately"]],
        [["maximal", "worst"], ["onset", "start", "outset", "beginning"]],
      ],
      explanation:
        "The paramedic and triage notes both record a sudden, TEARING pain that was maximal at onset — the classic dissection descriptor. It was quietly softened to 'loin pain' in the clerking, losing its danger. Restoring the character is what re-opens the diagnosis.",
      pdqi: ["thorough", "synthesized"],
    },
    {
      id: "finding-ct-kub",
      label: "Reads the CT KUB correctly (no stone; dilated thoracic aorta)",
      category: "findings",
      weight: 8,
      triggers: [
        [
          ["ct kub", "kub", "ct"],
          ["no calculus", "no stone", "no renal calculus", "no ureteric", "negative", "no obstruction"],
        ],
        [
          ["dilated", "dilatation", "dilation", "prominent", "wide"],
          ["aorta", "thoracic aorta", "aortic"],
        ],
      ],
      explanation:
        "The CT KUB shows NO calculus and no obstruction — it does not support renal colic — and it flags an incidentally dilated thoracic aorta at the edge of the field. Reading the whole report, not just the 'no stone' headline, is the pivot of the case.",
      pdqi: ["accurate", "thorough"],
    },
    {
      id: "plan-referral",
      label: "Refers vascular / cardiothoracic surgery urgently",
      category: "plan",
      weight: 8,
      triggers: [
        [
          ["vascular", "cardiothoracic", "cardiac surgery", "aortic team"],
          ["refer", "referral", "surgeon", "surgery", "team", "discuss", "escalate", "escalation"],
        ],
        [["vascular surgery", "cardiothoracic surgery"]],
      ],
      explanation:
        "A suspected dissection needs immediate discussion with vascular / cardiothoracic surgery in parallel with the aortogram — the disposition is a specialist emergency, not urology outpatients.",
      pdqi: ["useful", "up-to-date"],
    },
    {
      id: "finding-diastolic-murmur",
      label: "Notes the new early diastolic murmur (aortic regurgitation)",
      category: "findings",
      weight: 7,
      triggers: [
        [["diastolic"], ["murmur"]],
        [["murmur"], ["aortic", "regurgitation", "regurgitant", "early diastolic"]],
        [["aortic regurgitation"]],
      ],
      explanation:
        "The clerking exam documents an early diastolic murmur at the left sternal edge — new aortic regurgitation, a recognised complication of a proximal dissection — but the impression ignored it. It is a hard sign that the pain is not renal.",
      pdqi: ["thorough", "accurate"],
    },
    {
      id: "finding-no-haematuria",
      label: "Notes the negative urine dip (no haematuria) argues against a stone",
      category: "findings",
      weight: 6,
      triggers: [
        [["haematuria", "hematuria", "blood"], ["no", "absent", "negative", "without", "nil", "not"]],
        [["urine", "urinalysis", "dipstick", "dip"], ["negative", "no blood", "clear", "normal"]],
      ],
      explanation:
        "The dipstick is negative for blood. Haematuria is present in the large majority of acute ureteric stones, so its absence is a quiet argument against the renal colic label — one more piece of evidence that did not get weighed.",
      pdqi: ["thorough", "accurate"],
    },
    {
      id: "finding-htn-smoking",
      label: "Identifies the risk factors (poorly controlled hypertension, ex-smoker)",
      category: "findings",
      weight: 6,
      triggers: [
        [
          ["hypertension", "hypertensive", "bp", "blood pressure"],
          [
            "poorly controlled",
            "uncontrolled",
            "poor control",
            "longstanding",
            "long-standing",
            "long standing",
            "chronic",
          ],
        ],
        [["smoker", "smoking", "pack year", "pack-year", "ex-smoker", "ex smoker"]],
      ],
      explanation:
        "Long-standing poorly controlled hypertension and a ~40 pack-year ex-smoking history — the classic dissection risk profile — live in the GP letters, not in the ED note. Linking the background to the presentation is part of the synthesis.",
      pdqi: ["thorough", "synthesized"],
    },
    {
      id: "finding-pain-radiation",
      label: "Notes the pain radiating loin-to-back",
      category: "findings",
      weight: 6,
      triggers: [
        [["radiating", "radiates", "radiation", "radiated"], ["back", "interscapular", "scapula", "posteriorly"]],
        [["loin", "flank"], ["back"]],
      ],
      explanation:
        "The pain went from the loin through to the back — an anterior-to-posterior radiation more in keeping with an aortic than a purely renal source. It is documented pre-hospital and at triage.",
      pdqi: ["thorough", "accurate"],
    },
    {
      id: "assessment-reject-renal-colic",
      label: "Concludes the picture is not renal colic",
      category: "assessment",
      weight: 6,
      triggers: [
        [
          ["renal colic", "colic"],
          [
            "not",
            "does not fit",
            "against",
            "reject",
            "unlikely",
            "wrong",
            "unconfirmed",
            "excluded",
            "no evidence",
            "not supported",
          ],
        ],
        [["not renal colic"]],
      ],
      explanation:
        "With no stone on CT, no haematuria and a red-flag pain history, the renal colic label does not hold. Explicitly stating that this is NOT renal colic is what stops the label being re-anchored downstream.",
      pdqi: ["synthesized", "internally consistent"],
    },
    {
      id: "plan-monitoring",
      label: "Monitors and prepares for instability (access, crossmatch, NBM)",
      category: "plan",
      weight: 5,
      triggers: [
        [["monitoring", "monitor", "cardiac monitor", "telemetry", "monitored"]],
        [["group and save", "group & save", "crossmatch", "cross-match", "g&s"]],
        [["large-bore", "large bore", "iv access", "cannula", "cannulae", "wide-bore"]],
      ],
      explanation:
        "A suspected dissection can decompensate suddenly: continuous cardiac monitoring, two large-bore cannulae, bloods with group and save / crossmatch and keeping the patient nil by mouth are the holding measures while imaging and the surgical decision happen.",
      pdqi: ["useful", "thorough"],
    },
  ],
  modelNote: `ED REVIEW — ?Aortic Dissection (day 1)

66M with long-standing poorly controlled hypertension and a ~40 pack-year ex-smoking history, brought in by ambulance with sudden, tearing left flank pain radiating through to the back, maximal at onset. Triaged and clerked as "?renal colic": codeine then morphine given, CT KUB requested.

The chart contradicts that label. The pain was maximal at onset and tearing (paramedic and triage notes). Blood pressure differs markedly between the arms — right 196/104, left 158/92. There is a new early diastolic murmur (aortic regurgitation) at the left sternal edge, documented once. Urine dipstick is negative for blood — no haematuria. CT KUB: no renal calculus and no obstruction, but a dilated thoracic aorta at the edge of the field with a recommendation for a dedicated CT aortogram.

Impression
This is not renal colic. The presentation is an aortic dissection until proven otherwise. The renal colic label was handed down and never revisited even as the opioid was escalated — "pain controlled" on morphine does not exclude the diagnosis.

Plan
1. Urgent CT aortogram now — action the radiologist's recommendation.
2. Urgent blood pressure control: target systolic 100–120 mmHg with IV labetalol; treat pain to reduce sympathetic drive.
3. Refer vascular / cardiothoracic surgery immediately.
4. Continuous cardiac monitoring, two large-bore IV cannulae, bloods with group and save / crossmatch, keep nil by mouth.
5. Serial observations in both arms; escalate immediately on any haemodynamic change.`,
};
