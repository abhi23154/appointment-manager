import express from 'express';
import cors from 'cors';
import appointmentsRouter from './routes/appointments.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/appointments', appointmentsRouter);

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const errors = {};
    for (const [field, e] of Object.entries(err.errors)) {
      errors[field] = e.name === 'CastError' ? `Enter a valid ${field === 'dateTime' ? 'date and time' : field}` : e.message;
    }
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Invalid ${err.path}` });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON body' });
  }
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

export default app;
