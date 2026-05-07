import { motion } from 'framer-motion'

export default function StatCard({ icon: Icon, label, value, trend, color = 'red', loading = false }) {
  const colorMap = {
    red: 'text-[var(--accent-primary)] bg-[var(--accent-primary)]/10',
    blue: 'text-[var(--admin-accent)] bg-[var(--admin-accent)]/10',
    green: 'text-green-400 bg-green-500/10',
    yellow: 'text-yellow-400 bg-yellow-500/10',
    orange: 'text-orange-400 bg-orange-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
  }

  const iconStyle = colorMap[color] || colorMap.red

  if (loading) {
    return (
      <div className="glass-card p-5">
        <div className="flex items-center gap-4">
          <div className="skeleton w-12 h-12 rounded-xl" />
          <div className="flex-1 flex flex-col gap-2">
            <div className="skeleton h-3 w-24 rounded" />
            <div className="skeleton h-7 w-16 rounded" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="glass-card p-5"
      whileHover={{ y: -2, boxShadow: '0 20px 60px var(--accent-glow)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="flex items-center gap-4">
        {Icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconStyle}`}>
            <Icon size={22} />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs text-[var(--text-muted)] font-body uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-bold font-display text-[var(--text-primary)]">{value ?? '—'}</p>
          {trend && (
            <p className={`text-xs font-body mt-0.5 ${trend.positive ? 'text-green-400' : 'text-red-400'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
