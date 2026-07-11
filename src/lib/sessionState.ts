import type { CaseUiState } from "../types";

/** The top-level workspace state persisted across a page reload. */
export type PersistedSession = {
  openCaseIds: string[];
  activeCaseId: string | null;
  caseUi: Record<string, CaseUiState>;
};

const empty = (): PersistedSession => ({ openCaseIds: [], activeCaseId: null, caseUi: {} });

/**
 * Sanitize a raw localStorage blob back into resumable state. Drops case ids no
 * longer in the registry (getCase throws on unknown ids, which would white-screen
 * the app on load), prunes per-case UI to the surviving open cases, and resets a
 * dangling active id. Tolerates malformed or absent JSON by returning empty
 * state. Pure; no React, no localStorage access (the caller reads the string).
 */
export function hydrateSession(
  raw: string | null,
  isKnownCase: (id: string) => boolean,
): PersistedSession {
  if (!raw) return empty();
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return empty();
  }
  if (typeof parsed !== "object" || parsed === null) return empty();
  const p = parsed as Partial<PersistedSession>;

  const openCaseIds = Array.isArray(p.openCaseIds)
    ? p.openCaseIds.filter((id): id is string => typeof id === "string" && isKnownCase(id))
    : [];

  const caseUi: Record<string, CaseUiState> = {};
  const rawUi =
    p.caseUi && typeof p.caseUi === "object" && !Array.isArray(p.caseUi)
      ? (p.caseUi as Record<string, CaseUiState>)
      : {};
  for (const id of openCaseIds) {
    if (rawUi[id]) caseUi[id] = rawUi[id];
  }

  const activeCaseId =
    typeof p.activeCaseId === "string" && openCaseIds.includes(p.activeCaseId)
      ? p.activeCaseId
      : null;

  return { openCaseIds, activeCaseId, caseUi };
}
