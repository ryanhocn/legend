import type { CaseRubric } from "../../../types";

/**
 * Scoring rubric for a day-1 ward-round / progress note on the delirium
 * ("dementia getting worse") case. Items reference facts that exist in the
 * chart (documents.ts / encounters.ts / bloods.ts); triggers list the phrasings
 * a student might reasonably use. Weights: the safety catches (the never-done
 * bladder scan, the unreviewed anticholinergic burden, the haloperidol written
 * against Parkinson's) sit heaviest, then the delirium diagnosis itself, then
 * the supporting findings.
 *
 * All content is fabricated for education and simulation only. Not for clinical use.
 */
export const caseDelirium001Rubric: CaseRubric = {
  caseId: "delirium001",
  noteType: "Progress Note",
  task: { code: "ptwr", label: "POST-TAKE WARD ROUND", minGrade: "st3" },
  wordBand: { target: 170, max: 280 },
  sections: [
    ["impression", "assessment", "diagnosis"],
    ["plan"],
  ],
  items: [
    {
      id: "safety-exclude-retention",
      label: "Excludes urinary retention — bladder scan (and catheter if in retention)",
      category: "safety",
      weight: 14,
      critical: true,
      triggers: [
        [["bladder scan", "bladder scanner", "post void residual", "pvr"]],
        [
          ["catheter", "catheterise", "catheterize", "catheterisation", "catheterised"],
          ["retention", "residual", "bladder", "decompress", "decompression"],
        ],
      ],
      explanation:
        "Nursing documented suprapubic fullness, dribbling incontinence and long unproductive visits to the urinal — the picture of retention with overflow — and requested a bladder scan TWICE (ward scanner away for repair, request carried forward). It was never done. Retention is one of the most reversible drivers of delirium, and it also explains the AKI; a note that does not order the scan (or a catheter) leaves the cause sitting in the bladder.",
      pdqi: ["accurate", "useful"],
    },
    {
      id: "safety-anticholinergic-burden",
      label: "Reviews and holds the anticholinergic / deliriogenic drug burden",
      category: "safety",
      weight: 13,
      critical: true,
      triggers: [
        [
          ["oxybutynin"],
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
            "discontinue",
            "discontinued",
            "review",
            "reviewed",
            "deprescribe",
            "deprescribed",
          ],
        ],
        [
          ["anticholinergic"],
          ["burden", "load", "review", "reduce", "reduced", "hold", "stop", "deprescribe"],
        ],
      ],
      explanation:
        "The drug chart quietly accumulated three deliriogenic drugs: oxybutynin (NEW from urology clinic 3 weeks ago — the timing fits the decline), long-standing amitriptyline, and codeine in regular use. Pharmacy flagged the cumulative anticholinergic burden on the night of admission and it was continued 'pending medical review'. Holding the oxybutynin and amitriptyline (and stopping the codeine) is treatment, not tidying.",
      pdqi: ["accurate", "up-to-date"],
    },
    {
      id: "safety-haloperidol-parkinsons",
      label: "Catches the haloperidol PRN against the Parkinson's disease",
      category: "safety",
      weight: 12,
      critical: true,
      triggers: [
        [
          ["haloperidol"],
          [
            "parkinson",
            "parkinsonism",
            "contraindicated",
            "contraindication",
            "stop",
            "stopped",
            "avoid",
            "avoided",
            "cancel",
            "cancelled",
            "remove",
            "removed",
            "discontinue",
            "discontinued",
            "switch",
            "switched",
          ],
        ],
        [
          ["antipsychotic", "antipsychotics", "dopamine antagonist", "dopamine antagonists", "dopamine blocker"],
          ["parkinson", "avoid", "contraindicated", "stop", "stopped"],
        ],
      ],
      explanation:
        "The overnight on-call doctor wrote up haloperidol 0.5 mg PRN and a dose was given at 03:10 — against the Parkinson's disease documented in the clerking PMH, the pharmacy note ('avoid dopamine antagonists') and the neurology letter. Dopamine antagonists worsen parkinsonism and can precipitate severe rigidity. The PRN must come off the chart; co-careldopa continues on time; if sedation is truly unavoidable, low-dose lorazepam is the stated alternative.",
      pdqi: ["accurate", "internally consistent"],
    },
    {
      id: "assessment-delirium-dx",
      label: "Makes DELIRIUM the diagnosis",
      category: "assessment",
      weight: 12,
      triggers: [[["delirium", "delirious", "acute confusional state"]]],
      explanation:
        "An acute change in cognition and attention over 48 hours, fluctuating and worse at night, with hallucinations, in a man lucid a week ago: this is hyperactive delirium by definition. Naming it is what converts 'manage the agitation' into 'find and remove the cause'.",
      pdqi: ["synthesized", "accurate"],
    },
    {
      id: "assessment-rejects-label",
      label: "Rejects the 'dementia progression' label",
      category: "assessment",
      weight: 6,
      triggers: [
        [
          ["not", "against", "rather than", "reject", "rejects", "dispute", "mislabel", "mislabelled"],
          [
            "dementia progression",
            "progression of dementia",
            "worsening dementia",
            "dementia getting worse",
            "baseline dementia",
          ],
        ],
      ],
      explanation:
        "Dementia does not progress over a weekend. The memory clinic letter says MILD cognitive impairment (MoCA 23/30, fully independent) — he never had a dementia diagnosis — and its final line says exactly this: an acute change should be assessed as delirium, not attributed to the label. Explicitly rejecting the label stops the next reader re-anchoring.",
      pdqi: ["synthesized", "internally consistent"],
    },
    {
      id: "finding-collateral",
      label: "Uses the collateral history — lucid and independent one week ago",
      category: "findings",
      weight: 8,
      triggers: [
        [["collateral"]],
        [
          ["week ago", "one week", "a week", "last week"],
          ["lucid", "independent", "well", "himself", "baseline", "crossword", "crosswords"],
        ],
        [["daughter"], ["lucid", "independent", "crossword", "crosswords", "normal", "himself"]],
      ],
      explanation:
        "The single most important document in this chart is the ED nursing collateral note: one week ago he was self-caring, doing the crossword daily and walking to the shop. That timeline is incompatible with 'dementia progression' and defines the acute change a delirium diagnosis needs. It was never reviewed by the medical team.",
      pdqi: ["thorough", "synthesized"],
    },
    {
      id: "finding-retention-signs",
      label: "Names the retention signs — suprapubic fullness, dribbling overflow",
      category: "findings",
      weight: 8,
      triggers: [
        [
          ["suprapubic"],
          ["fullness", "full", "tender", "tenderness", "distension", "distended", "dull", "mass", "firm"],
        ],
        [["palpable bladder", "distended bladder", "bladder palpable", "full bladder"]],
        [["dribbling", "overflow"]],
      ],
      explanation:
        "Nursing documented a full, firm lower abdomen with suprapubic discomfort, dribbling incontinence with wet pads, and long unproductive standing at the urinal — dribbling in an 87-year-old man with BPH on a new antimuscarinic is overflow until proven otherwise. The clerking read the wet pads as 'in keeping with dementia progressing'.",
      pdqi: ["thorough", "accurate"],
    },
    {
      id: "finding-drug-timeline",
      label: "Links the NEW oxybutynin (urology, 3 weeks ago) to the deterioration",
      category: "findings",
      weight: 8,
      triggers: [
        [
          ["oxybutynin"],
          ["new", "newly", "started", "recent", "recently", "3 weeks", "three weeks", "urology"],
        ],
        [["amitriptyline"], ["codeine"]],
      ],
      explanation:
        "The urology letter of 15/06 started oxybutynin 5 mg BD — with a safety-net to stop it if he became confused — and the post-void residual was never measured because the clinic scanner was unavailable. Three weeks later he is delirious and dribbling. Reading the drug chart's DATES, not just its list, is the move this case rewards.",
      pdqi: ["thorough", "synthesized"],
    },
    {
      id: "finding-not-uti",
      label: "Reads the urine dip in context (not a UTI)",
      category: "findings",
      weight: 6,
      triggers: [
        [["nitrites", "nitrite"], ["negative"]],
        [["mixed growth"]],
        [["uti"], ["not", "no", "unlikely", "against", "does not", "red herring"]],
        [["dip", "dipstick"], ["red herring", "unreliable", "poor test", "contaminant", "weak"]],
      ],
      explanation:
        "The dip shows leucocytes with NEGATIVE nitrites (from a pad specimen), the culture is mixed growth with no significant bacteriuria, he is afebrile with a normal white count and CRP 11 — and his dip was 'positive' at urology three weeks ago too. In elderly men with incomplete emptying the dip is chronically abnormal; here it bought an antibiotic and an anchor.",
      pdqi: ["accurate", "synthesized"],
    },
    {
      id: "finding-constipation",
      label: "Picks up the constipation — no bowels open for 5 days",
      category: "findings",
      weight: 6,
      triggers: [
        [["constipation", "constipated", "no bowels", "bowels not open", "faecal loading", "faecally loaded"]],
        [["codeine"], ["constipating", "constipation", "stop", "stopped", "reduce", "hold", "held"]],
      ],
      explanation:
        "The stool chart reads day 5 with no bowel motion, on regular codeine plus two antimuscarinics — all three slow the gut. Constipation is a delirium driver in its own right and compounds the urinary retention. Laxatives were never prescribed (he declined one in May; nobody asked again).",
      pdqi: ["thorough", "accurate"],
    },
    {
      id: "finding-aki-postrenal",
      label: "Recognizes the AKI against the documented baseline (?post-renal)",
      category: "findings",
      weight: 6,
      triggers: [
        [["aki", "acute kidney injury"]],
        // Interpretive words required: the PROGRESS template auto-embeds the raw
        // "Creatinine 142 ... High" lab line, which must not score alone.
        [["creatinine"], ["raised", "elevated", "baseline"]],
        [["post renal", "postrenal", "obstructive"], ["aki", "kidney", "renal", "nephropathy", "picture"]],
      ],
      explanation:
        "Creatinine 142 with urea 13.6 against a baseline of 88 (neurology letter, 02/2026) is an AKI, and the clerking waved it through as 'likely chronic for age'. With a full bladder and dribbling overflow the first differential is post-renal obstruction — another line of evidence pointing at the scan that was never done.",
      pdqi: ["accurate", "thorough"],
    },
    {
      id: "plan-4at",
      label: "Completes a 4AT / formal delirium screen",
      category: "plan",
      weight: 6,
      triggers: [
        [["4at", "delirium screen", "cognitive assessment", "confusion assessment method", "amts", "amt"]],
      ],
      explanation:
        "No structured cognitive or delirium assessment has been done at any point: AMTS 'not completed' at clerking, 4AT 'not completed — patient drowsy' on the post-take round. A 4AT takes two minutes, needs no cooperation beyond observation, and would have made the diagnosis on day one.",
      pdqi: ["thorough", "useful"],
    },
    {
      id: "plan-stop-antibiotic",
      label: "Stops the empirical cefalexin",
      category: "plan",
      weight: 5,
      triggers: [
        [
          ["cefalexin", "cephalexin", "antibiotic", "antibiotics"],
          ["stop", "stopped", "hold", "held", "discontinue", "discontinued", "rationalise", "no evidence"],
        ],
      ],
      explanation:
        "Cefalexin was started on a weak-positive dip and the culture has come back mixed growth with no significant bacteriuria. Continuing it treats the label, not the patient, and keeps the '?UTI' anchor alive on every subsequent note.",
      pdqi: ["accurate", "useful"],
    },
    {
      id: "plan-nonpharm",
      label: "Uses non-pharmacological delirium management first",
      category: "plan",
      weight: 5,
      triggers: [
        [
          [
            "non pharmacological",
            "nonpharmacological",
            "reorientation",
            "re orientation",
            "delirium bundle",
            "one to one",
            "glasses",
            "hearing aids",
            "day night",
            "family at the bedside",
          ],
        ],
      ],
      explanation:
        "First-line management of hyperactive delirium is non-pharmacological: reorientation, glasses and hearing aids, lighting and a day–night routine, familiar faces at the bedside, and treating the causes — not sedation. The overnight response (haloperidol) inverted that order.",
      pdqi: ["useful", "comprehensible"],
    },
    {
      id: "plan-monitor-renal",
      label: "Repeats and monitors the renal function and fluid balance",
      category: "plan",
      weight: 4,
      triggers: [
        [
          ["repeat", "recheck", "monitor", "trend"],
          ["u e", "u es", "renal", "creatinine", "bloods", "fluid balance"],
        ],
      ],
      explanation:
        "The AKI needs a trajectory: repeat U&E, a fluid balance chart, and — once the bladder is drained — watch for post-obstructive diuresis. The clerking deferred the creatinine to 'repeat in AM' without a plan attached.",
      pdqi: ["useful", "up-to-date"],
    },
  ],
  modelNote: `POST-TAKE REVIEW — Geriatrics (day 1)

87M admitted with acute agitation and confusion, labelled "dementia progression ?UTI". The collateral (ED nursing note) contradicts the label: independent and lucid one week ago, doing the crossword daily. An acute 48-hour change is DELIRIUM until proven otherwise — 4AT to be completed now (never done).

The positive dip is a red herring: nitrites negative, culture mixed growth — not a UTI. The drivers are on the drug chart and in the bladder: oxybutynin started 3 weeks ago at urology, on top of amitriptyline and regular codeine — a high anticholinergic burden; no bowels open for 5 days; nursing document suprapubic fullness with dribbling overflow incontinence, and NO bladder scan has been done. Creatinine 142 against a baseline of 88 is an AKI, ?post-renal. Calcium, glucose and CT head unremarkable.

Impression
Hyperactive delirium precipitated by probable urinary retention, anticholinergic drug burden and constipation — not dementia progression (memory clinic: MCI, MoCA 23/30) — on a background of Parkinson's disease.

Plan
1. Bladder scan NOW; catheterise if significant residual. Repeat U&E to trend the AKI; monitor fluid balance.
2. HOLD oxybutynin and amitriptyline; stop regular codeine (constipating) and prescribe laxatives.
3. STOP the haloperidol PRN — contraindicated in Parkinson's. Continue co-careldopa strictly on time; if sedation becomes unavoidable, low-dose lorazepam.
4. Stop cefalexin — no evidence of UTI.
5. Complete the 4AT; non-pharmacological measures — reorientation, glasses and hearing aids, day–night routine, family at the bedside.
6. Update the daughter; correct the "dementia" label on the problem list.`,
};
