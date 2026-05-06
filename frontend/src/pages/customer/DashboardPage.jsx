import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarPlus, CalendarCheck, MessageSquare, User, Calendar, Clock } from 'lucide-react'
import StatCard from '../../components/shared/StatCard'
import BookingCard from '../../components/shared/BookingCard'
import useAuthStore from '../../store/authStore'
import bookingService from '../../services/bookingService'
import inquiryService from '../../services/inquiryService'
import { ROUTES } from '../../utils/constants'
import { formatDate, formatTime } from '../../utils/formatters'

const containerVariants = {
  animate: { transition: { staggerChildren: 0.08 } },
}
const itemVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [bookings, setBookings] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      bookingService.getBookings(),
      inquiryService.getInquiries(),
    ]).then(([bRes, iRes]) => {
      setBookings(bRes.data)
      setInquiries(iRes.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const totalBookings = bookings.length
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length
  const completedBookings = bookings.filter((b) => b.status === 'completed').length
  const openInquiries = inquiries.filter((i) => i.status === 'pending').length
  const recentBookings = bookings.slice(0, 5)
  const upcoming = bookings.find((b) => ['pending', 'confirmed'].includes(b.status) && new Date(b.booking_date) >= new Date())

  return (
    <div>
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 mb-6 border-l-4 border-[var(--accent-primary)]"
      >
        <h1 className="font-display font-bold text-2xl text-[var(--text-primary)]">
          Selamat Datang, {user?.full_name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-[var(--text-secondary)] font-body text-sm mt-1">
          Here's an overview of your account activity.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <motion.div variants={itemVariants}>
          <StatCard icon={CalendarCheck} label="Total Bookings" value={totalBookings} color="orange" loading={loading} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard icon={Clock} label="Pending" value={pendingBookings} color="yellow" loading={loading} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard icon={CalendarCheck} label="Completed" value={completedBookings} color="green" loading={loading} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard icon={MessageSquare} label="Open Inquiries" value={openInquiries} color="blue" loading={loading} />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-xl text-[var(--text-primary)]">Recent Bookings</h2>
            <Link to={ROUTES.BOOKINGS} className="text-sm text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] font-body transition-colors">
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass-card p-5 h-32">
                  <div className="skeleton h-4 w-1/3 rounded mb-3" />
                  <div className="skeleton h-3 w-2/3 rounded mb-2" />
                  <div className="skeleton h-3 w-1/2 rounded" />
                </div>
              ))}
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="glass-card p-10 text-center">
              <CalendarPlus size={36} className="text-[var(--text-muted)] mx-auto mb-3" />
              <p className="text-[var(--text-secondary)] font-body mb-4">No bookings yet. Ready to book your first service?</p>
              <Link to={ROUTES.BOOK} className="btn-primary text-sm px-6 py-2.5">Book Now</Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recentBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">
          {/* Upcoming Appointment */}
          {upcoming && (
            <div className="glass-card p-5 border-l-4 border-[var(--accent-primary)]">
              <p className="text-xs text-[var(--text-muted)] font-body uppercase tracking-wider mb-2">Next Appointment</p>
              <div className="flex items-center gap-2 mb-1">
                <Calendar size={16} className="text-[var(--accent-primary)]" />
                <span className="text-sm font-semibold text-[var(--text-primary)] font-body">{formatDate(upcoming.booking_date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[var(--accent-primary)]" />
                <span className="text-sm text-[var(--text-secondary)] font-body">{formatTime(upcoming.booking_time)}</span>
              </div>
              <p className="text-xs font-mono text-[var(--accent-primary)] mt-2">{upcoming.booking_reference}</p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="glass-card p-5">
            <h3 className="font-display font-semibold text-lg text-[var(--text-primary)] mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              {[
                { to: ROUTES.BOOK, icon: CalendarPlus, label: 'Book a Service' },
                { to: ROUTES.BOOKINGS, icon: CalendarCheck, label: 'View Bookings' },
                { to: ROUTES.INQUIRIES, icon: MessageSquare, label: 'My Inquiries' },
                { to: ROUTES.PROFILE, icon: User, label: 'Edit Profile' },
              ].map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.to}
                    to={action.to}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/5 transition-all font-body"
                  >
                    <Icon size={16} className="text-[var(--accent-primary)]" />
                    {action.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
