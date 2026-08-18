# MediSlot

MediSlot is a healthcare discovery and appointment platform that helps patients find nearby hospitals, compare hospital types, and explore doctors and medical services in one place.

It combines a modern frontend interface with a connected backend API for location-aware hospital search, role-based dashboards, and healthcare workflows.

## Overview

MediSlot is designed to make hospital discovery easier for patients and medical staff by combining:

- hospital search by name, area, specialization, and radius
- live nearby-location filtering using coordinates
- registered hospital and external directory results
- role-based dashboards for patient, doctor, and hospital admin
- booking flow and healthcare access experience

## Key Features

- Nearby hospital search using latitude and longitude
- Radius filters such as 1 km, 5 km, 10 km, 25 km, and 50 km
- Search by hospital name, specialty, city, or area
- Filtering by specialization and hospital registration type
- Support for both registered MediSlot hospitals and directory-based external hospitals
- Patient, doctor, and admin dashboard views
- Responsive layout for desktop and mobile screens
- Express + Prisma backend with JWT authentication support

## App Screenshot

![MediSlot hospital search dashboard](https://images.unsplash.com/photo-1538108149393-fbbd818959e6?auto=format&fit=crop&w=1400&q=80)

## Tech Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Lucide icons

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT authentication
- Socket.io support

## Project Structure

```bash
medislot/
├── backend/
│   ├── prisma/
│   ├── src/
│   ├── tests/
│   ├── .env.local
│   └── package.json
├── frontend/
│   ├── app/
│   ├── components/
│   ├── context/
│   ├── services/
│   ├── types/
│   ├── .env.local
│   └── package.json
└── README.md
```

## Getting Started

### 1) Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2) Configure environment variables

Create local environment files if needed:

#### Backend
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_database_url
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

#### Frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3) Start the backend

```bash
cd backend
npm run dev
```

### 4) Start the frontend

```bash
cd frontend
npm run dev
```

Then open:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Main Modules

- Hospital search and location filtering
- User authentication and role-based access
- Booking logic and appointment scheduling
- Hospital profile and doctor listings
- Platform dashboards for different user roles

## Status

This project is actively evolving toward a healthcare booking and hospital discovery platform for real-world deployment.

## License

This project is intended for internal/demo usage unless a different license is added later.
