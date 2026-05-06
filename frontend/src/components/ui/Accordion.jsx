import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export function AccordionItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left gap-4"
        aria-expanded={isOpen}
      >
        <span className="font-display font-semibold text-[var(--text-primary)] text-lg leading-snug">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-[var(--accent-primary)]"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-5 pb-5 text-[var(--text-secondary)] font-body text-sm leading-relaxed border-t border-[var(--border-subtle)] pt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Accordion({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => (
        <AccordionItem
          key={item.id || index}
          question={item.question_en || item.question}
          answer={item.answer_en || item.answer}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  )
}
