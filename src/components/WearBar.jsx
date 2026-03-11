function WearBar({ currentWearKm, lifespanKm, status }) {
  const pct = Math.min((currentWearKm / lifespanKm) * 100, 100);

  const getColor = () => {
    if (pct >= 90 || status === 'Needs Replacement') return 'var(--red)';
    if (pct >= 65 || status === 'Warning') return 'var(--orange)';
    return 'var(--green)';
  };

  const getLabel = () => {
    if (pct >= 90) return 'REPLACE NOW';
    if (pct >= 65) return 'WARNING';
    return 'OPTIMAL';
  };

  return (
    <div className="wear-bar-container">
      <div className="wear-bar-header">
        <span className="wear-pct">{Math.round(pct)}% worn</span>
        <span className="wear-status-badge" style={{ color: getColor(), borderColor: getColor() }}>
          {getLabel()}
        </span>
      </div>
      <div className="wear-bar-track">
        <div
          className="wear-bar-fill"
          style={{ width: `${pct}%`, backgroundColor: getColor() }}
        />
      </div>
      <div className="wear-bar-footer">
        <span>{currentWearKm.toLocaleString()} km</span>
        <span>{lifespanKm.toLocaleString()} km max</span>
      </div>
    </div>
  );
}

export default WearBar;
