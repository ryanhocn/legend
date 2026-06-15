import { X } from "lucide-react";
import type { Report } from "../../types";

export function ReportPreview({
  report,
  onClose,
}: {
  report: Report;
  onClose: () => void;
}) {
  return (
    <section className="report-preview">
      <div className="report-preview-head">
        <span>Report Preview</span>
        <button title="Close" onClick={onClose}>
          <X size={13} />
        </button>
      </div>

      <div className="report-preview-body">
        <h2>{report.title}</h2>
        <div className="report-type">{report.type}</div>

        <dl className="report-meta">
          {report.department && (
            <>
              <dt>Department</dt>
              <dd>{report.department}</dd>
            </>
          )}
          {report.author && (
            <>
              <dt>Author</dt>
              <dd>{report.author}</dd>
            </>
          )}
          {report.signedAt && (
            <>
              <dt>Signed</dt>
              <dd>{report.signedAt}</dd>
            </>
          )}
        </dl>

        <p className="report-text">{report.body}</p>
      </div>
    </section>
  );
}
