const statusStyles = {
  // Booking statuses
  pending: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
  confirmed: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  in_progress: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
  completed: 'bg-green-500/15 text-green-400 border border-green-500/30',
  cancelled: 'bg-red-500/15 text-red-400 border border-red-500/30',

  // Inquiry statuses
  replied: 'bg-green-500/15 text-green-400 border border-green-500/30',
  closed: 'bg-gray-500/15 text-gray-400 border border-gray-500/30',

  // Role
  admin: 'bg-blue-500/20 text-blue-300 border border-blue-500/40',
  customer: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',

  // Generic
  success: 'bg-green-500/15 text-green-400 border border-green-500/30',
  warning: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
  danger: 'bg-red-500/15 text-red-400 border border-red-500/30',
  info: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  muted: 'bg-gray-500/15 text-gray-400 border border-gray-500/30',

  // Categories
  maintenance: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  repair: 'bg-red-500/15 text-red-400 border border-red-500/30',
  performance: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
  topset: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
  general: 'bg-gray-500/15 text-gray-400 border border-gray-500/30',
}

const statusLabels = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  replied: 'Replied',
  closed: 'Closed',
  admin: 'ADMIN',
  customer: 'Customer',
  maintenance: 'Maintenance',
  repair: 'Repair',
  performance: 'Performance',
  topset: 'Topset',
  general: 'General',
}

export default function Badge({ status, label, className = '', size = 'sm' }) {
  const style = statusStyles[status] || statusStyles.muted
  const text = label || statusLabels[status] || status

  const sizeClass = size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1'

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium font-body
        ${sizeClass} ${style} ${className}
      `}
    >
      {text}
    </span>
  )
}
