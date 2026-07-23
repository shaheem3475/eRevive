# eRevive

eRevive is a circular e-waste platform prototype for selling devices, scheduling recycling, donating technology, locating collection points, and redeeming Eco Points.

## Installation

1. Install Node.js 18+ and MongoDB.
2. Copy `backend/.env.example` to `backend/.env` and set Firebase Admin, Firebase Web, MongoDB, Cloudinary, and `FRONTEND_ORIGINS` values.
3. Run `npm install` from `backend`.
4. Run `npm run dev` from `backend` and open `http://localhost:5000`.

Firebase Authentication must enable Email/Password and Google providers as appropriate. Cloudinary is required for donation image uploads.

## Folder structure

`index.html`, `dashboard.html`, and `styles.css` are the static frontend. `backend/config` holds integrations, `controllers` holds API logic, `middleware` protects and validates requests, `models` defines MongoDB documents, `routes` defines API endpoints, and `services` contains Cloudinary and business rules.

## Security model

The backend verifies Firebase ID tokens on private APIs. It derives Firebase UID and email exclusively from verified claims, calculates prices/charges/reward costs on the server, and stores durable dashboard data in MongoDB. Do not commit `backend/.env`.

## API

See [docs/API.md](docs/API.md).
