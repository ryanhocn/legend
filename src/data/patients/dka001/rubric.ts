import type { CaseRubric } from "../../../types";

/**
 * Scoring rubric for the ED review / progress note on the DKA case. Items
 * reference facts that exist in the chart (documents.ts / encounters.ts);
 * triggers list the phrasings a student might reasonably use. Weights: the
 * three safety catches heaviest (start the fixed-rate insulin the parked plan
 * never did, replace potassium with it, and refuse to echo the
 * antiemetic-and-discharge label), then diagnosis, then supporting findings.
 *
 * All content is fabricated for education and simulation only. Not for clinical use.
 */
export const caseDka001Rubric: CaseRubric = {
  caseId: "dka001",
  noteType: "Progress Note",
  task: { code: "ed", label: "ED REVIEW", minGrade: "st3" },
  wordBand: { target: 150, max: 250 },
  sections: [
    ["impression", "assessment", "diagnosis"],
    ["plan"],
  ],
  items: [
    {
      id: "safety-fixed-rate-insulin",
      label: "Starts / carries forward the fixed-rate insulin infusion",
      category: "safety",
      weight: 15,
      critical: true,
      triggers: [
        [["fixed rate insulin", "fixed rate intravenous insulin", "friii", "fixed rate infusion"]],
        [["insulin"], ["fixed rate", "infusion", "0.1 units", "6 units"]],
        [["actrapid"]],
      ],
      explanation:
        "The 06:10 VBG met DKA criteria (pH 7.18, ketones 5.8) but the 'gastroenteritis' plan was never revised — fixed-rate insulin (0.1 units/kg/hr) only started after the 08:15 consultant review. A note that does not carry the infusion forward recreates the two-hour gap in which the definitive treatment did not run.",
      pdqi: ["accurate", "useful", "up-to-date"],
    },
    {
      id: "safety-potassium-replacement",
      label: "Replaces and rechecks potassium with the insulin (K+ 3.4)",
      category: "safety",
      weight: 15,
      critical: true,
      triggers: [
        [
          ["potassium", "kcl", "hypokalaemia", "hypokalemia"],
          [
            "replace",
            "replaced",
            "replacement",
            "correct",
            "corrected",
            "add",
            "added",
            "40 mmol",
            "supplement",
            "supplementation",
          ],
        ],
        [["kcl"], ["fluids", "fluid", "bag", "bags", "saline", "infusion"]],
        [["potassium"], ["recheck", "rechecked", "monitor", "monitored", "before insulin", "with the insulin"]],
      ],
      explanation:
        "K+ was 3.4 on the gas with an insulin plan pending. Insulin drives potassium into cells: running a fixed-rate infusion without replacement (40 mmol/L KCl in the fluids) and a 1-hour recheck on cardiac monitoring risks hypokalaemic cardiac arrest — the classic avoidable DKA death.",
      pdqi: ["accurate", "useful"],
    },
    {
      id: "safety-reject-gastroenteritis-label",
      label: "Rejects the gastroenteritis label and cancels the discharge plan",
      category: "safety",
      weight: 12,
      critical: true,
      triggers: [
        [
          [
            "not gastroenteritis",
            "not viral",
            "not a viral",
            "not infective",
            "not gastro",
            "rather than gastroenteritis",
            "against gastroenteritis",
            "against an infective",
            "does not fit",
            "doesnt fit",
          ],
        ],
        [
          ["gastroenteritis", "viral"],
          [
            "mislabel",
            "mislabelled",
            "mislabeled",
            "label",
            "labelled",
            "labeled",
            "relabelled",
            "revised",
            "rejected",
            "unlikely",
            "anchoring",
            "anchored",
            "premature closure",
            "wrong",
          ],
        ],
        [["discharge"], ["cancel", "cancelled", "canceled", "not for", "no longer", "abandoned"]],
      ],
      explanation:
        "The chart contains a 'young, will settle' antiemetic-and-discharge plan and a pre-drafted gastroenteritis discharge summary. Echoing that label sends a patient in ketoacidosis home. The note must name the revision — this is DKA, the vomiting IS the DKA — and explicitly cancel the discharge plan.",
      pdqi: ["accurate", "synthesized", "internally consistent"],
    },
    {
      id: "finding-osmotic-symptoms",
      label: "Surfaces the weeks of polyuria and polydipsia from the triage narrative",
      category: "findings",
      weight: 8,
      triggers: [
        [["polyuria"]],
        [["polydipsia"]],
        [["thirst", "thirsty"]],
        [["osmotic symptoms"]],
      ],
      explanation:
        "The refuting history was in the first document: triage recorded weeks of 'drinking loads', waking 4–5 times a night to pass urine and looser clothes. A 24-hour vomiting story does not explain weeks of osmotic symptoms — reading past the label is the whole case.",
      pdqi: ["thorough", "synthesized"],
    },
    {
      id: "finding-weight-loss",
      label: "Documents the objective weight loss (68.4 kg → 61.5 kg)",
      category: "findings",
      weight: 5,
      triggers: [[["weight"], ["loss", "lost", "losing", "down", "looser", "68", "61"]]],
      explanation:
        "The GP letter of 25/05 records 68.4 kg; he weighs 61.5 kg today — ~7 kg in six weeks. The chart itself proves the weight loss; it lives in the historic letter, not the admission bloods.",
      pdqi: ["thorough", "up-to-date"],
    },
    {
      id: "finding-kussmaul",
      label: "Recognizes the Kussmaul-pattern respirations (± acetone breath)",
      category: "findings",
      weight: 8,
      triggers: [
        [["kussmaul"]],
        [["deep"], ["breathing", "respirations", "breaths", "sighing"]],
        [["sighing"]],
        [["acetone", "pear drops", "nail varnish", "ketotic breath"]],
      ],
      explanation:
        "Nursing documented deep sighing respirations with a pear-drops smell at 05:35 — Kussmaul breathing compensating for metabolic acidosis, with acetone on the breath. RR 24–28 with clear lungs and SpO2 99% is acidosis, not anxiety and not a chest problem.",
      pdqi: ["thorough", "accurate", "synthesized"],
    },
    {
      id: "finding-acidosis-on-gas",
      label: "Reads the gas: metabolic acidosis with ketonaemia",
      category: "findings",
      weight: 8,
      triggers: [
        [["metabolic acidosis"]],
        [["ph"], ["7.18"]],
        // Interpretive words required: the PROGRESS template auto-embeds the raw
        // "Ketones (BOHB) 5.8 ... High" / "Bicarbonate 11 ... Low" lab lines,
        // which must not score alone.
        [["ketones"], ["raised", "elevated"]],
        [["bicarbonate", "bicarb", "hco3"], ["reduced", "depressed", "consumed"]],
        [["anion gap"]],
      ],
      explanation:
        "pH 7.18, bicarbonate 11 with a low pCO2 (compensation), glucose 27.3 and ketones 5.8: a raised-anion-gap metabolic acidosis with ketonaemia. The gas resulted at 06:10 and diagnosed the case on its own — it needed reading, not repeating.",
      pdqi: ["accurate", "thorough"],
    },
    {
      id: "finding-persistent-tachycardia",
      label: "Notes the persistent tachycardia / volume depletion despite fluids",
      category: "findings",
      weight: 5,
      triggers: [
        [["tachycardia", "tachycardic"]],
        // Interpretive words required: the PROGRESS template auto-embeds the raw
        // vitals line HR value, which must not score alone.
        [["hr"], ["persistent", "persistently", "ongoing", "unresolved", "despite", "refractory"]],
        [["dehydration", "dehydrated", "hypovolaemia", "hypovolaemic", "hypovolemia", "hypovolemic", "volume deplete", "volume depleted"]],
      ],
      explanation:
        "HR 118 at triage, 124 by 08:15 — three hours of 'oral fluids trial' changed nothing, because the litres being lost were osmotic. A gastroenteritis that fails its own treatment plan should have prompted a rethink.",
      pdqi: ["thorough", "internally consistent"],
    },
    {
      id: "finding-infection-screen-context",
      label: "Reads the infection screen in context (afebrile, CRP 4)",
      category: "findings",
      weight: 5,
      triggers: [
        // Interpretive words required: the PROGRESS template auto-embeds the raw
        // "CRP 4" line and several other "Low"-flagged lab rows, which must not
        // score alone.
        [["crp"], ["normal", "not raised", "unremarkable"]],
        [["afebrile", "apyrexial", "no fever"]],
        [["wcc", "white cell", "white cells", "leucocytosis", "leukocytosis"], ["dka", "ketoacidosis", "stress", "demargination", "without infection", "not infection"]],
      ],
      explanation:
        "He was afebrile throughout with CRP 4 — nothing supports an infective gastroenteritis. The WCC of 14.2 is the demargination leucocytosis of DKA itself, and the mildly raised amylase is common in DKA; neither should be spent propping up the wrong label.",
      pdqi: ["accurate", "synthesized"],
    },
    {
      id: "assessment-dka",
      label: "States the diagnosis: diabetic ketoacidosis",
      category: "assessment",
      weight: 10,
      triggers: [[["dka", "diabetic ketoacidosis", "ketoacidosis"]]],
      explanation:
        "Hyperglycaemia (glucose 27.3) + ketonaemia (5.8) + acidosis (pH 7.18, bicarbonate 11) is DKA by definition. The vomiting and abdominal pain are caused by the ketoacidosis — they are the presentation, not a competing diagnosis.",
      pdqi: ["accurate", "synthesized"],
    },
    {
      id: "assessment-new-t1dm",
      label: "Names the new type 1 diabetes (HbA1c 118 — weeks, not stress)",
      category: "assessment",
      weight: 8,
      triggers: [
        [["type 1", "t1dm", "type one"]],
        [["new"], ["diabetes", "diabetic"]],
        // Interpretive words required: the PROGRESS template auto-embeds the raw
        // "HbA1c 118 ... High" lab line, which must not score alone.
        [["hba1c"], ["raised", "elevated"]],
      ],
      explanation:
        "HbA1c 118 mmol/mol proves weeks-to-months of hyperglycaemia: this is a first presentation of type 1 diabetes, not stress hyperglycaemia from vomiting. Naming it drives the rest of the admission — basal insulin, education, specialist follow-up.",
      pdqi: ["accurate", "synthesized", "up-to-date"],
    },
    {
      id: "plan-fluid-resuscitation",
      label: "Continues IV crystalloid resuscitation with fluid balance",
      category: "plan",
      weight: 6,
      triggers: [
        [["0.9", "saline", "sodium chloride", "crystalloid", "iv fluids", "intravenous fluids", "fluid resuscitation", "fluid balance"]],
      ],
      explanation:
        "He is litres depleted from osmotic diuresis and vomiting: 0.9% sodium chloride per the DKA pathway, with a strict fluid balance chart. Oral fluids were never going to close this deficit — that was the failed experiment of the first three hours.",
      pdqi: ["useful", "up-to-date"],
    },
    {
      id: "plan-monitoring-glucose-ketones",
      label: "Sets DKA monitoring: hourly CBG/ketones, repeat gas, glucose 10% when CBG <14",
      category: "plan",
      weight: 6,
      triggers: [
        [["hourly"], ["glucose", "cbg", "ketones", "blood sugar"]],
        [["glucose 10", "10% glucose", "dextrose"], ["14", "cbg"]],
        [["repeat", "2 hourly", "two hourly"], ["vbg", "gas", "blood gas"]],
      ],
      explanation:
        "Fixed-rate insulin without a monitoring scaffold is its own hazard: hourly CBG and capillary ketones, VBG at 2 hours to prove the acidosis is clearing, and 10% glucose added once CBG falls below 14 so the insulin (which treats the ketones, not just the sugar) keeps running.",
      pdqi: ["useful", "thorough"],
    },
    {
      id: "plan-diabetes-team",
      label: "Refers to the diabetes team: basal insulin, education, follow-up",
      category: "plan",
      weight: 6,
      triggers: [
        [["diabetes team", "diabetes specialist", "dsn", "endocrinology", "endocrine team", "diabetic team"]],
        [["basal", "glargine", "lantus", "long acting insulin"]],
        [["education", "sick day rules"]],
      ],
      explanation:
        "A new type 1 diagnosis needs the diabetes team today, not at discharge: basal glargine started alongside the infusion, DSN education (injections, CBG, sick-day rules, never stopping basal insulin), antibodies/C-peptide, and young-adult clinic follow-up.",
      pdqi: ["useful", "thorough"],
    },
    {
      id: "plan-vte",
      label: "Addresses VTE prophylaxis (dehydrated, hyperosmolar)",
      category: "plan",
      weight: 5,
      triggers: [
        // Interpretive words required: the PROGRESS template's "DVT prophylaxis:"
        // footer must not satisfy this by itself.
        [
          ["vte", "thromboprophylaxis", "prophylaxis", "dalteparin", "enoxaparin", "tinzaparin"],
          ["reviewed", "review", "assessed"],
        ],
      ],
      explanation:
        "DKA is a prothrombotic state — dehydration and hyperosmolality raise VTE risk even in a 19-year-old. The assessment is outstanding on the chart and belongs in the plan.",
      pdqi: ["thorough", "useful"],
    },
  ],
  modelNote: `ED REVIEW — Emergency Medicine (post board round)

19M, 24 h vomiting and abdominal pain, labelled ?viral gastroenteritis at triage (flatmates unwell, recent takeaway). The label does not fit: the triage narrative records weeks of thirst (polydipsia) and polyuria with weight loss (68.4 kg at GP 25/05 — 61.5 kg today), nursing documented deep sighing (Kussmaul) respirations with acetone on the breath, and he stayed tachycardic (HR 118–124) despite three hours of oral fluids. Afebrile with CRP 4 — against infection; WCC 14.2 reflects DKA itself.

VBG (resulted 06:10, not actioned until the 08:15 consultant review): pH 7.18, bicarbonate 11, glucose 27.3, ketones 5.8 — metabolic acidosis with ketonaemia. HbA1c 118 confirms weeks of hyperglycaemia, not stress.

Impression
Diabetic ketoacidosis — new presentation of type 1 diabetes. Not gastroenteritis; discharge plan cancelled.

Plan
1. Fixed-rate insulin infusion 0.1 units/kg/hr (6 units/hr), running since 08:50.
2. K+ 3.4 — potassium replacement with the insulin: 40 mmol/L KCl in each bag, recheck at 1 h on continuous ECG (insulin shifts potassium intracellularly — arrest risk).
3. IV 0.9% sodium chloride per DKA pathway; strict fluid balance.
4. Hourly CBG and ketones; repeat VBG at 2 h; add glucose 10% when CBG <14.
5. Refer diabetes team / DSN today — basal glargine started, new-T1DM education and sick-day rules.
6. VTE prophylaxis once reviewed; admit to AMU.`,
};
