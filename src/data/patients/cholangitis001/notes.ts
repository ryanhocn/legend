import type { Note } from "../../../types";

/**
 * Synthetic note set for the cholangitis case (Hart, Amelia, 64F). Drives the
 * Notes/Trans browser: category tabs filter by `category`, "Admission" by the
 * `admission` flag and "Incomplete" by `status`. The list sorts by `timestamp`.
 *
 * All content is fabricated for education and simulation only. Not for clinical use.
 */
export const caseCholangitis001Notes: Note[] = [
  {
    id: "note-hp-001",
    category: "H&P",
    noteType: "H&P",
    author: "Green, Annabel",
    credential: "MD",
    authorRole: "*PHYSICIAN: FACULTY",
    service: "(A) General Surgery — AMU",
    dateOfService: "Today 08:20",
    fileTime: "Today 08:54",
    timestamp: 1781511600,
    status: "signed",
    admission: true,
    body: `GENERAL SURGERY ADMISSION H&P
Admission Date: Today — PCP: Shah, Rajesh, MD

CC: Fever, right upper quadrant pain and jaundice.

HISTORY OF PRESENT ILLNESS:
Amelia Hart is a 64-year-old woman presenting with a 24-hour history of rigors,
right upper quadrant pain and progressive jaundice. Over the preceding weeks she
describes intermittent colicky RUQ pain after fatty meals. Pain is now constant,
band-like and radiates to the back. She reports dark urine and pale stools. No
prior biliary surgery.

In the Emergency Department she was febrile (38.6), tachycardic (HR 112) and
hypotensive (BP 98/60), with a positive sepsis screen.

PAST MEDICAL HISTORY:
- Gallstones (ultrasound 01/2026)               12/01/2026
- Biliary colic                                 12/01/2026
- Essential hypertension                        2019
- Type 2 diabetes mellitus (diet controlled)    2021

PAST SURGICAL HISTORY:
- Nil of note.

ALLERGIES:
- Penicillin — rash.

MEDICATIONS (on admission):
- Amlodipine 5 mg PO OD
- Metformin 500 mg PO BD

EXAMINATION:
- Alert, jaundiced, warm peripheries. Charcot's triad present.
- Abdomen: tender RUQ, positive Murphy's sign, no peritonism.
- Chest clear, heart sounds normal.

INVESTIGATIONS:
- WCC 18.2, CRP 220, bilirubin 88, ALP 410, ALT 145, lactate 2.8.
- US abdomen: dilated CBD 11 mm with stone, gallbladder calculi.

IMPRESSION:
Acute cholangitis secondary to choledocholithiasis, with sepsis physiology.

PLAN:
1. Sepsis six bundle. IV crystalloid resuscitation.
2. Blood cultures, then IV antibiotics (see microbiology — penicillin allergy).
3. Urgent referral to gastroenterology for ERCP / biliary decompression.
4. NBM pending ERCP. Hourly observations, repeat lactate and LFTs in 6 hours.
5. VTE assessment, capillary glucose monitoring.`,
  },
  {
    id: "note-ed-002",
    category: "ED Notes",
    noteType: "ED Provider Note",
    author: "Patel, Anita",
    credential: "MD",
    authorRole: "*PHYSICIAN: FACULTY",
    service: "Emergency Department",
    dateOfService: "Today 06:40",
    fileTime: "Today 07:12",
    timestamp: 1781505600,
    status: "signed",
    admission: true,
    body: `EMERGENCY DEPARTMENT PROVIDER NOTE

Presenting complaint: fever, RUQ pain and jaundice for 24 hours.

Hypotensive and febrile on arrival, with rigors witnessed in triage. Tender RUQ
with positive Murphy's sign. Visibly jaundiced.

Bloods show raised WCC and CRP with an obstructive LFT picture. VBG lactate 2.8.

Impression: biliary sepsis, likely ascending cholangitis. Sepsis six commenced
in the department: IV fluids given, blood cultures sent, catheterised for urine
output. Referred to General Surgery for senior review. Antibiotics to be charted
with microbiology input given penicillin allergy.`,
  },
  {
    id: "note-ed-001",
    category: "ED Notes",
    noteType: "ED Triage Note",
    author: "Okafor, Blessing",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "Emergency Department",
    dateOfService: "Today 06:05",
    fileTime: "Today 06:18",
    timestamp: 1781503500,
    status: "signed",
    admission: true,
    body: `ED TRIAGE NOTE

64F self-presented with fever, abdominal pain and "yellow eyes". Rigors in
waiting room. Looks unwell.

Obs: T 38.6, HR 112, BP 98/60, RR 22, SpO2 96% RA. NEWS2 = 8.
Allergy band applied: PENICILLIN.

Triage category: Very urgent. Sepsis screen initiated, doctor informed
immediately. Moved to majors.`,
  },
  {
    id: "note-prog-001",
    category: "Progress",
    noteType: "Post-Take Ward Round",
    author: "Green, Annabel",
    credential: "MD",
    authorRole: "*PHYSICIAN: FACULTY",
    service: "(A) General Surgery — AMU",
    dateOfService: "Today 09:50",
    fileTime: "Today 10:08",
    timestamp: 1781517000,
    status: "signed",
    admission: true,
    body: `SURGICAL POST-TAKE WARD ROUND NOTE

Seen on the post-take ward round with the on-call team.

64F admitted overnight with fever, RUQ pain and jaundice. Charcot's triad.
Obs improving after 1 L crystalloid: T 37.9, HR 98, BP 110/68.

Impression: acute cholangitis secondary to choledocholithiasis.

Plan:
- Confirm blood cultures sent and IV antibiotics given (penicillin allergy —
  await microbiology advice).
- Urgent ERCP today — gastroenterology referral made.
- NBM. Continue IV fluids. Strict fluid balance.
- Repeat LFTs and lactate at 6 hours.
- Update next of kin.`,
  },
  {
    id: "note-prog-002",
    category: "Progress",
    noteType: "Best Poss Rx Hx",
    author: "Bajorek, Sarah",
    credential: "PharmD",
    authorRole: ".PHARMACIST",
    service: "Pharmacy",
    dateOfService: "Today 09:05",
    fileTime: "Today 09:31",
    timestamp: 1781514300,
    status: "signed",
    admission: true,
    body: `BEST POSSIBLE MEDICATION HISTORY

Sources: patient interview, GP summary, community pharmacy record (2 sources).

Regular medications confirmed:
- Amlodipine 5 mg PO once daily.
- Metformin 500 mg PO twice daily (omit while NBM / septic — review renal
  function and lactate).

Allergy: Penicillin — rash (documented, patient confirms).

Recommendation: hold metformin given sepsis and NBM status. Reviewed antibiotic
choice with microbiology due to penicillin allergy. No anticoagulation on file —
VTE prophylaxis to be assessed by team.`,
  },
  {
    id: "note-prog-003",
    category: "Progress",
    noteType: "Gastroenterology Progress",
    author: "Mensah, Daniel",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "(A) Gastroenterology",
    dateOfService: "Today 13:10",
    fileTime: "Today 13:24",
    timestamp: 1781529000,
    status: "cosign",
    body: `GASTROENTEROLOGY PROGRESS NOTE

Reviewed prior to ERCP. Patient consented, NBM since 08:00, IV access x2.
Antibiotics given. Latest lactate 1.9 (improving), bilirubin 84.

Plan:
- For ERCP this afternoon on the emergency list.
- Continue IV fluids and antibiotics peri-procedure.
- Repeat bloods post-procedure; monitor for pancreatitis and bleeding.

Awaiting consultant cosign.`,
  },
  {
    id: "note-cons-001",
    category: "Consults",
    noteType: "Consult Note",
    author: "Abara, Felix",
    credential: "MD",
    authorRole: "*PHYSICIAN: FACULTY",
    service: "(A) Gastroenterology",
    dateOfService: "Today 11:15",
    fileTime: "Today 11:40",
    timestamp: 1781522100,
    status: "signed",
    body: `GASTROENTEROLOGY CONSULT — ERCP

Asked to review 64F with acute cholangitis and dilated CBD (11 mm) with stone on
ultrasound.

Agree with diagnosis of ascending cholangitis secondary to choledocholithiasis.
Sepsis physiology improving with resuscitation and antibiotics.

Plan:
- Accept for urgent ERCP today for biliary decompression and stone extraction.
- Ensure platelets and clotting checked; correct any coagulopathy pre-procedure.
- Consent obtained including risks of pancreatitis, bleeding, perforation.
- Anaesthetic review requested for sedation given septic state.`,
  },
  {
    id: "note-cons-002",
    category: "Consults",
    noteType: "Microbiology Consult",
    author: "Roussel, Marie",
    credential: "MD",
    authorRole: "*PHYSICIAN: FACULTY",
    service: "Microbiology",
    dateOfService: "Today 10:30",
    fileTime: "Today 10:52",
    timestamp: 1781519400,
    status: "signed",
    body: `MICROBIOLOGY — ANTIMICROBIAL ADVICE

Re: 64F, acute cholangitis, sepsis. Documented penicillin allergy (rash).

The rash is non-severe (no anaphylaxis / SJS), so the risk of cross-reactivity
with later-generation agents is low. However, given the documented allergy:

Recommendation:
- Ciprofloxacin 400 mg IV BD PLUS metronidazole 500 mg IV TDS as empirical
  cover for biliary sepsis in penicillin allergy.
- If piperacillin/tazobactam is used by the team, ensure first dose is given
  under observation; benefit may outweigh risk in severe sepsis.
- Chase blood cultures; de-escalate on sensitivities. Review at 48 hours.`,
  },
  {
    id: "note-cons-003",
    category: "Consults",
    noteType: "Pre-Procedure Assessment",
    author: "Ngata, Hemi",
    credential: "MD",
    authorRole: "*PHYSICIAN: FACULTY",
    service: "Anaesthetics",
    dateOfService: "Today 12:40",
    fileTime: "Today 12:58",
    timestamp: 1781527200,
    status: "signed",
    body: `ANAESTHETIC PRE-PROCEDURE ASSESSMENT (for ERCP)

64F, septic but resuscitated. ASA III. Mallampati II, good mouth opening.
Fasted since 08:00. Penicillin allergy noted.

Plan:
- Conscious sedation with cardiorespiratory monitoring; senior anaesthetist
  present given septic physiology.
- Ensure IV access and fluids running; have vasopressor available.
- Post-procedure recovery in a monitored bed.`,
  },
  {
    id: "note-nurse-001",
    category: "Nursing",
    noteType: "Nursing Admission Assessment",
    author: "Mai, Cherry",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "(A) General Surgery — AMU",
    dateOfService: "Today 07:55",
    fileTime: "Today 08:21",
    timestamp: 1781510100,
    status: "signed",
    admission: true,
    body: `NURSING ADMISSION ASSESSMENT

64F admitted to AMU Bay 3 from ED with biliary sepsis.

Obs on arrival: T 38.4, HR 104, BP 104/64, RR 20, SpO2 97% RA. NEWS2 = 5.
Pain score 7/10 RUQ. Analgesia given as charted.

Risk assessments: falls — low; pressure area (Waterlow) — moderate; VTE — to be
completed by medical team. Penicillin allergy band checked and present.
Catheter in situ, urine output monitored. Patient and family updated, anxious
but cooperative.`,
  },
  {
    id: "note-nurse-002",
    category: "Nursing",
    noteType: "Nursing Shift Note",
    author: "Basilio, Roxanne",
    credential: "RN",
    authorRole: ".NURSE: (RN)",
    service: "(A) General Surgery — AMU",
    dateOfService: "Today 15:30",
    fileTime: "Today 15:46",
    timestamp: 1781537400,
    status: "signed",
    body: `NURSING SHIFT NOTE (Late)

Patient returned from ERCP at 15:05, sedation worn off, GCS 15. Obs stable:
T 37.2, HR 84, BP 118/72. Pain improved (2/10). Remains NBM per gastro until
review. IV fluids and antibiotics continuing.

Monitoring for post-ERCP complications: abdominal pain, bleeding, fever. Urine
output adequate. Family at bedside and updated. Escalation plan in place.`,
  },
  {
    id: "note-proc-001",
    category: "Procedures",
    noteType: "ERCP Procedure Note",
    author: "Abara, Felix",
    credential: "MD",
    authorRole: "*PHYSICIAN: FACULTY",
    service: "(A) Gastroenterology",
    dateOfService: "Today 14:25",
    fileTime: "Today 14:58",
    timestamp: 1781533500,
    status: "signed",
    body: `ERCP PROCEDURE NOTE

Indication: acute cholangitis with choledocholithiasis.
Sedation: conscious sedation, anaesthetist present. Antibiotics given.

Findings: deep cannulation of the common bile duct achieved. Cholangiogram
showed a dilated CBD with a single obstructing stone. Pus expressed on
sphincterotomy, consistent with cholangitis.

Procedure: biliary sphincterotomy performed, stone extracted with balloon
trawl. Good biliary drainage achieved. No plastic stent required.

Complications: none immediate. Estimated blood loss minimal.

Post-procedure plan: NBM 4 hours then sips. Monitor for pancreatitis (amylase
if abdominal pain), bleeding and perforation. Continue antibiotics; surgical
team to plan interval cholecystectomy.`,
  },
  {
    id: "note-proc-002",
    category: "Procedures",
    noteType: "Line Insertion Note",
    author: "Mensah, Daniel",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "(A) General Surgery — AMU",
    dateOfService: "Today 14:10",
    fileTime: "Today 14:19",
    timestamp: 1781532600,
    status: "signed",
    body: `PERIPHERAL CANNULA INSERTION NOTE

Second large-bore cannula (18G) sited in left antecubital fossa under aseptic
technique for peri-procedural fluids and antibiotics. Inserted first attempt,
flushed and patent, no complications. VIP score 0.`,
  },
  {
    id: "note-prog-004",
    category: "Progress",
    noteType: "Progress Note",
    author: "Mensah, Daniel",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "(A) General Surgery — AMU",
    dateOfService: "Today 16:45",
    fileTime: "—",
    timestamp: 1781541900,
    status: "incomplete",
    body: `POST-ERCP PROGRESS NOTE (DRAFT)

Reviewed post-ERCP. Patient comfortable, observations stable, tolerating sips.

Assessment: acute cholangitis, source controlled following ERCP and
sphincterotomy with stone extraction.

Plan:
- Continue IV antibiotics, review at 48 hours with microbiology.
- ***repeat bloods in AM — bilirubin / LFT trend, FBC***
- ***document interval cholecystectomy plan with consultant***
- VTE prophylaxis decision pending.

[Draft — not yet signed.]`,
  },
  {
    id: "note-dc-001",
    category: "Discharge",
    noteType: "Discharge Summary",
    author: "Mensah, Daniel",
    credential: "MD",
    authorRole: "*PHYSICIAN: RESIDENT",
    service: "(A) General Surgery — AMU",
    dateOfService: "Today 16:50",
    fileTime: "—",
    timestamp: 1781542200,
    status: "incomplete",
    body: `DISCHARGE SUMMARY (DRAFT — IN PROGRESS)

Reason for admission: acute cholangitis secondary to choledocholithiasis.

Hospital course: presented with Charcot's triad and sepsis; resuscitated and
treated with IV antibiotics; underwent urgent ERCP with sphincterotomy and stone
extraction.

Discharge medications: ***to complete***
Follow-up: ***surgical clinic for interval cholecystectomy — to arrange***
Outstanding results: ***blood culture sensitivities pending***

[Incomplete — do not finalise until ERCP recovery confirmed and TTOs reviewed.]`,
  },
];
