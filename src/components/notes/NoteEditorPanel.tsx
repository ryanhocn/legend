import { X } from "lucide-react";
import type { NoteDraft } from "../../types";
import { NoteEditor } from "./NoteEditor";

/**
 * Right-rail NoteWriter container. Holds a tab strip of every open draft so
 * several notes can be edited at once, and renders the active draft below.
 */
export function NoteEditorPanel({
  editors,
  activeId,
  onSelect,
  onClose,
  onChangeBody,
  onChangeNoteType,
  onSign,
  onPend,
  error,
}: {
  editors: NoteDraft[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
  onChangeBody: (id: string, body: string) => void;
  onChangeNoteType: (id: string, noteType: string) => void;
  onSign: (id: string) => void;
  onPend: (id: string) => void;
  error: string | null;
}) {
  const active = editors.find((draft) => draft.id === activeId) ?? null;

  return (
    <div className="note-editor-pane">
      {error && <div className="editor-save-error">{error}</div>}
      <div className="note-editor-tabbar" role="tablist">
        {editors.map((draft) => (
          <div
            key={draft.id}
            className={draft.id === activeId ? "note-editor-tab active" : "note-editor-tab"}
          >
            <button
              role="tab"
              aria-selected={draft.id === activeId}
              className="note-editor-tab-label"
              onClick={() => onSelect(draft.id)}
            >
              {draft.noteType}
            </button>
            <button
              className="note-editor-tab-close"
              aria-label={`Close ${draft.noteType}`}
              onClick={() => onClose(draft.id)}
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      {active && (
        <NoteEditor
          key={active.id}
          noteType={active.noteType}
          service={active.service}
          value={active.body}
          mode={active.mode}
          onChangeNoteType={(noteType) => onChangeNoteType(active.id, noteType)}
          onChange={(body) => onChangeBody(active.id, body)}
          onSign={() => onSign(active.id)}
          onPend={() => onPend(active.id)}
        />
      )}
    </div>
  );
}
