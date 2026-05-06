const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-3',
}

export default function Spinner({ size = 'md', className = '', admin = false }) {
  const sizeClass = sizes[size] || sizes.md
  const color = admin ? 'border-blue-500' : 'border-brand-orange'

  return (
    <div
      className={`
        ${sizeClass} ${color}
        rounded-full border-t-transparent animate-spin
        ${className}
      `}
      role="status"
      aria-label="Loading"
    />
  )
}

export function FullPageSpinner({ admin = false }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[var(--bg-primary)] z-50">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" admin={admin} />
        <p className="text-[var(--text-secondary)] font-body text-sm">Loading...</p>
      </div>
    </div>
  )
}
