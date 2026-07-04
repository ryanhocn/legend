import { Bell, Menu, Search, StickyNote } from "lucide-react";
import type { UserProfile } from "../../types";

export function TopSystemBar({
  stickyOpen,
  onToggleSticky,
  user,
}: {
  stickyOpen: boolean;
  onToggleSticky: () => void;
  user: UserProfile;
}) {
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
        <button
          className={stickyOpen ? "top-pill sticky-toggle active" : "top-pill sticky-toggle"}
          onClick={onToggleSticky}
          aria-pressed={stickyOpen}
        >
          <StickyNote size={14} />
          Sticky Note
        </button>

        <Bell size={16} />
        <div
          className="user-bubble"
          title={`${user.forename} ${user.surname} — Medical Student`}
        >
          {(user.forename[0] ?? "").toUpperCase()}
          {(user.surname[0] ?? "").toUpperCase()}
        </div>
      </div>
    </header>
  );
}
