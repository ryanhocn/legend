import type { CaseRubric } from "../../../types";

/**
 * Scoring rubric for a day-1 ED review / assessment note on the neutropenic
 * sepsis case. Items reference facts that exist in the chart (documents.ts /
 * encounters.ts); triggers list the phrasings a student might reasonably use.
 * Weights: safety catches heaviest (the antibiotic delay, the penicillin
 * anaphylaxis and the masked fever), then the diagnosis and disposition, then
 * supporting findings.
 *
 * All content is fabricated for education and simulation only. Not for clinical use.
 */
export const caseNeutropenicsepsis001Rubric: CaseRubric = {
  caseId: "neutropenicsepsis001",
  noteType: "Progress Note",
  task: { code: "ed", label: "ED REVIEW", minGrade: "st3" },
  wordBand: { target: 160, max: 260 },
  sections: [
    ["impression", "assessment", "diagnosis"],
    ["plan"],
  ],
  items: [
    {
      id: "safety-antibiotics-now",
      label: "Recognises antibiotics are overdue and must be given immediately",
      category: "safety",
      weight: 15,
      critical: true,
      triggers: [
        [
          ["antibiotic", "antibiotics", "abx"],
          [
            "immediate",
            "immediately",
            "now",
            "stat",
            "within",
            "hour",
            "delay",
            "delayed",
            "breach",
            "breached",
            "overdue",
            "urgent",
          ],
        ],
      ],
      explanation:
        "The neutrophil count resulted at 08:20 but no antibiotics were given, and she then rigored in the waiting room. The door-to-antibiotic standard (1 hour from arrival) was breached. In neutropenic sepsis the single most time-critical action is empirical IV antibiotics within the hour — the note must flag that they are overdue and give them now, not wait for cultures.",
      pdqi: ["accurate", "useful"],
    },
    {
      id: "safety-penicillin-allergy",
      label: "Catches the penicillin anaphylaxis against the pathway's pip/taz default",
      category: "safety",
      weight: 15,
      critical: true,
      triggers: [
        [["penicillin"], ["anaphylaxis", "allergy", "allergic", "avoid", "contraindicated"]],
        [["aztreonam"]],
      ],
      explanation:
        "The neutropenic sepsis pathway order defaulted to piperacillin/tazobactam and the allergy alert was overridden, but the chart documents a PENICILLIN ANAPHYLAXIS (2018). Pip/taz is a penicillin and is contraindicated. The note must catch this and name the allergy-safe regimen (aztreonam + vancomycin + gentamicin per microbiology). Re-exposing her repeats a potentially fatal error.",
      pdqi: ["accurate", "useful"],
    },
    {
      id: "safety-masked-fever",
      label: "Sees that paracetamol at triage masked the fever",
      category: "safety",
      weight: 12,
      critical: true,
      triggers: [
        [
          ["paracetamol", "antipyretic"],
          ["mask", "masked", "masking", "afebrile", "reassured", "reassure", "fever"],
        ],
      ],
      explanation:
        "Paracetamol 1 g given at triage dropped the temperature to 37.4 at 07:45, which reinforced the 'well-looking, ?viral' label and the decision to leave her in the waiting room. A transiently normal temperature must not reassure in a neutropenic patient — the note should name the masking so the next reader is not falsely reassured.",
      pdqi: ["accurate", "synthesized"],
    },
    {
      id: "finding-neutropenia",
      label: "Reports the profound neutropenia (neutrophils 0.3)",
      category: "findings",
      weight: 9,
      triggers: [
        // Interpretive words required: the PROGRESS template auto-embeds the raw
        // "Neutrophils 0.3 ... Low" lab line, which must not score alone.
        [
          ["neutrophils", "neutrophil", "neutropenia", "neutropenic"],
          ["severe", "profound", "nadir"],
        ],
      ],
      explanation:
        "The admission FBC shows neutrophils 0.3 (WCC 1.1): profound neutropenia at the expected chemotherapy nadir. This single number reclassifies the whole presentation and is the fact the viral label ignored.",
      pdqi: ["thorough", "accurate"],
    },
    {
      id: "finding-chemo-history",
      label: "Names the oncology history (day 10 post docetaxel chemo)",
      category: "findings",
      weight: 9,
      triggers: [
        [
          ["chemotherapy", "chemo", "docetaxel"],
          ["day", "cycle", "post", "breast", "recent", "nadir"],
        ],
      ],
      explanation:
        "She is day 10 post cycle 2 of adjuvant docetaxel/cyclophosphamide for breast cancer — the nadir window (days 7–14). The history lives in the oncology clinic letter and the chemotherapy record, not the presenting complaint, and it is what makes 'fever' an emergency.",
      pdqi: ["thorough", "synthesized"],
    },
    {
      id: "finding-sepsis-physiology",
      label: "Recognises the sepsis physiology (rigors, hypotension, NEWS2)",
      category: "findings",
      weight: 8,
      triggers: [
        [["rigors", "rigor", "rigoring"]],
        [["news2", "news"]],
        [["sepsis", "septic"]],
        // Raw flag/value words removed: the PROGRESS template always prints "BP
        // <sys>/<dia>" plus multiple "Low"-flagged lab rows, which must not
        // satisfy this alone.
        [["bp", "blood pressure", "hypotension", "hypotensive"], ["falling", "dropping", "down"]],
      ],
      explanation:
        "Rigors witnessed by nursing, BP trending to 95/56, HR 118 and a rising NEWS2 with a lactate of 2.1: this is sepsis, not a self-limiting virus, and it drives the urgency.",
      pdqi: ["thorough", "accurate"],
    },
    {
      id: "finding-source",
      label: "Looks for a source (sore throat / mucositis, CXR clear)",
      category: "findings",
      weight: 5,
      triggers: [
        [["sore throat", "throat", "mucositis", "pharyngitis", "pharynx", "pharyngeal"]],
      ],
      explanation:
        "The likely portal is the mouth/pharynx — mild pharyngeal erythema and early oral mucositis, with a clear CXR. Documenting the source search matters because neutropenic patients mount blunted signs and the focus is easily missed.",
      pdqi: ["thorough", "useful"],
    },
    {
      id: "finding-cultures",
      label: "Tracks the cultures (sent before antibiotics, pending)",
      category: "findings",
      weight: 5,
      triggers: [
        [
          ["cultures", "culture"],
          ["pending", "sent", "taken", "awaiting", "chase", "no growth", "before"],
        ],
      ],
      explanation:
        "Blood cultures x2 and urine were sent before the first antibiotic dose and are pending. The note should carry the pending result forward so someone chases it and de-escalates at 48 hours — without letting the culture delay the antibiotics.",
      pdqi: ["up-to-date", "useful"],
    },
    {
      id: "assessment-neutropenic-sepsis",
      label: "States the diagnosis: neutropenic sepsis",
      category: "assessment",
      weight: 10,
      triggers: [
        [["neutropenic"], ["sepsis", "septic"]],
        [["febrile neutropenia", "neutropenic sepsis"]],
      ],
      explanation:
        "Fever plus neutrophils below 0.5 at the nadir is neutropenic sepsis by definition. Naming it is what converts a 'viral illness' into a time-critical oncological emergency with a standard bundle.",
      pdqi: ["accurate", "synthesized"],
    },
    {
      id: "assessment-reject-viral",
      label: "Explicitly rejects the viral-illness label",
      category: "assessment",
      weight: 6,
      triggers: [
        [["viral", "flu"], ["not", "rather", "misdiagnos", "mislabel", "wrong", "against"]],
      ],
      explanation:
        "The triage note calls this 'flu-like illness, well-looking, ?viral'. Explicitly stating that this is NOT a viral illness is what stops the next reader from re-anchoring on the wrong label and repeating the delay.",
      pdqi: ["synthesized", "internally consistent"],
    },
    {
      id: "plan-empirical-regimen",
      label: "Prescribes the allergy-safe empirical regimen",
      category: "plan",
      weight: 8,
      triggers: [
        [["aztreonam"], ["vancomycin", "gentamicin"]],
        [["neutropenic sepsis", "penicillin allergy"], ["policy", "protocol", "pathway", "regimen", "guideline"]],
      ],
      explanation:
        "Empirical cover must be broad-spectrum but penicillin-free given the anaphylaxis: microbiology advised aztreonam + vancomycin + gentamicin per the local penicillin-allergy neutropenic sepsis policy. Naming the actual regimen (not just 'antibiotics') closes the loop opened by the pathway default.",
      pdqi: ["useful", "up-to-date"],
    },
    {
      id: "plan-fluids",
      label: "Resuscitates with IV fluids and monitors",
      category: "plan",
      weight: 5,
      triggers: [
        [["fluids", "fluid", "crystalloid", "bolus"]],
      ],
      explanation:
        "She has sepsis physiology with a lactate of 2.1 and an early AKI: IV crystalloid resuscitation with lactate, urine output and renal monitoring is part of the sepsis bundle alongside the antibiotics.",
      pdqi: ["useful", "up-to-date"],
    },
    {
      id: "plan-isolation-escalate",
      label: "Isolates, escalates and admits",
      category: "plan",
      weight: 6,
      triggers: [
        [["isolation", "isolate", "side room", "barrier", "protective"]],
        [["escalate", "escalation", "senior", "admit", "admission", "admitted"]],
      ],
      explanation:
        "A high-risk neutropenic septic patient must not sit in the waiting room: she needs protective (neutropenic) isolation, senior review and admission for inpatient IV antibiotics, not ambulatory management.",
      pdqi: ["useful", "thorough"],
    },
    {
      id: "plan-acute-oncology",
      label: "Refers acute oncology (MASCC / G-CSF)",
      category: "plan",
      weight: 5,
      triggers: [
        [["oncology"], ["refer", "referral", "acute", "team", "advice", "discuss"]],
        [["mascc"]],
        [["g-csf", "gcsf", "g csf", "filgrastim"]],
      ],
      explanation:
        "Acute oncology should be involved early: to risk-stratify (MASCC — low score means high risk, admit), consider G-CSF given the profound neutropenia and sepsis, and plan the timing of the next chemotherapy cycle.",
      pdqi: ["useful", "thorough"],
    },
  ],
  modelNote: `ED REVIEW — Neutropenic Sepsis (day 1)

52F, day 10 post cycle 2 adjuvant docetaxel chemotherapy for breast cancer, self-presented with fever, malaise and a sore throat. Triaged as a "flu-like illness, ?viral" and sent to the waiting room. This is neutropenic sepsis, NOT a viral illness.

Paracetamol given at triage masked the fever (37.4 at 07:45), reinforcing the "well-looking" label; she has since rigored and her observations are septic — T 38.6, HR 118, BP 95/56, RR 22, NEWS2 escalating.

Bloods: neutrophils 0.3 (profound/severe neutropenia), WCC 1.1, CRP 88, lactate 2.1, creatinine 96 (early AKI). CXR clear; likely source is oral mucositis / pharynx.

Impression
High-risk febrile neutropenia — neutropenic sepsis, day 10 post docetaxel. The neutrophil count resulted at 08:20 but antibiotics were not given: the door-to-antibiotic (1 hour) standard is breached, so antibiotics are overdue and the immediate priority.

Plan
1. IV empirical antibiotics NOW, within the hour — do not wait for cultures. Documented PENICILLIN ANAPHYLAXIS, so NOT piperacillin/tazobactam (pathway default, contraindicated): give aztreonam + vancomycin + gentamicin per the penicillin-allergy neutropenic sepsis policy.
2. Septic screen: blood cultures x2 and urine sent before antibiotics — chase and de-escalate at 48 h; do not delay antibiotics for them.
3. IV crystalloid fluid resuscitation; monitor lactate, urine output and renal function.
4. Protective (neutropenic) isolation; senior review; admit — not for the waiting room.
5. Refer acute oncology: MASCC risk score, consider G-CSF, plan cycle 3 timing.`,
};
