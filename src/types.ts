export type MainTab =
  | "summary"
  | "chart"
  | "results"
  | "notes"
  | "treatments"
  | "wrapup"
  | "messages"
  | "demographics"
  | "flowsheets";

export type ChartTab =
  | "encounters"
  | "letters"
  | "edVisits"
  | "labs"
  | "radiology"
  | "meds"
  | "referrals"
  | "media"
  | "orders";

export type ChartRow =
  | {
      kind: "group";
      label: string;
    }
  | {
      kind: "row";
      when: string;
      symbol: string;
      type: string;
      with: string;
      description: string;
      status: string;
      location: string;
      linkedReportId?: string;
    };

export type Report = {
  id: string;
  title: string;
  type: string;
  department?: string;
  author?: string;
  signedAt?: string;
  body: string;
};

export type NoteCategory =
  | "H&P"
  | "Progress"
  | "Nursing"
  | "Procedures"
  | "Consults"
  | "ED Notes"
  | "Discharge";

export type NoteStatus = "signed" | "incomplete" | "cosign";

export type Note = {
  id: string;
  category: NoteCategory;
  /** Display label shown in the list, e.g. "Progress Notes", "Consult Note". */
  noteType: string;
  /** Stored "Surname, Forename"; rendered with surname uppercased via formatClinician. */
  author: string;
  /** Post-nominal, e.g. "MD", "RN", "PharmD". */
  credential: string;
  /** Credential line under the author, e.g. "*PHYSICIAN: FACULTY", ".NURSE". */
  authorRole: string;
  service: string;
  /** Human label shown in the UI, e.g. "Today 08:20". */
  dateOfService: string;
  fileTime: string;
  /** Unix epoch seconds; sort key for the list (display uses dateOfService). */
  timestamp: number;
  status: NoteStatus;
  /** True for notes that belong to the admission episode (cross-cuts category). */
  admission?: boolean;
  body: string;
  addendum?: string;
};

/** An open note in the right-rail NoteWriter; multiple can be edited at once. */
export type NoteDraft = {
  id: string;
  noteType: string;
  service: string;
  body: string;
};
