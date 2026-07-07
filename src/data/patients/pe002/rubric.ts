import type { CaseRubric } from "../../../types";

/**
 * Scoring rubric for the ST3-level ED reassessment on the high-risk pulmonary
 * embolism case (Merrick, Joanne, 48F). The teaching spine is a
 * symptom-to-specialty reflex: a collapse with a few limb jerks is railroaded
 * onto the "?first seizure" pathway and parked "awaiting neurology" while a
 * massive PE declares itself in the obs, the ECG and the gas. The registrar's
 * job is to reject the label, risk-stratify as HIGH-RISK PE (sustained
 * hypotension + RV strain), start empirical anticoagulation, weigh reperfusion
 * against a 3-week-old major operation, image, and escalate — not wait.
 *
 * Weights load the four critical catches (severity recognition, anticoagulation,
 * the reperfusion/contraindication call, and escalating instead of waiting),
 * then the de-anchoring findings, then the supporting synthesis and plan.
 *
 * Trigger hygiene: the PROGRESS SmartText auto-embeds the vitals line and every
 * bloods row (test, value, range, and flag words like "High"). No trigger here
 * pairs a test name or a template word with data the template can paste; each
 * requires an interpretive token the template cannot emit. Verified by
 * progress-autofill.test.ts.
 *
 * All content is fabricated for education and simulation only. Not for clinical use.
 */
