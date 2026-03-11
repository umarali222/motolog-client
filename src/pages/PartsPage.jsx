import { useState, useEffect } from 'react';
import WearBar from '../components/WearBar';
import { partsApi } from '../services/api';

function PartsPage() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingWear, setEditingWear] = useState(null);
  const [wearInput, setWearInput] = useState('');
  const [formData, setFormData] = useState({
    partName: '',
    brand: '',
    lifespanKm: '',
    currentWearKm: '0',
    status: 'Optimal',
    notes: '',
  });

  useEffect(() => {
    partsApi.getAll()
      .then(setParts)
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
      const newPart = await partsApi.create({
        ...formData,
        lifespanKm: Number(formData.lifespanKm),
        currentWearKm: Number(formData.currentWearKm),
      });
      setParts([newPart, ...parts]);
      setFormData({ partName: '', brand: '', lifespanKm: '', currentWearKm: '0', status: 'Optimal', notes: '' });
      setShowForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this part from your MotoLog?')) return;
    try {
      await partsApi.delete(id);
      setParts(parts.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddWear = async (part, amount) => {
    const newWear = part.currentWearKm + amount;
    const pct = (newWear / part.lifespanKm) * 100;
    const newStatus = pct >= 90 ? 'Needs Replacement' : pct >= 65 ? 'Warning' : 'Optimal';
    try {
      const updated = await partsApi.update(part._id, { currentWearKm: newWear, status: newStatus });
      setParts(parts.map(p => p._id === part._id ? updated : p));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetWear = async (part) => {
    const val = Number(wearInput);
    if (isNaN(val) || val < 0) return;
    const pct = (val / part.lifespanKm) * 100;
    const newStatus = pct >= 90 ? 'Needs Replacement' : pct >= 65 ? 'Warning' : 'Optimal';
    try {
      const updated = await partsApi.update(part._id, { currentWearKm: val, status: newStatus });
      setParts(parts.map(p => p._id === part._id ? updated : p));
      setEditingWear(null);
      setWearInput('');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading-state">Loading parts...</div>;

  const criticalCount = parts.filter(p => {
    const pct = (p.currentWearKm / p.lifespanKm) * 100;
    return pct >= 65;
  }).length;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Parts Tracker</h1>
          <p className="page-subtitle">
            {parts.length} parts tracked
            {criticalCount > 0 && <span className="warning-badge"> · ⚠️ {criticalCount} need attention</span>}
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add Part'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3 className="form-title">Register New Part</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Part Name *</label>
                <input type="text" name="partName" placeholder="e.g. Rotto Petal Disc Brake" value={formData.partName} onChange={handleChange} className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Brand</label>
                <input type="text" name="brand" placeholder="e.g. DID, EBC, NGK" value={formData.brand} onChange={handleChange} className="form-input" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Lifespan (km) *</label>
                <input type="number" name="lifespanKm" placeholder="e.g. 15000" value={formData.lifespanKm} onChange={handleChange} className="form-input" required min="1" />
              </div>
              <div className="form-group">
                <label className="form-label">Current Wear (km)</label>
                <input type="number" name="currentWearKm" placeholder="0" value={formData.currentWearKm} onChange={handleChange} className="form-input" min="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="form-input form-select">
                  <option value="Optimal">Optimal</option>
                  <option value="Warning">Warning</option>
                  <option value="Needs Replacement">Needs Replacement</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <input type="text" name="notes" placeholder="Install notes, part number, etc." value={formData.notes} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Add Part'}
              </button>
            </div>
          </form>
        </div>
      )}

      {parts.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">⚙️</span>
          <p>No parts tracked yet. Add your first part to start monitoring wear.</p>
          <button className="btn-primary" onClick={() => setShowForm(true)}>Add First Part</button>
        </div>
      ) : (
        <div className="parts-grid">
          {parts.map(part => {
            const pct = (part.currentWearKm / part.lifespanKm) * 100;
            const borderColor = pct >= 90 ? 'var(--red)' : pct >= 65 ? 'var(--orange)' : 'var(--blue)';
            return (
              <div key={part._id} className="part-card" style={{ '--border-accent': borderColor }}>
                <div className="part-card-header">
                  <div>
                    <h3 className="part-name">{part.partName}</h3>
                    {part.brand && <span className="part-brand">{part.brand}</span>}
                  </div>
                  <button className="btn-delete" onClick={() => handleDelete(part._id)} title="Remove part">✕</button>
                </div>

                <WearBar currentWearKm={part.currentWearKm} lifespanKm={part.lifespanKm} status={part.status} />

                {part.notes && <p className="part-notes">{part.notes}</p>}

                <div className="part-card-actions">
                  <button className="btn-wear" onClick={() => handleAddWear(part, 100)}>+100 km</button>
                  <button className="btn-wear" onClick={() => handleAddWear(part, 500)}>+500 km</button>
                  <button className="btn-wear btn-wear-set" onClick={() => { setEditingWear(part._id); setWearInput(String(part.currentWearKm)); }}>
                    Set Wear
                  </button>
                </div>

                {editingWear === part._id && (
                  <div className="wear-edit-row">
                    <input
                      type="number"
                      value={wearInput}
                      onChange={e => setWearInput(e.target.value)}
                      className="form-input wear-edit-input"
                      placeholder="Enter km"
                      min="0"
                      autoFocus
                    />
                    <button className="btn-primary" onClick={() => handleSetWear(part)}>Save</button>
                    <button className="btn-ghost" onClick={() => setEditingWear(null)}>Cancel</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PartsPage;