import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Download, UserX, UserCheck, Trash2, X } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Pagination from '../../components/ui/Pagination'
import ConfirmDialog from '../../components/shared/ConfirmDialog'
import api from '../../services/api'
import useNotificationStore from '../../store/notificationStore'
import { formatDate } from '../../utils/formatters'

export default function ManageCustomers() {
  const [customers, setCustomers] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [confirmAction, setConfirmAction] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const { success: showSuccess, error: showError } = useNotificationStore()
  const limit = 10

  const fetchCustomers = () => {
    setLoading(true)
    api.get('/admin/customers', {
      params: { search: search || undefined, status: statusFilter !== 'all' ? statusFilter : undefined, limit, offset: (page - 1) * limit },
    }).then((res) => {
      setCustomers(res.data.data)
      setTotal(res.data.total)
    }).catch(() => showError('Failed to load customers'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchCustomers() }, [search, statusFilter, page])

  const handleToggleStatus = async () => {
    if (!confirmAction) return
    setActionLoading(true)
    try {
      await api.put(`/admin/customers/${confirmAction.customer.id}/status`, null, {
        params: { is_active: !confirmAction.customer.is_active },
      })
      showSuccess(`Customer ${confirmAction.customer.is_active ? 'disabled' : 'enabled'} successfully`)
      setConfirmAction(null)
      fetchCustomers()
    } catch {
      showError('Failed to update customer status')
    } finally {
      setActionLoading(false)
    }
  }

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Registered', 'Status']
    const rows = customers.map((c) => [c.full_name, c.email, c.phone || '', formatDate(c.created_at), c.is_active ? 'Active' : 'Disabled'])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'customers.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Manage Customers</h1>
          <p className="text-[var(--text-secondary)] font-body text-sm mt-1">{total} total customers</p>
        </div>
        <Button variant="ghost" onClick={exportCSV} className="flex items-center gap-2 text-sm">
          <Download size={16} />
          Export CSV
        </Button>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="input-field pl-9 input-field-admin"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'disabled'].map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1) }}
              className={`px-4 py-2 rounded-xl text-sm font-medium font-body transition-all capitalize
                ${statusFilter === s ? 'bg-[var(--admin-accent)] text-white' : 'glass-card text-[var(--text-secondary)] hover:text-[var(--admin-accent)]'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden overflow-x-auto mb-4">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-[var(--border-subtle)]">
              {['Name', 'Email', 'Phone', 'Registered', 'Status', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider font-body">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-[var(--border-subtle)]">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>
                  ))}
                </tr>
              ))
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-[var(--text-muted)] font-body">No customers found.</td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-white/5 cursor-pointer transition-colors"
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--admin-accent)] to-blue-400 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{customer.full_name?.[0]?.toUpperCase()}</span>
                      </div>
                      <span className="text-sm font-medium text-[var(--text-primary)] font-body">{customer.full_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)] font-body">{customer.email}</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)] font-body">{customer.phone || '—'}</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)] font-body">{formatDate(customer.created_at)}</td>
                  <td className="px-4 py-3">
                    <Badge status={customer.is_active ? 'success' : 'danger'} label={customer.is_active ? 'Active' : 'Disabled'} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setConfirmAction({ type: 'toggle', customer })}
                        className={`p-1.5 rounded-lg transition-colors ${customer.is_active ? 'text-yellow-400 hover:bg-yellow-500/10' : 'text-green-400 hover:bg-green-500/10'}`}
                        title={customer.is_active ? 'Disable' : 'Enable'}
                      >
                        {customer.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={page} totalPages={Math.ceil(total / limit)} onPageChange={setPage} />

      {/* Customer Detail Panel */}
      {selectedCustomer && (
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed right-0 top-0 bottom-0 w-80 bg-[var(--bg-secondary)] border-l border-[var(--border-subtle)] z-50 overflow-y-auto p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">Customer Details</h3>
            <button onClick={() => setSelectedCustomer(null)} className="p-2 rounded-lg hover:bg-white/5 text-[var(--text-muted)]">
              <X size={18} />
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--admin-accent)] to-blue-400 flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-2xl">{selectedCustomer.full_name?.[0]?.toUpperCase()}</span>
            </div>
            <div className="text-center">
              <p className="font-display font-bold text-lg text-[var(--text-primary)]">{selectedCustomer.full_name}</p>
              <p className="text-xs text-[var(--text-muted)] font-body">{selectedCustomer.email}</p>
            </div>
            {[
              { label: 'Phone', value: selectedCustomer.phone || '—' },
              { label: 'Address', value: selectedCustomer.address || '—' },
              { label: 'Registered', value: formatDate(selectedCustomer.created_at) },
              { label: 'MFA', value: selectedCustomer.mfa_enabled ? 'Enabled' : 'Disabled' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between text-sm font-body">
                <span className="text-[var(--text-muted)]">{item.label}</span>
                <span className="text-[var(--text-secondary)]">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <ConfirmDialog
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleToggleStatus}
        loading={actionLoading}
        title={confirmAction?.customer?.is_active ? 'Disable Account?' : 'Enable Account?'}
        message={`Are you sure you want to ${confirmAction?.customer?.is_active ? 'disable' : 'enable'} ${confirmAction?.customer?.full_name}'s account?`}
        confirmLabel={confirmAction?.customer?.is_active ? 'Disable' : 'Enable'}
        variant={confirmAction?.customer?.is_active ? 'danger' : 'primary'}
      />
    </div>
  )
}
