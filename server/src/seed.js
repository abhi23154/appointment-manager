import Appointment from './models/Appointment.js';

// Starting data from the assessment brief. Inserted only when the collection is empty.
const STARTING_DATA = [
  { customerName: 'Alex Morgan', service: 'Consultation', dateTime: new Date('2026-11-02T10:00:00'), status: 'Pending' },
  { customerName: 'Jamie Lee', service: 'Follow-up', dateTime: new Date('2026-11-02T11:30:00'), status: 'Confirmed' },
  { customerName: 'Taylor Smith', service: 'Review', dateTime: new Date('2026-11-03T14:00:00'), status: 'Cancelled' },
];

export async function seedIfEmpty() {
  if ((await Appointment.estimatedDocumentCount()) === 0) {
    await Appointment.insertMany(STARTING_DATA);
    console.log('Seeded starting appointments from the brief');
  }
}
