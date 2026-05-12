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
INSERT INTO public.faqs (question_en, question_bm, answer_en, answer_bm, category, sort_order) VALUES
  ('What is Cabin Crew Motorsport?',
   'Apakah itu Cabin Crew Motorsport?',
   'Cabin Crew Motorsport is a specialist motorcycle workshop established in 2013, located at Pangsapuri Sri Malaysia, Kg Malaysia Tambahan, 57100 Kuala Lumpur. We specialise in Yamaha LC 135, FZ, and Y15ZR servicing and performance upgrades.',
   'Cabin Crew Motorsport adalah bengkel motosikal pakar yang ditubuhkan pada 2013, terletak di Pangsapuri Sri Malaysia, Kg Malaysia Tambahan, 57100 Kuala Lumpur. Kami pakar dalam servis dan naik taraf prestasi Yamaha LC 135, FZ, dan Y15ZR.',
   'general', 1),

  ('How do I book a service?',
   'Bagaimana saya boleh menempah servis?',
   'Register for an account, log in, navigate to "Book Service" in your dashboard, select your desired services, choose a date and time slot, and confirm your booking.',
   'Daftar akaun, log masuk, pergi ke "Book Service" dalam dashboard anda, pilih servis yang dikehendaki, pilih tarikh dan masa, dan sahkan tempahan anda.',
   'booking', 2),

  ('What payment methods do you accept?',
   'Apakah kaedah pembayaran yang diterima?',
   'We currently accept cash payment at the workshop upon service completion. Online payment will be available soon.',
   'Kami menerima pembayaran tunai di bengkel selepas servis selesai. Pembayaran dalam talian akan tersedia tidak lama lagi.',
   'payment', 3),

  ('How do I cancel or reschedule a booking?',
   'Bagaimana untuk membatalkan atau menjadualkan semula tempahan?',
   'You can manage your bookings from your customer dashboard. Please cancel at least 24 hours in advance.',
   'Anda boleh mengurus tempahan dari dashboard pelanggan anda. Sila batalkan sekurang-kurangnya 24 jam lebih awal.',
   'booking', 4),

  ('Is my personal data safe?',
   'Adakah data peribadi saya selamat?',
   'Yes. We use industry-standard security including password hashing, multi-factor authentication (OTP), and encrypted data storage via Supabase.',
   'Ya. Kami menggunakan keselamatan standard industri termasuk pencincangan kata laluan, pengesahan pelbagai faktor (OTP), dan penyimpanan data yang disulitkan.',
   'security', 5),

  ('What is Multi-Factor Authentication (MFA)?',
   'Apakah itu Pengesahan Pelbagai Faktor (MFA)?',
   'MFA adds an extra layer of security. After entering your password, you receive a One-Time Password (OTP) sent to your email.',
   'MFA menambah lapisan keselamatan tambahan. Selepas memasukkan kata laluan, anda akan menerima Kata Laluan Sekali Guna (OTP) yang dihantar ke e-mel anda.',
   'security', 6),

  ('What types of services do you offer?',
   'Apakah jenis servis yang ditawarkan?',
   'We offer Topset Service, Overhaul, Repair services (clutch, waterpump, fork), Tuntut Insurance, and Servis Berkala (oil, brake, chain & sprocket) for Yamaha LC 135, FZ, and Y15ZR.',
   'Kami menawarkan Servis Topset, Overhaul, Servis Pembaikan (klac, pam air, fork), Tuntut Insurans, dan Servis Berkala (minyak, brek, rantai & sprocket) untuk Yamaha LC 135, FZ, dan Y15ZR.',
   'services', 7),

  ('What are your operating hours?',
   'Apakah waktu operasi bengkel?',
   'We are open Monday to Saturday, 9:00 AM to 6:00 PM. We are closed on Sundays and public holidays.',
   'Kami buka Isnin hingga Sabtu, 9:00 PG hingga 6:00 PTG. Kami tutup pada hari Ahad dan cuti umum.',
   'general', 8),

  ('Where is the workshop located?',
   'Di manakah bengkel ini terletak?',
   'We are located at No. 00-06, Pangsapuri Sri Malaysia, Jalan 3/141, Kg Malaysia Tambahan, 57100, Kuala Lumpur. Contact us at 017-628 4426.',
   'Kami terletak di No. 00-06, Pangsapuri Sri Malaysia, Jalan 3/141, Kg Malaysia Tambahan, 57100, Kuala Lumpur. Hubungi kami di 017-628 4426.',
   'general', 9),

  ('Can I walk in without a booking?',
   'Bolehkah saya datang tanpa tempahan?',
   'Yes, walk-ins are welcome, but we recommend booking online to secure your preferred time slot and avoid waiting.',
   'Ya, pelanggan tanpa tempahan dialu-alukan, tetapi kami mengesyorkan tempahan dalam talian untuk mendapatkan slot masa pilihan anda.',
   'booking', 10);

