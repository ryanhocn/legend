import type { CaseRubric } from "../../../types";

/**
 * Scoring rubric for a day-1 ward-round / progress note on the
 * NSTEMI-as-dyspepsia case. Items reference facts that exist in the chart
 * (documents.ts / encounters.ts); triggers list the phrasings a student might
 * reasonably use. Weights: safety catches heaviest (the un-actioned troponin,
 * the aspirin allergy against the clerking plan, renal dosing of the
 * anticoagulant), then diagnosis and disposition, then supporting findings.
 *
 * All content is fabricated for education and simulation only. Not for clinical use.
 */
export const caseNstemi001Rubric: CaseRubric = {
  caseId: "nstemi001",
  noteType: "Progress Note",
  task: { code: "ward", label: "WARD ROUND REVIEW", minGrade: "fy" },
  wordBand: { target: 150, max: 250 },
  sections: [
    ["impression", "assessment", "diagnosis"],
    ["plan"],
  ],
  items: [
    {
      id: "safety-troponin-rise",
      label: "Actions the un-reviewed troponin rise (38 → 612)",
      category: "safety",
      weight: 15,
      critical: true,
      triggers: [
        [["troponin"], ["612"]],
        [["troponin"], ["dynamic", "rise", "risen", "rising"]],
        [["troponin"], ["significantly", "markedly"], ["raised", "elevated", "increased"]],
      ],
      explanation:
        "The 6-hour troponin resulted at 01:12 at 612 ng/L (from 38) and nobody actioned it: the night SHO's draft says 'chase 23:50 troponin' and the morning nursing note says the results are 'on the system for day-team review'. A dynamic rise cannot be explained away as CKD — chronic renal impairment gives a stable elevation, not a 16-fold climb. A note that does not surface and act on this number sends her home with an untreated infarct.",
      pdqi: ["accurate", "up-to-date", "useful"],
    },
    {
      id: "safety-aspirin-allergy",
      label: "Catches the aspirin allergy against the clerking loading plan",
      category: "safety",
      weight: 15,
      critical: true,
      triggers: [
        [["aspirin"], ["allergy", "allergic", "angioedema", "avoid", "contraindicated"]],
        [["clopidogrel", "ticagrelor"]],
      ],
      explanation:
        "The clerking plan reads 'load aspirin 300 mg PO ... per ACS pathway' — but the chart documents an aspirin allergy with angioedema and bronchospasm (allergy band applied at triage, confirmed by pharmacy this morning). Antiplatelet loading must use clopidogrel 300 mg per the allergy pathway instead. Carrying the clerking plan forward unchanged re-exposes her to the error.",
      pdqi: ["accurate", "useful"],
    },
    {
      id: "safety-renal-dosing",
      label: "Adjusts the anticoagulant for renal impairment (eGFR 28)",
      category: "safety",
      weight: 12,
      critical: true,
      triggers: [
        [
          ["egfr", "renal", "renally", "kidney", "aki", "ckd"],
          ["fondaparinux", "enoxaparin", "heparin", "anticoagulation", "anticoagulant"],
        ],
        [["fondaparinux", "enoxaparin"], ["avoid", "adjusted", "adjust", "reduced", "caution"]],
      ],
      explanation:
        "The clerking plan reaches for 'fondaparinux 2.5 mg SC per ACS pathway', but her eGFR is 28 and falling (27 on the 23:50 sample). Pathway-dose fondaparinux is not safe to default to in severe renal impairment: the anticoagulant choice and dose must be made against her renal function (dose-adjusted enoxaparin or unfractionated heparin, discussed with cardiology).",
      pdqi: ["accurate", "thorough", "useful"],
    },
    {
      id: "safety-hold-metformin",
      label: "Holds metformin (AKI, eGFR 28, possible contrast)",
      category: "safety",
      weight: 8,
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
          ],
        ],
      ],
      explanation:
        "Metformin was still given at 08:05 this morning with an eGFR of 28 — pharmacy recommend holding it (lactic acidosis risk, and contrast angiography may be coming). The note must document the hold; the ramipril deserves the same review while the AKI resolves.",
      pdqi: ["accurate", "up-to-date"],
    },
    {
      id: "finding-atypical-presentation",
      label: "Names the atypical presentation as an anginal equivalent",
      category: "findings",
      weight: 8,
      triggers: [
        [["atypical", "anginal equivalent", "angina equivalent"]],
        [["diabetic", "diabetes"], ["silent", "masked", "blunted"]],
      ],
      explanation:
        "Epigastric burning with nausea and clamminess in a 57-year-old diabetic is a recognised anginal equivalent — diabetics disproportionately present without classic chest pain. Naming the atypia is what stops the next reader re-anchoring on 'indigestion'.",
      pdqi: ["thorough", "synthesized"],
    },
    {
      id: "finding-exertional-pattern",
      label: "Surfaces the exertional pattern (including the GP letter)",
      category: "findings",
      weight: 8,
      triggers: [
        [["exertion", "exertional", "on walking", "with walking", "climbing", "uphill", "up the hill"]],
      ],
      explanation:
        "The symptom is reproducibly brought on by walking uphill and relieved by rest — it is in the triage note, the clerking, and was already sitting in the GP letter of 15/06. An exertional, rest-relieved pattern is angina's signature; reflux does not care about hills.",
      pdqi: ["thorough", "synthesized"],
    },
    {
      id: "finding-ecg-changes",
      label: "Reports the dynamic T-wave inversion (V4–V6, deepening)",
      category: "findings",
      weight: 8,
      triggers: [
        [["t wave inversion", "t wave inversions", "inverted t waves", "twi"]],
        [["ecg"], ["dynamic", "deepening", "evolving", "ischaemia", "ischaemic", "ischemic"]],
      ],
      explanation:
        "The ED trace showed 1–2 mm T-wave inversion V4–V6, dismissed as 'non-specific' with no prior for comparison; the 06:45 repeat shows it deepening to 3–4 mm across V3–V6, and the 11/2025 ECG on file was normal — so the change is both new and dynamic. The cardiology overread says exactly this.",
      pdqi: ["accurate", "up-to-date"],
    },
    {
      id: "finding-risk-profile",
      label: "Assembles the cardiovascular risk profile",
      category: "findings",
      weight: 6,
      triggers: [
        [["risk profile", "risk factors"]],
        [["father"], ["mi", "myocardial", "infarction", "54"]],
        [["pack years", "pack year", "smoker", "smoking"]],
      ],
      explanation:
        "T2DM, hypertension, hyperlipidaemia, 20 pack-years and a father dead of MI at 54 — the April GP letter calls her calculated cardiovascular risk high. The pre-test probability lives in the outpatient records, not the admission bloods.",
      pdqi: ["thorough", "synthesized"],
    },
    {
      id: "finding-aki-on-ckd",
      label: "Recognizes the AKI on CKD (creatinine 168, eGFR 28 from 52)",
      category: "findings",
      weight: 6,
      triggers: [
        [["aki", "acute kidney injury"]],
        // Interpretive words required: the PROGRESS template auto-embeds the raw
        // "eGFR 28" / "Creatinine 168" lab lines, which must not score alone.
        [["egfr"], ["28", "27"], ["baseline", "52", "ckd", "chronic", "worsened", "worsening"]],
        [["creatinine"], ["168", "171"], ["baseline", "98", "ckd", "chronic", "risen", "rising", "acute"]],
      ],
      explanation:
        "Creatinine 168 against a baseline of 98 (April), eGFR 28 from 52: an AKI on CKD 3a. It is not a footnote — it drives the anticoagulant dosing, the metformin hold, and the timing of any contrast angiography.",
      pdqi: ["thorough", "accurate"],
    },
    {
      id: "assessment-nstemi",
      label: "States the diagnosis: NSTEMI / ACS",
      category: "assessment",
      weight: 10,
      triggers: [
        [["nstemi", "acs", "acute coronary syndrome", "non st elevation"]],
      ],
      explanation:
        "Dynamic troponin rise + new deepening T-wave inversion + an exertional anginal-equivalent history in a high-risk diabetic = NSTEMI. Everything needed for the diagnosis is already in the chart; no single person has put it together.",
      pdqi: ["accurate", "synthesized"],
    },
    {
      id: "assessment-not-dyspepsia",
      label: "Rejects the dyspepsia/GORD label explicitly",
      category: "assessment",
      weight: 6,
      triggers: [
        [
          ["dyspepsia", "gord", "reflux", "indigestion", "gastritis"],
          ["not", "against", "unlikely", "mislabelled", "mislabeled", "rejected", "rather than"],
        ],
      ],
      explanation:
        "'Settled with Gaviscon' is doing a lot of anchoring in this chart — antacid 'response' is common in ACS and proves nothing. The label must be explicitly retired, or the next shift inherits it.",
      pdqi: ["synthesized", "internally consistent"],
    },
    {
      id: "plan-cardiology-referral",
      label: "Refers urgently to cardiology",
      category: "plan",
      weight: 10,
      triggers: [
        [
          ["cardiology", "cardiologist"],
          ["refer", "referral", "referred", "discuss", "discussed", "discussion", "review"],
        ],
      ],
      explanation:
        "No cardiology referral has been made at any point — the repeat ECG report even recommends one. An NSTEMI needs urgent cardiology input for risk stratification and inpatient angiography (timed against her renal function).",
      pdqi: ["useful", "up-to-date"],
    },
    {
      id: "plan-antiplatelet-loading",
      label: "Loads the correct antiplatelet (clopidogrel, not aspirin)",
      category: "plan",
      weight: 8,
      triggers: [
        [["load", "loading", "loaded"], ["clopidogrel", "ticagrelor", "antiplatelet"]],
        [["clopidogrel", "ticagrelor"], ["300", "180"]],
      ],
      explanation:
        "ACS medical management must start now, not after the round: antiplatelet loading with clopidogrel 300 mg (aspirin is contraindicated by her allergy), alongside a renally-appropriate anticoagulant per the safety items above.",
      pdqi: ["useful", "accurate"],
    },
    {
      id: "plan-monitoring",
      label: "Puts her on cardiac monitoring with serial ECGs/troponin",
      category: "plan",
      weight: 5,
      triggers: [
        [["repeat", "serial"], ["troponin", "ecg", "ecgs"]],
        [["monitoring", "monitored", "telemetry"]],
      ],
      explanation:
        "She has had two episodes in twelve hours and is currently on a general AMU bay on 4-hourly obs. Continuous cardiac monitoring, serial ECGs and a repeat troponin — with immediate escalation for further pain — is the floor, not the ceiling.",
      pdqi: ["useful", "thorough"],
    },
  ],
  modelNote: `WARD REVIEW — General Medicine (day 1)

57F admitted with "indigestion": 3 weeks of exertional epigastric burning (GP letter 15/06 — comes on up the hill, settles with rest), then a 40-minute episode at rest with nausea and clamminess, and a further episode at 23:30. Atypical presentation — an anginal equivalent in a diabetic. Strong risk profile: T2DM, hypertension, hyperlipidaemia, ex-smoker 20 pack-years, father's MI at 54.

Labelled dyspepsia in ED, but the chart disagrees: troponin 38 then 612 overnight — a dynamic rise, resulted 01:12, not yet actioned. Repeat ECG: deepening T-wave inversion V3–V6 (new since the normal 2025 trace). Apyrexial, CRP normal.

Renal: AKI on CKD — creatinine 168 (baseline 98), eGFR 28 (52 in April).

Impression
NSTEMI, initially mislabelled as dyspepsia — the GORD label does not survive the troponin trend.

Plan
1. Urgent cardiology referral — for inpatient angiography once renal function reviewed.
2. Aspirin ALLERGY (angioedema) — do not give aspirin; load clopidogrel 300 mg instead.
3. Anticoagulation dosed for renal function: eGFR 28 — avoid pathway-dose fondaparinux; dose-adjusted enoxaparin after discussion with cardiology.
4. HOLD metformin (AKI, eGFR 28, possible contrast); hold ramipril; recheck U&E today.
5. Continuous cardiac monitoring; repeat troponin and serial ECGs; immediate escalation with any further pain.`,
};
