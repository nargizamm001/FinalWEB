# FitTrack — Fitness Tracker Web Application (Advanced Databases / NoSQL)

Deployed frontend (Vercel): https://finalnosql.vercel.app  
Deployed backend (Render/Railway): https://<PASTE_BACKEND_URL_HERE>

## Project overview
FitTrack is a full-stack fitness tracker web application. Users can register, log in, manage workout sessions, track daily metrics (weight, steps, sleep, water), and view analytics (weekly summary, top exercises).
The backend is built with Node.js + Express and MongoDB. The frontend is built with React (Vite). Authentication is implemented using JWT.

## Tech stack
Frontend: React, Vite, Axios, React Router  
Backend: Node.js, Express, Mongoose  
Database: MongoDB Atlas  
Security: JWT, bcrypt  
Validation: Joi  
Deployment: Vercel (frontend), Render/Railway (backend)

## System architecture
Client (React) → REST API (Express) → MongoDB (Mongoose)

## Database design
Collections used:
- users: name, email (unique), passwordHash, role, createdAt/updatedAt
- workouts: user (ref users), date, durationMin, notes, items (exercise refs), sets (embedded)
- metrics: user (ref users), date, weightKg, steps, sleepHours, waterMl
- exercises: name, muscleGroup (if present)

Relationship:
- One user has many workouts and metrics
- Every workout/metric is filtered by the logged-in user (owner)

## Environment variables

Backend (server/.env)
PORT=5000
MONGO_URI=...
JWT_SECRET=...
CLIENT_URL=http://localhost:5173,https://finalnosql.vercel.app

Frontend (client .env / Vercel env)
VITE_API_URL=https://<BACKEND_URL>

## Local setup instructions

1) Clone repository
git clone <repo-url>
cd FinalWEB

2) Run backend
cd server
npm install
cp .env.example .env
npm run dev

3) Run frontend
cd ../client
npm install
Create client/.env and add:
VITE_API_URL=http://localhost:5000
npm run dev

Open: http://localhost:5173

## API documentation

Base URL:
- Local: http://localhost:5000
- Production: https://<BACKEND_URL>

Authentication (public)
POST /api/auth/register
Body:
{
  "name": "User",
  "email": "user@mail.com",
  "password": "StrongPass123"
}

POST /api/auth/login
Body:
{
  "email": "user@mail.com",
  "password": "StrongPass123"
}
Response:
{
  "token": "<JWT>",
  "user": { "id": "...", "name": "...", "email": "...", "role": "user" }
}

User management (private)
Header:
Authorization: Bearer <JWT>

GET /api/users/profile
PUT /api/users/profile

Main resource (private): Workouts
POST /api/workouts
GET /api/workouts
GET /api/workouts/:id
PUT /api/workouts/:id
DELETE /api/workouts/:id

Additional resource (private): Metrics
POST /api/metrics
GET /api/metrics
DELETE /api/metrics/:id

Analytics (private)
GET /api/analytics/weekly-summary
GET /api/analytics/top-exercises

RBAC (bonus)
Admin-only:
DELETE /api/admin/workouts/:id

## Validation and error handling
- Joi validation is applied to auth and resource endpoints
- Global error handler returns meaningful status codes: 400, 401, 403, 404, 500

## Screenshots (required)
Add screenshots to README (or a /screens folder) showing:
1) Home page
2) Register page
3) Login page
4) Profile page (after login)
5) Workouts list
6) Workout details (items/sets)
7) Metrics page
8) Analytics page
9) MongoDB Atlas collections (users + workouts + metrics)
10) Deployment (Vercel + Render/Railway URLs)

## Authors
Tyulebayeva Arailym  
Mnaidarova Nargiza