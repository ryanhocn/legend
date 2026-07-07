import type { CaseRubric } from "../../../types";

/**
 * Scoring rubric for the post-take review of a recurrent-aspiration /
 * ceiling-of-care case (Pemberton, Arthur, 89M). This is a consultant-level
 * judgment case: a competent pneumonia plan is not enough — the marks are for
 * recognising the trajectory and owning the ceiling-of-care, resuscitation,
 * best-interests and feeding decisions the chart keeps deferring.
 *
 * Trigger hygiene: the PROGRESS SmartText pastes the vitals line and every
 * bloods row (values, ranges and flags "High"/"Low"/"High (mild)") plus the
 * header "CARE OF THE ELDERLY ... FRAILTY ..." into the note. No trigger below
 * is satisfiable by that text alone — "ceiling of care" is a full phrase (the
 * template only has "care of the elderly"), "frailty" is always gated on an
 * interpretive token, and no test name is ever paired with a bare value or
 * flag word.
 *
 * All content is fabricated for education and simulation only. Not for clinical use.
 */
export const caseAspiration001Rubric: CaseRubric = {
  caseId: "aspiration001",
  noteType: "Post-Take Ward Round",
  task: { code: "ptwr", label: "POST-TAKE WARD ROUND", minGrade: "consultant" },
  wordBand: { target: 180, max: 320 },
  sections: [
    ["impression", "assessment", "diagnosis"],
    ["plan"],
  ],
  items: [
    {
      id: "safety-ceiling-of-care",
      label: "Establishes a proportionate ceiling of care",
      category: "safety",
      weight: 14,
      critical: true,
      triggers: [
        [["ceiling of care", "ceiling"]],
        [["treatment escalation", "escalation plan", "respect form", "respect"]],
        [
          ["escalation"],
          [
            "limit",
            "limited",
            "limits",
            "not for",
            "appropriate",
            "proportionate",
            "decision on",
          ],
        ],
      ],
      explanation:
        "Two prior discharge summaries asked for a ceiling of care and neither was actioned; on the third aspiration in four months, deciding the ceiling (ward-based treatment vs ICU, and what is proportionate) is the central task of this review. Without it he is escalated by default down a path his SALT letter and his family both question.",
      pdqi: ["useful", "synthesized", "up-to-date"],
    },
    {
      id: "safety-dnacpr",
      label: "Makes a resuscitation (DNACPR) decision",
      category: "safety",
      weight: 12,
      critical: true,
      triggers: [
        [
          [
            "dnacpr",
            "dnar",
            "dnr",
            "not for cpr",
            "not for resuscitation",
            "resuscitation status",
            "cpr decision",
          ],
        ],
        [["resuscitation"], ["decision", "status", "not for", "discuss", "form"]],
      ],
      explanation:
        "There is no DNACPR anywhere on file, so CPR would be attempted on an 89-year-old, cachectic, bed-bound man with end-stage dementia — a resuscitation that cannot restore him to a meaningful state. A resuscitation decision belongs in this note, made with the family, not left to a crash call.",
      pdqi: ["useful", "accurate"],
    },
    {
      id: "safety-best-interests",
      label: "Holds a best-interests / advance care planning discussion with the family",
      category: "safety",
      weight: 12,
      critical: true,
      triggers: [
        [["best interest", "best interests"]],
        [
          ["advance care", "acp", "advance care planning", "anticipatory"],
          ["plan", "planning", "discussion", "decision"],
        ],
        [
          ["family", "daughter", "next of kin", "nok", "relatives"],
          [
            "discussion",
            "meeting",
            "conversation",
            "involve",
            "involved",
            "call",
            "update",
            "best interest",
          ],
        ],
      ],
      explanation:
        "He lacks capacity, so decisions are made in his best interests, and his daughter (a nurse and next of kin) has already asked the question in ED. A documented family meeting and advance care plan is not optional courtesy — it is the lawful and humane basis for every decision that follows.",
      pdqi: ["useful", "thorough"],
    },
    {
      id: "safety-feeding-decision",
      label: "Makes a SALT-guided feeding decision — not a feeding tube",
      category: "safety",
      weight: 12,
      critical: true,
      triggers: [
        [
          [
            "tube feeding",
            "ng feeding",
            "peg",
            "nasogastric",
            "enteral feeding",
            "feeding tube",
          ],
          [
            "not",
            "avoid",
            "against",
            "inappropriate",
            "decline",
            "evidence",
            "risk",
            "harm",
            "no benefit",
          ],
        ],
        [["risk feeding", "risk-feeding", "comfort feeding", "feeding at risk", "feed at risk"]],
      ],
      explanation:
        "The clerking plans to 'consider NG feeding' — exactly what the 12/06 SALT letter advises against, because tube feeding in advanced dementia does not prevent aspiration or prolong life and adds its own harms. The note must reject the tube and follow SALT toward risk-feeding for comfort; defaulting to a feeding tube is an active harm here.",
      pdqi: ["accurate", "up-to-date", "useful"],
    },
    {
      id: "assessment-trajectory",
      label: "Recognises the end-stage trajectory, not an isolated infection",
      category: "assessment",
      weight: 10,
      triggers: [
        [
          ["recurrent", "third", "3rd", "repeated", "recurring"],
          ["aspiration", "pneumonia", "admission", "episode"],
        ],
        [
          ["end stage", "end-stage", "terminal", "progressive", "dying", "final"],
          ["dysphagia", "dementia", "decline", "trajectory", "illness"],
        ],
      ],
      explanation:
        "Three aspirations in four months, a falling weight and end-stage dysphagia are one progressive illness reaching its terminal phase — not three separate treatable chest infections. Naming the trajectory is what reframes the whole admission from 'cure the pneumonia' to 'what is proportionate now'.",
      pdqi: ["synthesized", "accurate"],
    },
    {
      id: "assessment-aspiration-pneumonia",
      label: "Diagnoses the aspiration pneumonia",
      category: "assessment",
      weight: 8,
      triggers: [
        [
          ["aspiration"],
          ["pneumonia", "pneumonitis", "chest infection", "lrti", "consolidation"],
        ],
      ],
      explanation:
        "The acute problem is real and must still be named: aspiration pneumonia with septic physiology (NEWS2 5) and right basal consolidation on CXR. The point is to treat it proportionately, not to pretend it is not there.",
      pdqi: ["accurate", "thorough"],
    },
    {
      id: "finding-salt-dysphagia",
      label: "Uses the SALT end-stage dysphagia review",
      category: "findings",
      weight: 7,
      triggers: [
        [["salt", "slt", "speech and language", "speech language"]],
        [
          ["dysphagia", "swallow"],
          ["end stage", "end-stage", "severe", "unsafe", "silent aspiration"],
        ],
      ],
      explanation:
        "The 12/06 SALT letter is the pivotal document: end-stage oropharyngeal dysphagia, no safe oral consistency, silent aspiration likely, tube feeding not recommended, risk-feeding advised. It answers the feeding question before the ward even asks it — and it is sitting unread in the chart.",
      pdqi: ["up-to-date", "thorough"],
    },
    {
      id: "finding-frailty-dementia",
      label: "Frames the advanced dementia / severe frailty",
      category: "findings",
      weight: 6,
      triggers: [
        [["cfs", "clinical frailty"], ["8", "eight", "severe", "advanced"]],
        [["advanced", "end stage", "end-stage", "severe"], ["dementia"]],
        [["frailty"], ["advanced", "severe", "eight", "frail"]],
      ],
      explanation:
        "Clinical Frailty Scale 8, advanced Alzheimer's, bed-bound and no longer recognising family — the baseline that makes aggressive intervention disproportionate. Every downstream decision hangs on stating it plainly.",
      pdqi: ["accurate", "thorough"],
    },
    {
      id: "finding-malnutrition",
      label: "Notes the progressive weight loss / malnutrition",
      category: "findings",
      weight: 6,
      triggers: [
        [
          [
            "weight loss",
            "losing weight",
            "weight is falling",
            "cachexia",
            "cachectic",
            "malnutrition",
            "malnourished",
            "undernourished",
            "must score",
          ],
        ],
      ],
      explanation:
        "Weight 55.9 to 51.0 kg, BMI 17.8, albumin 24, refusing intake — the biochemical and anthropometric signature of the terminal decline, and the reason a feeding tube feels tempting and is nonetheless wrong.",
      pdqi: ["thorough", "accurate"],
    },
    {
      id: "finding-hypernatraemia",
      label: "Identifies the hypernatraemic dehydration",
      category: "findings",
      weight: 5,
      triggers: [
        [["hypernatraemia", "hypernatremia", "hypernatraemic", "hypernatremic"]],
        [["dehydration", "dehydrated", "volume deplete", "volume depletion"]],
      ],
      explanation:
        "Sodium 149 with a raised urea reflects free-water depletion from weeks of poor intake — part of the same failure to eat and drink, correctable but only gently.",
      pdqi: ["accurate", "internally consistent"],
    },
    {
      id: "finding-aki",
      label: "Identifies the acute kidney injury",
      category: "findings",
      weight: 5,
      triggers: [
        [["aki", "acute kidney injury"]],
        [
          ["creatinine", "renal", "kidney"],
          ["rising", "worsening", "baseline", "impaired", "impairment", "injury"],
        ],
      ],
      explanation:
        "Creatinine 118 against a baseline of ~85 with eGFR 48 is a dehydration AKI — relevant both to fluid management and to any decision about the burden of ongoing investigation.",
      pdqi: ["accurate", "thorough"],
    },
    {
      id: "plan-antibiotics",
      label: "Continues proportionate antibiotics for the pneumonia",
      category: "plan",
      weight: 5,
      triggers: [
        [
          ["co-amoxiclav", "coamoxiclav", "amoxicillin", "antibiotic", "antibiotics", "metronidazole"],
          ["aspiration", "pneumonia", "continue", "iv", "cover", "proportionate"],
        ],
      ],
      explanation:
        "Treating the pneumonia and treating him gently are not in conflict: continue the IV co-amoxiclav as a proportionate, ward-level intervention within the agreed ceiling.",
      pdqi: ["useful", "up-to-date"],
    },
    {
      id: "plan-cautious-fluids",
      label: "Rehydrates cautiously for the hypernatraemia / AKI",
      category: "plan",
      weight: 5,
      triggers: [
        [
          ["fluid", "fluids", "rehydration", "rehydrate", "crystalloid"],
          ["cautious", "slow", "gradual", "careful", "correct", "hypernatr", "aki"],
        ],
      ],
      explanation:
        "Hypernatraemia must be corrected slowly to avoid cerebral oedema; cautious rehydration is the right amount of intervention for the AKI without over-medicalising a dying man.",
      pdqi: ["accurate", "useful"],
    },
    {
      id: "plan-comfort",
      label: "Adds a comfort-focused / anticipatory-prescribing plan",
      category: "plan",
      weight: 6,
      triggers: [
        [
          [
            "palliative",
            "palliation",
            "comfort care",
            "comfort-focused",
            "comfort focused",
            "end of life",
            "end-of-life",
            "symptom control",
          ],
        ],
        [["anticipatory"], ["medication", "medications", "meds", "prescribing", "prescription"]],
      ],
      explanation:
        "Whatever the ceiling, comfort must be planned for, not improvised: anticipatory medications for breathlessness, secretions and distress, oral care, and a comfort-first stance if he deteriorates despite antibiotics.",
      pdqi: ["useful", "thorough"],
    },
    {
      id: "plan-senior-ownership",
      label: "Takes senior ownership / leads the conversation today",
      category: "plan",
      weight: 5,
      triggers: [
        [
          ["consultant", "senior"],
          [
            "review",
            "discuss",
            "decision",
            "involve",
            "meeting",
            "lead",
            "escalate",
            "responsible",
          ],
        ],
      ],
      explanation:
        "These decisions are consultant-level and cannot be deferred to 'the afternoon round' for a fourth time; the note should show a named senior taking ownership of the ceiling and the family conversation today.",
      pdqi: ["useful", "synthesized"],
    },
  ],
  modelNote: `POST-TAKE WARD ROUND — Care of the Elderly

89M, advanced Alzheimer's dementia, Clinical Frailty Scale 8, bed-bound, admitted overnight with his THIRD aspiration pneumonia in four months (septic overnight: T 38.6, RR 28, SpO2 89% on air, NEWS2 5; WCC 14.2, CRP 168, right basal consolidation on CXR). He also has hypernatraemic dehydration with an AKI (sodium 149, creatinine 118, eGFR 48) and progressive malnutrition — cachectic, albumin 24, weight 55.9 to 51.0 kg with worsening refusal of intake.

The trajectory, not the pneumonia, is the issue. The SALT review of 12/06 documents end-stage oropharyngeal dysphagia with no safe oral consistency and silent aspiration; two prior discharge summaries recommended considering a ceiling of care, and none was actioned. There is no DNACPR or ReSPECT on file, so he is full escalation by default, and his daughter Julie (RGN, next of kin) has already asked whether that is right.

Impression
Recurrent aspiration pneumonia on a background of end-stage dementia and dysphagia — the terminal phase of a progressive illness, not an isolated, curable infection.

Plan
1. Establish a proportionate ceiling of care today (ward-based treatment, not appropriate for ICU) and complete a DNACPR / ReSPECT resuscitation decision.
2. Best-interests discussion and family meeting with the daughter this morning; document the advance care plan.
3. Feeding: follow SALT — not for NG/PEG tube feeding (no benefit in advanced dementia); risk-feeding for comfort.
4. Continue IV co-amoxiclav for the aspiration pneumonia; cautious rehydration for the hypernatraemia and AKI.
5. Palliative, comfort-focused care with anticipatory medications; consultant to review and lead the family conversation today.`,
};
