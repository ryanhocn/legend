import { useState, type ReactNode } from "react";
import {
  AlertTriangle,
  Bell,
  CalendarDays,
  ClipboardList,
  FileText,
  Menu,
  MessageSquare,
  Plus,
  Printer,
  RefreshCw,
  Search,
  ShieldAlert,
  Star,
  UserRound,
  X,
} from "lucide-react";
import {
  Group as PanelGroup,
  Panel,
  Separator as PanelResizeHandle,
} from "react-resizable-panels";
import "./App.css";

type MainTab =
  | "chart"
  | "episode"
  | "notes"
  | "treatments"
  | "wrapup"
  | "messages"
  | "demographics"
  | "flowsheets";

type ChartTab =
  | "encounters"
  | "notesTrans"
  | "letters"
  | "edVisits"
  | "labs"
  | "radiology"
  | "meds"
  | "referrals"
  | "media"
  | "orders";

type ChartRow =
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
    };

const patient = {
  surname: "Hart",
  forename: "Amelia",
  displayName: "Hart, Amelia",
  initials: "AH",
  pronouns: "she/her",
  sex: "Female",
  age: 64,
  dob: "14/03/1961",
  caseId: "LEG-000001",
  location: "AMU Bay 3",
  specialty: "General Surgery",
  attending: "Ms Green",
  primaryCare: "Dr Shah",
  allergies: "Penicillin — rash",
  isolation: "None",
  code: "For escalation",
  acuity: "Sepsis screen positive",
  presentingComplaint: "Fever, RUQ pain and jaundice",
  phone: "No mobile on file",
  infection: "None recorded",
  bmi: "29.1",
};

const chartRows: ChartRow[] = [
  {
    kind: "row",
    when: "Today 09:50",
    symbol: "★",
    type: "Ward Round",
    with: "Surgery",
    description:
      "New admission review. Fever, RUQ pain, jaundice. Consider acute cholangitis.",
    status: "Open",
    location: "AMU",
  },
  {
    kind: "row",
    when: "Today 09:20",
    symbol: "🧪",
    type: "Bloods",
    with: "Lab",
    description: "WCC 18.2, CRP 220, bilirubin 88, ALP 410, ALT 145.",
    status: "Final",
    location: "Lab",
  },
  {
    kind: "row",
    when: "Today 09:10",
    symbol: "🦠",
    type: "Microbiology",
    with: "Lab",
    description: "Blood cultures pending. No antibiotic documented yet.",
    status: "Pending",
    location: "Lab",
  },
  {
    kind: "row",
    when: "Today 08:35",
    symbol: "📄",
    type: "ED Note",
    with: "ED",
    description:
      "Impression: biliary sepsis. Hypotensive and febrile. Needs senior review.",
    status: "Signed",
    location: "ED",
  },
  {
    kind: "group",
    label: "6 Months Ago",
  },
  {
    kind: "row",
    when: "12/01/2026",
    symbol: "📅",
    type: "Clinic",
    with: "Primary Care",
    description: "Intermittent RUQ pain after fatty meals. Possible gallstones.",
    status: "Signed",
    location: "GP",
  },
  {
    kind: "row",
    when: "09/11/2025",
    symbol: "🧪",
    type: "Bloods",
    with: "Primary Care",
    description: "LFTs mildly deranged. Repeat advised.",
    status: "Final",
    location: "GP",
  },
  {
    kind: "group",
    label: "1 Year Ago",
  },
  {
    kind: "row",
    when: "06/02/2025",
    symbol: "📄",
    type: "ED Visit",
    with: "ED",
    description: "Epigastric pain. Discharged with safety-netting.",
    status: "Signed",
    location: "ED",
  },
  {
    kind: "row",
    when: "19/12/2024",
    symbol: "📅",
    type: "Appointment",
    with: "Primary Care",
    description: "Hypertension review. No acute issues.",
    status: "Closed",
    location: "GP",
  },
  {
    kind: "group",
    label: "2 Years Ago",
  },
  {
    kind: "row",
    when: "09/08/2024",
    symbol: "📄",
    type: "Telephone",
    with: "Primary Care",
    description: "Medication review.",
    status: "Signed",
    location: "GP",
  },
];

const mainTabs: { key: MainTab; label: string }[] = [
  { key: "chart", label: "Chart Review" },
  { key: "episode", label: "Episode" },
  { key: "notes", label: "Notes" },
  { key: "treatments", label: "Treatments" },
  { key: "wrapup", label: "Wrap-Up" },
  { key: "messages", label: "Patient Message" },
  { key: "demographics", label: "Demographics" },
  { key: "flowsheets", label: "Flowsheets" },
];

