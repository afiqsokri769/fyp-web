import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ServiceCard from '../../components/shared/ServiceCard'
import serviceService from '../../services/serviceService'
import { SERVICE_CATEGORIES } from '../../utils/constants'

const containerVariants = {
  animate: { transition: { staggerChildren: 0.04 } },  // reduced from 0.07
}
const itemVariants = {
  initial: { opacity: 0, y: 12 },  // reduced movement
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24, duration: 0.25 } },
}

// Fallback static services — shown when DB has no data yet
const STATIC_SERVICES = [
  {
    id: '1', name_en: 'Engine Oil Change', name_bm: 'Tukar Minyak Enjin',
    category: 'maintenance',
    description: 'Full synthetic or semi-synthetic engine oil replacement with filter check.',
    price_min: 30, price_max: 60, duration_minutes: 30,
    image_url: '/images/services/oil-change.jpg', is_active: true,
  },
  {
    id: '2', name_en: 'Topset Service', name_bm: 'Servis Topset',
    category: 'topset',
    description: 'Complete topset overhaul including piston ring, valve seal, gasket, and carbon cleaning.',
    price_min: 150, price_max: 350, duration_minutes: 180,
    image_url: '/images/services/topset.jpg', is_active: true,
  },
  {
    id: '3', name_en: 'Brake Pad Replacement', name_bm: 'Tukar Pad Brek',
    category: 'maintenance',
    description: 'Front and rear brake pad inspection and replacement with quality parts.',
    price_min: 40, price_max: 100, duration_minutes: 45,
    image_url: '/images/services/brake.jpg', is_active: true,
  },
  {
    id: '4', name_en: 'Chain & Sprocket Service', name_bm: 'Servis Rantai & Sprocket',
    category: 'maintenance',
    description: 'Chain lubrication, adjustment, or full replacement with sprocket inspection.',
    price_min: 50, price_max: 150, duration_minutes: 60,
    image_url: '/images/services/chain.jpg', is_active: true,
  },
  {
    id: '5', name_en: 'Performance Carburetor Tuning', name_bm: 'Penalaan Karburator Prestasi',
    category: 'performance',
    description: 'Fine-tune your LC 135 carburetor for optimal power and fuel efficiency.',
    price_min: 80, price_max: 200, duration_minutes: 90,
    image_url: '/images/services/carb.jpg', is_active: true,
  },
  {
    id: '6', name_en: 'Full Engine Repair', name_bm: 'Baik Pulih Enjin Penuh',
    category: 'repair',
    description: 'Comprehensive engine diagnosis and repair for major mechanical issues.',
    price_min: 300, price_max: 800, duration_minutes: 300,
    image_url: '/images/services/engine.jpg', is_active: true,
  },
  {
    id: '7', name_en: 'Tyre Change & Balancing', name_bm: 'Tukar Tayar & Balans',
    category: 'maintenance',
    description: 'Front or rear tyre replacement and wheel balancing service.',
    price_min: 60, price_max: 180, duration_minutes: 45,
    image_url: '/images/services/tyre.jpg', is_active: true,
  },
  {
    id: '8', name_en: 'Electrical Diagnostic', name_bm: 'Diagnostik Elektrik',
    category: 'repair',
    description: 'Full electrical system check including wiring, battery, and ignition system.',
    price_min: 50, price_max: 150, duration_minutes: 60,
    image_url: '/images/services/electrical.jpg', is_active: true,
  },
]

export default function ServicesPage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    setLoading(true)
    serviceService.getServices()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setServices(res.data)
        } else {
          // DB empty — use static fallback
          setServices(STATIC_SERVICES)
        }
      })
      .catch(() => {
        // API error — use static fallback
        setServices(STATIC_SERVICES)
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = activeCategory === 'all'
    ? services
    : services.filter((s) => s.category === activeCategory)

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-primary)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[var(--accent-primary)]/5 rounded-full blur-3xl" />
        <div className="relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[var(--accent-primary)] font-body text-sm font-semibold tracking-widest uppercase mb-3">
              What We Offer
            </p>
            <h1 className="font-display font-bold text-5xl sm:text-6xl text-[var(--text-primary)]">
              OUR SERVICES
            </h1>
            <p className="text-[var(--text-secondary)] font-body text-lg mt-4 max-w-xl mx-auto">
              From routine maintenance to full performance builds — we've got your LC 135 covered.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="px-4 max-w-7xl mx-auto mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`
                px-5 py-2 rounded-full text-sm font-medium font-body transition-all
                ${activeCategory === cat.value
                  ? 'bg-[var(--accent-primary)] text-white shadow-[0_0_16px_var(--accent-glow)]'
                  : 'glass-card text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]'
                }
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-4 max-w-7xl mx-auto pb-20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass-card p-5 h-72">
                <div className="skeleton h-36 rounded-xl mb-4" />
                <div className="skeleton h-4 w-3/4 rounded mb-2" />
                <div className="skeleton h-3 w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[var(--text-muted)] font-body text-lg">
              No services found in this category.
            </p>
          </div>
        ) : (
          <motion.div
            key={activeCategory}
            variants={containerVariants}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filtered.map((service) => (
              <motion.div key={service.id} variants={itemVariants}>
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  )
}
