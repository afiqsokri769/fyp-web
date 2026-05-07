-- ================================================
-- FIX: Restore service_role permissions after DB reset
-- Run this in Supabase SQL Editor
-- ================================================

-- Grant full access to service_role on all app tables
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.services TO service_role;
GRANT ALL ON public.bookings TO service_role;
GRANT ALL ON public.booking_services TO service_role;
GRANT ALL ON public.inquiries TO service_role;
GRANT ALL ON public.faqs TO service_role;
GRANT ALL ON public.time_slots TO service_role;
GRANT ALL ON public.blocked_dates TO service_role;

-- Grant usage on sequences (for auto-increment IDs)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Also grant to authenticated and anon roles for RLS to work
GRANT SELECT ON public.services TO anon;
GRANT SELECT ON public.faqs TO anon;
GRANT SELECT ON public.time_slots TO anon;
GRANT INSERT ON public.inquiries TO anon;

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.booking_services TO authenticated;
GRANT SELECT, INSERT ON public.inquiries TO authenticated;
GRANT SELECT ON public.services TO authenticated;
GRANT SELECT ON public.faqs TO authenticated;
GRANT SELECT ON public.time_slots TO authenticated;
GRANT SELECT ON public.blocked_dates TO authenticated;

-- Ensure the handle_new_user trigger function has correct permissions
ALTER FUNCTION public.handle_new_user() SECURITY DEFINER;

-- Re-grant execute on the trigger function
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO service_role;
GRANT EXECUTE ON FUNCTION public.generate_booking_reference() TO service_role;