const chartTabs: { key: ChartTab; label: string }[] = [
  { key: "encounters", label: "Encounters" },
  { key: "notesTrans", label: "Notes/Trans" },
  { key: "letters", label: "Letters" },
  { key: "edVisits", label: "ED Visits" },
  { key: "labs", label: "Labs" },
  { key: "radiology", label: "Rad" },
  { key: "meds", label: "Meds" },
  { key: "referrals", label: "Referrals" },
  { key: "media", label: "Media" },
  { key: "orders", label: "Other Orders" },
];

const bloods = [
  { test: "WCC", value: "18.2", range: "4.0–11.0", flag: "High" },
  { test: "CRP", value: "220", range: "<5", flag: "High" },
  { test: "Bilirubin", value: "88", range: "<21", flag: "High" },
  { test: "ALP", value: "410", range: "30–130", flag: "High" },
  { test: "ALT", value: "145", range: "<40", flag: "High" },
  { test: "Creatinine", value: "98", range: "45–90", flag: "High" },
  { test: "Sodium", value: "134", range: "135–145", flag: "Low" },
];

function App() {
  const [mainTab, setMainTab] = useState<MainTab>("chart");
  const [chartTab, setChartTab] = useState<ChartTab>("encounters");
  const [note, setNote] = useState("");

  return (
    <div className="legend-app">
      <TopSystemBar />
      <PatientContextBar />

      <PanelGroup direction="horizontal" className="ehr-workspace">
        <Panel defaultSize="16%" minSize="14%" maxSize="24%">
          <div className="left-panel-frame">
            <PatientSidebar />
          </div>
        </Panel>

        <PanelResizeHandle className="resize-handle" />

        <Panel defaultSize="58%" minSize="40%">
          <main className="center-shell">
            <MainTabBar selected={mainTab} onSelect={setMainTab} />

            <div className="module-body">
              {mainTab === "chart" && (
                <ChartReview
                  chartTab={chartTab}
                  setChartTab={setChartTab}
                  note={note}
                  setNote={setNote}
                />
              )}

              {mainTab !== "chart" && (
                <PlaceholderModule
                  title={mainTabs.find((tab) => tab.key === mainTab)?.label ?? ""}
                />
              )}
            </div>
          </main>
        </Panel>

        <PanelResizeHandle className="resize-handle" />

        <Panel defaultSize="26%" minSize="22%" maxSize="36%">
          <div className="right-panel-frame">
            <RightContextRail note={note} />
          </div>
        </Panel>
      </PanelGroup>

      <BottomActionBar />
    </div>
  );
}

function TopSystemBar() {
  return (
    <header className="top-system-bar">
      <div className="top-left">
        <button className="icon-button dark">
          <Menu size={17} />
        </button>
        <div className="brand-chip">
          <span className="brand-logo">L</span>
          <span className="brand-text">LegendCare</span>
        </div>
        <span className="environment-text">
          TRAINING — REHAB / ORTHO / GENERAL SURGERY — AMELIA HART
        </span>
      </div>

      <div className="global-search">
        <Search size={15} />
        <span>Search synthetic chart...</span>
      </div>

      <div className="top-right">
        <button className="top-pill">My Incomplete Notes 7</button>
        <button className="top-pill">My Open Charts 3</button>
        <button className="top-pill">Notifications 12</button>
        <Bell size={16} />
        <div className="user-bubble">MJ</div>
      </div>
    </header>
  );
}

function PatientContextBar() {
  return (
    <div className="patient-context-bar">
      <div className="mini-toolbar">
        <button>In Basket</button>
        <button>Schedule</button>
        <button>Chart</button>
        <button>View Schedules</button>
        <button>Apps</button>
        <button>SmartTool Editors</button>
        <button>Documentation Only Enc</button>
        <button>Telephone Call</button>
        <button>LAR - Dept</button>
      </div>

      <div className="patient-chip">
        <UserRound size={16} />
        <strong>{patient.displayName}</strong>
      </div>
    </div>
  );
}

function PatientSidebar() {
  return (
    <aside className="patient-sidebar">
      <div className="paper-stack">
        <div />
        <div />
        <div />
      </div>

      <div className="patient-avatar">{patient.initials}</div>

      <h2>{patient.displayName}</h2>
      <div className="patient-subtitle">
        {patient.sex}, {patient.age} / {patient.dob}
      </div>
      <div className="patient-subtitle">MRN: {patient.caseId}</div>

      <button className="yellow-action">Active Care Plan</button>

      <div className="patient-warning">
        MyHealth: Deactivated
        <br />
        SMS MyLink to: No Mobile Phone on File
      </div>

      <SideInfo label="VIDO DIALER" value="hover over" />
      <SideInfo label="Isolation" value={patient.isolation} />
      <SideInfo label="PCP" value={patient.primaryCare} />
      <SideInfo label="Primary Cvg" value="None" />
      <SideInfo label="Consult Codes" value="Accepted" />
      <SideInfo label="Allergies" value={patient.allergies} danger />
      <SideInfo label="Current Meds" value="0" />
      <SideInfo label="Infection" value={patient.infection} />
      <SideInfo label="Ht" value="—" />
      <SideInfo label="Last Wt" value="—" />
      <SideInfo label="BMI" value={patient.bmi} />
    </aside>
  );
}

