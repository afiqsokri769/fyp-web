import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard, Sun, Moon } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { ROUTES } from '../../utils/constants'

// Theme hook
function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('ccm_theme') || 'dark')
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('ccm_theme', theme)
  }, [theme])
  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  return { theme, toggle }
}

const navLinks = [
  { to: ROUTES.HOME, label: 'Home' },
  { to: ROUTES.ABOUT, label: 'About' },
  { to: ROUTES.SERVICES, label: 'Services' },
  { to: ROUTES.FAQ, label: 'FAQ' },
  { to: ROUTES.CONTACT, label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()
  const { theme, toggle: toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
    setUserMenuOpen(false)
  }

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-40 transition-all duration-300
        ${scrolled ? 'bg-[var(--bg-secondary)]/90 backdrop-blur-xl border-b border-[var(--border-subtle)] shadow-lg' : 'bg-transparent'}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">CC</span>
            </div>
            <div className="font-display font-bold text-lg leading-none">
              <span className="text-[var(--text-primary)]">CABIN CREW</span>
              <span className="text-[var(--accent-primary)] ml-1">MOTORSPORT</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium font-body transition-all relative
                  ${isActive
                    ? 'text-[var(--accent-primary)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-[var(--accent-primary)] rounded-full"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg glass-card hover:border-[var(--accent-primary)] transition-all text-[var(--text-secondary)] hover:text-[var(--accent-primary)]"
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl glass-card hover:border-[var(--accent-primary)] transition-all"
                >
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.full_name} className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{user.full_name?.[0]?.toUpperCase()}</span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-[var(--text-primary)] font-body max-w-[120px] truncate">
                    {user.full_name}
                  </span>
                  <ChevronDown size={14} className="text-[var(--text-muted)]" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 glass-card p-2 shadow-2xl"
                    >
                      <Link
                        to={user.role === 'admin' ? ROUTES.ADMIN : ROUTES.DASHBOARD}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors font-body"
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>
                      <Link
                        to={ROUTES.PROFILE}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors font-body"
                      >
                        <User size={16} />
                        Profile
                      </Link>
                      <hr className="border-[var(--border-subtle)] my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors font-body"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to={ROUTES.LOGIN} className="btn-ghost text-sm px-5 py-2.5">
                  Login
                </Link>
                <Link to={ROUTES.REGISTER} className="btn-primary text-sm px-5 py-2.5">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-[var(--bg-secondary)]/95 backdrop-blur-xl border-t border-[var(--border-subtle)]"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-sm font-medium font-body transition-all
                    ${isActive
                      ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <hr className="border-[var(--border-subtle)] my-2" />

              {isAuthenticated && user ? (
                <>
                  <Link
                    to={user.role === 'admin' ? ROUTES.ADMIN : ROUTES.DASHBOARD}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-white/5 font-body flex items-center gap-2"
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false) }}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 font-body flex items-center gap-2 text-left"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Link to={ROUTES.LOGIN} onClick={() => setMobileOpen(false)} className="btn-ghost text-sm text-center">
                    Login
                  </Link>
                  <Link to={ROUTES.REGISTER} onClick={() => setMobileOpen(false)} className="btn-primary text-sm text-center">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
