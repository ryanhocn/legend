import { useState } from "react";
import { Clock, Send, X } from "lucide-react";
import { matchChronos } from "../../lib/chronos";
import type { ChronosIntent } from "../../types";

type Turn = { from: "you" | "chronos"; text: string };

const NO_MATCH =
  "No channel for that yet. Try asking about the cultures, the organism, or which antibiotic to narrow to.";

/**
 * Chronos console (spec §8): a deterministic time-skip channel. The trainee
 * asks for a pending result; a matching authored intent advances the sim-clock
 * to that result's reveal and returns a templated reply. Floating bottom-right
 * so it does not fight the bottom-left Performance dock. Rendered only when the
 * case declares chronos intents.
 */
export function ChronosDock({
  intents,
  onAdvance,
}: {
  intents: ChronosIntent[];
  onAdvance: (targetAt: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [turns, setTurns] = useState<Turn[]>([
    { from: "chronos", text: "Chronos: I can pull a pending result forward. What are you chasing?" },
  ]);

  function send() {
    const text = draft.trim();
    if (!text) return;
    const match = matchChronos(text, intents);
    setTurns((prev) => [
      ...prev,
      { from: "you", text },
      { from: "chronos", text: match ? match.reply : NO_MATCH },
    ]);
    setDraft("");
    if (match) onAdvance(match.targetAt);
  }

  return (
    <div className="chronos-dock">
      {open && (
        <div className="chronos-panel" role="dialog" aria-label="Chronos time-skip channel">
          <div className="chronos-head">
            <span>
              <Clock size={14} /> Chronos
            </span>
            <button aria-label="Close Chronos" onClick={() => setOpen(false)}>
              <X size={14} />
            </button>
          </div>
          <div className="chronos-log">
            {turns.map((turn, i) => (
              <div key={i} className={`chronos-turn ${turn.from}`}>
                {turn.text}
              </div>
            ))}
          </div>
          <div className="chronos-input">
            <input
              value={draft}
              placeholder="e.g. any word on the cultures?"
              aria-label="Ask Chronos"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
            />
            <button aria-label="Send" onClick={send}>
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
      <button
        className={open ? "chronos-launcher active" : "chronos-launcher"}
        onClick={() => setOpen((v) => !v)}
        aria-pressed={open}
        title="Chronos time-skip channel"
      >
        <Clock size={15} />
        Chronos
      </button>
    </div>
  );
}
