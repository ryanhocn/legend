import { useState } from "react";
import { AlertTriangle, FileText, Printer, RefreshCw } from "lucide-react";
import { TabStrip } from "../layout/TabStrip";
import { chartTabs } from "../../data/tabs";
import type { ChartTab } from "../../types";
import { EncounterTable } from "./EncounterTable";
import { LabsPanel } from "./LabsPanel";

export function ChartReview({
  chartTab,
  setChartTab,
  selectedReportId,
  onSelectReport,
}: {
  chartTab: ChartTab;
  setChartTab: (tab: ChartTab) => void;
  selectedReportId: string | null;
  onSelectReport: (reportId: string) => void;
}) {
  const [noticeOpen, setNoticeOpen] = useState(true);

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

      <TabStrip variant="sub" tabs={chartTabs} selected={chartTab} onSelect={setChartTab} />

      <ChartToolbar />

      {noticeOpen && (
        <div className="yellow-notice">
          <AlertTriangle size={15} />
          Not all records have been loaded and sorted. Load remaining records to sort all records.
          <button>Load Additional Records</button>
          <button onClick={() => setNoticeOpen(false)}>Hide</button>
        </div>
      )}

      <div className="chart-panel">
        {chartTab === "encounters" && (
          <EncounterTable
            selectedReportId={selectedReportId}
            onSelectReport={onSelectReport}
          />
        )}
        {chartTab === "labs" && <LabsPanel />}
        {chartTab !== "encounters" && chartTab !== "labs" && (
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
