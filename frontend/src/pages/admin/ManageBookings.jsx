import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Download, ChevronDown, ChevronUp, Filter } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Pagination from '../../components/ui/Pagination'
import api from '../../services/api'
import useNotificationStore from '../../store/notificationStore'
import { formatDate, formatTime } from '../../utils/formatters'

const STATUSES = ['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled']

export default function ManageBookings() {
  const [bookings, setBookings] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [bulkStatus, setBulkStatus] = useState('confirmed')
  const [updatingId, setUpdatingId] = useState(null)
  const { success: showSuccess, error: showError } = useNotificationStore()
  const limit = 10

  const fetchBookings = () => {
    setLoading(true)
    api.get('/admin/bookings', {
      params: {
        status: statusFilter !== 'all' ? statusFilter : undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        limit,
        offset: (page - 1) * limit,
      },
    }).then((res) => {
      setBookings(res.data.data)
      setTotal(res.data.total)
    }).catch(() => showError('Failed to load bookings'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchBookings() }, [statusFilter, dateFrom, dateTo, page])

  const updateStatus = async (bookingId, status) => {
    setUpdatingId(bookingId)
    try {
      await api.put(`/admin/bookings/${bookingId}/status`, { status })
      showSuccess('Booking status updated')
      fetchBookings()
    } catch {
      showError('Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleBulkUpdate = async () => {
    if (selectedIds.length === 0) return
    try {
      await Promise.all(selectedIds.map((id) => api.put(`/admin/bookings/${id}/status`, { status: bulkStatus })))
      showSuccess(`${selectedIds.length} bookings updated`)
      setSelectedIds([])
      fetchBookings()
    } catch {
      showError('Bulk update failed')
    }
  }

  const exportCSV = () => {
    const headers = ['Reference', 'Customer', 'Date', 'Time', 'Status', 'Price']
    const rows = bookings.map((b) => [
      b.booking_reference,
      b.profiles?.full_name || '',
      formatDate(b.booking_date),
      formatTime(b.booking_time),
      b.status,
      b.total_estimated_price || '',
    ])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bookings.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const toggleSelect = (id) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Manage Bookings</h1>
          <p className="text-[var(--text-secondary)] font-body text-sm mt-1">{total} total bookings</p>
        </div>
        <Button variant="ghost" onClick={exportCSV} className="flex items-center gap-2 text-sm">
          <Download size={16} />
          Export CSV
        </Button>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1) }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium font-body transition-all capitalize
                ${statusFilter === s ? 'bg-[var(--admin-accent)] text-white' : 'glass-card text-[var(--text-secondary)] hover:text-[var(--admin-accent)]'}`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="flex gap-2 ml-auto">
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="input-field input-field-admin text-sm py-1.5 px-3" />
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="input-field input-field-admin text-sm py-1.5 px-3" />
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-3 mb-4 flex items-center gap-3"
        >
          <span className="text-sm text-[var(--text-secondary)] font-body">{selectedIds.length} selected</span>
          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value)}
            className="input-field input-field-admin text-sm py-1.5 px-3 w-auto"
          >
            {STATUSES.filter((s) => s !== 'all').map((s) => (
              <option key={s} value={s} className="bg-[var(--bg-secondary)] capitalize">{s.replace('_', ' ')}</option>
            ))}
          </select>
          <Button variant="admin" size="sm" onClick={handleBulkUpdate}>Apply</Button>
          <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])}>Clear</Button>
        </motion.div>
      )}

      {/* Table */}
      <div className="glass-card overflow-hidden overflow-x-auto mb-4">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-[var(--border-subtle)]">
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  className="accent-[var(--admin-accent)]"
                  checked={selectedIds.length === bookings.length && bookings.length > 0}
                  onChange={(e) => setSelectedIds(e.target.checked ? bookings.map((b) => b.id) : [])}
                />
              </th>
              {['Reference', 'Customer', 'Services', 'Date', 'Time', 'Status', 'Update Status', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider font-body">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-[var(--border-subtle)]">
                  {Array.from({ length: 9 }).map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>
                  ))}
                </tr>
              ))
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-[var(--text-muted)] font-body">No bookings found.</td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <>
                  <tr
                    key={booking.id}
                    className="border-b border-[var(--border-subtle)] hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="accent-[var(--admin-accent)]"
                        checked={selectedIds.includes(booking.id)}
                        onChange={() => toggleSelect(booking.id)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-[var(--admin-accent)]">{booking.booking_reference}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--text-secondary)] font-body">
                      {booking.profiles?.full_name || '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--text-secondary)] font-body max-w-[160px] truncate">
                      {booking.booking_services?.map((bs) => bs.services?.name_en).join(', ') || '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--text-secondary)] font-body">{formatDate(booking.booking_date)}</td>
                    <td className="px-4 py-3 text-sm text-[var(--text-secondary)] font-body">{formatTime(booking.booking_time)}</td>
                    <td className="px-4 py-3"><Badge status={booking.status} /></td>
                    <td className="px-4 py-3">
                      <select
                        value={booking.status}
                        onChange={(e) => updateStatus(booking.id, e.target.value)}
                        disabled={updatingId === booking.id}
                        className="input-field input-field-admin text-xs py-1 px-2 w-auto"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {STATUSES.filter((s) => s !== 'all').map((s) => (
                          <option key={s} value={s} className="bg-[var(--bg-secondary)] capitalize">{s.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors"
                      >
                        {expandedId === booking.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </td>
                  </tr>
                  <AnimatePresence>
                    {expandedId === booking.id && (
                      <tr key={`${booking.id}-expanded`}>
                        <td colSpan={9} className="px-4 pb-4">
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="glass-card p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm font-body"
                          >
                            <div>
                              <p className="text-xs text-[var(--text-muted)] mb-1">Motorcycle</p>
                              <p className="text-[var(--text-secondary)]">{booking.motorcycle_model || '—'} {booking.motorcycle_year && `(${booking.motorcycle_year})`}</p>
                            </div>
                            <div>
                              <p className="text-xs text-[var(--text-muted)] mb-1">License Plate</p>
                              <p className="text-[var(--text-secondary)]">{booking.license_plate || '—'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-[var(--text-muted)] mb-1">Mileage</p>
                              <p className="text-[var(--text-secondary)]">{booking.mileage ? `${booking.mileage} km` : '—'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-[var(--text-muted)] mb-1">Est. Price</p>
                              <p className="text-[var(--admin-accent)] font-semibold">{booking.total_estimated_price ? `RM ${parseFloat(booking.total_estimated_price).toFixed(2)}` : '—'}</p>
                            </div>
                            {booking.special_notes && (
                              <div className="col-span-2 sm:col-span-4">
                                <p className="text-xs text-[var(--text-muted)] mb-1">Notes</p>
                                <p className="text-[var(--text-secondary)]">{booking.special_notes}</p>
                              </div>
                            )}
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={page} totalPages={Math.ceil(total / limit)} onPageChange={setPage} />
    </div>
  )
}
