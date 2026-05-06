export const SERVICE_CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'repair', label: 'Repair' },
  { value: 'performance', label: 'Performance' },
  { value: 'topset', label: 'Topset' },
  { value: 'general', label: 'General' },
]

export const BOOKING_STATUSES = {
  pending: { label: 'Pending', color: 'warning' },
  confirmed: { label: 'Confirmed', color: 'info' },
  in_progress: { label: 'In Progress', color: 'orange' },
  completed: { label: 'Completed', color: 'success' },
  cancelled: { label: 'Cancelled', color: 'danger' },
}

export const INQUIRY_STATUSES = {
  pending: { label: 'Pending', color: 'warning' },
  replied: { label: 'Replied', color: 'success' },
  closed: { label: 'Closed', color: 'muted' },
}

export const FAQ_CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'general', label: 'General' },
  { value: 'booking', label: 'Booking' },
  { value: 'services', label: 'Services' },
  { value: 'payment', label: 'Payment' },
  { value: 'security', label: 'Security' },
]

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  SERVICES: '/services',
  CONTACT: '/contact',
  FAQ: '/faq',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/dashboard/profile',
  BOOK: '/dashboard/book',
  BOOKINGS: '/dashboard/bookings',
  INQUIRIES: '/dashboard/inquiries',
  ADMIN: '/admin',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_SERVICES: '/admin/services',
  ADMIN_BOOKINGS: '/admin/bookings',
  ADMIN_INQUIRIES: '/admin/inquiries',
}

export const WORKSHOP_INFO = {
  name: 'Cabin Crew Motorsport',
  tagline: 'Specialist Modified LC 135 — Performance Sparepart',
  address: 'Kampung Seri Malaysia, Kuala Lumpur, Malaysia',
  phone: '+60 11-XXXX XXXX',
  email: 'info@cabincrewmotorsport.com',
  hours: 'Monday – Saturday: 9:00 AM – 6:00 PM',
  closed: 'Closed on Sundays & Public Holidays',
  mapsUrl: 'https://maps.google.com/?q=Kampung+Seri+Malaysia+Kuala+Lumpur',
}
