import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

/**
 * Upload a file to Supabase Storage
 * @param {File} file - The file to upload
 * @param {string} bucket - Storage bucket name
 * @param {string} path - File path within bucket
 * @returns {Promise<string>} Public URL of uploaded file
 */
export async function uploadFile(file, bucket, path) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type,
    })

  if (error) throw new Error(`Upload failed: ${error.message}`)

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)
  return urlData.publicUrl
}

/**
 * Upload a service image
 * @param {File} file
 * @returns {Promise<string>} Public URL
 */
export async function uploadServiceImage(file) {
  const ext = file.name.split('.').pop()
  const path = `services/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  return uploadFile(file, 'service-images', path)
}

/**
 * Upload an inquiry attachment
 * @param {File} file
 * @param {string} userId
 * @returns {Promise<string>} Public URL
 */
export async function uploadInquiryAttachment(file, userId) {
  const ext = file.name.split('.').pop()
  const path = `${userId || 'public'}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  return uploadFile(file, 'inquiry-attachments', path)
}

export default supabase
