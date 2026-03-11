function StatCard({ label, value, unit, accent, icon }) {
  return (
    <div className="stat-card" style={{ '--accent': accent || 'var(--blue)' }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-body">
        <div className="stat-value">
          {value}
          {unit && <span className="stat-unit">{unit}</span>}
        </div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

export default StatCard;