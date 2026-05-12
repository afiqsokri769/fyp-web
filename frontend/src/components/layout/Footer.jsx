import { Link } from 'react-router-dom'
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, Clock } from 'lucide-react'
import { ROUTES, WORKSHOP_INFO } from '../../utils/constants'

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">CC</span>
              </div>
              <div className="font-display font-bold text-lg">
                <span className="text-[var(--text-primary)]">CABIN CREW</span>
                <span className="text-[var(--accent-primary)] ml-1">MOTORSPORT</span>
              </div>
            </div>
            <p className="text-[var(--text-secondary)] font-body text-sm leading-relaxed max-w-xs mb-4">
              {WORKSHOP_INFO.tagline}. Your trusted LC 135 specialist in Kuala Lumpur.
            </p>
            <div className="flex items-center gap-3">
              <a href={WORKSHOP_INFO.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-2 rounded-lg glass-card hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] text-[var(--text-muted)] transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" aria-label="Instagram" className="p-2 rounded-lg glass-card hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] text-[var(--text-muted)] transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" aria-label="YouTube" className="p-2 rounded-lg glass-card hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] text-[var(--text-muted)] transition-all">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-[var(--text-primary)] mb-4 text-lg">Quick Links</h3>
            <ul className="flex flex-col gap-2">
              {[
                { to: ROUTES.HOME, label: 'Home' },
                { to: ROUTES.ABOUT, label: 'About Us' },
                { to: ROUTES.SERVICES, label: 'Services' },
                { to: ROUTES.FAQ, label: 'FAQ' },
                { to: ROUTES.CONTACT, label: 'Contact' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors font-body"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display font-semibold text-[var(--text-primary)] mb-4 text-lg">Contact</h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2 text-sm text-[var(--text-secondary)] font-body">
                <MapPin size={16} className="text-[var(--accent-primary)] flex-shrink-0 mt-0.5" />
                {WORKSHOP_INFO.address}
              </li>
              <li className="flex items-center gap-2 text-sm text-[var(--text-secondary)] font-body">
                <Phone size={16} className="text-[var(--accent-primary)] flex-shrink-0" />
                {WORKSHOP_INFO.phone}
              </li>
              <li className="flex items-center gap-2 text-sm text-[var(--text-secondary)] font-body">
                <Mail size={16} className="text-[var(--accent-primary)] flex-shrink-0" />
                {WORKSHOP_INFO.email}
              </li>
              <li className="flex items-start gap-2 text-sm text-[var(--text-secondary)] font-body">
                <Clock size={16} className="text-[var(--accent-primary)] flex-shrink-0 mt-0.5" />
                <span>{WORKSHOP_INFO.hours}<br /><span className="text-[var(--text-muted)]">{WORKSHOP_INFO.closed}</span></span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--border-subtle)] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)] font-body">
            © 2025 Cabin Crew Motorsport. All rights reserved.
          </p>
          <p className="text-xs text-[var(--text-muted)] font-body">
            built by linkedin: Muhammad Talha Kausar 
          </p>
        </div>
      </div>
    </footer>
  )
}
