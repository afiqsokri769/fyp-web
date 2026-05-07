import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { ChevronDown, Wrench, Shield, MapPin, ArrowRight, Star } from 'lucide-react'
import ServiceCard from '../../components/shared/ServiceCard'
import { AccordionItem } from '../../components/ui/Accordion'
import serviceService from '../../services/serviceService'
import { ROUTES, WORKSHOP_INFO } from '../../utils/constants'

// Same static fallback as ServicesPage
const STATIC_SERVICES = [
  { id: '1', name_en: 'Engine Oil Change', name_bm: 'Tukar Minyak Enjin', category: 'maintenance', description: 'Full synthetic or semi-synthetic engine oil replacement with filter check.', price_min: 30, price_max: 60, duration_minutes: 30, image_url: '/images/services/oil-change.jpg', is_active: true },
  { id: '2', name_en: 'Topset Service', name_bm: 'Servis Topset', category: 'topset', description: 'Complete topset overhaul including piston ring, valve seal, gasket, and carbon cleaning.', price_min: 150, price_max: 350, duration_minutes: 180, image_url: '/images/services/topset.jpg', is_active: true },
  { id: '3', name_en: 'Brake Pad Replacement', name_bm: 'Tukar Pad Brek', category: 'maintenance', description: 'Front and rear brake pad inspection and replacement with quality parts.', price_min: 40, price_max: 100, duration_minutes: 45, image_url: '/images/services/brake.jpg', is_active: true },
  { id: '5', name_en: 'Performance Carburetor Tuning', name_bm: 'Penalaan Karburator Prestasi', category: 'performance', description: 'Fine-tune your LC 135 carburetor for optimal power and fuel efficiency.', price_min: 80, price_max: 200, duration_minutes: 90, image_url: '/images/services/carb.jpg', is_active: true },
]

// Animated counter
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / 60
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])

  return <span ref={ref}>{count}{suffix}</span>
}

// Floating particles
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: `${Math.random() * 20}%`,
            animationDuration: `${3 + Math.random() * 5}s`,
            animationDelay: `${Math.random() * 4}s`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
          }}
        />
      ))}
    </div>
  )
}

