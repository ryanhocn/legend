import { chartRows } from "../../data/chart";

export function EncounterTable({
  selectedReportId,
  onSelectReport,
}: {
  selectedReportId: string | null;
  onSelectReport: (reportId: string) => void;
}) {
  return (
    <div className="encounter-table-wrap">
      <table className="encounter-table">
        <thead>
          <tr>
            <th className="bookmark-col">◆</th>
            <th>When</th>
            <th />
            <th>Type</th>
            <th>With</th>
            <th>Description</th>
            <th>Status</th>
            <th>Location</th>
          </tr>
        </thead>

        <tbody>
          {chartRows.map((row, index) => {
            if (row.kind === "group") {
              return (
                <tr key={`group-${row.label}`} className="date-group-row">
                  <td colSpan={8}>{row.label}</td>
                </tr>
              );
            }

            const linked = row.linkedReportId;
            const classes = [
              linked ? "linked-row" : "",
              linked && linked === selectedReportId ? "selected-row" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <tr
                key={`${row.when}-${row.type}-${index}`}
                className={classes || undefined}
                onClick={linked ? () => onSelectReport(linked) : undefined}
              >
                <td className="bookmark-col">{linked ? "📄" : "▸"}</td>
                <td>{row.when}</td>
                <td>{row.symbol}</td>
                <td>{row.type}</td>
                <td>{row.with}</td>
                <td>{row.description}</td>
                <td>{row.status}</td>
                <td>{row.location}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
