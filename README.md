# Appointment Manager

A small appointment management app built for the freelancer practical assessment.

**Stack:** React (Vite) · Node.js · Express · MongoDB (Mongoose) · JavaScript

## Disclosure
- AI assistance: this project was built with help from Claude (Anthropic) for code generation and setup guidance. I ran it locally against MongoDB and tested the flows listed below.
- No starter template was used.
- All data is fictional. The three starting appointments come from the assessment brief.

## Features
- List appointments with customer name, service, date/time and status
- Add an appointment with validation and clear error messages (client and server)
- Change an appointment's status (Pending, Confirmed, Cancelled)
- Filter by All, Pending, Confirmed, Cancelled
- Search by customer name (case-insensitive, works together with the status filter)
- Responsive layout for mobile and desktop
- Data persisted in MongoDB; starting data is seeded only when the collection is empty

## Project structure
```
appointment-manager/
├── server/            Express API + Mongoose
│   ├── src/models/Appointment.js
│   ├── src/routes/appointments.js
│   ├── src/app.js, index.js, seed.js
│   └── .env.example
└── client/            React (Vite) UI
    └── src/ (App.jsx, api.js, components/, styles.css)
```

## Setup and run
Requirements: Node.js 18+ and MongoDB running locally (default port 27017), or a free MongoDB Atlas connection string.

**1. API**
```bash
cd server
cp .env.example .env      # Windows PowerShell: copy .env.example .env
npm install
npm run dev               # http://localhost:5000
```

**2. UI** (second terminal)
```bash
cd client
npm install
npm run dev               # http://localhost:5173
```

On first start the API prints `MongoDB connected` and seeds the starting appointments.

### Environment variables (`server/.env`)
| Name | Example | Purpose |
|---|---|---|
| `PORT` | `5000` | API port |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/appointment_manager` | MongoDB connection string |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Allowed browser origin (CORS) |

`.env` is git-ignored. Only `.env.example` (no secrets) is committed.

## API notes
| Method | Path | Description |
|---|---|---|
| GET | `/api/appointments?status=&search=` | List appointments, sorted by date. `status` is All, Pending, Confirmed or Cancelled. `search` matches customer name, case-insensitive. |
| POST | `/api/appointments` | Create. Body: `customerName`, `service`, `dateTime`, `status`. Returns 201, or 400 with `{ message, errors: { field: text } }`. |
| PATCH | `/api/appointments/:id/status` | Change status. Body: `{ "status": "Confirmed" }`. Returns 400 for an invalid status or id, 404 if not found. |
| GET | `/api/health` | Liveness check. |

## Tests performed
Manual tests, local MongoDB. Tick only what you have tested yourself before submitting.

- [x] Add an appointment with valid data
- [x] Refresh the page: data persists (also visible in MongoDB Compass)
- [ ] Validation: submitting an empty form shows errors for all required fields
- [ ] Change an appointment's status and confirm it saves
- [ ] Filter by Pending, Confirmed, Cancelled and All
- [ ] Search by customer name (upper and lower case), also combined with a status filter
- [ ] Mobile layout checked in browser dev tools

Automated: `cd server && npm test` runs 3 routing and validation-rejection tests that need no database.

## Completed
List, add form with validation, status change, status filter, customer-name search, responsive UI, Express API, MongoDB persistence, seeded starting data.

## Incomplete items and known limitations
- No edit or delete for appointments
- No pagination
- No authentication
- No automated tests that use the database or the UI
- Dates are stored in UTC and shown in the browser's local time zone. The seed times use the server's local time zone.

## Technical decision
Filtering and search run as MongoDB queries on the server instead of in the browser. The search term is regex-escaped and the input is debounced (300 ms), so it stays safe and fast as the data grows. After a status change the list is re-fetched so the active filter always shows correct results.