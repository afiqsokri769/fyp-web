# Requirements Document

## Introduction

Cabin Crew Motorsport is a motorcycle workshop (bengkel motosikal) located in Kampung Seri Malaysia, Kuala Lumpur, Malaysia, specialising in LC 135 servicing and performance spare parts. This project delivers a full-stack web application that establishes the workshop's online presence, enables customers to book services online, and provides administrators with a comprehensive dashboard to manage all operations. The system solves three core problems: the workshop has no online presence, no authentication system, and no booking system. This is developed as a Final Year Project (FYP).

The application serves two user groups: customers who can register, book services, and track their bookings and inquiries; and administrators who manage customers, services, bookings, and inquiries through a dedicated dashboard.

---

## Glossary

- **System**: The Cabin Crew Motorsport web application as a whole.
- **Customer**: An authenticated end-user who books services and submits inquiries.
- **Admin**: An authenticated user with elevated privileges who manages all system data.
- **Booking**: A confirmed reservation for one or more workshop services at a specific date and time.
- **Booking_Reference**: A unique, system-generated alphanumeric identifier for each booking.
- **Service**: A workshop offering (e.g., oil change, tyre replacement, performance tuning) with a name, description, price, and duration.
- **Inquiry**: A message submitted by a visitor or customer via the contact form, which an admin can reply to.
- **FAQ**: A frequently asked question with a categorised answer displayed publicly.
- **Time_Slot**: A predefined available time window during which a booking can be made.
- **Blocked_Date**: A date on which no bookings are accepted (e.g., public holidays, workshop closure).
- **Profile**: A user's personal information record linked to their authentication account.
- **MFA**: Multi-Factor Authentication — a second verification step using a one-time password (OTP).
- **OTP**: One-Time Password — a time-limited code sent to the user's email for verification.
- **JWT**: JSON Web Token — a signed token used to authenticate API requests.
- **RLS**: Row-Level Security — Supabase/PostgreSQL policies that restrict data access per user.
- **Avatar**: A profile picture uploaded by the customer and stored in Supabase Storage.
- **Booking_Wizard**: The 3-step booking flow: (1) select services, (2) choose date/time and enter motorcycle details, (3) confirm.
- **Admin_Dashboard**: The administrative interface accessible only to users with the admin role.
- **Customer_Dashboard**: The authenticated interface accessible to customers.
- **Auth_Service**: The Supabase Auth module handling registration, login, OTP, and session management.
- **API**: The FastAPI backend exposing RESTful endpoints consumed by the frontend.
- **Validator**: The combined Zod (frontend) and Pydantic (backend) validation layer.
- **Rate_Limiter**: The backend middleware that restricts repeated login attempts.
- **Storage_Service**: Supabase Storage used for avatar and service image uploads.
- **Notification_Service**: The frontend toast notification system.
- **Realtime_Service**: Supabase Realtime used for live inquiry updates.

---

## Requirements

### Requirement 1: User Registration

**User Story:** As a visitor, I want to create an account with my full name, email, phone number, and password, so that I can access the booking system and track my service history.

#### Acceptance Criteria

1. THE System SHALL provide a registration page at the `/register` route.
2. WHEN a visitor submits the registration form, THE Validator SHALL validate that full name, email, phone number, and password fields are all present and non-empty.
3. WHEN a visitor submits a registration form with an invalid email format, THE Validator SHALL display an inline error message identifying the invalid field.
4. WHEN a visitor submits a password that is fewer than 8 characters or lacks at least one uppercase letter, one lowercase letter, and one number, THE Validator SHALL reject the submission and display the password requirements.
5. WHEN a visitor submits a valid registration form, THE Auth_Service SHALL create a new user account and a corresponding Profile record.
6. WHEN a visitor submits a registration form with an email address already registered, THE System SHALL display an error message stating the email is already in use.
7. WHEN registration succeeds, THE System SHALL redirect the Customer to the Customer_Dashboard.
8. THE System SHALL require the visitor to accept the terms and conditions before the registration form can be submitted.

