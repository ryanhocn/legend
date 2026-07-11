import type { Note } from "../types";

/**
 * Who may act on a note, from the CURRENT persona's point of view. Server-side,
 * ownership of work is the account (better-auth user.id); this adds a
 * client-only realism layer so switching persona behaves like a real chart: you
 * edit/delete only what your current persona authored, but you may addend any
 * note your account owns (cross-clinician addenda are normal). Pure; no React.
 *
 * - userNotes:   every note the server returned for this account + case.
 * - myHcpId:     the live persona's doctor id (UserProfile.hcpId).
 * - playerHcpId: the static case-persona the trainee plays (CaseBundle.playerHcpId).
 */
export function noteOwnership(
  note: Note,
  args: { userNotes: Note[]; myHcpId: string; playerHcpId?: string },
): { canEdit: boolean; canDelete: boolean; canAddend: boolean } {
  const { userNotes, myHcpId, playerHcpId } = args;
  const isAccountNote = userNotes.some((n) => n.id === note.id);
  // Authored by the persona currently signed in. A legacy account note with no
  // stamped authorId is grandfathered to the current persona (all notes from
  // buildUserNote do stamp authorId, so this only covers pre-existing rows).
  const mine = isAccountNote && (note.authorId == null || note.authorId === myHcpId);
  const canAddend = isAccountNote || (!!note.authorId && note.authorId === playerHcpId);
  return { canEdit: mine, canDelete: mine, canAddend };
}
