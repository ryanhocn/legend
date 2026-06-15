/**
 * Render a clinician's name the way the chart shows it: surname in caps, then
 * forename and post-nominal — "GREEN, Annabel, MD". Authors are stored as
 * "Surname, Forename"; the credential (MD / RN / PharmD) is held separately.
 */
export function formatClinician(author: string, credential: string): string {
  const [surname, ...rest] = author.split(", ");
  const forename = rest.join(", ");
  return forename
    ? `${surname.toUpperCase()}, ${forename}, ${credential}`
    : `${surname.toUpperCase()}, ${credential}`;
}
