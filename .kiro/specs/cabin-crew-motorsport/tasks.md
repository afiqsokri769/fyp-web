# Implementation Tasks: Cabin Crew Motorsport

## Phase 1: Database & Configuration

- [x] 1. Create database schema and seed files
  - [x] 1.1 Create `database/schema.sql` with all 8 tables (profiles, services, bookings, booking_services, inquiries, faqs, time_slots, blocked_dates), triggers, functions, and RLS policies
  - [x] 1.2 Create `database/seed.sql` with 7 time slots, 10 FAQs, and 8 services seed data

## Phase 2: Backend (FastAPI)

- [-] 2. Scaffold FastAPI project structure
  - [x] 2.1 Create `backend/requirements.txt` with all pinned dependencies
  - [x] 2.2 Create `backend/.env.example` with all required environment variable keys
  - [x] 2.3 Create `backend/config.py` with Pydantic settings model
  - [x] 2.4 Create `backend/database.py` with Supabase client initialisation (anon + service role clients)
  - [x] 2.5 Create `backend/main.py` with FastAPI app, CORS middleware, and router registration

- [ ] 3. Create Pydantic models
  - [ ] 3.1 Create `backend/models/auth.py` — RegisterRequest, LoginRequest, OTPVerifyRequest, TokenResponse
  - [ ] 3.2 Create `backend/models/user.py` — ProfileResponse, ProfileUpdateRequest, PasswordChangeRequest
  - [ ] 3.3 Create `backend/models/booking.py` — BookingCreate, BookingResponse, BookingStatusUpdate, AvailableSlotResponse
  - [ ] 3.4 Create `backend/models/service.py` — ServiceCreate, ServiceUpdate, ServiceResponse
  - [ ] 3.5 Create `backend/models/inquiry.py` — InquiryCreate, InquiryResponse, InquiryReplyRequest

- [ ] 4. Create auth middleware and utilities
  - [ ] 4.1 Create `backend/middleware/auth_middleware.py` — `get_current_user` dependency that verifies Supabase JWT and returns user id + role; `require_admin` dependency
  - [ ] 4.2 Create `backend/utils/auth_helpers.py` — rate limiter (max 5 attempts / 15 min per IP), token helpers
  - [ ] 4.3 Create `backend/utils/email_helpers.py` — OTP send/verify helpers via Supabase Auth

- [ ] 5. Create API routers
  - [ ] 5.1 Create `backend/routers/auth.py` — POST /auth/register, /auth/login, /auth/verify-otp, /auth/logout, /auth/refresh, /auth/forgot-password, /auth/reset-password, GET /auth/me
  - [ ] 5.2 Create `backend/routers/bookings.py` — GET/POST /bookings, GET/PUT /bookings/{id}, GET /bookings/available-slots
  - [ ] 5.3 Create `backend/routers/services.py` — GET /services, GET /services/{id}, POST/PUT/DELETE /services (admin)
  - [ ] 5.4 Create `backend/routers/inquiries.py` — GET/POST /inquiries, GET /inquiries/{id}
  - [ ] 5.5 Create `backend/routers/users.py` — GET/PUT /users/profile, POST /users/change-password, /users/toggle-mfa, /users/upload-avatar
  - [ ] 5.6 Create `backend/routers/admin.py` — GET /admin/stats, GET /admin/customers, PUT /admin/customers/{id}/status, GET/PUT /admin/bookings, GET/PUT /admin/inquiries/{id}/reply

## Phase 3: Frontend Scaffold & Config

- [ ] 6. Scaffold Vite + React frontend
  - [ ] 6.1 Create `frontend/package.json` with all dependencies (react, vite, tailwindcss, framer-motion, lucide-react, zustand, axios, react-hook-form, zod, react-router-dom, recharts, @dnd-kit/core, @dnd-kit/sortable)
  - [ ] 6.2 Create `frontend/vite.config.js` with proxy to `http://localhost:8000`
  - [ ] 6.3 Create `frontend/tailwind.config.js` with custom colours (brand.orange, brand.admin), fonts (display: Rajdhani, body: Plus Jakarta Sans), animations (fade-in, slide-up, glow-pulse)
  - [ ] 6.4 Create `frontend/index.html` with Google Fonts import (Rajdhani + Plus Jakarta Sans)
  - [ ] 6.5 Create `frontend/src/index.css` with all CSS custom properties (--bg-primary, --accent-primary, --admin-accent, etc.), glass-card, btn-primary, btn-ghost, btn-danger styles
  - [ ] 6.6 Create `frontend/.env.example` with VITE_API_URL, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

