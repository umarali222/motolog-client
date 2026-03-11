import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import StatCard from '../components/StatCard';
import WearBar from '../components/WearBar';
import { ridesApi, partsApi } from '../services/api';

function Dashboard() {
  const [rides, setRides] = useState([]);
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([ridesApi.getAll(), partsApi.getAll()])
      .then(([ridesData, partsData]) => {
        setRides(ridesData);
        setParts(partsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalKm = rides.reduce((sum, r) => sum + r.distanceKm, 0);
  const topSpeed = rides.reduce((max, r) => Math.max(max, r.topSpeedKmh || 0), 0);
  const criticalParts = parts.filter(p => {
    const pct = (p.currentWearKm / p.lifespanKm) * 100;
    return pct >= 65 || p.status === 'Needs Replacement' || p.status === 'Warning';
  });

  // Last 7 rides for chart
  const chartData = [...rides]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-7)
    .map(r => ({
      date: new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      km: r.distanceKm,
      speed: r.topSpeedKmh || 0,
    }));

  if (loading) return <div className="loading-state">Loading your MotoLog...</div>;

  return (
    <div className="page dashboard-page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Your ride intelligence at a glance</p>
      </div>

      {/* Stats Row */}
      <div className="stats-grid">
        <StatCard label="Total Distance" value={totalKm.toLocaleString()} unit=" km" icon="🛣️" accent="var(--blue)" />
        <StatCard label="Total Rides" value={rides.length} icon="🏍️" accent="var(--purple)" />
        <StatCard label="Top Speed" value={topSpeed} unit=" km/h" icon="⚡" accent="var(--orange)" />
        <StatCard label="Parts Tracked" value={parts.length} icon="⚙️" accent="var(--green)" />
      </div>

      {/* Charts Row */}
      {chartData.length > 0 && (
        <div className="charts-grid">
          <div className="chart-card">
            <h3 className="chart-title">Distance per Ride <span className="chart-sub">(last 7)</span></h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="date" tick={{ fill: '#666', fontSize: 11 }} />
                <YAxis tick={{ fill: '#666', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                  itemStyle={{ color: '#4da8da' }}
                />
                <Bar dataKey="km" fill="#4da8da" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Top Speed Trend <span className="chart-sub">(last 7)</span></h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="date" tick={{ fill: '#666', fontSize: 11 }} />
                <YAxis tick={{ fill: '#666', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                  itemStyle={{ color: '#ff9800' }}
                />
                <Line type="monotone" dataKey="speed" stroke="#ff9800" strokeWidth={2} dot={{ fill: '#ff9800', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {chartData.length === 0 && (
        <div className="empty-chart-state">
          <span>📊</span>
          <p>Log some rides to see your charts populate here</p>
        </div>
      )}

      {/* Parts Alerts */}
      {criticalParts.length > 0 && (
        <div className="alerts-section">
          <h3 className="section-title">⚠️ Maintenance Alerts</h3>
          <div className="alerts-list">
            {criticalParts.map(part => (
              <div key={part._id} className="alert-card">
                <div className="alert-part-name">{part.partName}</div>
                <WearBar
                  currentWearKm={part.currentWearKm}
                  lifespanKm={part.lifespanKm}
                  status={part.status}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Rides */}
      {rides.length > 0 && (
        <div className="recent-section">
          <h3 className="section-title">Recent Rides</h3>
          <div className="recent-list">
            {[...rides].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5).map(ride => (
              <div key={ride._id} className="recent-ride-row">
                <span className="ride-date">{new Date(ride.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                <span className="ride-dist">{ride.distanceKm} km</span>
                {ride.topSpeedKmh && <span className="ride-speed">⚡ {ride.topSpeedKmh} km/h</span>}
                {ride.notes && <span className="ride-notes">{ride.notes}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;