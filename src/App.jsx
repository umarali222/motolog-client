import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [parts, setParts] = useState([]);
  
  // 1. This state holds whatever you type into the form
  const [formData, setFormData] = useState({
    partName: '',
    brand: '',
    lifespanKm: ''
  });

  // Fetch parts when the page loads
  useEffect(() => {
    fetch('http://localhost:5000/api/parts')
      .then(res => res.json())
      .then(data => setParts(data))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  // 2. This handles updating the state as you type
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. This fires when you hit the "Add Part" button
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the page from reloading
    
    try {
      const response = await fetch('http://localhost:5000/api/parts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // We convert the lifespan to a number just in case!
        body: JSON.stringify({
          ...formData,
          lifespanKm: Number(formData.lifespanKm) 
        }),
      });

      const newPart = await response.json();
      
      // Add the new part to our screen instantly
      setParts([newPart, ...parts]); 
      
      // Clear the form boxes
      setFormData({ partName: '', brand: '', lifespanKm: '' }); 
    } catch (error) {
      console.error("Error adding part:", error);
    }
  };
// 4. This fires when you click a red Delete button
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/parts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // This filters the deleted part out of your React state so it instantly vanishes from the screen!
        setParts(parts.filter(part => part._id !== id));
      }
    } catch (error) {
      console.error("Error deleting part:", error);
    }
  };

  return (
    <div className="app-container">
      <h1>Motolog Dashboard</h1>

      {/* --- THE NEW ADD PART FORM --- */}
      <div style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
        <h3 style={{ marginTop: 0, color: '#4da8da' }}>+ Add New Motorcycle Part</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            name="partName" 
            placeholder="Part Name (e.g. Chain)" 
            value={formData.partName} 
            onChange={handleInputChange}
            required
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #333', backgroundColor: '#2a2a2a', color: '#fff', flex: 1 }}
          />
          <input 
            type="text" 
            name="brand" 
            placeholder="Brand (e.g. DID)" 
            value={formData.brand} 
            onChange={handleInputChange}
            required
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #333', backgroundColor: '#2a2a2a', color: '#fff', flex: 1 }}
          />
          <input 
            type="number" 
            name="lifespanKm" 
            placeholder="Lifespan in Km" 
            value={formData.lifespanKm} 
            onChange={handleInputChange}
            required
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #333', backgroundColor: '#2a2a2a', color: '#fff', width: '150px' }}
          />
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4da8da', color: '#000', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
            Add Part
          </button>
        </form>
      </div>
      {/* ----------------------------- */}
      
      {parts.length === 0 ? (
        <p>Loading your parts from the cloud...</p>
      ) : (
        parts.map(part => (
          // Notice we added 'position: relative' here so we can pin the button to the corner
          <div key={part._id} className="part-card" style={{ backgroundColor: '#1e1e1e', padding: '20px', marginTop: '15px', borderRadius: '10px', borderLeft: '4px solid #4da8da', position: 'relative' }}>
            <h2 style={{ marginTop: '0', color: '#fff' }}>{part.partName}</h2>
            <p style={{ color: '#aaa' }}>Brand: {part.brand}</p>
            <p style={{ color: '#aaa' }}>Total Lifespan: {part.lifespanKm} km</p>
            <p style={{ color: '#4da8da', fontWeight: 'bold' }}>Current Wear: {part.currentWearKm} km</p>
            
            {/* THE NEW DELETE BUTTON */}
            <button 
              onClick={() => handleDelete(part._id)} 
              style={{ position: 'absolute', top: '20px', right: '20px', padding: '8px 15px', backgroundColor: '#e53935', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default App;