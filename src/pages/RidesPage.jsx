import { useState, useEffect } from 'react';
import { ridesApi } from '../services/api';

function RidesPage() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    distanceKm: '',
    topSpeedKmh: '',
    notes: '',
  });

  useEffect(() => {
    ridesApi.getAll()
      .then(setRides)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newRide = await ridesApi.create({
        ...formData,
        distanceKm: Number(formData.distanceKm),
        topSpeedKmh: formData.topSpeedKmh ? Number(formData.topSpeedKmh) : undefined,
      });
      setRides([newRide, ...rides]);
      setFormData({ date: new Date().toISOString().split('T')[0], distanceKm: '', topSpeedKmh: '', notes: '' });
      setShowForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this ride?')) return;
    try {
      await ridesApi.delete(id);
      setRides(rides.filter(r => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const totalKm = rides.reduce((s, r) => s + r.distanceKm, 0);
  const avgKm = rides.length ? (totalKm / rides.length).toFixed(1) : 0;

  if (loading) return <div className="loading-state">Loading rides...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Ride Log</h1>
          <p className="page-subtitle">{rides.length} rides · {totalKm.toLocaleString()} km total · {avgKm} km avg</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Log Ride'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3 className="form-title">New Ride Entry</h3>
          <form onSubmit={handleSubmit} className="ride-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Distance (km) *</label>
                <input
                  type="number"
                  name="distanceKm"
                  placeholder="e.g. 120"
                  value={formData.distanceKm}
                  onChange={handleChange}
                  className="form-input"
                  required
                  min="0"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Top Speed (km/h)</label>
                <input
                  type="number"
                  name="topSpeedKmh"
                  placeholder="e.g. 180"
                  value={formData.topSpeedKmh}
                  onChange={handleChange}
                  className="form-input"
                  min="0"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                name="notes"
                placeholder="Route, conditions, memorable moments..."
                value={formData.notes}
                onChange={handleChange}
                className="form-input form-textarea"
                rows={3}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Ride'}
              </button>
            </div>
          </form>
        </div>
      )}

      {rides.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🏍️</span>
          <p>No rides logged yet. Hit the road and log your first ride!</p>
          <button className="btn-primary" onClick={() => setShowForm(true)}>Log Your First Ride</button>
        </div>
      ) : (
        <div className="rides-list">
          {[...rides].sort((a, b) => new Date(b.date) - new Date(a.date)).map(ride => (
            <div key={ride._id} className="ride-card">
              <div className="ride-card-left">
                <div className="ride-card-date">
                  {new Date(ride.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                {ride.notes && <div className="ride-card-notes">{ride.notes}</div>}
              </div>
              <div className="ride-card-stats">
                <div className="ride-stat">
                  <span className="ride-stat-value">{ride.distanceKm}</span>
                  <span className="ride-stat-unit">km</span>
                </div>
                {ride.topSpeedKmh && (
                  <div className="ride-stat ride-stat-speed">
                    <span className="ride-stat-value">{ride.topSpeedKmh}</span>
                    <span className="ride-stat-unit">km/h top</span>
                  </div>
                )}
              </div>
              <button className="btn-delete" onClick={() => handleDelete(ride._id)} title="Delete ride">✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RidesPage;