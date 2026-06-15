import type { Report } from "../../types";
import { ReportPreview } from "./ReportPreview";

/** Right-hand viewer pane: shows the selected encounter's report, or an empty state. */
export function ReportPanel({
  report,
  onClose,
}: {
  report: Report | null;
  onClose: () => void;
}) {
  if (!report) {
    return (
      <div className="report-empty">
        <p>No report open</p>
        <p className="summary-muted">Select an encounter in Chart Review to view its report.</p>
      </div>
    );
  }

  return <ReportPreview report={report} onClose={onClose} />;
}
