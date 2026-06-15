import { useMemo, useRef, useState } from "react";
import {
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Filter,
  Info,
  RefreshCw,
  SquarePen,
} from "lucide-react";
import {
  Group as PanelGroup,
  Panel,
  Separator as PanelResizeHandle,
  type PanelImperativeHandle,
} from "react-resizable-panels";
import type { Note, NoteCategory } from "../../types";
import { NoteList } from "./NoteList";
import { NotePreview } from "./NotePreview";

type TabKey = "All Notes" | "Admission" | NoteCategory | "Incomplete";

const NOTE_TABS: TabKey[] = [
  "All Notes",
  "Admission",
  "H&P",
  "Progress",
  "Nursing",
  "Procedures",
  "Consults",
  "ED Notes",
  "Discharge",
  "Incomplete",
];

function filterNotes(notes: Note[], tab: TabKey): Note[] {
  if (tab === "All Notes") return notes;
  if (tab === "Admission") return notes.filter((n) => n.admission);
  if (tab === "Incomplete") return notes.filter((n) => n.status === "incomplete");
  return notes.filter((n) => n.category === tab);
}

/**
 * Dense notes activity (Notes main tab): action toolbar, category tabs and a
 * resizable mailbox list / preview split. Writing happens in the right-rail
 * NoteEditor opened via onNewNote.
 */
export function NotesBrowser({
  notes,
  onNewNote,
}: {
  notes: Note[];
  onNewNote: () => void;
}) {
  const [activeTab, setActiveTab] = useState<TabKey>("All Notes");
  // null means "no explicit pick yet" — selection falls back to the first
  // visible (newest) note, and re-falls-back whenever the filter narrows.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const listRef = useRef<PanelImperativeHandle>(null);
  const [listCollapsed, setListCollapsed] = useState(false);

  function toggleList() {
    const panel = listRef.current;
    if (!panel) return;
    if (panel.isCollapsed()) panel.expand();
    else panel.collapse();
  }

  // Newest first; Unix timestamp is the sort key so mixed date labels stay correct.
  const filtered = useMemo(
    () =>
      filterNotes(notes, activeTab)
        .slice()
        .sort((a, b) => b.timestamp - a.timestamp),
    [notes, activeTab],
  );
  // Keep selection valid as the filter narrows: fall back to the first visible note.
  const selected = filtered.find((n) => n.id === selectedId) ?? filtered[0] ?? null;

  return (
    <div className="notes-browser">
      <div className="notes-toolbar">
        <button className="notes-toolbar-primary" onClick={onNewNote}>
          <SquarePen size={14} />
          New Note
        </button>
        <button>
          <CheckCheck size={14} />
          Cosign Note
        </button>
        <button>
          <Info size={14} />
          Legend
        </button>
        <button>
          <Filter size={14} />
          Filter
        </button>
        <div className="toolbar-spacer" />
        <button>
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <div className="notes-tabs" role="tablist">
        {NOTE_TABS.map((tab) => {
          const count = filterNotes(notes, tab).length;
          return (
            <button
              key={tab}
              role="tab"
              aria-selected={tab === activeTab}
              className={tab === activeTab ? "notes-tab active" : "notes-tab"}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              <span className="notes-tab-count">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="notes-shown">
        Number of notes shown: {filtered.length} of {notes.length}. All loaded.
      </div>

      <div className="notes-split">
        <PanelGroup orientation="horizontal" className="notes-panels">
          <Panel
            defaultSize="38%"
            minSize="22%"
            collapsible
            collapsedSize="0%"
            panelRef={listRef}
            onResize={() => setListCollapsed(listRef.current?.isCollapsed() ?? false)}
          >
            <NoteList
              notes={filtered}
              selectedId={selected?.id ?? null}
              onSelect={setSelectedId}
            />
          </Panel>

          <PanelResizeHandle className="resize-handle inner">
            <button
              className="handle-collapse"
              aria-label={listCollapsed ? "Show note list" : "Hide note list"}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={toggleList}
            >
              {listCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
            </button>
          </PanelResizeHandle>

          <Panel defaultSize="62%" minSize="35%">
            <NotePreview note={selected} />
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