---

### Requirement 2: User Authentication

**User Story:** As a registered user, I want to log in with my email and password, so that I can securely access my account.

#### Acceptance Criteria

1. THE System SHALL provide a login page at the `/login` route.
2. WHEN a user submits valid email and password credentials, THE Auth_Service SHALL issue a JWT and store it in localStorage under the key `ccm_token`.
3. WHEN a user submits invalid credentials, THE System SHALL display an error message and SHALL NOT reveal whether the email or password was incorrect.
4. WHEN a user with the admin role successfully authenticates, THE System SHALL redirect the user to `/admin`.
5. WHEN a user with the customer role successfully authenticates, THE System SHALL redirect the user to `/dashboard`.
6. WHEN a login attempt fails 5 or more consecutive times from the same origin, THE Rate_Limiter SHALL block further login attempts for 15 minutes and return an appropriate error message.
7. WHEN a user's JWT is expired or invalid, THE System SHALL redirect the user to `/login`.

---

### Requirement 3: Multi-Factor Authentication (MFA/OTP)

**User Story:** As a registered user, I want to enable MFA on my account, so that my account is protected by a second verification step.

#### Acceptance Criteria

1. WHERE MFA is enabled on an account, WHEN the user submits valid credentials, THE Auth_Service SHALL send an OTP to the user's registered email address.
2. WHERE MFA is enabled, WHEN the user submits a valid OTP within 10 minutes of issuance, THE Auth_Service SHALL complete authentication and issue a JWT.
3. WHERE MFA is enabled, IF the user submits an incorrect or expired OTP, THEN THE Auth_Service SHALL reject the authentication attempt and display an error message.
4. THE System SHALL allow a Customer to enable or disable MFA from the Profile page.
5. WHEN MFA is toggled, THE System SHALL require the user to verify their current password before the change takes effect.

---

### Requirement 4: Public Home Page

**User Story:** As a visitor, I want to see an engaging home page, so that I can quickly understand what Cabin Crew Motorsport offers and be encouraged to book a service.

#### Acceptance Criteria

1. THE System SHALL render the home page at the `/` route without requiring authentication.
2. THE System SHALL display a hero section containing the workshop name, a tagline, and a call-to-action button linking to `/services`.
3. THE System SHALL display a services preview section showing a subset of available services.
4. THE System SHALL display a "Why Choose Us" section highlighting key workshop differentiators.
5. THE System SHALL display a FAQ preview section showing up to 3 frequently asked questions.
6. THE System SHALL display a contact strip containing the workshop's phone number, address, and operating hours.
7. THE System SHALL display a footer with navigation links and social media links.

---

### Requirement 5: About Page

**User Story:** As a visitor, I want to learn about the workshop's story, team, and values, so that I can decide whether to trust them with my motorcycle.

#### Acceptance Criteria

1. THE System SHALL render the about page at the `/about` route without requiring authentication.
2. THE System SHALL display the workshop's founding story and background.
3. THE System SHALL display team member profiles including name and role.
4. THE System SHALL display the workshop's core values.
5. THE System SHALL display an embedded map showing the workshop's location in Kampung Seri Malaysia, Kuala Lumpur.

---

### Requirement 6: Services Page

**User Story:** As a visitor, I want to browse all available services with filtering options, so that I can find the service I need and book it.

#### Acceptance Criteria

1. THE System SHALL render the services page at the `/services` route without requiring authentication.
2. THE System SHALL display all active services as a grid of service cards, each showing the service name, description, price, and estimated duration.
3. THE System SHALL provide filter tabs that allow visitors to filter services by category.
4. WHEN a visitor selects a filter tab, THE System SHALL update the displayed service cards to show only services matching the selected category without a full page reload.
5. THE System SHALL display a booking call-to-action that links authenticated users to `/dashboard/book` and unauthenticated visitors to `/login`.

---

### Requirement 7: Contact Page and Inquiry Submission

