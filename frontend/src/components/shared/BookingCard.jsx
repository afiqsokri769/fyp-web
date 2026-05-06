import { motion } from 'framer-motion'
import { Calendar, Clock, Bike, Hash } from 'lucide-react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { formatDate, formatTime } from '../../utils/formatters'

export default function BookingCard({ booking, onCancel, loading }) {
  const services = booking.booking_services || []
  const serviceNames = services.map((bs) => bs.services?.name_en || 'Service').join(', ')
  const canCancel = booking.status === 'pending' || booking.status === 'confirmed'

  return (
    <motion.div
      className="glass-card p-5 flex flex-col gap-4"
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Hash size={14} className="text-[var(--text-muted)]" />
            <span className="text-xs font-mono text-[var(--accent-primary)] font-semibold">
              {booking.booking_reference}
            </span>
          </div>
          <p className="font-display font-semibold text-[var(--text-primary)] text-base leading-tight">
            {serviceNames || 'Service Booking'}
          </p>
        </div>
        <Badge status={booking.status} />
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] font-body">
          <Calendar size={14} className="text-[var(--accent-primary)]" />
          {formatDate(booking.booking_date)}
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] font-body">
          <Clock size={14} className="text-[var(--accent-primary)]" />
          {formatTime(booking.booking_time)}
        </div>
        {booking.motorcycle_model && (
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] font-body col-span-2">
            <Bike size={14} className="text-[var(--accent-primary)]" />
            {booking.motorcycle_model} {booking.motorcycle_year && `(${booking.motorcycle_year})`}
          </div>
        )}
      </div>

      {/* Price */}
      {booking.total_estimated_price && (
        <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
          <span className="text-xs text-[var(--text-muted)] font-body">Estimated Total</span>
          <span className="font-display font-bold text-[var(--accent-primary)]">
            RM {parseFloat(booking.total_estimated_price).toFixed(2)}
          </span>
        </div>
      )}

      {/* Cancel Button */}
      {canCancel && onCancel && (
        <Button
          variant="danger"
          size="sm"
          onClick={() => onCancel(booking)}
          loading={loading}
          className="w-full"
        >
          Cancel Booking
        </Button>
      )}
    </motion.div>
  )
}
