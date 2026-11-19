const BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(BASE + path, { headers: { 'Content-Type': 'application/json' }, ...options });
  } catch {
    throw Object.assign(new Error('Cannot reach the server. Check that the API is running.'), { fields: {} });
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw Object.assign(new Error(data.message || 'Request failed'), { fields: data.errors || {} });
  }
  return data;
}

export const STATUSES = ['Pending', 'Confirmed', 'Cancelled'];

export const getAppointments = ({ status, search }) => {
  const params = new URLSearchParams();
  if (status && status !== 'All') params.set('status', status);
  if (search.trim()) params.set('search', search.trim());
  return request(`/appointments?${params}`);
};

export const createAppointment = (body) =>
  request('/appointments', { method: 'POST', body: JSON.stringify(body) });

export const updateStatus = (id, status) =>
  request(`/appointments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
