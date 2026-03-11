const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = {
  async get(path) {
    const res = await fetch(`${BASE_URL}${path}`);
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    return res.json();
  },
  async post(path, body) {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
    return res.json();
  },
  async put(path, body) {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`PUT ${path} failed: ${res.status}`);
    return res.json();
  },
  async delete(path) {
    const res = await fetch(`${BASE_URL}${path}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`);
    return res.json();
  },
};

// Parts API
export const partsApi = {
  getAll: () => api.get('/api/parts'),
  create: (data) => api.post('/api/parts', data),
  update: (id, data) => api.put(`/api/parts/${id}`, data),
  delete: (id) => api.delete(`/api/parts/${id}`),
};

// Rides API
export const ridesApi = {
  getAll: () => api.get('/api/rides'),
  create: (data) => api.post('/api/rides', data),
  delete: (id) => api.delete(`/api/rides/${id}`),
};