## Phase 4: State Management & API Layer

- [ ] 7. Create Zustand stores
  - [ ] 7.1 Create `frontend/src/store/authStore.js` — user, token, isLoading, isAuthenticated, login(), logout(), setUser(), initialize() with localStorage persistence using key `ccm_token`
  - [ ] 7.2 Create `frontend/src/store/bookingStore.js` — selectedServices, selectedDate, selectedSlot, motorcycleDetails, currentStep, actions to update each field and reset
  - [ ] 7.3 Create `frontend/src/store/notificationStore.js` — toasts array, addToast(message, type), removeToast(id), auto-dismiss after 4 seconds, max 3 toasts

- [ ] 8. Create API service layer
  - [ ] 8.1 Create `frontend/src/services/api.js` — Axios instance with baseURL from VITE_API_URL, request interceptor attaching JWT, response interceptor handling 401 → logout + redirect
  - [ ] 8.2 Create `frontend/src/services/authService.js` — register, login, verifyOtp, logout, forgotPassword, resetPassword, getMe
  - [ ] 8.3 Create `frontend/src/services/bookingService.js` — getBookings, createBooking, getBooking, updateBooking, getAvailableSlots
  - [ ] 8.4 Create `frontend/src/services/serviceService.js` — getServices, getService, createService, updateService, deleteService, reorderServices
  - [ ] 8.5 Create `frontend/src/services/inquiryService.js` — getInquiries, createInquiry, getInquiry

- [ ] 9. Create utility files
  - [ ] 9.1 Create `frontend/src/utils/constants.js` — SERVICE_CATEGORIES, BOOKING_STATUSES, INQUIRY_STATUSES, ROUTES
  - [ ] 9.2 Create `frontend/src/utils/formatters.js` — formatDate, formatTime, formatPrice (RM), formatPhone (Malaysian)
  - [ ] 9.3 Create `frontend/src/utils/validators.js` — Zod schemas: registerSchema, loginSchema, bookingSchema, inquirySchema, profileSchema, passwordSchema

## Phase 5: Reusable UI Components

- [ ] 10. Build primitive UI components
  - [ ] 10.1 Create `frontend/src/components/ui/Button.jsx` — variants: primary, ghost, danger; size: sm, md, lg; loading state with spinner; Framer Motion press animation (scale 0.97 on active)
  - [ ] 10.2 Create `frontend/src/components/ui/Input.jsx` — label, error message, show/hide toggle for password fields, focus ring with accent colour
  - [ ] 10.3 Create `frontend/src/components/ui/Card.jsx` — GlassCard with glassmorphism styles, hover prop (translateY + glow), glow prop, Framer Motion cardVariants entrance animation
  - [ ] 10.4 Create `frontend/src/components/ui/Badge.jsx` — status badges: pending (yellow), confirmed (blue), in_progress (orange), completed (green), cancelled (red), replied (green), closed (grey)
  - [ ] 10.5 Create `frontend/src/components/ui/Modal.jsx` — portal-based modal, scale-in spring animation (0.9→1.0), backdrop blur, close on Escape key and backdrop click
  - [ ] 10.6 Create `frontend/src/components/ui/Toast.jsx` — renders toasts from notificationStore, slide-in Framer Motion animation, bottom-right desktop / top-center mobile, auto-dismiss
  - [ ] 10.7 Create `frontend/src/components/ui/Spinner.jsx` — animated ring spinner in accent colour, size variants
  - [ ] 10.8 Create `frontend/src/components/ui/Table.jsx` — responsive table with sortable headers, loading skeleton rows (shimmer), empty state slot
  - [ ] 10.9 Create `frontend/src/components/ui/Pagination.jsx` — prev/next + page number buttons, shows current page and total
  - [ ] 10.10 Create `frontend/src/components/ui/Accordion.jsx` — animated open/close with Framer Motion height animation, chevron rotation

## Phase 6: Layout Components

- [ ] 11. Build layout components
  - [ ] 11.1 Create `frontend/src/components/layout/Navbar.jsx` — transparent on top, glass blur on scroll (useScrollPosition), logo (CABIN CREW + MOTORSPORT in orange), Login/Register buttons when unauthenticated, avatar dropdown when authenticated, hamburger + full-screen overlay on mobile
  - [ ] 11.2 Create `frontend/src/components/layout/Footer.jsx` — logo, nav links, social media placeholders, copyright © 2025
  - [ ] 11.3 Create `frontend/src/components/layout/PublicLayout.jsx` — wraps Navbar + Outlet + Footer, AnimatePresence for page transitions
  - [ ] 11.4 Create `frontend/src/components/layout/CustomerSidebar.jsx` — brand logo, nav links with Lucide icons (Dashboard, Book Service, My Bookings, Inquiries, Profile), logout button, collapsible on mobile
  - [ ] 11.5 Create `frontend/src/components/layout/CustomerLayout.jsx` — fixed sidebar + scrollable main, orange accent scheme
  - [ ] 11.6 Create `frontend/src/components/layout/AdminSidebar.jsx` — same structure as CustomerSidebar but blue accent, ADMIN badge/pill, links: Overview, Customers, Services, Bookings, Inquiries
  - [ ] 11.7 Create `frontend/src/components/layout/AdminLayout.jsx` — fixed sidebar + scrollable main, blue accent scheme

