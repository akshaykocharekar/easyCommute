# 🚌 EasyCommute

A full-stack smart bus tracking and commute management platform. EasyCommute lets passengers track buses in real time, search routes, find nearby stops, and manage subscriptions — while giving operators and admins dedicated dashboards to manage the entire system.

**Live Demo → [easy-commute-one.vercel.app](https://easy-commute-one.vercel.app)**

---

## What is EasyCommute?

EasyCommute was built as a Final-year academic project with the goal of solving a real problem — the lack of reliable, real-time public bus information for daily commuters. Instead of guessing when the next bus arrives, passengers can open EasyCommute and see exactly where buses are, how full they are, and when they'll arrive.

The platform has three types of users:

- **Passengers** — search routes, track buses live on a map, check occupancy, and subscribe to premium features
- **Bus Operators** — update their bus location in real time, manage their assigned route, and view their panel
- **Admins** — manage users, operators, buses, routes, subscriptions, and support requests from a dedicated dashboard

---

## Features

### For Passengers

- 🗺️ **Live Bus Tracking** — see buses moving on an interactive map in real time
- 🔍 **Route Search** — search for routes between stops
- 📍 **Nearby Buses** — find buses closest to your current location
- ⏱️ **ETA Estimation** — get arrival time estimates for your route
- 🚌 **Occupancy Indicator** — know how crowded a bus is before boarding
- 💳 **Premium Subscription** — upgrade via Razorpay for advanced features
- 📱 **PWA Support** — installable as an app on mobile

### For Bus Operators

- 📡 **Live Location Updates** — broadcast real-time GPS location via Socket.IO
- 🗂️ **Operator Panel** — manage your assigned bus and route
- ✅ **Verification System** — operators are approved by admin before going live

### For Admins

- 👥 **User Management** — view, delete, grant premium, and reset passwords for users
- 🚌 **Bus Management** — create, assign, and approve buses
- 🛣️ **Route Management** — create routes, add stops, assign buses
- 🔧 **Operator Management** — verify or reject operator applications
- 📊 **Dashboard Stats** — overview of platform activity
- 🛡️ **Integrity Reports** — detect data issues like unassigned buses
- 🎫 **Support Requests** — view and respond to user support tickets

---

## Tech Stack

### Frontend

| Tech                    | Purpose             |
| ----------------------- | ------------------- |
| React 19                | UI framework        |
| Vite                    | Build tool          |
| Tailwind CSS 4          | Styling             |
| React Router 7          | Client-side routing |
| Leaflet + React Leaflet | Interactive maps    |
| Socket.IO Client        | Real-time updates   |
| Framer Motion           | Animations          |
| Recharts                | Admin charts        |
| Axios                   | HTTP requests       |
| React Hot Toast         | Notifications       |
| Vite PWA Plugin         | Progressive Web App |

### Backend

| Tech                | Purpose                           |
| ------------------- | --------------------------------- |
| Node.js + Express 5 | Server framework                  |
| MongoDB + Mongoose  | Database                          |
| Socket.IO           | Real-time WebSocket communication |
| JWT (jsonwebtoken)  | Authentication                    |
| bcryptjs            | Password hashing                  |
| Razorpay            | Payment processing                |

### Deployment

| Service       | What             |
| ------------- | ---------------- |
| Vercel        | Frontend hosting |
| Render        | Backend hosting  |
| MongoDB Atlas | Database         |

---

## Project Structure

```
easyCommute/
├── frontend/
│   └── src/
│       ├── api/          # Axios instance
│       ├── components/   # Shared UI components
│       ├── context/      # Auth context
│       ├── layouts/      # Dashboard layout
│       ├── pages/        # All page components
│       └── services/     # API service helpers
└── backend/
    └── src/
        ├── config/       # DB, Razorpay config
        ├── controllers/  # Route handlers
        ├── middleware/   # Auth, role guards
        ├── models/       # Mongoose schemas
        ├── routes/       # Express routers
        └── utils/        # Geo utilities
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Razorpay account (test keys are fine)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/easyCommute.git
cd easyCommute
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Start the backend:

```bash
npm run dev
```

### 3. Set up the frontend

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Creating an Admin Account

There's no public registration for admin accounts. Seed one directly in MongoDB:

```js
db.users.insertOne({
  name: "Admin",
  email: "admin@easycommute.com",
  password: "<bcrypt-hashed-password>",
  role: "SUPER_ADMIN",
  emailVerified: true,
  subscriptionPlan: "FREE",
  subscriptionStatus: "INACTIVE",
});
```

To generate a bcrypt hash for the password, run this once in Node:

```js
const bcrypt = require("bcryptjs");
console.log(await bcrypt.hash("yourpassword", 10));
```

---

## Authentication

EasyCommute uses simple email/password authentication with JWT tokens.

- Register → instant account creation, logged in immediately
- Login → email + password → JWT stored in localStorage
- **Forgot password?** → contact the admin. Admins can reset any user's password from Admin → Users → Reset Password

---

## API Overview

All endpoints are prefixed with `/api`.

| Method | Endpoint                          | Description                      |
| ------ | --------------------------------- | -------------------------------- |
| POST   | `/auth/register`                  | Register a new user              |
| POST   | `/auth/register-operator`         | Register as a bus operator       |
| POST   | `/auth/login`                     | Login                            |
| GET    | `/auth/me`                        | Get current user                 |
| GET    | `/api/buses`                      | List all buses                   |
| GET    | `/api/routes`                     | List all routes                  |
| GET    | `/api/nearby`                     | Find nearby buses                |
| GET    | `/api/search`                     | Search routes                    |
| GET    | `/api/eta/:busId`                 | Get ETA for a bus                |
| POST   | `/api/payment`                    | Initiate Razorpay payment        |
| GET    | `/admin/users`                    | List all users (admin only)      |
| PUT    | `/admin/users/:id/reset-password` | Reset user password (admin only) |
| PATCH  | `/admin/operators/:id/verify`     | Verify operator (admin only)     |

---

## Environment Variables Reference

### Backend `.env`

| Variable              | Description                   |
| --------------------- | ----------------------------- |
| `PORT`                | Server port (default 5000)    |
| `MONGO_URI`           | MongoDB connection string     |
| `JWT_SECRET`          | Secret for signing JWT tokens |
| `RAZORPAY_KEY_ID`     | Razorpay public key           |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key           |

### Frontend `.env`

| Variable       | Description          |
| -------------- | -------------------- |
| `VITE_API_URL` | Backend API base URL |

---

## Academic Context

This project was developed as part of a Final Year Bca curriculum to demonstrate a production-ready full-stack application using modern web technologies. It covers real-time systems, REST API design, role-based access control, payment integration, and geolocation features.

---

## License

MIT
