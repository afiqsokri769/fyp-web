-- ================================================
-- CABIN CREW MOTORSPORT — SEED DATA
-- ================================================

-- Seed time slots
INSERT INTO public.time_slots (slot_time, max_bookings) VALUES
  ('09:00', 2),
  ('10:00', 2),
  ('11:00', 2),
  ('14:00', 2),
  ('15:00', 2),
  ('16:00', 2),
  ('17:00', 2);

-- Seed FAQs
INSERT INTO public.faqs (question_en, answer_en, category, sort_order) VALUES
  ('What is Cabin Crew Motorsport?', 'Cabin Crew Motorsport is a specialist motorcycle workshop located in Kampung Seri Malaysia, Kuala Lumpur. We specialise in LC 135 modification, servicing, and performance spare parts.', 'general', 1),
  ('How do I book a service?', 'Register for an account, log in, navigate to "Book Service" in your dashboard, select your desired services, choose a date and time slot, and confirm your booking.', 'booking', 2),
  ('What payment methods do you accept?', 'We currently accept cash payment at the workshop upon service completion. Online payment will be available soon.', 'payment', 3),
  ('How do I cancel or reschedule a booking?', 'You can manage your bookings from your customer dashboard. Please cancel at least 24 hours in advance to allow us to offer the slot to other customers.', 'booking', 4),
  ('Is my personal data safe?', 'Yes. We use industry-standard security including password hashing, multi-factor authentication (OTP), and encrypted data storage via Supabase.', 'security', 5),
  ('What is Multi-Factor Authentication (MFA)?', 'MFA adds an extra layer of security. After entering your password, you receive a One-Time Password (OTP) sent to your email that you must enter to complete login.', 'security', 6),
  ('What types of services do you offer?', 'We offer routine maintenance, topset services, engine repair, performance upgrades, and genuine/aftermarket spare parts for LC 135 and other motorcycles.', 'services', 7),
  ('What are your operating hours?', 'We are open Monday to Saturday, 9:00 AM to 6:00 PM. We are closed on Sundays and public holidays.', 'general', 8),
  ('Where is the workshop located?', 'We are located at Kampung Seri Malaysia, Kuala Lumpur. You can find the exact address and map on our Contact page.', 'general', 9),
  ('Can I walk in without a booking?', 'Yes, walk-ins are welcome, but we recommend booking online to secure your preferred time slot and avoid waiting.', 'booking', 10);

-- Seed services
INSERT INTO public.services (name_en, name_bm, category, description, price_min, price_max, duration_minutes, sort_order) VALUES
  ('Engine Oil Change', 'Tukar Minyak Enjin', 'maintenance', 'Full synthetic or semi-synthetic engine oil replacement with filter check.', 30, 60, 30, 1),
  ('Topset Service', 'Servis Topset', 'topset', 'Complete topset overhaul including piston ring, valve seal, gasket, and carbon cleaning. Recommended every 30,000km.', 150, 350, 180, 2),
  ('Brake Pad Replacement', 'Tukar Pad Brek', 'maintenance', 'Front and rear brake pad inspection and replacement with quality parts.', 40, 100, 45, 3),
  ('Chain & Sprocket Service', 'Servis Rantai & Sprocket', 'maintenance', 'Chain lubrication, adjustment, or full replacement with sprocket inspection.', 50, 150, 60, 4),
  ('Performance Carburetor Tuning', 'Penalaan Karburator Prestasi', 'performance', 'Fine-tune your LC 135 carburetor for optimal power and fuel efficiency.', 80, 200, 90, 5),
  ('Full Engine Repair', 'Baik Pulih Enjin Penuh', 'repair', 'Comprehensive engine diagnosis and repair for major mechanical issues.', 300, 800, 300, 6),
  ('Tyre Change & Balancing', 'Tukar Tayar & Balans', 'maintenance', 'Front or rear tyre replacement and wheel balancing service.', 60, 180, 45, 7),
  ('Electrical Diagnostic', 'Diagnostik Elektrik', 'repair', 'Full electrical system check including wiring, battery, and ignition system.', 50, 150, 60, 8);
