import type { CaseRubric } from "../../../types";

/**
 * Scoring rubric for a day-2 ward-round / progress note on the subdural case.
 * Items reference facts that exist in the chart (documents.ts / encounters.ts);
 * triggers list the phrasings a student might reasonably use. Weights: the
 * three safety catches heaviest (CT head, apixaban, the unescalated GCS trend),
 * then the diagnosis, then supporting findings and disposition.
 *
 * All content is fabricated for education and simulation only. Not for clinical use.
 */
export const caseSubdural001Rubric: CaseRubric = {
  caseId: "subdural001",
  noteType: "Progress Note",
  task: { code: "ward", label: "WARD ROUND REVIEW", minGrade: "fy" },
  wordBand: { target: 150, max: 250 },
  sections: [
    ["impression", "assessment", "diagnosis"],
    ["plan"],
  ],
  items: [
    {
      id: "safety-ct-head",
      label: "Requests an urgent CT head this admission",
      category: "safety",
      weight: 15,
      critical: true,
      triggers: [
        [
          ["ct head", "ct brain", "ct of the head", "neuroimaging"],
          [
            "urgent",
            "urgently",
            "now",
            "today",
            "immediate",
            "immediately",
            "request",
            "requested",
            "order",
            "ordered",
            "arrange",
            "arranged",
            "same day",
          ],
        ],
      ],
      explanation:
        "An anticoagulated head injury with fluctuating GCS, a worsening headache and new focal signs mandates urgent CT head — yet none has been requested this admission (and none was done at the index attendance). Every hour on apixaban with an expanding subdural is borrowed time.",
      pdqi: ["useful", "up-to-date"],
    },
    {
      id: "safety-hold-apixaban",
      label: "Holds the apixaban pending assessment",
      category: "safety",
      weight: 12,
      critical: true,
      triggers: [
        [
          ["apixaban", "doac", "anticoagulation", "anticoagulant"],
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
            "discontinue",
            "discontinued",
          ],
        ],
      ],
      explanation:
        "Apixaban is still on the active drug chart and was given this morning — the pharmacist's written query about continuing it is sitting unanswered in the notes. With a probable intracranial bleed the anticoagulant must be held immediately; remember a normal INR/APTT does not exclude apixaban effect.",
      pdqi: ["accurate", "up-to-date"],
    },
    {
      id: "safety-escalate-gcs",
      label: "Reads and escalates the falling GCS trend",
      category: "safety",
      weight: 12,
      critical: true,
      triggers: [
        [
          ["gcs", "conscious level"],
          [
            "falling",
            "fallen",
            "fell",
            "dropped",
            "dropping",
            "declining",
            "deteriorating",
            "deteriorated",
            "worsening",
            "downward",
            "13",
          ],
        ],
        [
          ["escalate", "escalated", "escalating", "escalation"],
          [
            "gcs",
            "conscious",
            "consciousness",
            "drowsiness",
            "drowsy",
            "senior",
            "registrar",
            "consultant",
          ],
        ],
      ],
      explanation:
        "The obs chart records GCS 15 → 14 → 13 across the nursing observations, faithfully documented and never escalated — the night note files it 'for review on the morning ward round' and the post-take round read the obs as 'stable'. A falling GCS is an emergency to act on, not a column to archive.",
      pdqi: ["up-to-date", "synthesized"],
    },
    {
      id: "finding-fall-anticoag",
      label: "Links the head injury 10 days ago to the anticoagulation",
      category: "findings",
      weight: 8,
      triggers: [
        [
          ["fall", "fell", "head injury", "head strike", "hit her head"],
          ["apixaban", "anticoagulation", "anticoagulated", "anticoagulant", "doac"],
        ],
      ],
      explanation:
        "The injury timeline is the spine of this case: a fall with head strike on 26/06 in a patient on apixaban, then a subacute decline. A note that mentions the fall without the anticoagulant (or vice versa) has missed why this combination is dangerous.",
      pdqi: ["thorough", "synthesized"],
    },
    {
      id: "finding-fluctuation",
      label: "Names the fluctuating conscious level (not 'just old age')",
      category: "findings",
      weight: 6,
      triggers: [
        [["fluctuating", "fluctuation", "fluctuates", "fluctuant", "waxing and waning"]],
      ],
      explanation:
        "'Drifts off mid-sentence, then perks up' — drowsy at 02:00, brighter by the round, worse again after lunch. Fluctuating consciousness is a classic subdural signature (and never a normal feature of ageing); labelling it captures what 'sleepy after a poor night' throws away.",
      pdqi: ["accurate", "thorough"],
    },
    {
      id: "finding-focal-weakness",
      label: "Reports the new left-sided weakness (physio note)",
      category: "findings",
      weight: 8,
      triggers: [
        [["left"], ["weakness", "weak", "hemiparesis", "drift"]],
        [["pronator drift"]],
        [["focal"], ["deficit", "signs", "neurology", "neurological", "weakness"]],
      ],
      explanation:
        "Physio found new mild left-sided weakness with pronator drift and left-veering gait, deferred mobilisation, and handed it over verbally — it never reached a medical note. A new focal deficit converts 'deconditioning' into a pressure story.",
      pdqi: ["thorough", "up-to-date"],
    },
    {
      id: "finding-morning-headache",
      label: "Tracks the worsening, morning-predominant headache",
      category: "findings",
      weight: 5,
      triggers: [
        [["headache"], ["morning", "mornings"]],
        [["headache"], ["worse", "worsening", "progressive", "pounding"]],
        [["raised"], ["pressure", "intracranial", "icp"]],
      ],
      explanation:
        "A headache that is worse in the mornings (and now 'pounding', with a vomit) is a raised-intracranial-pressure pattern, documented from the GP telephone call through to the night nursing note. It deserves naming, not another paracetamol.",
      pdqi: ["thorough", "synthesized"],
    },
    {
      id: "finding-not-uti",
      label: "Challenges the UTI label with the actual evidence",
      category: "findings",
      weight: 6,
      triggers: [
        [["mixed growth"]],
        [
          ["uti", "urinary", "urine"],
          [
            "not supported",
            "does not support",
            "against",
            "unlikely",
            "no evidence",
            "doubt",
            "contamination",
            "contaminant",
            "contaminated",
          ],
        ],
        [["afebrile"], ["uti", "urine", "urinary", "infection"]],
      ],
      explanation:
        "She is afebrile with CRP 22, nitrites negative, and the culture shows mixed growth most consistent with contamination — the lab even says so. A trace-leucocyte dipstick in a woman of 79 is not a diagnosis; treating it as one is what anchored this admission.",
      pdqi: ["accurate", "internally consistent"],
    },
    {
      id: "finding-ed-no-ct",
      label: "Spots the missed CT at the index ED attendance",
      category: "findings",
      weight: 6,
      triggers: [
        [
          ["ct"],
          [
            "no ct",
            "not performed",
            "not done",
            "never performed",
            "never done",
            "not scanned",
            "never scanned",
            "missed",
            "should have",
            "omitted",
            "was not",
          ],
        ],
      ],
      explanation:
        "On 26/06 she met a clear head-injury imaging indication — head injury on an anticoagulant — but the discharge note reads 'no CT indicated: GCS 15, no vomiting, no focal deficit'. Anticoagulation is itself the indication; recognising the missed scan is what stops the error propagating into today.",
      pdqi: ["accurate", "synthesized"],
    },
    {
      id: "assessment-subdural",
      label: "States the likely diagnosis: subdural haematoma",
      category: "assessment",
      weight: 10,
      triggers: [
        [
          [
            "subdural",
            "sdh",
            "intracranial bleed",
            "intracranial haemorrhage",
            "intracranial hemorrhage",
            "head bleed",
          ],
        ],
      ],
      explanation:
        "Head injury on apixaban, a latent interval, then fluctuating drowsiness, morning headache and a new focal deficit: this is a subdural haematoma until the CT proves otherwise. Naming it is what turns a tidy 'delirium screen' into the right emergency.",
      pdqi: ["accurate", "synthesized"],
    },
    {
      id: "assessment-subacute",
      label: "Places it on the timeline: subacute, evolving since the fall",
      category: "assessment",
      weight: 6,
      triggers: [
        [["subacute"]],
        [["10 days", "ten days"], ["fall", "injury", "ago"]],
        [["since the fall"], ["evolving", "evolved", "progressive", "worsening", "developing"]],
      ],
      explanation:
        "The 10-day latent interval is the signature of a subacute subdural — slow venous ooze, symptoms that creep and fluctuate rather than crash. Anchoring the assessment to the injury date is what separates this from 'confusion, cause unclear'.",
      pdqi: ["synthesized", "internally consistent"],
    },
    {
      id: "plan-neurosurgery",
      label: "Plans neurosurgical referral once imaging confirms",
      category: "plan",
      weight: 8,
      triggers: [[["neurosurgery", "neurosurgical", "neurosurgeons"]]],
      explanation:
        "A confirmed symptomatic subdural with a falling GCS needs same-day neurosurgical discussion — the definitive treatment is surgical (burr-hole drainage), not observation on an elderly-care ward.",
      pdqi: ["useful", "up-to-date"],
    },
    {
      id: "plan-reversal",
      label: "Makes an anticoagulation reversal plan",
      category: "plan",
      weight: 8,
      triggers: [
        [
          ["reversal", "reverse", "reversed"],
          ["anticoagulation", "anticoagulant", "apixaban", "doac", "plan", "agent"],
        ],
        [["prothrombin complex", "pcc", "andexanet"]],
        [
          ["haematology", "hematology"],
          ["advice", "advise", "discuss", "discussed", "liaise", "contact", "guide"],
        ],
      ],
      explanation:
        "Holding the drug is not enough: if the CT confirms a bleed she needs active reversal — prothrombin complex concentrate (or andexanet where available) on haematology advice. Nobody in the chart has discussed reversal at any point; the pharmacist offered and was not taken up.",
      pdqi: ["useful", "thorough"],
    },
    {
      id: "plan-neuro-obs",
      label: "Steps up to hourly neuro obs with escalation parameters",
      category: "plan",
      weight: 5,
      triggers: [
        [["neuro obs", "neurological observations", "neuro observations"]],
        [["hourly", "1 hourly", "one hourly"], ["obs", "observations", "gcs", "neuro"]],
      ],
      explanation:
        "Routine ward obs already missed a three-point GCS slide. She needs hourly neurological observations with a written trigger — any further GCS drop prompts immediate senior review — so the next change is acted on within minutes, not filed for the morning.",
      pdqi: ["useful", "thorough"],
    },
  ],
  modelNote: `WARD ROUND REVIEW — Geriatrics (day 2)

79F readmitted with fluctuating drowsiness, worsening headache — worse in the mornings, with one vomit — and new unsteadiness, 10 days after a fall with head strike while anticoagulated on apixaban for AF. Labelled ?UTI / deconditioning, but the chart does not support it: afebrile, CRP only 22, nitrites negative, and the urine culture shows mixed growth (likely contamination).

The obs chart shows the GCS falling 15 → 14 → 13 overnight, fluctuating through the day, and physio has documented new mild LEFT-sided weakness with pronator drift — a focal deficit. No CT head was performed at the ED attendance on 26/06 despite anticoagulation (a missed head-injury imaging indication), and none has been requested this admission. Apixaban is still on the drug chart and was given this morning.

Impression
Likely subacute subdural haematoma evolving since the fall: raised-pressure headache, fluctuating conscious level, new focal signs. Not explained by infection or "old age".

Plan
1. Urgent CT head now — escalated to the registrar and consultant given the falling GCS.
2. HOLD apixaban immediately; group and save. If a bleed is confirmed, reversal with prothrombin complex concentrate (PCC) on haematology advice.
3. Refer to neurosurgery once imaging is available.
4. Hourly neuro obs; any further GCS drop = immediate senior review.
5. Stop nitrofurantoin (no supporting evidence of UTI). Nil by mouth pending review. Update daughter.`,
};
