import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ currentPage, totalPages, onPageChange, className = '' }) {
  if (totalPages <= 1) return null

  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages, start + maxVisible - 1)
  if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1)

  for (let i = start; i <= end; i++) pages.push(i)

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg glass-card hover:border-[var(--accent-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} className="text-[var(--text-secondary)]" />
      </button>

      {start > 1 && (
        <>
          <PageButton page={1} current={currentPage} onClick={onPageChange} />
          {start > 2 && <span className="text-[var(--text-muted)] px-1">...</span>}
        </>
      )}

      {pages.map((page) => (
        <PageButton key={page} page={page} current={currentPage} onClick={onPageChange} />
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-[var(--text-muted)] px-1">...</span>}
          <PageButton page={totalPages} current={currentPage} onClick={onPageChange} />
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg glass-card hover:border-[var(--accent-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        aria-label="Next page"
      >
        <ChevronRight size={16} className="text-[var(--text-secondary)]" />
      </button>

      <span className="text-xs text-[var(--text-muted)] font-body ml-2">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  )
}

function PageButton({ page, current, onClick }) {
  const isActive = page === current
  return (
    <button
      onClick={() => onClick(page)}
      className={`
        w-9 h-9 rounded-lg text-sm font-medium font-body transition-all
        ${isActive
          ? 'bg-[var(--accent-primary)] text-white shadow-[0_0_16px_var(--accent-glow)]'
          : 'glass-card text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]'
        }
      `}
      aria-current={isActive ? 'page' : undefined}
    >
      {page}
    </button>
  )
}