export const casePe002Rubric: CaseRubric = {
  caseId: "pe002",
  noteType: "ED Reassessment",
  task: { code: "ed", label: "ED RESUS REASSESSMENT", minGrade: "st3" },
  wordBand: { target: 240, max: 340 },
  sections: [
    ["impression", "assessment", "diagnosis"],
    ["plan"],
  ],
  items: [
    {
      id: "safety-highrisk-pe",
      label: "Recognises HIGH-RISK / massive PE (hypotension + RV strain)",
      category: "safety",
      weight: 15,
      critical: true,
      triggers: [
        [
          [
            "high risk",
            "highrisk",
            "massive",
            "sub massive",
            "submassive",
            "haemodynamic",
            "hemodynamic",
            "haemodynamically unstable",
            "hemodynamically unstable",
            "obstructive shock",
          ],
          [
            "pe",
            "pulmonary embolism",
            "pulmonary embolus",
            "pulmonary emboli",
            "embolism",
            "embolus",
          ],
        ],
      ],
      explanation:
        "Sustained hypotension (100/64 → 86/52 through the morning, worse after a fluid bolus) with hypoxia and RV strain is a HIGH-RISK (massive) PE — the time-critical category. Naming it as such is what unlocks emergency reperfusion and a resus-room response rather than a majors cubicle 'awaiting neurology'.",
      pdqi: ["accurate", "synthesized"],
    },
    {
      id: "safety-anticoagulation",
      label: "Starts empirical anticoagulation (UFH preferred) without waiting for imaging",
      category: "safety",
      weight: 13,
      critical: true,
      triggers: [
        [
          [
            "heparin",
            "ufh",
            "unfractionated",
            "anticoagulation",
            "anticoagulate",
            "anticoagulant",
            "lmwh",
            "low molecular weight heparin",
            "dalteparin",
            "enoxaparin",
            "tinzaparin",
          ],
          [
            "start",
            "started",
            "starting",
            "commence",
            "commenced",
            "empirical",
            "empirically",
            "therapeutic",
            "treatment dose",
            "give",
            "given",
            "infusion",
            "immediately",
          ],
        ],
      ],
      explanation:
        "With PE the leading diagnosis, empirical anticoagulation should not wait for the CTPA. Unfractionated heparin is preferred here over LMWH: it is titratable and rapidly reversible, keeping the door open for thrombolysis in a patient who is both high-risk and recently post-operative. No anticoagulation has been prescribed since arrival.",
      pdqi: ["accurate", "useful"],
    },
    {
      id: "safety-reperfusion",
      label: "Weighs thrombolysis against the recent-surgery contraindication",
      category: "safety",
      weight: 12,
      critical: true,
      triggers: [
        [
          [
            "thrombolysis",
            "thrombolyse",
            "thrombolytic",
            "alteplase",
            "tenecteplase",
            "tpa",
            "reperfusion",
            "embolectomy",
            "thrombectomy",
          ],
          [
            "contraindication",
            "contraindicated",
            "bleeding risk",
            "haemorrhage risk",
            "hemorrhage risk",
            "relative",
            "post operative",
            "postoperative",
            "recent surgery",
            "3 weeks",
            "surgery",
            "risk benefit",
            "weigh",
          ],
        ],
      ],
      explanation:
        "High-risk PE with obstructive shock is a thrombolysis indication, but she is 3 weeks from a prolonged laparoscopic hysterectomy — a relative contraindication. The registrar must actively weigh reperfusion (systemic thrombolysis, or catheter-directed therapy / embolectomy if bleeding risk is prohibitive) against that risk with a senior, not quietly skip the question.",
      pdqi: ["accurate", "synthesized"],
    },
    {
      id: "safety-escalate",
      label: "Escalates immediately — does not park the patient awaiting neurology",
      category: "safety",
      weight: 10,
      critical: true,
      triggers: [
        [
          [
            "critical care",
            "intensive care",
            "icu",
            "hdu",
            "medical registrar",
            "med reg",
            "consultant",
            "pert",
            "pe response team",
            "senior",
            "peri arrest",
            "peri-arrest",
            "resuscitation team",
          ],
        ],
        [
          ["neurology", "neurological"],
          [
            "not await",
            "without waiting",
            "do not wait",
            "dont wait",
            "cannot wait",
            "cancel",
            "stand down",
            "stop",
            "independent of",
            "regardless",
          ],
        ],
      ],
      explanation:
        "The safety failure in the chart is a deteriorating patient parked on the neurology list for nearly two hours. A high-risk PE needs the consultant, critical care and (where available) a PE response team now — escalation cannot be contingent on a neurology review that is not coming.",
      pdqi: ["useful", "up-to-date"],
    },
    {
      id: "finding-syncope-not-seizure",
      label: "Uses the collateral to refute a seizure (convulsive syncope)",
      category: "findings",
      weight: 8,
      triggers: [
        [["tongue"], ["no", "not", "without", "absent", "denies"]],
        [["post ictal", "postictal"], ["no", "not", "without", "absent", "none"]],
        [["convulsive syncope"]],
        [["incontinence"], ["no", "not", "without", "denies", "absent"]],
      ],
      explanation:
        "The ambulance sheet is the key document: no tongue-biting, no incontinence, no post-ictal phase, and she was talking normally within a minute. That is convulsive syncope (a few anoxic jerks after a faint), not epilepsy — the twist is a symptom-to-specialty reflex, and the collateral dismantles it.",
      pdqi: ["thorough", "synthesized"],
    },
    {
      id: "finding-hypotension",
      label: "Names the sustained, fluid-unresponsive hypotension",
      category: "findings",
      weight: 7,
      triggers: [
        [
          ["hypotension", "hypotensive"],
          [
            "sustained",
            "persistent",
            "refractory",
            "progressive",
            "worsening",
            "fluid unresponsive",
            "not responding",
            "unresponsive",
            "despite",
            "falling",
          ],
        ],
      ],
      explanation:
        "Systolic fell 100 → 86 across the morning and dropped further after a 250 ml bolus. Persistent hypotension that does not respond to fluid is the single obs that a first-fit label cannot explain and that defines this as high-risk PE — it must be stated, not averaged away.",
      pdqi: ["accurate", "up-to-date"],
    },
    {
      id: "finding-rv-strain-ecg",
      label: "Reads the ECG as right-heart strain, not 'nonspecific'",
      category: "findings",
      weight: 7,
      triggers: [
        [["s1q3t3", "s1 q3 t3"]],
        [
          ["t wave inversion", "t-wave inversion", "twi", "anterior t wave"],
          ["v1", "v2", "v3", "v4", "anterior", "right", "strain"],
        ],
        [["right heart strain", "rv strain", "right ventricular strain"]],
      ],
      explanation:
        "The ECG was signed off as 'anterior T-wave changes ?nonspecific', but sinus tachycardia with anterior TWI (V1–V4) and an S1Q3T3 pattern is textbook right-heart strain. Re-reading it in the context of the obs is the pivot from a neurology work-up to a PE.",
      pdqi: ["accurate", "internally consistent"],
    },
    {
      id: "finding-troponin-lactate",
      label: "Interprets the troponin and lactate as strain / hypoperfusion",
      category: "findings",
      weight: 6,
      triggers: [
        [
          ["troponin"],
          ["strain", "right heart", "right ventric", "rv", "demand", "cardiac strain"],
        ],
        [
          ["lactate"],
          [
            "hypoperfusion",
            "shock",
            "perfusion",
            "obstructive",
            "tissue",
            "end organ",
            "end-organ",
            "clearance",
          ],
        ],
      ],
      explanation:
        "The raised hs-troponin is not an ACS here — it is right-ventricular strain from acute pressure overload. The venous lactate of 3.4 with a respiratory alkalosis signals early hypoperfusion / obstructive shock. Read together they mark severity, and neither belongs to a seizure.",
      pdqi: ["synthesized", "accurate"],
    },
    {
      id: "finding-vte-risk",
      label: "Surfaces the buried VTE substrate (recent surgery, HRT, stopped prophylaxis)",
      category: "findings",
      weight: 8,
      triggers: [
        [
          ["hysterectomy", "tlh", "salpingo", "laparoscopic", "bso"],
          [
            "risk",
            "vte",
            "thrombosis",
            "provoked",
            "immobil",
            "recent",
            "weeks ago",
            "surgery",
            "prophylaxis",
          ],
        ],
        [
          ["hrt", "oestrogen", "estrogen", "estradiol", "norethisterone"],
          ["continued", "perioperative", "stopped", "risk", "vte", "provok"],
        ],
        [
          ["prophylaxis"],
          [
            "stopped",
            "not restarted",
            "discontinued",
            "discharge",
            "none",
            "not prescribed",
            "no extended",
            "omitted",
          ],
        ],
      ],
      explanation:
        "The provoking factors live in old encounters, not the admission: a prolonged (3 h 50) TLH+BSO three weeks ago, oral combined HRT deliberately continued through the perioperative period, extended VTE prophylaxis not prescribed at discharge, and a week of exertional breathlessness the GP called deconditioning. Together they make this a strongly provoked PE.",
      pdqi: ["thorough", "synthesized"],
    },
    {
      id: "assessment-pe",
      label: "Names pulmonary embolism as the leading diagnosis",
      category: "assessment",
      weight: 8,
      triggers: [
        [["pulmonary embolism", "pulmonary embolus", "pulmonary emboli", "pe"]],
      ],
      explanation:
        "Syncope + sustained hypotension + hypoxia + RV strain on ECG + recent major surgery with continued HRT: the synthesis is pulmonary embolism. The note must say so plainly instead of perpetuating the '?first seizure' label the pathway anchored on.",
      pdqi: ["accurate", "synthesized"],
    },
    {
      id: "assessment-risk-strat",
      label: "Documents structured risk stratification (Wells / high-risk category)",
      category: "assessment",
      weight: 6,
      triggers: [
        [["wells"]],
        [["pesi", "spesi"]],
        [["geneva"]],
        [
          ["high risk", "high-risk"],
          ["category", "categorise", "categorize", "class", "classification", "stratif"],
        ],
      ],
      explanation:
        "No structured stratification is documented anywhere in the chart. A Wells score (clinical signs of DVT, PE most likely, HR >100, recent surgery) puts her high probability, and sustained hypotension puts her in the HIGH-RISK category — the pre-test probability and the severity tier justify empirical treatment and reperfusion planning.",
      pdqi: ["thorough", "comprehensible"],
    },
    {
      id: "plan-imaging",
      label: "Plans appropriate imaging (CTPA, or bedside echo if too unstable)",
      category: "plan",
      weight: 6,
      triggers: [
        [["ctpa", "ct pulmonary angiogram", "ct pulmonary angiography"]],
        [
          ["bedside echo", "echocardiogram", "echocardiography", "point of care echo", "pocus"],
          ["rv", "right heart", "dilat", "strain", "unstable", "too unstable", "bedside"],
        ],
      ],
      explanation:
        "CTPA confirms the diagnosis, but only if she is stable enough to travel. If she is too unstable to leave resus, bedside echocardiography looking for RV dilatation / strain can support empirical thrombolysis without moving her. The note should name the imaging and the stability caveat.",
      pdqi: ["useful", "thorough"],
    },
    {
      id: "plan-resus",
      label: "Resuscitates: oxygen, IV access, continuous monitoring",
      category: "plan",
      weight: 5,
      triggers: [
        [
          ["oxygen"],
          ["titrate", "supplemental", "target", "high flow", "maintain", "saturations", "give"],
        ],
        [["iv access", "cannula", "wide bore", "large bore", "large-bore", "two cannulae"]],
        [["continuous", "cardiac"], ["monitor", "monitoring", "telemetry"]],
        [["resuscitation", "resuscitate", "abcde", "a to e"]],
      ],
      explanation:
        "She is peri-arrest physiology: high-flow oxygen titrated to saturations, large-bore IV access, continuous cardiac monitoring in resus, and cautious (not aggressive) fluids, since flooding an obstructed right ventricle can worsen output. Basic resuscitation runs in parallel with the diagnostic work.",
      pdqi: ["useful", "up-to-date"],
    },
    {
      id: "plan-review-rethink",
      label: "Stands down the first-seizure pathway and rationalises the work-up",
      category: "plan",
      weight: 4,
      triggers: [
        [
          ["first seizure", "first fit", "seizure pathway", "fit pathway", "seizure workup"],
          [
            "stand down",
            "stop",
            "cancel",
            "abandon",
            "rescind",
            "not",
            "incorrect",
            "wrong",
            "discontinue",
          ],
        ],
        [
          ["ct head", "neurology"],
          ["stand down", "cancel", "stop", "not needed", "unnecessary", "de-escalate", "deescalate"],
        ],
      ],
      explanation:
        "The CT head is normal and the collateral excludes a seizure, so the first-fit pathway (further neuro work-up, driving advice, neurology as owner) should be explicitly stood down. Leaving it live is what let the patient sit on the wrong queue while deteriorating.",
      pdqi: ["internally consistent", "useful"],
    },
  ],
  modelNote: `ED RESUS REASSESSMENT — Emergency Medicine

IMPRESSION
48F, collapse at work with brief LOC and a few limb jerks — triaged "?first seizure", but this is a high-risk (massive) pulmonary embolism, not epilepsy. The ambulance collateral refutes a seizure: no tongue-biting, no incontinence, no post-ictal phase, talking within a minute — convulsive syncope. She has persistent hypotension, worsening despite a fluid bolus, with sinus tachycardia and hypoxia on air. The ECG shows anterior T-wave inversion (V1–V4) and S1Q3T3 — right heart strain, not "nonspecific". The troponin reflects right-heart strain and the venous lactate marks hypoperfusion; the gas shows a respiratory alkalosis. CT head is normal. The substrate is buried in old notes: recent major surgery (TLH+BSO 3 weeks ago), oral HRT continued perioperatively, extended VTE prophylaxis not prescribed at discharge, and a preceding week of exertional breathlessness with right calf ache. Wells score 7 — high probability, high-risk category on sustained hypotension.

PLAN
1. Escalate to critical care and the medical registrar now; do not await neurology.
2. Resuscitate: high-flow oxygen to target saturations, large-bore IV access, continuous cardiac monitoring, cautious fluids.
3. Start empirical unfractionated heparin infusion immediately (titratable and reversible if reperfusion follows).
4. Consider thrombolysis, weighing the relative contraindication of surgery 3 weeks ago — a consultant-level decision.
5. Urgent CTPA if stable enough to travel; bedside echocardiography for RV dilatation if too unstable to move.
6. Stand down the first-seizure pathway; CT head is normal and neurology is not the priority. Reassess after each intervention.`,
};
