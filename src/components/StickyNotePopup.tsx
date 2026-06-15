import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Star, X } from "lucide-react";
import patient from "../data/patient.json";
import { usePersistentState } from "../hooks/usePersistentState";

const STORAGE_KEY = `legend.sticky.${patient.caseId}`;

export function StickyNotePopup({ onClose }: { onClose: () => void }) {
  const [text, setText] = usePersistentState(STORAGE_KEY, patient.stickyNote);
  const [pos, setPos] = useState({ x: window.innerWidth - 300, y: 96 });
  const dragOffset = useRef<{ dx: number; dy: number } | null>(null);

  const onPointerMove = useCallback((event: PointerEvent) => {
    if (!dragOffset.current) return;
    setPos({
      x: event.clientX - dragOffset.current.dx,
      y: event.clientY - dragOffset.current.dy,
    });
  }, []);

  const stopDragging = useCallback(() => {
    dragOffset.current = null;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", stopDragging);
  }, [onPointerMove]);

  const startDragging = (event: ReactPointerEvent<HTMLDivElement>) => {
    // Don't start a drag when the close/action buttons are pressed.
    if ((event.target as HTMLElement).closest("button")) return;
    dragOffset.current = { dx: event.clientX - pos.x, dy: event.clientY - pos.y };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stopDragging);
  };

  useEffect(() => stopDragging, [stopDragging]);

  return (
    <div className="sticky-popup" style={{ left: pos.x, top: pos.y }}>
      <div className="sticky-title" onPointerDown={startDragging}>
        <span>My Sticky Note</span>
        <div className="sticky-actions">
          <Star size={14} />
          <button title="Pop out">↗</button>
          <button title="Close" onClick={onClose}>
            <X size={13} />
          </button>
        </div>
      </div>
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Write a private note for yourself..."
      />
    </div>
  );
}