- [ ] 12. Build shared components
  - [ ] 12.1 Create `frontend/src/components/shared/ProtectedRoute.jsx` — checks isAuthenticated and role, redirects to /login with returnUrl if unauthenticated, redirects to /dashboard if wrong role, shows Spinner while isLoading
  - [ ] 12.2 Create `frontend/src/components/shared/ServiceCard.jsx` — glass card with service image placeholder, name, category badge, description, price range, duration, Book button
  - [ ] 12.3 Create `frontend/src/components/shared/BookingCard.jsx` — booking reference, service names, date/time, status badge, cancel button if pending
  - [ ] 12.4 Create `frontend/src/components/shared/StatCard.jsx` — icon, label, value, optional trend indicator, glass card style
  - [ ] 12.5 Create `frontend/src/components/shared/ConfirmDialog.jsx` — modal with title, message, confirm (danger) and cancel buttons

## Phase 7: Auth Pages

- [ ] 13. Build authentication pages
  - [ ] 13.1 Create `frontend/src/pages/auth/LoginPage.jsx` — centered glass card, email + password fields, show/hide toggle, remember me, shake animation on error, MFA redirect flow, role-based redirect on success
  - [ ] 13.2 Create `frontend/src/pages/auth/RegisterPage.jsx` — full name, email, phone (Malaysian format), password with strength indicator, confirm password, terms checkbox, success state showing "Check your email"
  - [ ] 13.3 Create `frontend/src/pages/auth/OTPVerifyPage.jsx` — 6-digit OTP input (individual boxes), resend OTP button, 10-minute countdown timer, verify via /auth/verify-otp
  - [ ] 13.4 Create `frontend/src/pages/auth/ForgotPasswordPage.jsx` — email input, submit sends reset email via /auth/forgot-password, success confirmation state

## Phase 8: Public Pages

- [ ] 14. Build public pages
  - [ ] 14.1 Create `frontend/src/pages/public/HomePage.jsx` — hero (full viewport, motorcycle SVG silhouette, animated title reveal, two CTAs, floating orange particles, scroll indicator), services preview (fetch top 4 from API), Why Choose Us (3 feature blocks + animated counters), FAQ preview (3 items accordion), contact strip, footer
  - [ ] 14.2 Create `frontend/src/pages/public/AboutPage.jsx` — hero gradient placeholder, workshop story, team section, core values (Trustworthy, Professional, Affordable, Quality Parts), Google Maps iframe (Kampung Seri Malaysia)
  - [ ] 14.3 Create `frontend/src/pages/public/ServicesPage.jsx` — page hero, filter tabs (All, Maintenance, Repair, Performance, Topset), service cards grid fetched from /services, Book This Service CTA (→ /login or /dashboard/book)
  - [ ] 14.4 Create `frontend/src/pages/public/ContactPage.jsx` — contact form (name, email, phone, subject, message) with React Hook Form + Zod, POST to /inquiries on submit, success toast, workshop details panel, Google Maps iframe
  - [ ] 14.5 Create `frontend/src/pages/public/FAQPage.jsx` — search input with real-time filter, accordion list grouped by category (General, Booking, Services, Payment, Security), empty state when no results, Framer Motion accordion animations

## Phase 9: Customer Pages

