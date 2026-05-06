import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, Wrench, CalendarCheck,
  MessageSquare, LogOut, X, Shield
} from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { ROUTES } from '../../utils/constants'

const navItems = [
  { to: ROUTES.ADMIN, label: 'Overview', icon: LayoutDashboard, end: true },
  { to: ROUTES.ADMIN_CUSTOMERS, label: 'Customers', icon: Users },
  { to: ROUTES.ADMIN_SERVICES, label: 'Services', icon: Wrench },
  { to: ROUTES.ADMIN_BOOKINGS, label: 'Bookings', icon: CalendarCheck },
  { to: ROUTES.ADMIN_INQUIRIES, label: 'Inquiries', icon: MessageSquare },
]

export default function AdminSidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--admin-accent)] to-blue-400 flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">CC</span>
          </div>
          <div className="font-display font-bold text-sm leading-none">
            <div className="text-[var(--text-primary)]">CABIN CREW</div>
            <div className="text-[var(--admin-accent)]">MOTORSPORT</div>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-xs font-semibold text-blue-300 font-body">
          <Shield size={12} />
          ADMIN
        </span>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt={user.full_name} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--admin-accent)] to-blue-400 flex items-center justify-center">
              <span className="text-white font-bold text-sm">{user?.full_name?.[0]?.toUpperCase()}</span>
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--text-primary)] font-body truncate">{user?.full_name}</p>
            <p className="text-xs text-[var(--text-muted)] font-body truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 flex flex-col gap-1" aria-label="Admin navigation">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium font-body transition-all
                ${isActive
                  ? 'bg-[var(--admin-accent)]/15 text-[var(--admin-accent)] border border-blue-500/30'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                }`
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[var(--border-subtle)]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all font-body"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-subtle)] h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-[var(--bg-secondary)] border-r border-[var(--border-subtle)] z-50 lg:hidden"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5"
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