function SideInfo({
  label,
  value,
  danger,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="side-info">
      <span className="side-label">{label}:</span>
      <span className={danger ? "side-value side-danger" : "side-value"}>
        {value}
      </span>
    </div>
  );
}

function MainTabBar({
  selected,
  onSelect,
}: {
  selected: MainTab;
  onSelect: (tab: MainTab) => void;
}) {
  return (
    <div className="main-tab-strip">
      <button className="back-button">←</button>
      {mainTabs.map((tab) => (
        <button
          key={tab.key}
          className={selected === tab.key ? "main-tab main-tab-active" : "main-tab"}
          onClick={() => onSelect(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function ChartReview({
  chartTab,
  setChartTab,
  note,
  setNote,
}: {
  chartTab: ChartTab;
  setChartTab: (tab: ChartTab) => void;
  note: string;
  setNote: (value: string) => void;
}) {
  return (
    <section className="chart-review">
      <div className="chart-title-row">
        <div>
          <h1>Chart Review</h1>
        </div>

        <div className="chart-title-actions">
          <button>
            <RefreshCw size={14} />
            Refresh
          </button>
          <button>
            <Printer size={14} />
            Print
          </button>
          <button>Log Out</button>
        </div>
      </div>

      <div className="chart-subtabs">
        {chartTabs.map((tab) => (
          <button
            key={tab.key}
            className={chartTab === tab.key ? "chart-subtab active" : "chart-subtab"}
            onClick={() => setChartTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ChartToolbar />

      <div className="yellow-notice">
        <AlertTriangle size={15} />
        Not all records have been loaded and sorted. Load remaining records to sort all records.
        <button>Load Additional Records</button>
        <button>Hide</button>
      </div>

      <div className="chart-panel">
        {chartTab === "encounters" && <EncounterTable />}
        {chartTab === "labs" && <LabsPanel />}
        {chartTab === "notesTrans" && <NotesTraining note={note} setNote={setNote} />}
        {chartTab !== "encounters" &&
          chartTab !== "labs" &&
          chartTab !== "notesTrans" && (
            <GenericChartTab label={chartTabs.find((t) => t.key === chartTab)?.label ?? ""} />
          )}
      </div>
    </section>
  );
}

function ChartToolbar() {
  return (
    <div className="chart-toolbar">
      <button>Preview</button>
      <button>
        <RefreshCw size={13} />
        Refresh
      </button>
      <button>Encounter</button>
      <button>Route</button>
      <button>External Image Exchange</button>
      <button>Image Archive</button>
      <button>More ▾</button>
      <div className="toolbar-spacer" />
      <button>Clear Filters</button>
      <button className="on-toggle">On</button>
    </div>
  );
}

function EncounterTable() {
  return (
    <div className="encounter-table-wrap">
      <table className="encounter-table">
        <thead>
          <tr>
            <th className="bookmark-col">◆</th>
            <th>When</th>
            <th />
            <th>Type</th>
            <th>With</th>
            <th>Description</th>
            <th>Status</th>
            <th>Location</th>
          </tr>
        </thead>

        <tbody>
          {chartRows.map((row, index) => {
            if (row.kind === "group") {
              return (
                <tr key={`group-${row.label}`} className="date-group-row">
                  <td colSpan={8}>{row.label}</td>
                </tr>
              );
            }

            return (
              <tr key={`${row.when}-${row.type}-${index}`}>
                <td className="bookmark-col">▸</td>
                <td>{row.when}</td>
                <td>{row.symbol}</td>
                <td>{row.type}</td>
                <td>{row.with}</td>
                <td>{row.description}</td>
                <td>{row.status}</td>
                <td>{row.location}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function LabsPanel() {
  return (
    <div className="labs-panel">
      <div className="panel-heading">Recent Blood Results</div>
      <table className="labs-table">
        <thead>
          <tr>
            <th>Test</th>
            <th>Value</th>
            <th>Reference Range</th>
            <th>Flag</th>
          </tr>
        </thead>
        <tbody>
          {bloods.map((result) => (
            <tr key={result.test} className="abnormal">
              <td>{result.test}</td>
              <td>{result.value}</td>
              <td>{result.range}</td>
              <td>{result.flag}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NotesTraining({
  note,
  setNote,
}: {
  note: string;
  setNote: (value: string) => void;
}) {
  const words = note.trim() ? note.trim().split(/\s+/).length : 0;

  return (
    <div className="note-training">
      <div className="note-task-card">
        <h2>Documentation Drill</h2>
        <p>
          Write a ward round note and initial plan for this synthetic patient.
          Focus on diagnosis, escalation, cultures, antibiotics, and source control.
        </p>

        <div className="teaching-box">
          Expected working diagnosis: <strong>acute cholangitis with sepsis physiology</strong>.
        </div>
      </div>

      <div className="note-editor">
        <div className="note-editor-header">
          <strong>Ward Round Note</strong>
          <span>{words} words</span>
        </div>

        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder={`WR note:
Seen on ward round.
64F admitted with fever, RUQ pain and jaundice...
Assessment:
Plan:`}
        />

        <div className="note-editor-actions">
          <button>Save Draft</button>
          <button className="green-button">Submit Note</button>
        </div>
      </div>
    </div>
  );
}

function GenericChartTab({ label }: { label: string }) {
  return (
    <div className="generic-tab">
      <FileText size={32} />
      <h2>{label}</h2>
      <p>
        Placeholder module for future synthetic EHR training content.
      </p>
    </div>
  );
}

function RightContextRail({ note }: { note: string }) {
  const lower = note.toLowerCase();
  const hasSepsis = lower.includes("sepsis");
  const hasCultures = lower.includes("culture");
  const hasAntibiotics = lower.includes("antibiotic") || lower.includes("abx");
  const hasSenior =
    lower.includes("senior") || lower.includes("reg") || lower.includes("consultant");
  const hasErcp = lower.includes("ercp") || lower.includes("source control");

  return (
    <aside className="right-rail">
      <StickyNoteBox />

      <RailCard title="Index">
        <div className="index-grid">
          <a>By Notes</a>
          <span>Regulatory</span>
          <a>Daily Notes</a>
          <span>Meds/Hx</span>
          <a>Progress Notes</a>
          <span>POC Co-Sign</span>
          <a>Clinical</a>
          <span />
        </div>
      </RailCard>

      <RailCard title="Time Mark">
        <div className="refresh-row">
          <span>Current as of Synthetic Training Session</span>
          <button>Refresh</button>
        </div>
      </RailCard>

      <div className="critical-banner">
        <ShieldAlert size={17} />
        This patient needs a Plan of Care order.
        <button>Place a Plan of Care order</button>
      </div>

      <RailCard title="Visit Counters">
        <Counter label="Episode Visit Count" value="1" />
        <Counter label="G-Code Count" value="1" />
        <Counter label="Progress Note Count" value="1" />
        <Counter label="Plan of Care Count" value="1" />
        <div className="small-warning">
          No order of REHAB PLAN OF CARE INTERNAL is found.
          <br />
          No order of REHAB PLAN OF CARE EXTERNAL is found.
        </div>
      </RailCard>

      <RailCard title="Legend Drill Feedback">
        <FeedbackLine label="Mentions sepsis" done={hasSepsis} />
        <FeedbackLine label="Mentions blood cultures" done={hasCultures} />
        <FeedbackLine label="Mentions antibiotics" done={hasAntibiotics} />
        <FeedbackLine label="Escalates to senior" done={hasSenior} />
        <FeedbackLine label="Mentions ERCP/source control" done={hasErcp} />
      </RailCard>

      <RailCard title="Review Flowsheet">
        <div className="empty-flowsheet">No data to display</div>
      </RailCard>
    </aside>
  );
}

function StickyNoteBox() {
  return (
    <div className="sticky-note">
      <div className="sticky-title">
        <span>My Sticky Note</span>
        <div className="sticky-actions">
          <Star size={14} />
          <button>↗</button>
          <button>
            <X size={13} />
          </button>
        </div>
      </div>
      <textarea defaultValue="15" />
    </div>
  );
}

function RailCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rail-card">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function Counter({ label, value }: { label: string; value: string }) {
  return (
    <div className="counter-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function FeedbackLine({ label, done }: { label: string; done: boolean }) {
  return (
    <div className={done ? "feedback-line done" : "feedback-line"}>
      <span>{done ? "✓" : "○"}</span>
      {label}
    </div>
  );
}

function PlaceholderModule({ title }: { title: string }) {
  return (
    <div className="placeholder-module">
      <MessageSquare size={42} />
      <h1>{title}</h1>
      <p>
        Future module placeholder. This is where specialty-specific synthetic EHR workflows can go.
      </p>
    </div>
  );
}

function BottomActionBar() {
  return (
    <footer className="bottom-action-bar">
      <button>
        <Plus size={15} />
        ADD ORDER
      </button>
      <button>
        <Plus size={15} />
        ADD DX (2)
      </button>
      <div className="bottom-spacer" />
      <button>
        <CalendarDays size={15} />
        PRINT AVS
      </button>
      <button className="sign-button">
        <ClipboardList size={15} />
        SIGN VISIT
      </button>
    </footer>
  );
}

export default App;
