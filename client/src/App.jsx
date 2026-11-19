import { useCallback, useEffect, useState } from 'react';
import { getAppointments, updateStatus } from './api.js';
import AppointmentForm from './components/AppointmentForm.jsx';
import AppointmentList from './components/AppointmentList.jsx';
import Filters from './components/Filters.jsx';

export default function App() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await getAppointments({ status, search: debounced }));
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [status, debounced]);

  useEffect(() => { load(); }, [load]);

  async function handleStatusChange(id, next) {
    try {
      await updateStatus(id, next);
      setError('');
      await load(); // re-fetch so the active filter stays correct
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="shell">
      <header>
        <h1>Appointments</h1>
        <p>{items.length} shown</p>
      </header>
      <div className="layout">
        <AppointmentForm onCreated={load} />
        <section>
          <Filters status={status} onStatus={setStatus} search={search} onSearch={setSearch} />
          {error && <p className="banner" role="alert">{error}</p>}
          <AppointmentList items={items} loading={loading} filtered={status !== 'All' || !!debounced.trim()}
            onStatusChange={handleStatusChange} />
        </section>
      </div>
    </main>
  );
}
