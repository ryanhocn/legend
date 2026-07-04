import type { ClinicalNote, NoteCategory, NoteDraft, NoteStatus, UserProfile } from "../types";

/** Building user-authored notes out of editor drafts. Pure; no React. */

const CATEGORY_BY_TYPE: Record<string, NoteCategory> = {
  "Progress Note": "Progress",
  "H&P": "H&P",
  "Consult Note": "Consults",
  "Procedure Note": "Procedures",
  "Nursing Note": "Nursing",
  "Discharge Summary": "Discharge",
};

/** DD/MM HH:MM, matching the app's absolute-time convention. */
export function formatStamp(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function buildUserNote(
  draft: NoteDraft,
  user: UserProfile,
  plainBody: string,
  status: NoteStatus,
  now: Date,
): ClinicalNote {
  const stamp = formatStamp(now);
  const timestamp = Math.floor(now.getTime() / 1000);
  return {
    kind: "note",
    id: `user-note-${timestamp}-${draft.id}`,
    encounterId: "enc-admission",
    category: CATEGORY_BY_TYPE[draft.noteType] ?? "Progress",
    noteType: draft.noteType,
    author: `${user.surname.trim()}, ${user.forename.trim()}`,
    credential: "MS",
    authorRole: "*MEDICAL STUDENT",
    service: draft.service,
    dateOfService: stamp,
    fileTime: status === "signed" ? stamp : "—",
    timestamp,
    status,
    admission: true,
    body: plainBody,
  };
}
