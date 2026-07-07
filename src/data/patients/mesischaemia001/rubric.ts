import type { CaseRubric } from "../../../types";

/**
 * Scoring rubric for a day-1 ward-round / progress note on the mesenteric
 * ischaemia case. Items reference facts that exist in the chart (documents.ts /
 * encounters.ts); triggers list the phrasings a student might reasonably use.
 * Weights: the safety catches (the named dissociation, the anticoagulation
 * hole, the opioid endpoint, the lactate trend, the CT angiogram) heaviest,
 * then diagnosis, then supporting findings.
 *
 * All content is fabricated for education and simulation only. Not for clinical use.
 */
export const caseMesischaemia001Rubric: CaseRubric = {
  caseId: "mesischaemia001",
  noteType: "Progress Note",
  task: { code: "ptwr", label: "POST-TAKE WARD ROUND", minGrade: "st3" },
  wordBand: { target: 160, max: 260 },
  sections: [
    ["impression", "assessment", "diagnosis"],
    ["plan"],
  ],
  items: [
    {
      id: "safety-pain-out-of-proportion",
      label: "Names the dissociation: pain out of proportion to a soft abdomen",
      category: "safety",
      weight: 15,
      critical: true,
      triggers: [
        [["out of proportion", "disproportionate", "out of keeping"]],
        [["pain"], ["soft"], ["10 10", "severe", "escalating", "refractory", "despite"]],
      ],
      explanation:
        "Every page of this chart records 10/10 pain against a soft, barely tender abdomen — triage, ED ('examination notably unimpressive'), the clerking, the night review — but nobody names it. Pain out of proportion to examination is THE early sign of mesenteric ischaemia; writing the dissociation down is what stops the next reader re-anchoring on gastroenteritis.",
      pdqi: ["synthesized", "accurate"],
    },
    {
      id: "safety-af-not-anticoagulated",
      label: "Surfaces the embolic substrate: AF with warfarin stopped and never restarted",
      category: "safety",
      weight: 15,
      critical: true,
      triggers: [
        [
          ["warfarin"],
          [
            "stopped",
            "stop",
            "held",
            "withheld",
            "discontinued",
            "not restarted",
            "never restarted",
            "off",
          ],
        ],
        [
          ["af", "atrial fibrillation", "fibrillation"],
          ["anticoagulation", "anticoagulated", "anticoagulant"],
        ],
        [["embolic", "embolus", "embolism"], ["source", "af", "atrial", "cardiac"]],
      ],
      explanation:
        "He has AF and a previous TIA, and his warfarin was stopped on 22/05/2026 after an epistaxis and never restarted — the restart review was DNA'd and not rebooked. The ED summary, both GP letters and the pharmacy med rec all record it. Six weeks without anticoagulation in AF is exactly the substrate for an embolus to the SMA; a note that omits it hides both the cause and the untreated stroke risk.",
      pdqi: ["accurate", "synthesized"],
    },
    {
      id: "safety-opioids-not-endpoint",
      label: "Flags the escalating opioid requirement as a red flag, not an endpoint",
      category: "safety",
      weight: 10,
      critical: true,
      triggers: [
        [
          ["morphine", "opioid", "opiate", "analgesia"],
          [
            "escalating",
            "escalated",
            "increasing",
            "requirement",
            "requirements",
            "red flag",
            "masking",
            "masks",
            "endpoint",
            "despite",
          ],
        ],
      ],
      explanation:
        "40 mg of morphine in 24 hours bought the label 'comfortable overnight', and the post-take round inherited it. Analgesia was titrated while the diagnosis went unchased: an escalating opioid requirement in an undiagnosed abdomen is itself a hard sign that the working diagnosis is wrong.",
      pdqi: ["useful", "synthesized"],
    },
    {
      id: "finding-lactate-rising",
      label: "Reads the lactate as a trend: 2.1 → 2.9 → 3.6 → 4.4 with acidosis",
      category: "findings",
      weight: 12,
      critical: true,
      triggers: [
        [
          ["lactate"],
          ["rising", "risen", "climbing", "increasing", "worsening", "trend", "trending", "4 4", "44"],
        ],
        [["metabolic acidosis"]],
        [["acidosis"], ["worsening", "developing", "new", "metabolic"]],
      ],
      explanation:
        "Serial gases climbed 2.1 (18:50) → 2.9 (23:30) → 3.6 (03:30) → 4.4 (07:00) with pH 7.27 and BE -9. Each value was resulted; the 3.6 was read as 'dehydration' and the 4.4 sat unseen at the post-take round. A rising lactate on fluids is failing resuscitation until proven otherwise — in this abdomen it means dying gut.",
      pdqi: ["up-to-date", "accurate"],
    },
    {
      id: "finding-bloody-stool",
      label: "Carries forward the dark bloody stool from the night nursing note",
      category: "findings",
      weight: 6,
      triggers: [
        [
          ["stool", "rectal", "melaena", "melena", "pr bleed"],
          ["dark", "blood", "bloody", "fresh blood"],
        ],
        [["melaena", "melena"]],
      ],
      explanation:
        "At 05:00 he passed a dark stool mixed with fresh blood — documented only in the night nursing note, phoned through and deferred to 'ward round review'. Bloody diarrhoea after severe pain is mucosal infarction declaring itself, not gastroenteritis.",
      pdqi: ["thorough", "up-to-date"],
    },
    {
      id: "finding-aki",
      label: "Notes the acute kidney injury / hypovolaemic picture",
      category: "findings",
      weight: 5,
      triggers: [
        [["aki", "acute kidney injury"]],
        // Interpretive words required: the PROGRESS template auto-embeds the raw
        // "Creatinine 118" / "Urea 11.8" lab lines, which must not score alone.
        [["creatinine"], ["raised", "rising", "climbing", "increasing", "increased", "baseline", "trend", "trending"]],
        [["urea"], ["raised", "rising", "climbing", "increasing", "increased", "baseline", "trend", "trending"]],
      ],
      explanation:
        "Creatinine 118 with urea 11.8 and Hb 168 is haemoconcentration plus early AKI — third-spacing and hypoperfusion, part of the same physiology as the lactate, not an incidental finding.",
      pdqi: ["thorough", "accurate"],
    },
    {
      id: "finding-amylase-context",
      label: "Reads the amylase in context (mildly raised — not pancreatitis)",
      category: "findings",
      weight: 5,
      triggers: [
        // Interpretive words required: the PROGRESS template auto-embeds the raw
        // "Amylase 142 ... High (mild)" lab line, which must not score alone.
        [["amylase"], ["mildly", "only", "slightly", "modest"]],
        [["pancreatitis"], ["not", "against", "unlikely", "excluded", "rule"]],
      ],
      explanation:
        "Amylase 142 is well short of the threshold for pancreatitis but is a recognised finding IN mesenteric ischaemia. Read alone it reassures; read in context it points at the gut.",
      pdqi: ["accurate", "synthesized"],
    },
    {
      id: "finding-obs-deteriorating",
      label: "Tracks the observations trending the wrong way (NEWS2 rising)",
      category: "findings",
      weight: 5,
      triggers: [
        [["news2", "news"], ["rising", "climbing", "increasing", "6"]],
        // Raw last-observation value removed: the PROGRESS auto-vitals line
        // always prints "BP <sys>/<dia>", which must not satisfy this alone.
        [["bp"], ["falling", "dropping", "drifting", "down"]],
        [["tachycardia", "tachycardic"], ["hypotension", "hypotensive"]],
      ],
      explanation:
        "HR 108 → 126 and BP 138/82 → 98/60 overnight, NEWS2 3 → 6, while the chart said 'comfortable'. The vitals tell the same story as the gases; a good note reads them as a trend, not a snapshot.",
      pdqi: ["up-to-date", "thorough"],
    },
    {
      id: "assessment-mesenteric-ischaemia",
      label: "Names the diagnosis: acute mesenteric ischaemia",
      category: "assessment",
      weight: 12,
      triggers: [
        [
          ["mesenteric"],
          ["ischaemia", "ischemia", "ischaemic", "ischemic", "occlusion", "embolus", "embolism", "infarction"],
        ],
        [["ischaemic", "ischemic"], ["bowel", "gut"]],
        [["bowel", "gut"], ["infarction", "infarcted", "dying", "dead"]],
      ],
      explanation:
        "Sudden severe pain out of proportion, AF off anticoagulation, rising lactate with metabolic acidosis and a bloody stool: this is acute (embolic) mesenteric ischaemia until proven otherwise. Naming it is what converts a drift towards discharge into a time-critical pathway.",
      pdqi: ["accurate", "synthesized"],
    },
    {
      id: "assessment-challenges-gastroenteritis",
      label: "Explicitly challenges the gastroenteritis label",
      category: "assessment",
      weight: 6,
      triggers: [
        [
          ["gastroenteritis"],
          ["not", "against", "unlikely", "revisit", "revisited", "reconsider", "query", "abandon"],
        ],
      ],
      explanation:
        "One vomit and a single loose stool at onset — then nothing — is gut-emptying at the moment of arterial occlusion, not an infective illness. The stool culture even says so ('a solitary loose stool is weak support'). The label must be revisited in writing, or it survives another shift.",
      pdqi: ["synthesized", "internally consistent"],
    },
    {
      id: "plan-ct-angiogram",
      label: "Plans an urgent CT angiogram of the mesenteric vessels",
      category: "plan",
      weight: 15,
      critical: true,
      triggers: [
        [["ct"], ["angiogram", "angiography", "angio", "mesenteric", "contrast"]],
        [["cta"]],
      ],
      explanation:
        "The diagnostic test for mesenteric ischaemia is a CT angiogram, urgently — not a stool culture and not another fluid bolus. Even the AXR report says plain film does not exclude ischaemia and names CT angiography as the investigation of choice. Every hour of delay is bowel.",
      pdqi: ["useful", "up-to-date"],
    },
    {
      id: "plan-senior-surgical-review",
      label: "Escalates now: surgical registrar / consultant review",
      category: "plan",
      weight: 8,
      triggers: [
        [
          ["registrar", "consultant", "senior", "vascular", "surgical team"],
          [
            "review",
            "reviewed",
            "discuss",
            "discussed",
            "inform",
            "informed",
            "aware",
            "contact",
            "escalate",
            "escalated",
          ],
        ],
      ],
      explanation:
        "A 77-year-old with probable dead gut needs a senior surgical opinion and early theatre/vascular awareness this morning, not 'ward team to review'. The chart shows three separate deferrals overnight; the note must break that chain.",
      pdqi: ["useful", "up-to-date"],
    },
    {
      id: "plan-nbm-resuscitation",
      label: "Prepares for theatre: NBM, resuscitation, broad-spectrum antibiotics",
      category: "plan",
      weight: 6,
      triggers: [
        [
          ["nbm", "nil by mouth"],
          ["fluids", "fluid", "crystalloid", "resuscitation", "antibiotics"],
        ],
      ],
      explanation:
        "The ward round plan said 'light diet and home tomorrow'. If this is ischaemic bowel he needs the opposite: nil by mouth, aggressive crystalloid resuscitation with hourly urine output, and broad-spectrum antibiotics for bacterial translocation.",
      pdqi: ["useful", "thorough"],
    },
    {
      id: "plan-anticoagulation-decision",
      label: "Plans the anticoagulation decision (heparin peri-operatively, restart for AF)",
      category: "plan",
      weight: 5,
      triggers: [
        [["heparin"]],
        [
          ["anticoagulation", "anticoagulate", "anticoagulant"],
          ["restart", "start", "resume", "once", "timing", "plan", "discuss", "decision"],
        ],
      ],
      explanation:
        "Embolic mesenteric ischaemia is treated with anticoagulation (IV heparin, timed with the surgical team), and the underlying failure — AF left off anticoagulation since May — must be fixed before discharge, not left to another DNA'd appointment.",
      pdqi: ["useful", "thorough"],
    },
  ],
  modelNote: `POST-TAKE REVIEW ADDENDUM — General Surgery (day 1)

77M clerked overnight as ?gastroenteritis: sudden severe generalised abdominal pain, one vomit, a single loose stool. Pain is OUT OF PROPORTION to examination — 10/10 despite escalating morphine (40 mg/24 h) while the abdomen stays soft and barely tender. The escalating opioid requirement is a red flag, not an endpoint.

Background: AF with previous TIA. Warfarin stopped 22/05 after epistaxis and never restarted (review DNA'd) — he is not anticoagulated: an embolic source for mesenteric occlusion.

Overnight: dark stool with fresh blood (nursing note 05:20). Lactate rising across serial gases 2.1 -> 2.9 -> 3.6 -> 4.4 with metabolic acidosis (pH 7.27, BE -9). HR 126 (AF), BP 98/60 — NEWS2 6 and rising. Creatinine 118, urea 11.8: AKI. Amylase only mildly raised (142) — not pancreatitis, and itself recognised in gut ischaemia.

Impression
Acute mesenteric ischaemia (likely embolic, AF off anticoagulation) until proven otherwise. A single loose stool does not support gastroenteritis — that label must be revisited.

Plan
1. URGENT CT angiogram of the mesenteric vessels now — discuss directly with radiology.
2. Immediate surgical registrar and consultant review; inform theatres and vascular surgery.
3. NBM, IV crystalloid resuscitation, broad-spectrum antibiotics, urinary catheter with hourly urine output.
4. Repeat gas in 1 h; trend lactate.
5. IV heparin timing with the operating team once CT confirms; plan restart of long-term anticoagulation for AF before discharge.`,
};
