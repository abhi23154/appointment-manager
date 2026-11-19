import { STATUSES } from '../api.js';

const fmt = (iso) =>
  new Date(iso).toLocaleString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function AppointmentList({ items, loading, filtered, onStatusChange }) {
  if (loading && !items.length) return <p className="note">Loading appointments…</p>;
  if (!items.length) {
    return <p className="note">{filtered ? 'No appointments match these filters.' : 'No appointments yet. Add the first one using the form.'}</p>;
  }
  return (
    <ul className="list">
      {items.map((a) => (
        <li key={a._id} className="item">
          <div className="who">
            <strong>{a.customerName}</strong>
            <span>{a.service}</span>
          </div>
          <time dateTime={a.dateTime}>{fmt(a.dateTime)}</time>
          <div className="state">
            <span className={`badge ${a.status.toLowerCase()}`}>{a.status}</span>
            <select aria-label={`Change status for ${a.customerName}`} value={a.status}
              onChange={(e) => onStatusChange(a._id, e.target.value)}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </li>
      ))}
    </ul>
  );
}
