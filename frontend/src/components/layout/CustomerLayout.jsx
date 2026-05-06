import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import CustomerSidebar from './CustomerSidebar'

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25 } },
}

export default function CustomerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] overflow-hidden">
      <CustomerSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center gap-4 px-4 py-3 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>
          <div className="font-display font-bold text-sm">
            <span className="text-[var(--text-primary)]">CABIN CREW</span>
            <span className="text-[var(--accent-primary)] ml-1">MOTORSPORT</span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto scroll-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="p-6 max-w-6xl mx-auto"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
