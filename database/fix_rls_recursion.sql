-- ================================================
-- FIX: RLS Infinite Recursion (PostgreSQL 42P17)
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ================================================
-- Problem: Admin RLS policies on "profiles" query profiles itself,
-- causing infinite recursion. Fix: use auth.jwt() to read role
-- from the JWT token metadata instead.
-- ================================================

-- Step 0: Update admin user's auth metadata so JWT contains role=admin
-- (Without this, auth.jwt()->'user_metadata'->>'role' returns 'customer')
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'admin@gmail.com';

-- ================================================
-- Step 1: Fix PROFILES policies (the actual recursion source)
-- ================================================
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- ================================================
-- Step 2: Fix all other tables that reference profiles for admin check
-- (These would also fail if profiles RLS is broken)
-- ================================================

-- SERVICES
DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
CREATE POLICY "Admins can manage services"
  ON public.services FOR ALL
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- BOOKINGS
DROP POLICY IF EXISTS "Admins manage all bookings" ON public.bookings;
CREATE POLICY "Admins manage all bookings"
  ON public.bookings FOR ALL
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- BOOKING_SERVICES
DROP POLICY IF EXISTS "Admins manage all booking services" ON public.booking_services;
CREATE POLICY "Admins manage all booking services"
  ON public.booking_services FOR ALL
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- FAQS
DROP POLICY IF EXISTS "Admins can manage faqs" ON public.faqs;
CREATE POLICY "Admins can manage faqs"
  ON public.faqs FOR ALL
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- TIME_SLOTS
DROP POLICY IF EXISTS "Admins can manage time_slots" ON public.time_slots;
CREATE POLICY "Admins can manage time_slots"
  ON public.time_slots FOR ALL
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- BLOCKED_DATES
DROP POLICY IF EXISTS "Admins can manage blocked_dates" ON public.blocked_dates;
CREATE POLICY "Admins can manage blocked_dates"
  ON public.blocked_dates FOR ALL
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- INQUIRIES
DROP POLICY IF EXISTS "Admins manage all inquiries" ON public.inquiries;
CREATE POLICY "Admins manage all inquiries"
  ON public.inquiries FOR ALL
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- ================================================
-- Done! All admin RLS policies now use JWT metadata
-- instead of querying the profiles table.
-- ================================================
