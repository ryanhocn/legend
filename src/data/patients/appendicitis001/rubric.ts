import type { CaseRubric } from "../../../types";

/**
 * Scoring rubric for the day-3 ward-round / progress note on the atypical
 * appendicitis case. Items reference facts that exist in the chart
 * (documents.ts / encounters.ts); triggers list the phrasings a student might
 * reasonably use. Weights: the safety catches heaviest (the unread trend must
 * be ACTED on — senior review + CT; the metformin/AKI and codeine-masking
 * hazards), then the revised diagnosis, then supporting findings.
 *
 * All content is fabricated for education and simulation only. Not for clinical use.
 */
export const caseAppendicitis001Rubric: CaseRubric = {
  caseId: "appendicitis001",
  noteType: "Progress Note",
  task: { code: "ward", label: "WARD ROUND REVIEW", minGrade: "fy" },
  wordBand: { target: 150, max: 250 },
  sections: [
    ["impression", "assessment", "diagnosis"],
    ["plan"],
  ],
  items: [
    {
      id: "finding-trend",
      label: "Reads the serial bloods as a rising trend, not a snapshot",
      category: "findings",
      weight: 8,
      triggers: [
        [
          ["wcc", "white cell", "crp", "inflammatory markers"],
          [
            "rising",
            "risen",
            "rise",
            "increasing",
            "increased",
            "climbing",
            "trending",
            "serial",
            "uptrend",
            "worsening",
          ],
        ],
      ],
      explanation:
        "WCC 11.9 → 14.6 → 17.8 and CRP 46 → 118 → 203 across three panels in two days. Each snapshot was individually explainable; the TREND is not. Yesterday's results were 'filed without comment' and this morning's carry 'no review documented' — the note must be the place the trend finally gets read.",
      pdqi: ["up-to-date", "synthesized"],
    },
    {
      id: "finding-atypical-rif",
      label: "Names the right-sided signs and why they are so quiet (retrocaecal)",
      category: "findings",
      weight: 7,
      triggers: [
        [
          ["rif", "right iliac fossa", "right sided", "right side"],
          ["fullness", "tenderness", "tender", "discomfort", "pain", "ache"],
        ],
        [["retrocaecal", "retrocecal"]],
        [["atypical"]],
      ],
      explanation:
        "A retrocaecal appendix lies behind the caecum, so the classic RIF guarding never appears: she has only 'mild RIF fullness' on a soft abdomen, examined properly once at clerking. In older adults appendicitis is atypical in up to half of cases — quiet signs are expected, not reassuring.",
      pdqi: ["thorough", "synthesized"],
    },
    {
      id: "finding-fever-news",
      label: "Tracks the creeping pyrexia and the rising NEWS2",
      category: "findings",
      weight: 6,
      triggers: [
        [
          ["temperature", "temp", "pyrexia"],
          ["creeping", "rising", "trending", "climbing", "low grade", "38 1", "spike", "spiking"],
        ],
        [["news", "news2"], ["5", "rising", "climbing", "increasing"]],
      ],
      explanation:
        "T 37.4 at triage, 37.6, 37.8, 37.9, 38.0, 38.1 overnight with HR up to 102: NEWS2 has gone 1 → 5 during an admission labelled constipation. The obs chart tells the same story as the bloods.",
      pdqi: ["up-to-date", "thorough"],
    },
    {
      id: "finding-anorexia",
      label: "Notices she has stopped eating (the food chart)",
      category: "findings",
      weight: 5,
      triggers: [
        [
          [
            "stopped eating",
            "not eating",
            "off food",
            "off her food",
            "anorexia",
            "anorexic",
            "food chart",
            "not eaten",
            "nil eaten",
            "poor oral intake",
            "refusing food",
          ],
        ],
      ],
      explanation:
        "The food chart shows a few mouthfuls on Saturday, sips of tea Sunday, nil since. Anorexia is one of the most reliable features of appendicitis in older adults — and it lives in the nursing notes, not the doctors' entries.",
      pdqi: ["thorough", "up-to-date"],
    },
    {
      id: "finding-aki",
      label: "Identifies the AKI against her documented baseline",
      category: "findings",
      weight: 7,
      triggers: [
        [["aki", "acute kidney injury"]],
        // Interpretive words required: the PROGRESS template auto-embeds the raw
        // "Creatinine 148" / "eGFR 30" lab lines, which must not score alone.
        [["creatinine"], ["rising", "risen", "climbing", "increasing", "increased", "baseline", "trend", "trending"]],
        [["egfr"], ["30"], ["baseline", "fallen", "falling", "dropped", "deteriorated", "deteriorating"]],
      ],
      explanation:
        "Creatinine 92 → 121 → 148 against a baseline of 76 (annual diabetes bloods, 02/04/2026) with eGFR now 30 and urine output falling overnight. The admission value already sat above baseline; the comparison lives in the outpatient labs.",
      pdqi: ["accurate", "thorough"],
    },
    {
      id: "finding-exam-gap",
      label: "Closes the examination gap (PR never chased; abdomen re-examined)",
      category: "findings",
      weight: 5,
      triggers: [
        [
          ["pr", "rectal"],
          [
            "declined",
            "not chased",
            "never chased",
            "never done",
            "not done",
            "not performed",
            "outstanding",
            "repeat",
            "repeated",
            "complete",
            "completed",
          ],
        ],
        [["re examined", "re examine", "re examination", "examined once"]],
      ],
      explanation:
        "The clerking documented 'PR declined — to be repeated on the ward round' and no one returned to it; the abdomen has had one proper examination in two days. An unexamined patient with a diverging chart is an unfinished assessment, and the note should say so.",
      pdqi: ["thorough", "internally consistent"],
    },
    {
      id: "finding-axr-context",
      label: "Reads the AXR in context (faecal loading excludes nothing)",
      category: "findings",
      weight: 5,
      triggers: [
        [
          ["axr", "abdominal film", "plain film", "x ray", "xray", "radiograph"],
          [
            "does not exclude",
            "doesn t exclude",
            "cannot exclude",
            "can not exclude",
            "not exclude",
            "not excluded",
            "falsely reassuring",
            "not reassuring",
          ],
        ],
      ],
      explanation:
        "The AXR was the anchor's best evidence — but the radiologist's own report says the appendix is not assessable on plain film and a normal AXR does not exclude early intra-abdominal inflammation. Faecal loading is near-universal in her age group.",
      pdqi: ["accurate", "synthesized"],
    },
    {
      id: "assessment-appendicitis",
      label: "Names the working concern: ?appendicitis / intra-abdominal sepsis",
      category: "assessment",
      weight: 10,
      triggers: [
        [["appendicitis", "appendix", "appendicular"]],
        [["intra abdominal", "intraabdominal"], ["sepsis", "infection", "source", "collection"]],
      ],
      explanation:
        "Rising inflammatory markers + creeping fever + anorexia + right-sided signs in a 74-year-old is atypical (retrocaecal) appendicitis until proven otherwise. Naming it is what converts a drifting admission into a plan.",
      pdqi: ["accurate", "synthesized"],
    },
    {
      id: "assessment-label",
      label: "Explicitly retires the 'constipation' label",
      category: "assessment",
      weight: 6,
      triggers: [
        [
          ["constipation"],
          [
            "label",
            "no longer",
            "no longer fits",
            "unlikely",
            "against",
            "reconsider",
            "reconsidered",
            "revise",
            "revised",
            "does not fit",
            "doesn t fit",
            "not fit",
            "more than",
            "not explain",
            "unsafe",
          ],
        ],
      ],
      explanation:
        "The label was blessed early (AXR, a telephone consultant agreement) and then inherited by every subsequent entry. A safe note doesn't just add a new diagnosis — it explicitly retires the old one so the next reader cannot re-anchor.",
      pdqi: ["synthesized", "internally consistent"],
    },
    {
      id: "assessment-sepsis",
      label: "Recognizes evolving sepsis / perforation risk in an older diabetic",
      category: "assessment",
      weight: 6,
      triggers: [
        [["sepsis", "septic"]],
        [["perforation", "perforated", "abscess", "collection"]],
      ],
      explanation:
        "NEWS2 5, T 38.1, HR 102, CRP 203 and an AKI: this is evolving intra-abdominal sepsis. Perforation rates in appendicitis rise steeply over 70, and diabetes both blunts symptoms and accelerates deterioration.",
      pdqi: ["accurate", "synthesized"],
    },
    {
      id: "plan-senior-review",
      label: "Escalates for senior surgical review TODAY",
      category: "plan",
      weight: 10,
      critical: true,
      triggers: [
        [
          ["registrar", "consultant", "senior", "surgical team"],
          [
            "review",
            "reviewed",
            "discuss",
            "discussed",
            "inform",
            "informed",
            "escalate",
            "escalated",
            "aware",
            "now",
            "today",
          ],
        ],
      ],
      explanation:
        "Two days of rising markers have resulted with no senior or surgical review — the weekend rota deferred the consultant round to Monday and each contact deferred to the next round. The single most important action in this note is escalation: registrar/consultant review this morning, not 'continue to observe'.",
      pdqi: ["useful", "up-to-date"],
    },
    {
      id: "plan-urgent-ct",
      label: "Requests urgent CT abdomen/pelvis",
      category: "plan",
      weight: 10,
      critical: true,
      triggers: [
        [["ct", "computed tomography"], ["abdomen", "abdo", "abdominal", "pelvis", "imaging"]],
      ],
      explanation:
        "No cross-sectional imaging has been requested in two days despite the trend. CT abdomen/pelvis is the investigation of choice for suspected appendicitis in older adults (ultrasound performs poorly, and a retrocaecal appendix hides from examination). Renal function needs flagging on the request — but AKI modifies the contrast discussion, it does not cancel the scan.",
      pdqi: ["useful", "accurate"],
    },
    {
      id: "plan-supportive",
      label: "Starts sepsis-facing supportive care (NBM, IV fluids, cultures, lactate)",
      category: "plan",
      weight: 5,
      triggers: [
        [["nbm", "nil by mouth"]],
        [["blood cultures", "cultures"]],
        [["lactate"]],
        [["iv fluids", "intravenous fluids", "crystalloid", "fluid resuscitation"]],
      ],
      explanation:
        "She may be heading to theatre and has an AKI on nil intake: NBM, IV fluids, blood cultures before any antibiotics, a lactate, repeat U&E and strict fluid balance are the groundwork. No microbiology has been sent at all this admission.",
      pdqi: ["useful", "thorough"],
    },
    {
      id: "safety-metformin-aki",
      label: "Holds metformin against the AKI (and flags it before any contrast)",
      category: "safety",
      weight: 12,
      critical: true,
      triggers: [
        [
          ["metformin"],
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
        [["metformin"], ["contrast"]],
      ],
      explanation:
        "She took metformin again at 08:05 this morning with a creatinine of 148 (baseline 76) and eGFR 30 — renal clearance is failing exactly as sepsis raises the lactic acidosis risk, and a contrast CT is the obvious next step. Pharmacy flagged the hold at med rec this morning; the note must carry it into the plan (ramipril should pause too).",
      pdqi: ["accurate", "up-to-date"],
    },
    {
      id: "safety-analgesia-masking",
      label: "Recognizes regular codeine is blunting the pain story (and constipating her)",
      category: "safety",
      weight: 10,
      critical: true,
      triggers: [
        [
          ["codeine", "opioid", "opiate", "analgesia"],
          [
            "mask",
            "masks",
            "masking",
            "masked",
            "blunt",
            "blunting",
            "blunted",
            "misleading",
            "falsely reassuring",
          ],
        ],
        [
          ["codeine", "opioid", "opiate"],
          [
            "stop",
            "stopped",
            "hold",
            "held",
            "withhold",
            "withheld",
            "wean",
            "weaned",
            "discontinue",
            "discontinued",
          ],
        ],
      ],
      explanation:
        "Every reassuring pain score (2–3/10) in this chart was recorded shortly after QDS codeine — 'pain controlled' has been doing the work of 'patient improving' while the obs deteriorate. The codeine is also feeding the very constipation the label rests on. Stop it, use paracetamol alone, and reassess the unmasked abdomen.",
      pdqi: ["accurate", "internally consistent"],
    },
  ],
  modelNote: `WARD ROUND — General Surgery (day 3)

74F admitted Saturday as "constipation": bowels not opened, off food, vague right-sided discomfort. The constipation label no longer fits the chart.

Serial bloods rising: WCC 11.9 → 14.6 → 17.8; CRP 46 → 118 → 203. Temperature creeping up — 38.1 overnight, HR 102, NEWS2 5. She has stopped eating (food chart: sips only since Saturday). Regular codeine is masking the pain story and feeding the constipation. Examination gap: PR declined at clerking and never chased; abdomen re-examined this morning — RIF fullness, now tender. AXR faecal loading does not exclude appendicitis. AKI: creatinine 148 from baseline 76, eGFR 30.

Impression
Likely atypical (retrocaecal) appendicitis in an older diabetic — evolving intra-abdominal sepsis, risk of perforation. Constipation label unsafe.

Plan
1. Senior surgical registrar review now — discussed and accepted.
2. Urgent CT abdomen/pelvis today (renal function flagged re contrast).
3. HOLD metformin and ramipril (AKI, eGFR 30).
4. Stop regular codeine; paracetamol only, reassess the abdomen unmasked.
5. NBM, IV fluids, blood cultures and lactate; repeat U&E, strict fluid balance.
6. Update patient and daughter. VTE review with theatre in mind.`,
};