**User Story:** As a visitor, I want to send a message to the workshop, so that I can ask questions before committing to a booking.

#### Acceptance Criteria

1. THE System SHALL render the contact page at the `/contact` route without requiring authentication.
2. THE System SHALL display a contact form with fields for name, email, phone number, subject, and message.
3. WHEN a visitor submits a valid contact form, THE System SHALL save the submission as a new record in the inquiries table and display a success confirmation message.
4. IF the contact form submission fails due to a server error, THEN THE System SHALL display an error message and SHALL retain the form data so the visitor does not lose their input.
5. THE System SHALL display the workshop's address, phone number, email address, and operating hours alongside the contact form.

---

### Requirement 8: FAQ Page

**User Story:** As a visitor, I want to search and browse frequently asked questions, so that I can find answers without contacting the workshop.

#### Acceptance Criteria

1. THE System SHALL render the FAQ page at the `/faq` route without requiring authentication.
2. THE System SHALL display all FAQs grouped by category in an accordion layout.
3. THE System SHALL provide a search input that filters displayed FAQs in real time as the visitor types.
4. WHEN a visitor types in the search input, THE System SHALL display only FAQs whose question or answer text contains the search term, without a full page reload.
5. WHEN no FAQs match the search term, THE System SHALL display an empty state message.

---

### Requirement 9: Customer Dashboard

**User Story:** As a Customer, I want a personalised dashboard, so that I can see my booking statistics and quickly navigate to key actions.

#### Acceptance Criteria

1. THE System SHALL render the customer dashboard at the `/dashboard` route and SHALL require authentication.
2. WHEN an unauthenticated user navigates to `/dashboard`, THE System SHALL redirect the user to `/login`.
3. THE System SHALL display summary statistics including total bookings, upcoming bookings, and pending inquiries.
4. THE System SHALL display the Customer's most recent bookings with their current status.
5. THE System SHALL provide quick action buttons linking to `/dashboard/book`, `/dashboard/bookings`, and `/dashboard/inquiries`.

---

### Requirement 10: Customer Profile Management

**User Story:** As a Customer, I want to manage my profile information, so that I can keep my contact details and security settings up to date.

#### Acceptance Criteria

1. THE System SHALL render the profile page at the `/dashboard/profile` route and SHALL require authentication.
2. THE System SHALL display the Customer's current full name, email, and phone number in editable fields.
3. WHEN a Customer submits updated profile information, THE System SHALL validate the fields using the Validator and save the changes to the profiles table.
4. THE System SHALL allow the Customer to upload an Avatar image from the profile page.
5. WHEN a Customer uploads an Avatar, THE Storage_Service SHALL store the image and THE System SHALL display the new avatar immediately.
6. THE System SHALL allow the Customer to change their password by providing their current password and a new password that meets the password policy.
7. IF the current password provided during a password change is incorrect, THEN THE System SHALL display an error message and SHALL NOT update the password.
8. THE System SHALL display a toggle for enabling or disabling MFA on the profile page.

---

### Requirement 11: Service Booking Wizard

**User Story:** As a Customer, I want to book one or more services through a guided multi-step form, so that I can schedule my motorcycle's service appointment easily.

#### Acceptance Criteria

1. THE System SHALL render the booking page at the `/dashboard/book` route and SHALL require authentication.
2. THE System SHALL present the Booking_Wizard as a 3-step flow: Step 1 — select services; Step 2 — choose date/time and enter motorcycle details; Step 3 — review and confirm.
3. WHEN a Customer is on Step 1, THE System SHALL display all active services with checkboxes or selection controls, and SHALL require at least one service to be selected before proceeding.
4. WHEN a Customer is on Step 2, THE System SHALL display a date picker that excludes Blocked_Dates and past dates.
5. WHEN a Customer selects a date in Step 2, THE System SHALL fetch and display only available Time_Slots for that date.
6. WHEN a Customer is on Step 2, THE System SHALL require motorcycle make, model, and year fields to be completed before proceeding.
7. WHEN a Customer is on Step 3, THE System SHALL display a summary of selected services, chosen date and time, motorcycle details, and the total estimated price.
8. WHEN a Customer confirms the booking in Step 3, THE System SHALL create a booking record, generate a unique Booking_Reference, and display a confirmation message containing the Booking_Reference.
9. IF a selected Time_Slot becomes unavailable between Step 2 and Step 3 confirmation, THEN THE System SHALL notify the Customer and prompt them to select a different time slot.
10. THE System SHALL allow the Customer to navigate back to a previous step without losing already-entered data.

