import type { CaseRubric } from "../../../types";

/**
 * Scoring rubric for a day-1 ward-round / progress note on the hypercalcaemia
 * ("off legs") case. Items reference facts that exist in the chart (documents.ts
 * / encounters.ts / bloods.ts); triggers list the phrasings a student might
 * reasonably use. Weights: the safety catches (unactioned calcium, the thiazide
 * / calcium-supplement drug trap, the un-chased myeloma screen) sit heaviest,
 * then the unifying diagnosis, then the supporting findings.
 *
 * All content is fabricated for education and simulation only. Not for clinical use.
 */
export const caseHypercalcaemia001Rubric: CaseRubric = {
  caseId: "hypercalcaemia001",
  noteType: "Progress Note",
  task: { code: "ptwr", label: "POST-TAKE WARD ROUND", minGrade: "st3" },
  wordBand: { target: 160, max: 280 },
  sections: [
    ["impression", "assessment", "diagnosis"],
    ["plan"],
  ],
  items: [
    {
      id: "safety-treat-hypercalcaemia",
      label: "Actively treats the hypercalcaemia (IV fluids to the calcium ± bisphosphonate)",
      category: "safety",
      weight: 14,
      critical: true,
      triggers: [
        [
          ["fluids", "fluid", "saline", "rehydration", "rehydrate", "crystalloid"],
          ["hypercalcaemia", "hypercalcemia", "calcium"],
        ],
        [["bisphosphonate", "pamidronate", "zoledronate", "zoledronic"]],
      ],
      explanation:
        "An adjusted calcium of 3.18 with an AKI is symptomatic hypercalcaemia and needs treating NOW — IV 0.9% saline titrated to the calcium, then a bisphosphonate once rehydrated. On the chart the raised calcium is sitting unactioned: the ward round hadn't reviewed the bloods and the fluids weren't titrated to it. A note that doesn't act on the calcium repeats that omission.",
      pdqi: ["accurate", "useful"],
    },
    {
      id: "safety-hold-thiazide",
      label: "Holds the thiazide (bendroflumethiazide)",
      category: "safety",
      weight: 12,
      critical: true,
      triggers: [
        [
          ["bendroflumethiazide", "thiazide", "bendrofluazide"],
          [
            "hold",
            "held",
            "stop",
            "stopped",
            "withhold",
            "withheld",
            "suspend",
            "suspended",
            "discontinue",
            "discontinued",
          ],
        ],
      ],
      explanation:
        "She is still prescribed bendroflumethiazide. Thiazides reduce urinary calcium excretion and RAISE serum calcium, and are nephrotoxic in an AKI — pharmacy flagged it but nobody held it. Continuing it works directly against the treatment.",
      pdqi: ["accurate", "up-to-date"],
    },
    {
      id: "safety-hold-calcium-supp",
      label: "Stops the calcium / vitamin D supplement (Adcal-D3)",
      category: "safety",
      weight: 12,
      critical: true,
      triggers: [
        [
          ["adcal", "colecalciferol", "cholecalciferol"],
          [
            "hold",
            "held",
            "stop",
            "stopped",
            "withhold",
            "withheld",
            "discontinue",
            "discontinued",
          ],
        ],
        [
          ["calcium supplement", "calcium and vitamin", "calcium carbonate", "vitamin d supplement"],
          ["hold", "held", "stop", "stopped", "withhold", "withheld", "discontinue"],
        ],
      ],
      explanation:
        "She remains on Adcal-D3, a calcium AND vitamin D supplement, despite frank hypercalcaemia. Giving calcium to a hypercalcaemic patient is an obvious harm; it must be stopped.",
      pdqi: ["accurate", "up-to-date"],
    },
    {
      id: "safety-chase-myeloma-screen",
      label: "Chases the pending myeloma screen",
      category: "safety",
      weight: 10,
      critical: true,
      triggers: [
        [
          ["electrophoresis", "light chains", "light chain", "paraprotein"],
          ["chase", "chased", "pending", "awaited", "awaiting", "outstanding", "request", "requested"],
        ],
        [
          ["myeloma screen"],
          ["chase", "chased", "pending", "awaited", "awaiting", "outstanding"],
        ],
      ],
      explanation:
        "The GP requested a serum electrophoresis and free light chains on 23/06 and the result is STILL unreported. It is the test that confirms the likely cause of both the hypercalcaemia and the anaemia; nobody has chased it.",
      pdqi: ["up-to-date", "useful"],
    },
    {
      id: "finding-hypercalcaemia",
      label: "Identifies the raised adjusted calcium",
      category: "findings",
      weight: 10,
      triggers: [
        // Interpretive words required: the PROGRESS template auto-embeds the raw
        // "Adjusted calcium 3.18 ... High" lab line, which must not score alone.
        [["calcium", "hypercalcaemia", "hypercalcemia"], ["raised", "elevated"]],
        [["hypercalcaemia", "hypercalcemia"]],
      ],
      explanation:
        "The adjusted (albumin-corrected) calcium is 3.18 mmol/L on the admission bone profile — the single result that reframes the whole admission, and the one the ward round hadn't yet read.",
      pdqi: ["accurate", "thorough"],
    },
    {
      id: "assessment-hypercalcaemia-dx",
      label: "Makes hypercalcaemia the unifying diagnosis",
      category: "assessment",
      weight: 12,
      triggers: [[["hypercalcaemia", "hypercalcemia"]]],
      explanation:
        "Off legs, confusion, constipation, thirst and polyuria are the classic 'bones, stones, groans and psychic moans' of hypercalcaemia. Naming it as the unifying diagnosis is what dissolves the 'social admission' label.",
      pdqi: ["synthesized", "accurate"],
    },
    {
      id: "assessment-myeloma",
      label: "Raises myeloma / malignancy as the likely cause",
      category: "assessment",
      weight: 8,
      triggers: [[["myeloma"]], [["malignancy", "malignant", "cancer"]]],
      explanation:
        "Hypercalcaemia with a normocytic anaemia, a very high ESR, a wide globulin gap, back pain and weight loss in an 81-year-old points to myeloma. The differential drives the workup (the electrophoresis / light chains).",
      pdqi: ["synthesized", "thorough"],
    },
    {
      id: "assessment-rejects-social",
      label: "Rejects the 'social admission' / UTI label",
      category: "assessment",
      weight: 6,
      triggers: [
        [["not", "reject", "against", "dispute", "incorrect", "more than"], ["social admission", "social"]],
        [["not", "mislabel", "mislabelled", "wrong"], ["acopia"]],
      ],
      explanation:
        "The clerking and the early ward round anchored on a social admission ± UTI. Explicitly rejecting that label is the reasoning step that stops the next reader from re-anchoring and missing the calcium again.",
      pdqi: ["synthesized", "internally consistent"],
    },
    {
      id: "finding-aki",
      label: "Recognizes the acute kidney injury",
      category: "findings",
      weight: 8,
      triggers: [
        [["aki", "acute kidney injury"]],
        // Interpretive words required: the PROGRESS template auto-embeds the raw
        // "Creatinine 158 ... High" / "eGFR 28 ... Low" lab lines, which must
        // not score alone.
        [["creatinine"], ["raised", "elevated"]],
        [["egfr"], ["reduced", "falling", "impaired", "decreased"]],
      ],
      explanation:
        "Creatinine 158 with an eGFR of 28 is an AKI, driven by hypercalcaemia and dehydration (and made worse by the thiazide). It sets the urgency and the fluid plan.",
      pdqi: ["accurate", "thorough"],
    },
    {
      id: "finding-not-uti",
      label: "Reads the urine dip in context (not a UTI)",
      category: "findings",
      weight: 6,
      triggers: [
        [["nitrites", "nitrite"], ["negative"]],
        [["uti"], ["not", "no", "against", "unlikely", "against"]],
        [["mixed growth"]],
        [["dip", "dipstick"], ["red herring", "contaminant", "unreliable", "weak"]],
      ],
      explanation:
        "The weak-positive dip has NEGATIVE nitrites and the culture is mixed growth (a contaminant): this is not a UTI, and trimethoprim was started on it. A dip is a poor test for UTI in the elderly and here it distracted from the calcium.",
      pdqi: ["accurate", "synthesized"],
    },
    {
      id: "finding-anaemia-esr",
      label: "Notes the normocytic anaemia with raised ESR / globulin gap",
      category: "findings",
      weight: 6,
      triggers: [
        [["anaemia", "anemia", "anaemic"]],
        // Interpretive words required: the PROGRESS template auto-embeds the raw
        // "Hb 98 ... Low" / "ESR 92 ... High" / "Total protein 92 ... High" lab
        // lines, which must not score alone.
        [["hb", "haemoglobin", "hemoglobin"], ["reduced", "depressed"]],
        [["esr"], ["raised", "elevated"]],
        [["globulin", "total protein"], ["gap", "raised", "elevated"]],
      ],
      explanation:
        "Hb 98 (normocytic), ESR 92 and a wide globulin gap (total protein 92 vs albumin 30) are the quiet fingerprints of a paraproteinaemia. They were already creeping on the GP bloods two weeks earlier (Hb 105, ESR 70, calcium 2.78).",
      pdqi: ["thorough", "synthesized"],
    },
    {
      id: "finding-symptoms",
      label: "Names the hypercalcaemia symptom cluster",
      category: "findings",
      weight: 6,
      triggers: [
        [["polyuria", "polydipsia", "thirst", "thirsty"]],
        [["bones"], ["stones", "groans", "moans"]],
        [["constipation", "constipated"], ["confusion", "confused", "muddled", "delirium"]],
      ],
      explanation:
        "Polyuria, polydipsia, constipation and confusion are the 'off legs' — the symptoms of hypercalcaemia, not of not-coping. Connecting them to the calcium is the synthesis the clerking missed.",
      pdqi: ["synthesized", "thorough"],
    },
    {
      id: "finding-weight-backpain",
      label: "Picks up the weight loss and back pain",
      category: "findings",
      weight: 5,
      triggers: [
        [["weight"], ["loss", "lost"]],
        [["back"], ["pain"]],
      ],
      explanation:
        "Months of weight loss and back pain (with osteopenia and L2 height loss on the spine film) are the red flags the community workup under-weighted. They live in the GP letters, not the admission bloods.",
      pdqi: ["thorough", "up-to-date"],
    },
    {
      id: "plan-stop-trimethoprim",
      label: "Stops the empirical trimethoprim",
      category: "plan",
      weight: 5,
      triggers: [
        [["trimethoprim", "antibiotic", "antibiotics"], ["stop", "stopped", "hold", "held", "discontinue"]],
      ],
      explanation:
        "Trimethoprim was started on a dip that does not support a UTI; it should be stopped. (It also nudges the creatinine up, muddying the AKI.)",
      pdqi: ["accurate", "useful"],
    },
    {
      id: "plan-monitor-repeat",
      label: "Repeats and monitors the calcium and renal function",
      category: "plan",
      weight: 5,
      triggers: [
        [["repeat", "recheck", "monitor", "trend"], ["calcium", "bone profile", "renal", "bloods"]],
      ],
      explanation:
        "The calcium and renal function must be repeated to confirm the response to fluids and the safety of the plan — the ward round left the bloods 'to check'.",
      pdqi: ["useful", "up-to-date"],
    },
  ],
  modelNote: `POST-TAKE REVIEW — Geriatrics (day 1)

81F brought in "off legs", confused and constipated. This is NOT a social admission, and the positive urine dip is a red herring: nitrites are negative and the culture is mixed growth, so this is not a UTI — stop the trimethoprim.

The unifying problem is HYPERCALCAEMIA: the adjusted calcium is raised at 3.18 with a secondary acute kidney injury (creatinine 158, eGFR 28). The symptoms fit exactly — polyuria, polydipsia, constipation and confusion. There is a normocytic anaemia (Hb 98) with ESR 92 and a wide globulin gap (total protein 92 vs albumin 30). Months of weight loss and back pain, plus a GP calcium already raised at 2.78 two weeks ago, point to an underlying cause.

Impression
Symptomatic hypercalcaemia, most likely of malignancy / MYELOMA, with a secondary AKI — mislabelled on arrival as a social admission ± UTI.

Plan
1. Treat the hypercalcaemia now: IV 0.9% saline titrated to the calcium and urine output; give a bisphosphonate (zoledronic acid) once rehydrated.
2. HOLD bendroflumethiazide (a thiazide raises calcium) and stop Adcal-D3 (a calcium and vitamin D supplement).
3. Chase the pending myeloma screen — serum electrophoresis and free light chains, requested by the GP and still outstanding.
4. Stop trimethoprim; laxatives for constipation.
5. Repeat bone profile and renal function to trend the calcium and confirm the response to fluids.`,
};