- [ ] 15. Build customer dashboard pages
  - [ ] 15.1 Create `frontend/src/pages/customer/DashboardPage.jsx` — welcome card ("Selamat Datang, [Name]! 👋"), stats row (Total Bookings, Pending, Completed, Open Inquiries), recent bookings table (last 5), quick action buttons, upcoming appointment card
  - [ ] 15.2 Create `frontend/src/pages/customer/ProfilePage.jsx` — avatar upload (POST /users/upload-avatar → Supabase Storage), editable fields (full name, phone, address), password change section, MFA toggle (POST /users/toggle-mfa with password confirmation), account info (email read-only, member since), delete account with ConfirmDialog
  - [ ] 15.3 Create `frontend/src/pages/customer/BookServicePage.jsx` — 3-step wizard with animated step transitions and progress bar: Step 1 (service selection with category filter, checkboxes, running total), Step 2 (date picker excluding blocked dates + past, time slot grid fetched per date, motorcycle details: model/year/license plate/mileage/notes), Step 3 (summary, total price, confirm → POST /bookings), success screen with booking reference
  - [ ] 15.4 Create `frontend/src/pages/customer/MyBookingsPage.jsx` — all customer bookings ordered by date desc, BookingCard components, status badges, cancel button for pending bookings with ConfirmDialog, skeleton loader, empty state
  - [ ] 15.5 Create `frontend/src/pages/customer/InquiriesPage.jsx` — inquiry list with status badges, expandable rows showing admin reply, Submit New Inquiry modal (subject + message form), Supabase Realtime subscription for live reply updates

## Phase 10: Admin Pages

- [ ] 16. Build admin dashboard pages
  - [ ] 16.1 Create `frontend/src/pages/admin/AdminDashboard.jsx` — blue accent stats (Total Customers, Bookings Today, Pending Bookings, Open Inquiries, Revenue This Month), 3 Recharts charts (bar: bookings per week, pie: service category distribution, line: new registrations over time), recent activity feed (latest bookings + inquiries + registrations)
  - [ ] 16.2 Create `frontend/src/pages/admin/ManageCustomers.jsx` — searchable paginated table (10/page) with columns: Name, Email, Phone, Registered, Total Bookings, Status; real-time search filter; Disable/Enable toggle with ConfirmDialog; Delete with ConfirmDialog; Export CSV button; click row → side panel with full profile + booking history
  - [ ] 16.3 Create `frontend/src/pages/admin/ManageServices.jsx` — service cards grid with @dnd-kit drag-to-reorder (persists sort_order via API), Add New Service modal (name EN+BM, category, description, price min/max, duration, image upload), Edit modal, Delete with ConfirmDialog, Active/Inactive toggle
  - [ ] 16.4 Create `frontend/src/pages/admin/ManageBookings.jsx` — paginated table with columns: Booking Reference, Customer, Services, Date, Time, Status, Created; status filter dropdown; date range filter; inline status update dropdown per row; bulk select + bulk status update; expandable row for full details; Export CSV button
  - [ ] 16.5 Create `frontend/src/pages/admin/ViewInquiries.jsx` — inquiry list with columns: Name, Email, Subject, Date, Status; click to open full message + reply textarea; Send Reply button (PUT /admin/inquiries/{id}/reply → status = replied); status filter; status update dropdown

## Phase 11: App Entry & Routing

- [ ] 17. Wire up routing and app entry
  - [ ] 17.1 Create `frontend/src/App.jsx` — React Router v6 with AnimatePresence for page transitions, all routes mapped: public routes under PublicLayout, /dashboard/* under CustomerLayout + ProtectedRoute (role: customer), /admin/* under AdminLayout + ProtectedRoute (role: admin)
  - [ ] 17.2 Create `frontend/src/main.jsx` — render App, call authStore.initialize() on mount, render Toast component globally
  - [ ] 17.3 Create `frontend/src/assets/logo.svg` — text-based SVG logo "CCM" in brand orange

## Phase 12: Custom Hooks

- [ ] 18. Create custom React hooks
  - [ ] 18.1 Create `frontend/src/hooks/useAuth.js` — wraps authStore, exposes login/logout/user/isAuthenticated
  - [ ] 18.2 Create `frontend/src/hooks/useBookings.js` — fetches bookings with loading/error state, cancelBooking action
  - [ ] 18.3 Create `frontend/src/hooks/useServices.js` — fetches services with category filter, loading/error state
  - [ ] 18.4 Create `frontend/src/hooks/useInquiries.js` — fetches inquiries, submitInquiry action, Supabase Realtime subscription setup

## Phase 13: Documentation & Deployment

- [ ] 19. Create documentation and deployment config
  - [x] 19.1 Create root `README.md` with project description, tech stack table, prerequisites, step-by-step setup (Supabase, backend, frontend), default admin account instructions, project structure tree, features list, author section
  - [x] 19.2 Create `backend/Dockerfile` — Python 3.11 slim, install requirements, expose port 8000, uvicorn entrypoint
  - [x] 19.3 Create `frontend/Dockerfile` — Node 18 alpine, npm install, npm run build, nginx serve
  - [x] 19.4 Create root `docker-compose.yml` — backend service (port 8000), frontend service (port 5173/80), environment variable injection