---

### Requirement 12: My Bookings

**User Story:** As a Customer, I want to view my full booking history with statuses, so that I can track the progress of my service appointments.

#### Acceptance Criteria

1. THE System SHALL render the bookings history page at the `/dashboard/bookings` route and SHALL require authentication.
2. THE System SHALL display all bookings belonging to the authenticated Customer, ordered by booking date descending.
3. THE System SHALL display each booking's Booking_Reference, service names, scheduled date and time, and current status.
4. THE System SHALL display booking statuses using visually distinct labels (e.g., pending, confirmed, in-progress, completed, cancelled).
5. WHEN a Customer views a booking with status "pending", THE System SHALL provide an option to cancel the booking.
6. WHEN a Customer cancels a booking, THE System SHALL update the booking status to "cancelled" and display a confirmation message.

---

### Requirement 13: My Inquiries

**User Story:** As a Customer, I want to view my submitted inquiries and any admin replies, so that I can follow up on my questions.

#### Acceptance Criteria

1. THE System SHALL render the inquiries page at the `/dashboard/inquiries` route and SHALL require authentication.
2. THE System SHALL display all inquiries submitted by the authenticated Customer, ordered by submission date descending.
3. THE System SHALL display each inquiry's subject, submission date, status, and any admin reply.
4. WHEN an admin posts a reply to an inquiry, THE Realtime_Service SHALL update the Customer's inquiry view without requiring a page refresh.

---

### Requirement 14: Admin Dashboard

**User Story:** As an Admin, I want a comprehensive dashboard with statistics and charts, so that I can monitor the workshop's operational performance at a glance.

#### Acceptance Criteria

1. THE System SHALL render the admin dashboard at the `/admin` route and SHALL require authentication with the admin role.
2. WHEN a user without the admin role navigates to any `/admin` route, THE System SHALL redirect the user to `/dashboard`.
3. THE System SHALL display summary statistics including total customers, total bookings, total revenue, and pending bookings count.
4. THE System SHALL display at least 3 charts using Recharts: a bookings-over-time line chart, a services-popularity bar chart, and a booking-status distribution pie chart.
5. THE System SHALL display a recent activity feed showing the latest bookings and inquiries.

---

### Requirement 15: Manage Customers

**User Story:** As an Admin, I want to view, search, disable, and export customer records, so that I can manage the customer base effectively.

#### Acceptance Criteria

1. THE System SHALL render the customer management page at the `/admin/customers` route and SHALL require the admin role.
2. THE System SHALL display all customer profiles in a searchable, paginated table.
3. WHEN an Admin types in the search input, THE System SHALL filter the displayed customers by name, email, or phone number in real time.
4. THE System SHALL allow an Admin to disable a customer account, preventing the customer from logging in.
5. WHEN an Admin disables a customer account, THE System SHALL display a confirmation dialog before applying the change.
6. THE System SHALL allow an Admin to delete a customer record.
7. WHEN an Admin initiates a customer deletion, THE System SHALL display a confirmation dialog before permanently removing the record.
8. THE System SHALL provide an export function that downloads the current customer list as a CSV file.

---

### Requirement 16: Manage Services

**User Story:** As an Admin, I want to create, edit, reorder, and delete services, so that I can keep the workshop's service catalogue up to date.

#### Acceptance Criteria

