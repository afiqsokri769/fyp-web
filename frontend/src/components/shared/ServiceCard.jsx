import { motion } from 'framer-motion'
import { Clock, Wrench, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '../ui/Badge'
import { formatPriceRange, formatDuration } from '../../utils/formatters'
import { ROUTES } from '../../utils/constants'
import useAuthStore from '../../store/authStore'

// Map service categories to local image paths as fallback
const CATEGORY_IMAGES = {
  maintenance: '/images/services/oil-change.jpg',
  topset: '/images/services/topset.jpg',
  repair: '/images/services/engine.jpg',
  performance: '/images/services/carb.jpg',
  general: '/images/services/electrical.jpg',
}

// Map service name keywords to specific images
function getServiceImage(service) {
  if (service.image_url && !service.image_url.startsWith('http')) {
    // Already a local path
    return service.image_url
  }
  const name = (service.name_en || '').toLowerCase()
  if (name.includes('oil') || name.includes('minyak')) return '/images/services/oil-change.jpg'
  if (name.includes('topset')) return '/images/services/topset.jpg'
  if (name.includes('brake') || name.includes('brek')) return '/images/services/brake.jpg'
  if (name.includes('chain') || name.includes('rantai')) return '/images/services/chain.jpg'
  if (name.includes('carb') || name.includes('karburator')) return '/images/services/carb.jpg'
  if (name.includes('engine') || name.includes('enjin')) return '/images/services/engine.jpg'
  if (name.includes('tyre') || name.includes('tayar')) return '/images/services/tyre.jpg'
  if (name.includes('electr') || name.includes('elektrik')) return '/images/services/electrical.jpg'
  // Fallback by category
  return CATEGORY_IMAGES[service.category] || '/images/services/engine.jpg'
}

export default function ServiceCard({ service, selectable, selected, onSelect }) {
  const { isAuthenticated } = useAuthStore()
  const bookLink = isAuthenticated ? ROUTES.BOOK : ROUTES.LOGIN
  const imageSrc = getServiceImage(service)

  return (
    <motion.div
      className={`glass-card p-5 flex flex-col gap-4 h-full
        ${selectable ? 'cursor-pointer' : ''}
        ${selected ? 'border-[var(--accent-primary)] shadow-[0_0_20px_var(--accent-glow)]' : ''}
      `}
      whileHover={{ y: -3, boxShadow: '0 20px 60px var(--accent-glow)' }}
      onClick={selectable ? () => onSelect?.(service) : undefined}
    >
      {/* Image — eager load for first visible cards, lazy for rest */}
      <div className="w-full h-40 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/5">
        <img
          src={imageSrc}
          alt={service.name_en}
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </div>

      {/* Title + select indicator */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-display font-semibold text-[var(--text-primary)] text-lg leading-tight">
            {service.name_en}
          </h3>
          {service.name_bm && (
            <p className="text-xs text-[var(--text-muted)] font-body mt-0.5">{service.name_bm}</p>
          )}
        </div>
        {selectable && (
          <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all
            ${selected
              ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)]'
              : 'border-[var(--border-subtle)]'
            }`}
          />
        )}
      </div>

      <Badge status={service.category} />

      {service.description && (
        <p className="text-sm text-[var(--text-secondary)] font-body leading-relaxed line-clamp-2 flex-1">
          {service.description}
        </p>
      )}

      {/* Price + CTA */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--border-subtle)]">
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
            className="flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors font-body"
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
