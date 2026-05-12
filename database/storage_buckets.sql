-- ================================================
-- SUPABASE STORAGE BUCKETS SETUP
-- Run this in Supabase SQL Editor
-- ================================================

-- Create service-images bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'service-images',
  'service-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880;

-- Create inquiry-attachments bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'inquiry-attachments',
  'inquiry-attachments',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760;

-- Create avatars bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152, -- 2MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 2097152;

-- Storage policies for service-images
CREATE POLICY "Public can view service images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'service-images');

CREATE POLICY "Admins can upload service images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'service-images'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Admins can update service images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'service-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can delete service images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'service-images' AND auth.role() = 'authenticated');

-- Storage policies for inquiry-attachments
CREATE POLICY "Public can view inquiry attachments"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'inquiry-attachments');

CREATE POLICY "Anyone can upload inquiry attachments"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'inquiry-attachments');

-- Storage policies for avatars
CREATE POLICY "Public can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');
