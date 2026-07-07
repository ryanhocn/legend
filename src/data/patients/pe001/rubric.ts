import type { CaseRubric } from "../../../types";

/**
 * Scoring rubric for a day-2 ward-round / progress note on the pulmonary
 * embolism case. Items reference facts that exist in the chart (documents.ts /
 * encounters.ts); triggers list the phrasings a student might reasonably use.
 * Weights: safety catches heaviest (the unactioned D-dimer / unvetted CTPA,
 * the missing anticoagulation, the reflexive 88–92% oxygen target), then the
 * de-anchoring diagnosis, then supporting findings.
 *
 * All content is fabricated for education and simulation only. Not for clinical use.
 */
export const casePe001Rubric: CaseRubric = {
  caseId: "pe001",
  noteType: "Progress Note",
  task: { code: "ward", label: "WARD ROUND REVIEW", minGrade: "fy" },
  wordBand: { target: 170, max: 270 },
  sections: [
    ["impression", "assessment", "diagnosis"],
    ["plan"],
  ],
  items: [
    {
      id: "safety-chase-ctpa",
      label: "Acts on the unactioned D-dimer / chases the unvetted CTPA",
      category: "safety",
      weight: 15,
      critical: true,
      triggers: [
        [
          ["ctpa", "ct pulmonary angiogram", "ct pulmonary angiography"],
          [
            "chase",
            "chased",
            "expedite",
            "expedited",
            "vetted",
            "vetting",
            "vet",
            "awaiting",
            "pending",
            "today",
            "urgent",
            "urgently",
            "requested",
            "perform",
          ],
        ],
        [
          ["d dimer", "ddimer"],
          // No raw value/flag words here: the PROGRESS template auto-embeds
          // "D-dimer 4.2 ... High", which must not satisfy a safety item alone.
          [
            "raised",
            "elevated",
            "positive",
            "markedly",
            "never actioned",
            "not actioned",
            "unactioned",
            "not reviewed",
            "missed",
          ],
        ],
      ],
      explanation:
        "The ED breathlessness panel included a D-dimer that reported at 4.2 mg/L FEU after transfer and was never commented on, and the night SHO's CTPA request is still sitting unvetted while the board round wrote 'continue current'. A note that does not chase the pending imaging or act on the result lets the diagnosis die in the queue.",
      pdqi: ["up-to-date", "useful"],
    },
    {
      id: "safety-anticoagulation",
      label: "Addresses anticoagulation — none prescribed despite the risk",
      category: "safety",
      weight: 15,
      critical: true,
      triggers: [
        [
          [
            "anticoagulation",
            "anticoagulant",
            "anticoagulate",
            "dalteparin",
            "enoxaparin",
            "tinzaparin",
            "lmwh",
            "low molecular weight heparin",
            "apixaban",
            "rivaroxaban",
          ],
          [
            "start",
            "started",
            "starting",
            "commence",
            "commenced",
            "give",
            "given",
            "treatment",
            "therapeutic",
            "dose",
            "prophylaxis",
            "prescribe",
            "prescribed",
            "not prescribed",
            "restart",
            "decision",
          ],
        ],
      ],
      explanation:
        "No pharmacological VTE prophylaxis has been prescribed since admission (the clerking left 'VTE assessment: to complete'), and pharmacy documented that his post-TKR rivaroxaban was stopped on day 5 and never restarted. With PE the leading diagnosis, the note must make an explicit anticoagulation decision — treatment-dose pending imaging, or a documented reason not to.",
      pdqi: ["accurate", "useful"],
    },
    {
      id: "safety-oxygen-target",
      label: "Corrects the reflexive 88–92% oxygen target (type 1, not a retainer)",
      category: "safety",
      weight: 10,
      critical: true,
      triggers: [
        [["94 98"]],
        [["type 1", "type one", "type i"], ["respiratory failure"]],
        [["hypocapnia", "hypocapnic", "low pco2", "pco2 low", "pco2 3 9"]],
      ],
      explanation:
        "The 88–92% target was written on pattern ('COPD') — but the ABG shows type 1 respiratory failure with a LOW pCO2 (3.9): he is not retaining CO2, and hypocapnia with hypoxia is itself a PE signature. Leaving the restricted target under-oxygenates him for no physiological reason; titrate to 94–98% and repeat the gas.",
      pdqi: ["accurate", "internally consistent"],
    },
    {
      id: "finding-infection-absent",
      label: "Documents the absent infection picture (chest clear, apyrexial, CRP 18)",
      category: "findings",
      weight: 8,
      triggers: [
        [["chest"], ["clear", "quiet"]],
        [["no wheeze", "wheeze free", "without wheeze"]],
        [["apyrexial", "afebrile", "no fever"]],
        [["crp"], ["only", "mildly elevated", "mildly raised", "modest", "reassuring"]],
        [["sputum"], ["no purulent", "not purulent", "no", "dry"]],
      ],
      explanation:
        "Three examiners (ED, clerking, night SHO) found the chest clear with no wheeze; he is apyrexial, has produced no purulent sputum, the WCC is normal and the CRP is only 18. The infective label rests on the background diagnosis, not on any finding in this chart.",
      pdqi: ["thorough", "accurate"],
    },
    {
      id: "finding-hypoxia-disproportionate",
      label: "Names the hypoxia as disproportionate to the clear CXR",
      category: "findings",
      weight: 8,
      triggers: [
        [
          ["hypoxia", "hypoxic", "hypoxaemia", "sats", "spo2", "desaturation"],
          [
            "out of proportion",
            "disproportionate",
            "out of keeping",
            "unexplained",
            "not explained",
          ],
        ],
        [
          ["cxr", "chest x ray", "chest xray", "radiograph"],
          ["clear", "no consolidation", "hyperinflated", "hyperinflation"],
        ],
        [
          ["desaturates", "desaturated", "desaturating", "desaturation"],
          ["exertion", "mobilising", "mobilizing", "walking", "84"],
        ],
      ],
      explanation:
        "SpO2 86% on air with a clear, hyperinflated CXR — and the radiologist said so: 'the degree of hypoxia is not explained by this radiograph'. Physio then documented desaturation to 84% on 10 metres. Unexplained hypoxia with a clear film is PE until proven otherwise.",
      pdqi: ["thorough", "synthesized"],
    },
    {
      id: "finding-tachycardia",
      label: "Tracks the persistent sinus tachycardia",
      category: "findings",
      weight: 6,
      triggers: [
        [
          ["tachycardia", "tachycardic"],
          ["persistent", "sinus", "ongoing", "despite", "remains", "unresolved"],
        ],
        [["hr"], ["105", "108", "110", "112", "never below 100"], ["persistent", "persistently", "ongoing", "still", "remains", "remained", "despite", "unresolved", "sinus"]],
      ],
      explanation:
        "HR has run 105–115 since triage and never settled with treatment. Persistent unexplained sinus tachycardia is the most consistent vital-sign clue in the chart (and the hs-troponin of 48 hints at right-heart strain).",
      pdqi: ["thorough", "up-to-date"],
    },
    {
      id: "finding-poor-response",
      label: "Notes the poor response to nebulisers, steroids and antibiotics",
      category: "findings",
      weight: 6,
      triggers: [
        [
          ["response", "responded", "responding", "improvement", "improving", "improved"],
          ["little", "poor", "no", "not", "minimal", "without"],
        ],
        [
          ["despite"],
          ["nebulisers", "nebulizers", "nebs", "salbutamol", "steroids", "prednisolone", "antibiotics", "doxycycline"],
        ],
      ],
      explanation:
        "Nursing charted nebulisers given 'with little apparent benefit'; obs are unchanged at 24 hours of prednisolone and doxycycline. His genuine exacerbation in 11/2025 responded briskly — this one is not behaving like that, and treatment failure should force a rethink.",
      pdqi: ["up-to-date", "internally consistent"],
    },
    {
      id: "finding-leg-swelling",
      label: "Flags the asymmetric right calf swelling (?DVT)",
      category: "findings",
      weight: 6,
      triggers: [
        [["calf", "leg"], ["swollen", "swelling", "oedema", "edema", "asymmetric"]],
        // Context required: the PROGRESS template's "DVT prophylaxis:" footer
        // must not satisfy this item by itself.
        [["dvt", "deep vein thrombosis"], ["calf", "leg", "swelling", "swollen", "asymmetric", "possible", "query", "suspect", "suspected"]],
      ],
      explanation:
        "Nursing, physio and the outpatient letters all mention the right lower leg being more swollen than the left — each time attributed to the recent knee surgery. Read together with the rest of the chart, it is a possible DVT feeding the PE, not just post-operative change.",
      pdqi: ["thorough", "synthesized"],
    },
    {
      id: "finding-vte-risk",
      label: "Surfaces the buried VTE risk factor (TKR + stopped rivaroxaban)",
      category: "findings",
      weight: 8,
      triggers: [
        [["arthroplasty", "knee replacement", "tkr", "knee surgery", "knee op"]],
        [
          ["rivaroxaban"],
          [
            "stopped",
            "stop",
            "early",
            "day 5",
            "discontinued",
            "never restarted",
            "not restarted",
            "incomplete",
            "5 days",
          ],
        ],
      ],
      explanation:
        "The risk factor lives in old encounters, not the admission: right TKR on 15/06/2026, prophylactic rivaroxaban stopped on day 5 after a nosebleed (GP telephone note 24/06, confirmed by pharmacy), and near-immobility since. He told the clerking team he had 'finished' the course — the chart says otherwise.",
      pdqi: ["thorough", "synthesized"],
    },
    {
      id: "assessment-pe",
      label: "Names pulmonary embolism as the leading diagnosis",
      category: "assessment",
      weight: 10,
      triggers: [[["pulmonary embolism", "pulmonary embolus", "pulmonary emboli", "pe"]]],
      explanation:
        "Unexplained hypoxia + clear CXR + persistent tachycardia + hypocapnia + recent major lower-limb surgery with interrupted prophylaxis: the synthesis is pulmonary embolism, and the note must say so rather than perpetuate the IECOPD label.",
      pdqi: ["accurate", "synthesized"],
    },
    {
      id: "assessment-deanchor",
      label: "Explicitly challenges the IECOPD label",
      category: "assessment",
      weight: 6,
      triggers: [
        [
          ["iecopd", "infective exacerbation", "exacerbation of copd"],
          [
            "unlikely",
            "not fit",
            "does not fit",
            "doesnt fit",
            "against",
            "doubt",
            "reconsider",
            "question",
            "poorly supported",
            "not convincing",
            "no evidence",
          ],
        ],
      ],
      explanation:
        "Triage, ED and the day-2 board round all pattern-matched 'COPD + breathless = IECOPD'. Writing down WHY the label fails (clear chest, no fever, CRP 18, no response) is what stops the next reader re-anchoring — the consultant's own post-take note invited exactly this rethink.",
      pdqi: ["synthesized", "internally consistent"],
    },
    {
      id: "assessment-wells",
      label: "Documents structured risk stratification (Wells score)",
      category: "assessment",
      weight: 5,
      triggers: [
        [["wells"]],
        [["two level"], ["score"]],
        [["geneva"]],
      ],
      explanation:
        "Nobody in the chart has documented a Wells score. Scoring him makes the pre-test probability explicit — DVT signs (3) + PE most likely (3) + HR >100 (1.5) + surgery within 4 weeks (1.5) = 9, high probability — and justifies imaging and empirical treatment.",
      pdqi: ["thorough", "comprehensible"],
    },
    {
      id: "plan-senior-escalation",
      label: "Escalates: discusses with the consultant / radiology today",
      category: "plan",
      weight: 5,
      triggers: [
        [
          ["discuss", "discussed", "escalate", "escalated", "inform", "informed", "speak"],
          ["consultant", "senior", "registrar", "attending", "radiology", "radiologist"],
        ],
      ],
      explanation:
        "A diagnosis change plus an anticoagulation decision in a post-operative patient is consultant-level business, and the CTPA only moves if someone speaks to radiology. The night SHO explicitly handed this to the day team.",
      pdqi: ["useful", "up-to-date"],
    },
    {
      id: "plan-monitoring",
      label: "Plans monitoring: repeat ABG, close observations, escalation criteria",
      category: "plan",
      weight: 4,
      triggers: [
        [["repeat"], ["abg", "gas", "gases", "bloods", "observations"]],
        [["hourly", "close"], ["obs", "observations", "news2", "news", "monitoring"]],
        [["echo", "echocardiogram", "echocardiography"]],
      ],
      explanation:
        "He is hypoxic with a mildly positive troponin: the note should commit to repeat gases after oxygen titration, close observations, and a low threshold for echo / escalation if he deteriorates before or after the CTPA.",
      pdqi: ["useful", "thorough"],
    },
    {
      id: "plan-review-treatment",
      label: "Rationalises the IECOPD treatment once the diagnosis is settled",
      category: "plan",
      weight: 4,
      triggers: [
        [
          ["review", "stop", "stopped", "wean", "rationalise", "rationalize", "discontinue", "reassess"],
          ["doxycycline", "antibiotic", "antibiotics", "prednisolone", "steroids", "steroid"],
        ],
      ],
      explanation:
        "Doxycycline and prednisolone were started on the anchored label; the sputum culture grew nothing and the infection picture is absent. Planning to review/stop them once the CTPA reports keeps the treatment tied to the actual diagnosis.",
      pdqi: ["useful", "internally consistent"],
    },
  ],
  modelNote: `WARD ROUND REVIEW — General Medicine (day 2)

68M admitted ?IECOPD. Background: COPD (FEV1 52%), current smoker; right total knee arthroplasty 3 weeks ago — rivaroxaban prophylaxis stopped on day 5 (epistaxis) and never restarted, largely chair-bound since.

The picture does not fit IECOPD: chest clear with no wheeze on three examinations, apyrexial throughout, no purulent sputum (culture: no growth), WCC normal, CRP only 18, and little response to nebulisers, prednisolone and doxycycline at 24 hours.

Persistent sinus tachycardia 105–115. Hypoxia out of proportion to a clear, hyperinflated CXR: SpO2 88% on 2 L, desaturating to 84% on mobilising. Right calf swollen relative to the left — ?DVT. ABG shows type 1 respiratory failure with hypocapnia (pCO2 3.9) — he is not retaining CO2. The admission D-dimer reported at 4.2 and was never actioned; hs-troponin 48. Wells score 9 — high probability.

Impression
Probable pulmonary embolism. IECOPD unlikely on current evidence.

Plan
1. Chase and expedite the CTPA requested overnight — discussed with the consultant and radiology; vetted for today.
2. Start treatment-dose dalteparin now pending imaging; no VTE prophylaxis was prescribed on admission — anticoagulation decision documented, risk assessment completed.
3. Correct oxygen target to 94–98% (type 1 failure, not a retainer); repeat ABG after titration; hourly observations; echo and escalate if he deteriorates.
4. Review antibiotics and wean prednisolone once the CTPA confirms. Update the patient.`,
};