const containerVariants = {
  animate: { transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
}

const faqs = [
  { question_en: 'How do I book a service?', answer_en: 'Register for an account, log in, navigate to "Book Service" in your dashboard, select your desired services, choose a date and time slot, and confirm your booking.' },
  { question_en: 'What are your operating hours?', answer_en: 'We are open Monday to Saturday, 9:00 AM to 6:00 PM. We are closed on Sundays and public holidays.' },
  { question_en: 'Can I walk in without a booking?', answer_en: 'Yes, walk-ins are welcome, but we recommend booking online to secure your preferred time slot and avoid waiting.' },
]

export default function HomePage() {
  const [services, setServices] = useState([])
  const [openFaq, setOpenFaq] = useState(null)

  useEffect(() => {
    serviceService.getServices()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setServices(res.data.slice(0, 4))
        } else {
          setServices(STATIC_SERVICES.slice(0, 4))
        }
      })
      .catch(() => setServices(STATIC_SERVICES.slice(0, 4)))
  }, [])

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/80 via-[var(--bg-primary)]/60 to-[var(--bg-secondary)]" />
          {/* Hero motorcycle image */}
          <img
            src="/images/hero-motorcycle.png"
            alt="LC 135 Motorcycle"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-luminosity"
          />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[var(--accent-primary)]/5 rounded-full blur-3xl" />
        </div>

        <Particles />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <p className="text-[var(--accent-primary)] font-body text-sm font-semibold tracking-[0.3em] uppercase mb-4">
              Kampung Seri Malaysia, Kuala Lumpur
            </p>
            <h1 className="font-display font-bold text-5xl sm:text-7xl lg:text-8xl text-[var(--text-primary)] leading-none mb-4">
              CABIN CREW
              <br />
              <span className="text-gradient">MOTORSPORT</span>
            </h1>
            <p className="text-[var(--text-secondary)] font-body text-lg sm:text-xl mt-6 mb-10 max-w-2xl mx-auto">
              Specialist Modified LC 135 — Performance Sparepart
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={ROUTES.BOOK} className="btn-primary text-lg px-8 py-4">
                Book a Service
              </Link>
              <Link to={ROUTES.ABOUT} className="btn-ghost text-lg px-8 py-4">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--text-muted)]"
        >
          <ChevronDown size={28} />
        </motion.div>
      </section>

      {/* ── SERVICES PREVIEW ── */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-[var(--accent-primary)] font-body text-sm font-semibold tracking-widest uppercase mb-2">What We Do</p>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-[var(--text-primary)]">OUR SERVICES</h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {services.length > 0
            ? services.map((s) => (
                <motion.div key={s.id} variants={itemVariants}>
                  <ServiceCard service={s} />
                </motion.div>
              ))
            : Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass-card p-5 h-64">
                  <div className="skeleton h-36 rounded-xl mb-4" />
                  <div className="skeleton h-4 w-3/4 rounded mb-2" />
                  <div className="skeleton h-3 w-1/2 rounded" />
                </div>
              ))
          }
        </motion.div>

        <div className="text-center mt-10">
          <Link to={ROUTES.SERVICES} className="btn-ghost inline-flex items-center gap-2">
            View All Services <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-20 px-4 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-[var(--text-primary)]">WHY CHOOSE US</h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            {[
              { icon: Wrench, title: 'Expert LC 135 Specialists', desc: 'Years of hands-on experience with Yamaha LC 135 modification, tuning, and performance upgrades.' },
              { icon: Shield, title: 'Secure Online Booking', desc: 'Book your service anytime with our secure platform. MFA-protected accounts keep your data safe.' },
              { icon: MapPin, title: 'Located in KL', desc: 'Conveniently located in Kampung Seri Malaysia, Kuala Lumpur. Easy access for all KL riders.' },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div key={i} variants={itemVariants} className="glass-card p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--accent-primary)]/10 border border-[var(--border-active)] flex items-center justify-center mx-auto mb-4">
                    <Icon size={24} className="text-[var(--accent-primary)]" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-[var(--text-primary)] mb-2">{item.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] font-body leading-relaxed">{item.desc}</p>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { value: 5, suffix: '+', label: 'Years Experience' },
              { value: 500, suffix: '+', label: 'Happy Customers' },
              { value: 1000, suffix: '+', label: 'Services Done' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="font-display font-bold text-4xl sm:text-5xl text-gradient">
                  <Counter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-[var(--text-secondary)] font-body mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ PREVIEW ── */}
      <section className="py-20 px-4 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-display font-bold text-4xl text-[var(--text-primary)]">COMMON QUESTIONS</h2>
        </motion.div>

        <div className="flex flex-col gap-3 mb-8">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              question={faq.question_en}
              answer={faq.answer_en}
              isOpen={openFaq === i}
              onToggle={() => setOpenFaq(openFaq === i ? null : i)}
            />
          ))}
        </div>

        <div className="text-center">
          <Link to={ROUTES.FAQ} className="btn-ghost inline-flex items-center gap-2">
            See All FAQ <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── CONTACT STRIP ── */}
      <section className="py-12 px-4 bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row gap-6 text-center sm:text-left">
            <div>
              <p className="text-xs text-[var(--text-muted)] font-body uppercase tracking-wider mb-1">Phone</p>
              <p className="font-display font-semibold text-[var(--text-primary)]">{WORKSHOP_INFO.phone}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)] font-body uppercase tracking-wider mb-1">Location</p>
              <p className="font-display font-semibold text-[var(--text-primary)]">{WORKSHOP_INFO.address}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)] font-body uppercase tracking-wider mb-1">Hours</p>
              <p className="font-display font-semibold text-[var(--text-primary)]">Mon–Sat, 9AM–6PM</p>
            </div>
          </div>
          <a
            href={WORKSHOP_INFO.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center gap-2 whitespace-nowrap"
          >
            <MapPin size={16} />
            Get Directions
          </a>
        </div>
      </section>
    </div>
  )
}
