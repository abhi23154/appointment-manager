import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';
import { seedIfEmpty } from './seed.js';

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is missing. Copy server/.env.example to server/.env');
  process.exit(1);
}

try {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  console.log('MongoDB connected');
  await seedIfEmpty();
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
} catch (err) {
  console.error('Could not connect to MongoDB:', err.message);
  process.exit(1);
}
