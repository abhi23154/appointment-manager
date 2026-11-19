import { Router } from 'express';
import Appointment, { STATUSES } from '../models/Appointment.js';

const router = Router();
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/appointments?status=Pending&search=alex
router.get(
  '/',
  wrap(async (req, res) => {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== 'All') {
      if (!STATUSES.includes(status)) {
        return res.status(400).json({ message: 'Invalid status filter' });
      }
      filter.status = status;
    }
    if (typeof search === 'string' && search.trim()) {
      filter.customerName = { $regex: escapeRegex(search.trim()), $options: 'i' };
    }

    res.json(await Appointment.find(filter).sort({ dateTime: 1 }));
  })
);

// POST /api/appointments
router.post(
  '/',
  wrap(async (req, res) => {
    const { customerName, service, dateTime, status } = req.body ?? {};
    const created = await Appointment.create({ customerName, service, dateTime, status });
    res.status(201).json(created);
  })
);

// PATCH /api/appointments/:id/status
router.patch(
  '/:id/status',
  wrap(async (req, res) => {
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: req.body?.status },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Appointment not found' });
    res.json(updated);
  })
);

export default router;
