import type { ReactNode } from "react";

/**
 * Shared tab strip. Every workspace panel uses one of these on top of a single
 * content pane, so the chrome is consistent and each view just fills the pane.
 */
export function TabStrip<K extends string>({
  tabs,
  selected,
  onSelect,
  variant,
  leading,
}: {
  tabs: { key: K; label: string }[];
  selected: K;
  onSelect: (key: K) => void;
  variant: "main" | "sub";
  leading?: ReactNode;
}) {
  const stripClass = variant === "main" ? "main-tab-strip" : "chart-subtabs";
  const tabClass = variant === "main" ? "main-tab" : "chart-subtab";
  const activeClass = variant === "main" ? "main-tab-active" : "active";

  return (
    <div className={stripClass}>
      {leading}
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={selected === tab.key ? `${tabClass} ${activeClass}` : tabClass}
          onClick={() => onSelect(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
