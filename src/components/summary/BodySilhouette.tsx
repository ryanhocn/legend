/** Simple front-facing body outline used as the backdrop for lines/drains/wounds. */
export function BodySilhouette() {
  return (
    <svg viewBox="0 0 100 200" className="body-silhouette" aria-hidden="true">
      <circle cx="50" cy="22" r="16" />
      <rect x="33" y="40" width="34" height="74" rx="13" />
      <rect x="18" y="46" width="12" height="60" rx="6" />
      <rect x="70" y="46" width="12" height="60" rx="6" />
      <rect x="35" y="108" width="13" height="84" rx="6" />
      <rect x="52" y="108" width="13" height="84" rx="6" />
    </svg>
  );
}
