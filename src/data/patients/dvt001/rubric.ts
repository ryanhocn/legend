import type { CaseRubric } from "../../../types";

/**
 * Scoring rubric for a day-3 progress note on the DVT-as-cellulitis case
 * (Ashworth, Colin, 59M). Items reference facts that exist in the chart
 * (documents.ts / encounters.ts); triggers list the phrasings a student might
 * reasonably use. Weights: safety catches heaviest (the never-requested
 * Doppler, no anticoagulation, the wrong antibiotic being escalated), then the
 * diagnosis, then the supporting findings.
 *
 * Trigger hygiene: the PROGRESS SmartText pastes the vitals line and every
 * bloods row (values, ranges, flags) plus a literal "DVT prophylaxis:" field
 * into the note. No trigger below is satisfiable by that text alone — every
 * "dvt" phrase is paired with an interpretive token the template cannot emit,
 * and "vte prophylaxis" is gated on "vte" (absent from the template).
 *
 * All content is fabricated for education and simulation only. Not for clinical use.
 */
export const caseDvt001Rubric: CaseRubric = {
  caseId: "dvt001",
  noteType: "Progress Note",
  task: { code: "progress", label: "PROGRESS REVIEW", minGrade: "fy" },
  wordBand: { target: 170, max: 300 },
  sections: [
    ["impression", "assessment", "diagnosis"],
    ["plan"],
  ],
  items: [
    {
      id: "safety-doppler",
      label: "Requests a compression Doppler / venous duplex ultrasound",
      category: "safety",
      weight: 15,
      critical: true,
      triggers: [
        [["doppler"]],
        [["duplex"]],
        [
          [
            "venous ultrasound",
            "leg ultrasound",
            "compression ultrasound",
            "lower limb ultrasound",
            "venous doppler",
            "leg doppler",
          ],
        ],
        [
          ["ultrasound", "uss", "scan"],
          ["dvt", "clot", "thrombosis", "venous", "deep vein", "leg vein"],
        ],
      ],
      explanation:
        "A compression Doppler (venous duplex) is the test that confirms or excludes a DVT, and none has ever been requested — the whole admission has been an antibiotic course for a diagnosis nobody imaged. ED even suggested it in writing. With a DVT-likely Wells score the scan is the immediate next step; the note must order it today.",
      pdqi: ["useful", "up-to-date"],
    },
    {
      id: "safety-anticoagulate",
      label: "Starts treatment-dose anticoagulation (interim cover)",
      category: "safety",
      weight: 14,
      critical: true,
      triggers: [
        [["anticoagulate", "anticoagulation", "anticoagulant"]],
        [
          [
            "lmwh",
            "dalteparin",
            "tinzaparin",
            "enoxaparin",
            "apixaban",
            "rivaroxaban",
            "edoxaban",
            "dabigatran",
            "heparin",
          ],
        ],
      ],
      explanation:
        "With a high pre-test probability and a scan not yet done, interim treatment-dose anticoagulation (LMWH or a DOAC) is indicated pending imaging — the clot is propagating in a tense calf while the team gives flucloxacillin. Note he has had NO anticoagulation and never even had VTE prophylaxis on this admission.",
      pdqi: ["useful", "up-to-date"],
    },
    {
      id: "safety-stop-abx",
      label: "Stops / challenges the flucloxacillin rather than escalating it",
      category: "safety",
      weight: 10,
      critical: true,
      triggers: [
        [
          ["flucloxacillin", "antibiotic", "antibiotics", "abx"],
          [
            "stop",
            "stopped",
            "stopping",
            "discontinue",
            "discontinued",
            "cease",
            "hold",
            "held",
            "challenge",
            "challenged",
            "unnecessary",
          ],
        ],
      ],
      explanation:
        "Three days of IV flucloxacillin have done nothing because there is no infection to treat, and this morning's plan is to ADD a second antibiotic — escalating the wrong treatment instead of questioning the label. The note must stop or explicitly challenge the antibiotics; 'continue and add clindamycin' is how the anchoring error compounds.",
      pdqi: ["accurate", "useful"],
    },
    {
      id: "safety-pe-risk",
      label: "Screens for / considers PE (a proximal DVT can embolise)",
      category: "safety",
      weight: 6,
      triggers: [
        [
          ["pe", "pulmonary embolism", "pulmonary emboli", "pulmonary embolus"],
          [
            "exclude",
            "risk",
            "screen",
            "consider",
            "rule out",
            "symptoms",
            "breathless",
            "breathlessness",
            "chest pain",
            "query",
            "assess",
          ],
        ],
      ],
      explanation:
        "A proximal leg DVT can embolise to the lungs; the note should record a brief PE screen (breathlessness, chest pain, hypoxia — all currently absent) and safety-net for it, rather than treating the leg in isolation.",
      pdqi: ["thorough", "useful"],
    },
    {
      id: "safety-vte-omission",
      label: "Flags that VTE prophylaxis / assessment was never done",
      category: "safety",
      weight: 5,
      triggers: [
        [
          ["vte", "venous thromboembolism"],
          [
            "prophylaxis",
            "assessment",
            "risk assessment",
            "not prescribed",
            "never prescribed",
            "omitted",
            "missed",
          ],
        ],
      ],
      explanation:
        "The nursing admission note flags that the VTE assessment form was never completed and no prophylaxis prescribed — an obese, immobile, long-haul traveller admitted for three days with no thromboprophylaxis. Naming the omission is part of owning the error.",
      pdqi: ["thorough", "accurate"],
    },
    {
      id: "finding-calf-asymmetry",
      label: "Uses the charted calf circumference difference (L 41 / R 37)",
      category: "findings",
      weight: 8,
      triggers: [
        [
          ["calf", "leg"],
          [
            "circumference",
            "asymmetry",
            "asymmetric",
            "difference",
            "differential",
            "larger",
            "enlarged",
            "3cm",
            "4cm",
            "41",
            "37",
          ],
        ],
      ],
      explanation:
        "The nursing admission chart records calf circumference L 41 cm / R 37 cm — a 4 cm difference, a positive Wells criterion — measured on day one and never read back by the medical team. The objective evidence of a unilateral DVT was already in the chart.",
      pdqi: ["up-to-date", "thorough"],
    },
    {
      id: "finding-unilateral-swelling",
      label: "Describes the unilateral tense swollen calf",
      category: "findings",
      weight: 6,
      triggers: [
        [
          ["unilateral"],
          ["swelling", "swollen", "calf", "leg", "oedema", "edema", "tense"],
        ],
      ],
      explanation:
        "A tense, unilaterally swollen calf is the cardinal sign the label glossed over — bilateral change would suggest another cause, but this is one leg, acutely bigger than the other.",
      pdqi: ["accurate", "thorough"],
    },
    {
      id: "finding-provoking-factors",
      label: "Surfaces the provoking factors (long-haul flight, immobility)",
      category: "findings",
      weight: 7,
      triggers: [
        [["flight", "long haul", "long-haul", "air travel", "aeroplane", "aircraft", "travel"]],
        [
          [
            "immobility",
            "immobilisation",
            "immobilization",
            "prolonged sitting",
            "prolonged driving",
            "driver",
            "driving",
            "hgv",
            "sedentary",
          ],
        ],
      ],
      explanation:
        "The clerking records a long-haul flight on 18/06 and a job (HGV driver) of prolonged seated immobility, on a background of obesity — the provoking history that makes DVT the front-runner. It is in the chart but never weighted.",
      pdqi: ["thorough", "synthesized"],
    },
    {
      id: "finding-cellulitis-mismatch",
      label: "Notes the cellulitis picture does not fit",
      category: "findings",
      weight: 7,
      triggers: [
        [
          ["cellulitis"],
          [
            "unlikely",
            "not improving",
            "no improvement",
            "failing",
            "failed",
            "not responding",
            "doesnt fit",
            "does not fit",
            "against",
            "reject",
            "rejected",
            "atypical",
            "mislabel",
            "mislabelled",
            "questionable",
            "overtreated",
          ],
        ],
        [["afebrile", "apyrexial", "no fever", "normal wcc", "normal white cell"], ["cellulitis"]],
      ],
      explanation:
        "Cellulitis that is afebrile throughout, with a normal white count and a CRP that has barely moved (28 to 31) and no response to three days of IV antibiotics, is cellulitis in name only. The note has to say the label does not fit rather than quietly continuing it.",
      pdqi: ["internally consistent", "synthesized"],
    },
    {
      id: "finding-no-portal",
      label: "Records the absent portal of entry",
      category: "findings",
      weight: 5,
      triggers: [
        [
          [
            "portal of entry",
            "break in the skin",
            "broken skin",
            "skin breach",
            "no wound",
            "entry point",
            "source of infection",
            "intact skin",
            "no ulcer",
          ],
        ],
      ],
      explanation:
        "No portal of entry — no wound, ulcer or skin breach — is documented anywhere; cellulitis usually has a source. Its absence is a quiet argument against infection that the successive notes never make.",
      pdqi: ["thorough", "accurate"],
    },
    {
      id: "assessment-dvt",
      label: "States the diagnosis: deep vein thrombosis",
      category: "assessment",
      weight: 12,
      critical: true,
      triggers: [
        [["deep vein thrombosis", "deep venous thrombosis"]],
        [
          ["dvt"],
          [
            "likely",
            "probable",
            "diagnosis",
            "impression",
            "suspected",
            "proximal",
            "provoked",
            "clot",
            "thrombosis",
            "thrombus",
            "acute",
          ],
        ],
      ],
      explanation:
        "Unilateral tense calf + 4 cm circumference difference + long-haul flight and immobility + a stone-cold inflammatory picture = deep vein thrombosis. Every element is in the chart; no note has assembled them into the diagnosis.",
      pdqi: ["accurate", "synthesized"],
    },
    {
      id: "assessment-wells",
      label: "Applies a two-level Wells DVT probability",
      category: "assessment",
      weight: 7,
      triggers: [
        [["wells"]],
        [
          [
            "two level",
            "two-level",
            "pretest probability",
            "pre-test probability",
            "pre test probability",
            "dvt likely",
            "clinically likely",
          ],
        ],
      ],
      explanation:
        "The two-level Wells score is the standard gate to a DVT pathway: calf swelling >3 cm, localised tenderness, unilateral pitting oedema and a plausible alternative that is actually less likely push him into the 'DVT likely' band — which mandates a Doppler. It appears nowhere in the chart.",
      pdqi: ["synthesized", "useful"],
    },
    {
      id: "assessment-provoked",
      label: "Recognises it as a provoked VTE",
      category: "assessment",
      weight: 6,
      triggers: [
        [["provoked"], ["dvt", "vte", "thrombosis", "clot", "embolism"]],
        [["provoking factor", "provoking factors"]],
      ],
      explanation:
        "Framing it as a provoked VTE (flight, immobility, obesity) is what later sets the anticoagulation duration and prompts a conversation about his driving and flying — it is not an incidental label.",
      pdqi: ["synthesized", "useful"],
    },
    {
      id: "plan-management",
      label: "Adds interim management and senior discussion",
      category: "plan",
      weight: 5,
      triggers: [
        [
          ["senior", "registrar", "med reg", "medical registrar", "consultant"],
          ["discuss", "discussed", "inform", "informed", "review", "escalate", "aware"],
        ],
        [["analgesia", "elevate", "elevation", "compression"], ["leg"]],
      ],
      explanation:
        "Pending the scan the plan needs the practical scaffolding — analgesia, leg elevation, and the change of direction discussed with the medical registrar today rather than left to the afternoon consultant round.",
      pdqi: ["useful", "thorough"],
    },
  ],
  modelNote: `WARD REVIEW — General Medicine (day 3)

59M admitted with a red, swollen, painful left lower leg, labelled cellulitis and started on IV flucloxacillin. Three days on he is afebrile throughout (NEWS2 1), WCC normal at 8.9 and CRP only mildly raised (28 to 31) — the picture does not fit cellulitis, and there is no portal of entry or skin breach anywhere in the chart. The chronic venous eczema explains a discoloured leg but not an acutely tense, unilateral, swollen calf. The nursing admission chart records a calf circumference difference of L 41 / R 37 cm that has not been read back. Provoking factors are prominent: a long-haul flight on 18/06 and prolonged immobility as an HGV driver, with obesity.

Impression
Provoked left lower limb deep vein thrombosis, not cellulitis. Two-level Wells score is DVT likely; the erythema and swelling have been anchored to an infection the inflammatory markers never supported.

Plan
1. Urgent compression Doppler ultrasound (venous duplex) of the left leg today.
2. Start treatment-dose anticoagulation now (LMWH / apixaban) as interim cover pending the scan.
3. Stop the IV flucloxacillin — challenge the cellulitis label rather than adding a second antibiotic.
4. Screen for PE symptoms (breathlessness, chest pain) — a proximal DVT can embolise.
5. VTE prophylaxis was never prescribed on admission; give analgesia, leg elevation, and discuss with the medical registrar today.`,
};
