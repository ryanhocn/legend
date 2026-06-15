import { useState } from "react";
import { VitalsChart } from "./VitalsChart";
import { VitalsTable } from "./VitalsTable";

export function VitalsPanel() {
  const [view, setView] = useState<"chart" | "table">("chart");

  return (
    <div className="vitals-panel">
      <div className="vitals-toggle">
        <button
          className={view === "chart" ? "active" : undefined}
          onClick={() => setView("chart")}
        >
          View Chart
        </button>
        <button
          className={view === "table" ? "active" : undefined}
          onClick={() => setView("table")}
        >
          View Table
        </button>
      </div>

      {view === "chart" ? <VitalsChart /> : <VitalsTable />}
    </div>
  );
}