1. THE System SHALL render the service management page at the `/admin/services` route and SHALL require the admin role.
2. THE System SHALL display all services in a list that supports drag-to-reorder functionality.
3. WHEN an Admin reorders services via drag-and-drop, THE System SHALL persist the new display order.
4. THE System SHALL provide a form to create a new service with fields for name, description, category, price, duration, and an optional image.
5. WHEN an Admin uploads a service image, THE Storage_Service SHALL store the image and THE System SHALL display a preview.
6. THE System SHALL allow an Admin to edit any existing service's details.
7. WHEN an Admin saves a service edit, THE Validator SHALL validate all required fields before persisting the change.
8. THE System SHALL allow an Admin to delete a service.
9. WHEN an Admin initiates a service deletion, THE System SHALL display a confirmation dialog before permanently removing the record.
10. THE System SHALL allow an Admin to toggle a service between active and inactive states, controlling its visibility on the public Services page.

---

### Requirement 17: Manage Bookings

**User Story:** As an Admin, I want to view, update, and export all bookings, so that I can manage the workshop's daily schedule and workload.

#### Acceptance Criteria

1. THE System SHALL render the booking management page at the `/admin/bookings` route and SHALL require the admin role.
2. THE System SHALL display all bookings in a paginated table showing Booking_Reference, customer name, services, scheduled date and time, and current status.
3. THE System SHALL allow an Admin to filter bookings by status and by date range.
4. THE System SHALL allow an Admin to update the status of any individual booking.
5. THE System SHALL allow an Admin to select multiple bookings and apply a status update to all selected bookings simultaneously (bulk action).
6. THE System SHALL provide an export function that downloads the current filtered booking list as a CSV file.

---

### Requirement 18: Manage Inquiries

**User Story:** As an Admin, I want to view all inquiries and reply to them, so that I can provide timely support to customers and visitors.

#### Acceptance Criteria

1. THE System SHALL render the inquiry management page at the `/admin/inquiries` route and SHALL require the admin role.
2. THE System SHALL display all inquiries in a list showing submitter name, email, subject, submission date, and current status.
3. THE System SHALL allow an Admin to open an inquiry and view the full message.
4. THE System SHALL allow an Admin to post a reply to an inquiry.
5. WHEN an Admin posts a reply, THE System SHALL update the inquiry status to "replied" and persist the reply text.
6. THE System SHALL allow an Admin to update the status of an inquiry (e.g., open, replied, closed).

---

### Requirement 19: Time Slot and Availability Management

**User Story:** As an Admin, I want the system to manage time slots and blocked dates, so that customers can only book appointments during available windows.

#### Acceptance Criteria

1. THE System SHALL seed the database with 7 predefined Time_Slots on initial setup.
2. WHEN a Customer requests available slots for a given date, THE API SHALL return only Time_Slots that are not fully booked and whose date is not in the Blocked_Dates table.
3. WHEN a booking is confirmed, THE System SHALL mark the corresponding Time_Slot as unavailable for that date if the slot's capacity is reached.
4. THE System SHALL prevent two bookings from being assigned to the same Time_Slot on the same date when capacity is exceeded.

---

### Requirement 20: Database Integrity and Triggers

**User Story:** As a developer, I want the database to automatically maintain data integrity, so that records are consistent without requiring manual intervention.

#### Acceptance Criteria

1. THE System SHALL automatically set the `updated_at` timestamp on all relevant table records whenever a row is updated.
2. WHEN a new booking record is created, THE System SHALL automatically generate and assign a unique Booking_Reference.
3. WHEN a new user registers via Auth_Service, THE System SHALL automatically create a corresponding Profile record via a database trigger.
4. THE System SHALL enforce Row-Level Security policies on all tables so that Customers can only read and modify their own records.
5. THE System SHALL enforce Row-Level Security policies so that Admins can read and modify all records.

---

### Requirement 21: API Security and Validation

**User Story:** As a developer, I want all API endpoints to be secured and validated, so that the system is protected against unauthorised access and malformed data.

#### Acceptance Criteria

