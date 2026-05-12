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
  established: '2013',
  owner: 'En. Yazid Bin Harun',
  mission: 'Menyediakan perkhidmatan yang mampu milik untuk setiap lapisan pengguna motorsikal.',
  vision: 'Menjadi salah satu bengkel terkemuka di Malaysia.',
  address: 'No. 00-06, Pangsapuri Sri Malaysia, Jalan 3/141, Kg Malaysia Tambahan, 57100, Kuala Lumpur',
  addressShort: 'Kg Malaysia Tambahan, 57100, KL',
  phone: '017-628 4426',
  email: 'cabincrewmotorsport@gmail.com',
  facebook: 'Cabin Crew Motorsport',
  facebookUrl: 'https://www.facebook.com/cabincrewmotorsport',
  hours: 'Isnin – Sabtu: 9:00 PG – 6:00 PTG',
  closed: 'Tutup pada Ahad & Cuti Umum',
  mapsUrl: 'https://maps.google.com/?q=Pangsapuri+Sri+Malaysia+Jalan+3/141+Kuala+Lumpur',
  specialists: ['Yamaha LC 135', 'Yamaha FZ', 'Yamaha Y15ZR'],
  management: [
    { name: 'En. Yazid Bin Harun', role: 'Pengarah (Director)' },
    { name: 'En. Muhammad Zulhilmi Bin Yazid', role: 'Pengurus Operasi (Operations Manager)' },
    { name: 'Pn. Rosilawati Binti Abd Rahim', role: 'Pengurus Kewangan (Finance Manager)' },
    { name: 'Saifullah Bin Saufi', role: 'Mekanik (Mechanic)' },
  ],
}
