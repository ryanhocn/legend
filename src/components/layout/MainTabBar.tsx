import { mainTabs } from "../../data/tabs";
import type { MainTab } from "../../types";
import { TabStrip } from "./TabStrip";

export function MainTabBar({
  selected,
  onSelect,
}: {
  selected: MainTab;
  onSelect: (tab: MainTab) => void;
}) {
  return (
    <TabStrip
      variant="main"
      tabs={mainTabs}
      selected={selected}
      onSelect={onSelect}
      leading={<button className="back-button">←</button>}
    />
  );
}