1. THE API SHALL require a valid JWT in the `Authorization` header for all protected endpoints.
2. IF a request to a protected endpoint contains an absent, malformed, or expired JWT, THEN THE API SHALL return an HTTP 401 response.
3. IF a request to an admin-only endpoint is made by a non-admin JWT, THEN THE API SHALL return an HTTP 403 response.
4. THE Validator SHALL validate all incoming request bodies against Pydantic models before processing.
5. IF a request body fails Pydantic validation, THEN THE API SHALL return an HTTP 422 response with field-level error details.
6. THE API SHALL apply CORS configuration to allow requests only from the configured frontend origin.

---

### Requirement 22: Frontend State Management and HTTP Communication

**User Story:** As a developer, I want a consistent state management and HTTP layer, so that the frontend behaves predictably and handles errors gracefully.

#### Acceptance Criteria

1. THE System SHALL manage authentication state using a Zustand authStore that persists the JWT and user profile.
2. THE System SHALL manage booking wizard state using a Zustand bookingStore.
3. THE System SHALL manage toast notifications using a Zustand notificationStore.
4. THE System SHALL use Axios with request interceptors to automatically attach the JWT from localStorage to all outgoing API requests.
5. THE System SHALL use Axios with response interceptors to handle HTTP 401 responses by clearing the stored JWT and redirecting the user to `/login`.
6. WHEN an API request fails, THE Notification_Service SHALL display a toast notification describing the error.

---

### Requirement 23: Responsive Design and Accessibility

**User Story:** As a user on any device, I want the application to be usable on mobile, tablet, and desktop screens, so that I can access the service from any device.

#### Acceptance Criteria

1. THE System SHALL implement a mobile-first responsive layout using Tailwind CSS breakpoints.
2. THE System SHALL display a collapsible navigation menu on screens narrower than the `md` Tailwind breakpoint.
3. THE System SHALL render all pages without horizontal scrolling on screens with a minimum width of 320px.
4. THE System SHALL use semantic HTML elements and ARIA attributes to support screen reader accessibility.

---

### Requirement 24: Loading, Empty, and Error States

**User Story:** As a user, I want clear visual feedback during loading, when no data is available, and when errors occur, so that I always understand the current state of the application.

#### Acceptance Criteria

1. WHILE an API request is in progress, THE System SHALL display a skeleton loader in place of the content being fetched.
2. WHEN an API request returns an empty data set, THE System SHALL display an empty state illustration and message appropriate to the context.
3. WHEN an API request fails, THE System SHALL display an error state with a retry option where applicable.
4. THE Notification_Service SHALL display toast notifications for all successful mutations (create, update, delete) and all API errors.

---

### Requirement 25: Visual Design System

**User Story:** As a developer, I want a consistent design system, so that all pages share a cohesive visual identity aligned with the "Liquid Metal Racing" theme.

#### Acceptance Criteria

1. THE System SHALL define CSS custom properties in `index.css` for the dark base theme, orange accent colour (`#FF6B00`), and blue admin accent colour (`#3B82F6`).
2. THE System SHALL apply the Rajdhani font to all heading elements and the Plus Jakarta Sans font to all body text.
3. THE System SHALL apply glassmorphism card styles (frosted glass background, border, backdrop blur) to content cards throughout the application.
4. THE System SHALL use Framer Motion spring animations for page transitions and interactive element entrances.
5. THE System SHALL use the orange accent (`#FF6B00`) for primary interactive elements in the customer-facing interface.
6. THE System SHALL use the blue accent (`#3B82F6`) for primary interactive elements in the admin interface.

---

### Requirement 26: Seed Data

**User Story:** As a developer, I want the database to be pre-populated with realistic seed data, so that the application is demonstrable immediately after setup.

#### Acceptance Criteria

1. THE System SHALL seed the database with exactly 7 Time_Slot records covering standard workshop operating hours.
2. THE System SHALL seed the database with exactly 10 FAQ records distributed across at least 3 categories.
3. THE System SHALL seed the database with exactly 8 Service records covering common LC 135 servicing and performance parts offerings.
