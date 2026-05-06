import { z } from 'zod'

// Password: min 8 chars, at least one letter AND one number
const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

// Phone: optional — skip validation if empty
const phoneSchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val || val.trim() === '') return true
      return /^(\+?60|0)[0-9]{8,10}$/.test(val.replace(/-/g, '').trim())
    },
    { message: 'Enter a valid Malaysian phone number (e.g. 012-3456789)' }
  )

export const registerSchema = z
  .object({
    full_name: z.string().min(1, 'Full name is required').min(2, 'Full name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    phone: phoneSchema,
    password: passwordSchema,
    confirm_password: z.string().min(1, 'Please confirm your password'),
    // terms is handled separately in the component, not via Zod
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  })

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  remember_me: z.boolean().optional().default(false),
})

export const profileSchema = z.object({
  full_name: z.string().min(1, 'Full name is required').min(2, 'Full name must be at least 2 characters'),
  phone: phoneSchema,
  address: z.string().optional(),
})

export const passwordChangeSchema = z
  .object({
    current_password: z.string().min(1, 'Current password is required'),
    new_password: passwordSchema,
    confirm_password: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  })

export const inquirySchema = z.object({
  sender_name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  sender_email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  sender_phone: phoneSchema,
  subject: z.string().min(1, 'Subject is required').min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(1, 'Message is required').min(10, 'Message must be at least 10 characters'),
})

export const bookingStep2Schema = z.object({
  booking_date: z.string().min(1, 'Please select a date'),
  booking_time: z.string().min(1, 'Please select a time slot'),
  motorcycle_model: z.string().min(1, 'Motorcycle model is required'),
  motorcycle_year: z
    .number()
    .min(1990, 'Year must be 1990 or later')
    .max(new Date().getFullYear() + 1, 'Invalid year'),
  license_plate: z.string().min(1, 'License plate is required'),
  mileage: z.number().optional(),
  special_notes: z.string().optional(),
})

export const serviceSchema = z.object({
  name_en: z.string().min(1, 'Service name is required'),
  name_bm: z.string().optional(),
  category: z.enum(['maintenance', 'repair', 'performance', 'topset', 'general']),
  description: z.string().optional(),
  price_min: z.number().min(0, 'Price must be positive').optional(),
  price_max: z.number().min(0, 'Price must be positive').optional(),
  duration_minutes: z.number().min(1, 'Duration must be at least 1 minute'),
  is_active: z.boolean(),
})

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
})

export const otpSchema = z.object({
  token: z
    .string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must contain only numbers'),
})
