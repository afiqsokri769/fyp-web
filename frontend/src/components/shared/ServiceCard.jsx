import { motion } from 'framer-motion'
import { Clock, Wrench, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '../ui/Badge'
import { formatPriceRange, formatDuration } from '../../utils/formatters'
import { ROUTES } from '../../utils/constants'
import useAuthStore from '../../store/authStore'

export default function ServiceCard({ service, onBook, selectable, selected, onSelect }) {
  const { isAuthenticated } = useAuthStore()

  const bookLink = isAuthenticated ? ROUTES.BOOK : ROUTES.LOGIN

  return (
    <motion.div
      className={`glass-card p-5 flex flex-col gap-4 cursor-pointer
        ${selected ? 'border-[var(--accent-primary)] shadow-[0_0_20px_var(--accent-glow)]' : ''}
      `}
      whileHover={{ y: -3, boxShadow: '0 20px 60px var(--accent-glow)' }}
      onClick={selectable ? () => onSelect?.(service) : undefined}
    >
      {/* Image placeholder */}
      <div className="w-full h-36 rounded-xl bg-gradient-to-br from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/5 flex items-center justify-center border border-[var(--border-subtle)]">
        {service.image_url ? (
          <img src={service.image_url} alt={service.name_en} className="w-full h-full object-cover rounded-xl" />
        ) : (
          <Wrench size={36} className="text-[var(--accent-primary)]/40" />
        )}
      </div>

      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display font-semibold text-[var(--text-primary)] text-lg leading-tight">
          {service.name_en}
        </h3>
        {selectable && (
          <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all
            ${selected
              ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)]'
              : 'border-[var(--border-subtle)]'
            }`}
          >
            {selected && <div className="w-full h-full rounded-full bg-white scale-50" />}
          </div>
        )}
      </div>

      {service.name_bm && (
        <p className="text-xs text-[var(--text-muted)] font-body -mt-2">{service.name_bm}</p>
      )}

      <Badge status={service.category} />

      {service.description && (
        <p className="text-sm text-[var(--text-secondary)] font-body leading-relaxed line-clamp-2">
          {service.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-[var(--border-subtle)]">
        <div>
          <p className="text-lg font-bold font-display text-[var(--accent-primary)]">
            {formatPriceRange(service.price_min, service.price_max)}
          </p>
          <div className="flex items-center gap-1 text-xs text-[var(--text-muted)] font-body mt-0.5">
            <Clock size={12} />
            {formatDuration(service.duration_minutes)}
          </div>
        </div>

        {!selectable && (
          <Link
            to={bookLink}
            className="flex items-center gap-1.5 text-sm font-medium text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors font-body"
            onClick={(e) => e.stopPropagation()}
          >
            Book
            <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </motion.div>
  )
}
