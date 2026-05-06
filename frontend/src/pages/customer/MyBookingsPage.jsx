import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarPlus } from 'lucide-react'
import BookingCard from '../../components/shared/BookingCard'
import ConfirmDialog from '../../components/shared/ConfirmDialog'
import bookingService from '../../services/bookingService'
import useNotificationStore from '../../store/notificationStore'
import { ROUTES } from '../../utils/constants'

const containerVariants = {
  animate: { transition: { staggerChildren: 0.07 } },
}
const itemVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelTarget, setCancelTarget] = useState(null)
  const [cancelling, setCancelling] = useState(false)
  const { success: showSuccess, error: showError } = useNotificationStore()

  const fetchBookings = () => {
    setLoading(true)
    bookingService.getBookings()
      .then((res) => setBookings(res.data))
      .catch(() => showError('Failed to load bookings'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchBookings() }, [])

  const handleCancel = async () => {
    if (!cancelTarget) return
    setCancelling(true)
    try {
      await bookingService.cancelBooking(cancelTarget.id)
      showSuccess('Booking cancelled successfully')
      setCancelTarget(null)
      fetchBookings()
    } catch {
      showError('Failed to cancel booking')
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">My Bookings</h1>
        <p className="text-[var(--text-secondary)] font-body text-sm mt-1">Track all your service appointments</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card p-5 h-44">
              <div className="skeleton h-4 w-1/3 rounded mb-3" />
              <div className="skeleton h-3 w-2/3 rounded mb-2" />
              <div className="skeleton h-3 w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <CalendarPlus size={48} className="text-[var(--text-muted)] mx-auto mb-4" />
          <h3 className="font-display font-bold text-xl text-[var(--text-primary)] mb-2">No bookings yet</h3>
          <p className="text-[var(--text-secondary)] font-body text-sm mb-6">Ready to book your first service?</p>
          <Link to={ROUTES.BOOK} className="btn-primary">Book Now</Link>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {bookings.map((booking) => (
            <motion.div key={booking.id} variants={itemVariants}>
              <BookingCard
                booking={booking}
                onCancel={(b) => setCancelTarget(b)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      <ConfirmDialog
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        loading={cancelling}
        title="Cancel Booking?"
        message={`Are you sure you want to cancel booking ${cancelTarget?.booking_reference}? This action cannot be undone.`}
        confirmLabel="Yes, Cancel"
        cancelLabel="Keep Booking"
      />
    </div>
  )
}
