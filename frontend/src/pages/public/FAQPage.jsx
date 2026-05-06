import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { AccordionItem } from '../../components/ui/Accordion'
import api from '../../services/api'
import { FAQ_CATEGORIES } from '../../utils/constants'

export default function FAQPage() {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [openIndex, setOpenIndex] = useState(null)

  useEffect(() => {
    api.get('/faqs').then((res) => setFaqs(res.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = faqs.filter((faq) => {
    const matchesSearch = !search ||
      faq.question_en.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer_en.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-primary)]" />
        <div className="relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[var(--accent-primary)] font-body text-sm font-semibold tracking-widest uppercase mb-3">Got Questions?</p>
            <h1 className="font-display font-bold text-5xl sm:text-6xl text-[var(--text-primary)]">FAQ</h1>
            <p className="text-[var(--text-secondary)] font-body text-lg mt-4 max-w-xl mx-auto">
              Find answers to the most common questions about our services and booking process.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-4 max-w-3xl mx-auto pb-20">
        {/* Search */}
        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setOpenIndex(null) }}
            className="input-field pl-11"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {FAQ_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => { setActiveCategory(cat.value); setOpenIndex(null) }}
              className={`
                px-4 py-1.5 rounded-full text-sm font-medium font-body transition-all
                ${activeCategory === cat.value
                  ? 'bg-[var(--accent-primary)] text-white'
                  : 'glass-card text-[var(--text-secondary)] hover:text-[var(--accent-primary)]'
                }
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="glass-card p-5">
                <div className="skeleton h-5 w-3/4 rounded mb-2" />
                <div className="skeleton h-3 w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[var(--text-muted)] font-body text-lg mb-2">No results found</p>
            <p className="text-[var(--text-muted)] font-body text-sm">Try a different search term or category</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((faq, index) => (
              <AccordionItem
                key={faq.id}
                question={faq.question_en}
                answer={faq.answer_en}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
