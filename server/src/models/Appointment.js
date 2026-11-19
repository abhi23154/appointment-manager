import mongoose from 'mongoose';

export const STATUSES = ['Pending', 'Confirmed', 'Cancelled'];

const appointmentSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      maxlength: [100, 'Customer name must be 100 characters or fewer'],
    },
    service: {
      type: String,
      required: [true, 'Service is required'],
      trim: true,
      maxlength: [100, 'Service must be 100 characters or fewer'],
    },
    dateTime: {
      type: Date,
      required: [true, 'Date and time is required'],
    },
    status: {
      type: String,
      enum: { values: STATUSES, message: 'Status must be Pending, Confirmed or Cancelled' },
      default: 'Pending',
    },
  },
  { timestamps: true }
);

appointmentSchema.index({ dateTime: 1 });
appointmentSchema.index({ status: 1 });

export default mongoose.model('Appointment', appointmentSchema);
