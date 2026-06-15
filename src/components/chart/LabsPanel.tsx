import { bloods } from "../../data/chart";

export function LabsPanel() {
  return (
    <div className="labs-panel">
      <div className="panel-heading">Recent Blood Results</div>
      <table className="labs-table">
        <thead>
          <tr>
            <th>Test</th>
            <th>Value</th>
            <th>Reference Range</th>
            <th>Flag</th>
          </tr>
        </thead>
        <tbody>
          {bloods.map((result) => (
            <tr key={result.test} className="abnormal">
              <td>{result.test}</td>
              <td>{result.value}</td>
              <td>{result.range}</td>
              <td>{result.flag}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