-- Seed services (real CCM services)
INSERT INTO public.services (name_en, name_bm, category, description, price_min, price_max, duration_minutes, sort_order) VALUES

  -- TOPSET
  ('Topset Service', 'Servis Topset', 'topset',
   'Complete topset service including: Gasket topset, Valve seal, Grind valve, Spark plug, Coolant, Engine oil, Oil filter, and Workmanship.',
   150, 350, 180, 1),

  -- OVERHAUL
  ('Full Engine Overhaul', 'Overhaul Enjin Penuh', 'repair',
   'Comprehensive engine overhaul including: Connecting rod, Bearing set engine, Gasket overhaul, Spark plug, Coolant, Engine oil, Oil filter, Oil seal engine, Pump rod & balancing, Engine cleaning, and Workmanship.',
   400, 900, 360, 2),

  -- MAINTENANCE
  ('Engine Oil Change', 'Tukar Minyak Enjin', 'maintenance',
   'Full synthetic or semi-synthetic engine oil replacement with oil filter check.',
   30, 60, 30, 3),

  ('Brake Service', 'Servis Brek', 'maintenance',
   'Front and rear brake inspection and replacement with quality parts.',
   40, 100, 45, 4),

  ('Chain & Sprocket Service', 'Servis Rantai & Sprocket', 'maintenance',
   'Chain lubrication, adjustment, or full replacement with sprocket inspection.',
   50, 150, 60, 5),

  -- REPAIR
  ('Clutch Repair', 'Baiki Klac', 'repair',
   'Clutch repair and replacement including: Clutch plate, Auto shoe clutch, Auto housing clutch, One way bearing clutch, and Ribet mangkuk clutch.',
   80, 250, 90, 6),

  ('Waterpump Kit Replacement', 'Ganti Kit Pam Air', 'repair',
   'Complete waterpump kit replacement to prevent overheating and coolant leaks.',
   60, 150, 60, 7),

  ('Fork Service', 'Servis Fork', 'repair',
   'Fork service including: Oil seal fork, Fork oil replacement, and Workmanship.',
   80, 200, 90, 8),

  ('One Way Starter Magnet', 'One Way Starter Magnet', 'repair',
   'Replacement of one way starter magnet for smooth engine starting.',
   60, 180, 60, 9),

  ('Skim Head / Block', 'Skim Head / Blok', 'performance',
   'Head and block skimming service for improved compression and engine performance.',
   100, 300, 120, 10),

  -- INSURANCE
  ('Tuntut Insurans', 'Tuntut Insurans', 'general',
   'Insurance claim assistance and repair service. We handle the paperwork and repairs for your motorcycle insurance claims.',
   0, 0, 120, 11),

  -- PERIODIC SERVICE
  ('Servis Berkala', 'Servis Berkala', 'maintenance',
   'Periodic maintenance service including engine oil change, brake inspection, and chain & sprocket check. Recommended every 3,000km.',
   80, 150, 60, 12);
