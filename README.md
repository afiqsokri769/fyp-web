# Cabin Crew Motorsport Web System

**FYP Project | 2025**

A full-stack motorcycle service booking web application for Cabin Crew Motorsport — a specialist LC 135 workshop located in Kampung Seri Malaysia, Kuala Lumpur, Malaysia.

---

## Project Description

This system solves three real-world problems for the workshop:
1. **No online presence** — customers could not find service info, location, or operating hours
2. **No authentication system** — no way for customers to create accounts or track bookings
3. **No booking system** — customers had to physically visit or call to make appointments

The application serves two user groups:
- **Customers** — register, browse services, book appointments, track bookings, submit inquiries
- **Admins** — manage customers, services, bookings, and inquiries from a protected dashboard

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v3 + CSS Variables |
| Animations | Framer Motion |
| Icons | Lucide React |
| Backend | FastAPI (Python 3.11+) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email + OTP/MFA) |
| Storage | Supabase Storage |
| State | Zustand |
| HTTP | Axios |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Drag & Drop | @dnd-kit |

---

## Prerequisites

- Node.js 18+
- Python 3.11+
- Supabase account (free tier sufficient)
- Git

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd cabin-crew-motorsport
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the schema:
   ```
   database/schema.sql
   ```
3. Run the seed data:
   ```
   database/seed.sql
   ```
4. Go to **Storage** and create two buckets:
   - `avatars` (public)
   - `service-images` (public)
5. Copy your **Project URL** and **anon key** from Project Settings → API

### 3. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials and JWT secret

# Start the server
uvicorn main:app --reload --port 8000
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your Supabase URL, anon key, and API URL

# Start development server
npm run dev
```

### 5. Access the Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |

---

## Default Admin Account

After setup, create an admin account:

1. Register via `/register` with any email
2. In **Supabase Table Editor**, open the `profiles` table
3. Find your profile row and change `role` from `customer` to `admin`
4. Log in — you will be redirected to `/admin`

---

## Project Structure

```
cabin-crew-motorsport/
├── database/
│   ├── schema.sql          # All tables, triggers, RLS policies
│   └── seed.sql            # Initial data (time slots, FAQs, services)
├── backend/
│   ├── main.py             # FastAPI app entry point
│   ├── config.py           # Settings (Pydantic)
│   ├── database.py         # Supabase client
│   ├── models/             # Pydantic request/response models
│   ├── routers/            # API route handlers
│   ├── middleware/         # JWT auth middleware
│   └── utils/              # Helpers (rate limiter, email)
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Router setup
│   │   ├── components/     # Reusable UI + layout components
│   │   ├── pages/          # All 16 pages
│   │   ├── store/          # Zustand state stores
│   │   ├── services/       # Axios API service functions
│   │   └── utils/          # Constants, formatters, validators
│   └── index.html
├── docker-compose.yml
└── README.md
```

---

## Features

### Customer Features
- Register and login with email/password
- Multi-Factor Authentication (OTP via email)
- Browse and filter workshop services
- 3-step booking wizard with date/time slot selection
- View and cancel bookings
- Submit and track inquiries with admin replies
- Manage profile, avatar, and security settings

### Admin Features
- Dashboard with live stats and Recharts visualisations
- Manage customers (search, disable, export CSV)
- Manage services (CRUD, drag-to-reorder, image upload)
- Manage bookings (status updates, bulk actions, export)
- Reply to inquiries and manage status

### Technical Features
- Glassmorphism "Liquid Metal Racing" UI design
- Framer Motion spring animations throughout
- Fully responsive (mobile, tablet, desktop)
- Row-Level Security on all database tables
- JWT authentication with Supabase
- Skeleton loaders and empty/error states

---

## Docker (Optional)

```bash
# Build and run both services
docker-compose up --build

# Frontend: http://localhost:5173
# Backend: http://localhost:8000
```

---

## Author

[Student Name] — [Student ID] — [University] — 2025

*Cabin Crew Motorsport FYP Project*
