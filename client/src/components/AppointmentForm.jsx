import { useState } from 'react';
import { STATUSES, createAppointment } from '../api.js';

const empty = { customerName: '', service: '', dateTime: '', status: 'Pending' };

function validate(v) {
  const e = {};
  if (!v.customerName.trim()) e.customerName = 'Enter the customer name';
  if (!v.service.trim()) e.service = 'Enter the service';
  if (!v.dateTime) e.dateTime = 'Choose a date and time';
  return e;
}

export default function AppointmentForm({ onCreated }) {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    try {
      await createAppointment({ ...values, dateTime: new Date(values.dateTime).toISOString() });
      setValues(empty);
      onCreated();
    } catch (err) {
      setErrors(err.fields || {});
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const field = (name, label, input) => (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      {input}
      {errors[name] && <p className="error" id={`${name}-error`} role="alert">{errors[name]}</p>}
    </div>
  );

  return (
    <form className="panel form" onSubmit={handleSubmit} noValidate>
      <h2>New appointment</h2>
      {field('customerName', 'Customer name',
        <input id="customerName" value={values.customerName} onChange={set('customerName')}
          maxLength={100} aria-invalid={!!errors.customerName} aria-describedby="customerName-error" />)}
      {field('service', 'Service',
        <input id="service" value={values.service} onChange={set('service')}
          maxLength={100} aria-invalid={!!errors.service} aria-describedby="service-error" />)}
      {field('dateTime', 'Date and time',
        <input id="dateTime" type="datetime-local" value={values.dateTime} onChange={set('dateTime')}
          aria-invalid={!!errors.dateTime} aria-describedby="dateTime-error" />)}
      {field('status', 'Status',
        <select id="status" value={values.status} onChange={set('status')}>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>)}
      {formError && !Object.keys(errors).length && <p className="error" role="alert">{formError}</p>}
      <button className="primary" disabled={saving}>{saving ? 'Saving…' : 'Add appointment'}</button>
    </form>
  );
}
