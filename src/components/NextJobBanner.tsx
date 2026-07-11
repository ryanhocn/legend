import { useState } from "react";
import { X } from "lucide-react";
import { NEXT_JOB_HIDE_KEY } from "../lib/session";

// No multiplayer yet; the banner is a singleplayer aid (there is no single
// "your job" when a team shares the patient). Flip this when a shared-session
// concept lands.
const isMultiplayer = false;

/** A small strip under the tab bar telling a solo trainee what to write next. */
export function NextJobBanner({ label, done }: { label: string; done: boolean }) {
  const [hidden, setHidden] = useState(
    () => window.localStorage.getItem(NEXT_JOB_HIDE_KEY) === "1",
  );
  if (isMultiplayer || done || hidden) return null;
  return (
    <div className="next-job-banner">
      <span className="next-job-label">Next: {label}</span>
      <button
        className="next-job-dismiss"
        title="Hide this hint"
        onClick={() => {
          window.localStorage.setItem(NEXT_JOB_HIDE_KEY, "1");
          setHidden(true);
        }}
      >
        <X size={13} />
      </button>
    </div>
  );
}
