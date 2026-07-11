import { useState } from "react";
import { PatientTabBar } from "./components/layout/PatientTabBar";
import { TopSystemBar } from "./components/layout/TopSystemBar";
import { PatientListPage } from "./components/patients/PatientListPage";
import { PatientWorkspace } from "./components/PatientWorkspace";
import { RotateGate } from "./components/RotateGate";
import { SignInPage } from "./components/SignInPage";
import { CaseContext } from "./context/CaseContext";
import { getCase } from "./data/patients";
import { authClient, useSession } from "./lib/authClient";
import type { CaseUiState, Grade, UserProfile } from "./types";
import "./App.css";

/** First token as forename, rest as surname; empty-safe for a missing display name. */
function splitName(name?: string): { forename: string; surname: string } | undefined {
  if (!name) return undefined;
  const [forename, ...rest] = name.trim().split(/\s+/);
  return { forename: forename ?? "", surname: rest.join(" ") };
}

// Land on Notes so a fresh trainee immediately sees the write-a-note call to action.
const DEFAULT_UI: CaseUiState = {
  mainTab: "notes",
  chartTab: "encounters",
  selectedDocId: null,
  editors: [],
  activeEditorId: null,
  wrapupOpen: false,
  openNoteIds: [],
  activePreviewId: null,
};

function App() {
  const { data: session, isPending } = useSession();
  const user: UserProfile | null =
    session?.user && session.user.forename && session.user.surname && session.user.grade && session.user.hcpId
      ? {
          forename: session.user.forename,
          surname: session.user.surname,
          grade: session.user.grade as Grade,
          hcpId: session.user.hcpId,
          image: session.user.image ?? undefined,
        }
      : null;

  // Open charts (patient tabs) + which one is focused. null focus with tabs
  // still open means the trainee is browsing the Patient Lists activity.
  const [openCaseIds, setOpenCaseIds] = useState<string[]>([]);
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  // Cross-switch workspace state per case (tabs, drafts, feedback dock).
  const [caseUi, setCaseUi] = useState<Record<string, CaseUiState>>({});
  const [stickyOpen, setStickyOpen] = useState(false);

  const activeCase = activeCaseId ? getCase(activeCaseId) : null;

  function openCase(id: string) {
    setOpenCaseIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setActiveCaseId(id);
  }

  function closeCase(id: string) {
    const remaining = openCaseIds.filter((openId) => openId !== id);
    setOpenCaseIds(remaining);
    // Discard the closed chart's in-memory state (drafts included; signed and
    // pended notes are already in localStorage).
    setCaseUi((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (activeCaseId === id) {
      // Focus the neighbour; with no tabs left the Patient Lists page shows.
      const closedAt = openCaseIds.indexOf(id);
      setActiveCaseId(remaining[closedAt] ?? remaining.at(-1) ?? null);
    }
  }

  function patchActiveUi(
    patch: Partial<CaseUiState> | ((prev: CaseUiState) => Partial<CaseUiState>),
  ) {
    if (!activeCaseId) return;
    setCaseUi((prev) => {
      const current = prev[activeCaseId] ?? DEFAULT_UI;
      const resolved = typeof patch === "function" ? patch(current) : patch;
      return {
        ...prev,
        [activeCaseId]: { ...current, ...resolved },
      };
    });
  }

  if (isPending) return null; // brief blank while the session loads

  if (!user) {
    return (
      <>
        <RotateGate />
        <SignInPage
          mode={session?.user ? "persona" : "signin"}
          initialName={splitName(session?.user?.name)}
          onComplete={async (p) => {
            if (!session?.user) await authClient.signIn.anonymous();
            await authClient.updateUser({ forename: p.forename, surname: p.surname, grade: p.grade });
          }}
          onGoogle={() => authClient.signIn.social({ provider: "google", callbackURL: "/" })}
        />
      </>
    );
  }

  return (
    <div className="legend-app">
      <RotateGate />
      <TopSystemBar
        stickyOpen={stickyOpen}
        onToggleSticky={() => setStickyOpen((open) => !open)}
        onMenu={() => setActiveCaseId(null)}
        user={user}
        activePatient={activeCase?.patient}
      />

      <PatientTabBar
        tabs={openCaseIds.map((id) => ({ id, label: getCase(id).patient.displayName }))}
        activeId={activeCaseId}
        onSelect={setActiveCaseId}
        onClose={closeCase}
      />

      {activeCase ? (
        <CaseContext.Provider value={activeCase} key={activeCase.id}>
          <PatientWorkspace
            user={user}
            ui={caseUi[activeCase.id] ?? DEFAULT_UI}
            onPatch={patchActiveUi}
            stickyOpen={stickyOpen}
            onCloseSticky={() => setStickyOpen(false)}
          />
        </CaseContext.Provider>
      ) : (
        <PatientListPage openIds={openCaseIds} onOpen={openCase} />
      )}
    </div>
  );
}

export default App;
