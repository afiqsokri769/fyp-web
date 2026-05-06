import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Send } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Pagination from '../../components/ui/Pagination'
import { Textarea } from '../../components/ui/Input'
import inquiryService from '../../services/inquiryService'
import useNotificationStore from '../../store/notificationStore'
import { formatDate, formatRelativeTime } from '../../utils/formatters'

const STATUSES = ['all', 'pending', 'replied', 'closed']

export default function ViewInquiries() {
  const [inquiries, setInquiries] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState(null)
  const [replyText, setReplyText] = useState({})
  const [sendingId, setSendingId] = useState(null)
  const { success: showSuccess, error: showError } = useNotificationStore()
  const limit = 10

  const fetchInquiries = () => {
    setLoading(true)
    inquiryService.getAllInquiries({
      status: statusFilter !== 'all' ? statusFilter : undefined,
      limit,
      offset: (page - 1) * limit,
    }).then((res) => {
      setInquiries(res.data.data)
      setTotal(res.data.total)
    }).catch(() => showError('Failed to load inquiries'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchInquiries() }, [statusFilter, page])

  const handleReply = async (inquiryId) => {
    const reply = replyText[inquiryId]?.trim()
    if (!reply) { showError('Reply cannot be empty'); return }
    setSendingId(inquiryId)
    try {
      await inquiryService.replyToInquiry(inquiryId, reply)
      showSuccess('Reply sent successfully')
      setReplyText((prev) => ({ ...prev, [inquiryId]: '' }))
      fetchInquiries()
    } catch {
      showError('Failed to send reply')
    } finally {
      setSendingId(null)
    }
  }

  const handleStatusUpdate = async (inquiryId, status) => {
    try {
      await inquiryService.updateInquiryStatus(inquiryId, status)
      showSuccess('Status updated')
      fetchInquiries()
    } catch {
      showError('Failed to update status')
    }
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Inquiries</h1>
        <p className="text-[var(--text-secondary)] font-body text-sm mt-1">{total} total inquiries</p>
      </motion.div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1) }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium font-body transition-all capitalize
              ${statusFilter === s ? 'bg-[var(--admin-accent)] text-white' : 'glass-card text-[var(--text-secondary)] hover:text-[var(--admin-accent)]'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Inquiry List */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}
        </div>
      ) : inquiries.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <p className="text-[var(--text-muted)] font-body">No inquiries found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 mb-6">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className="glass-card overflow-hidden">
              {/* Header Row */}
              <div className="flex items-center gap-4 p-4">
                <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <div className="sm:col-span-2">
                    <p className="text-sm font-semibold text-[var(--text-primary)] font-body truncate">{inquiry.subject}</p>
                    <p className="text-xs text-[var(--text-muted)] font-body">{inquiry.sender_name} · {inquiry.sender_email}</p>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] font-body self-center">{formatRelativeTime(inquiry.created_at)}</p>
                  <div className="flex items-center gap-2">
                    <Badge status={inquiry.status} />
                    <select
                      value={inquiry.status}
                      onChange={(e) => handleStatusUpdate(inquiry.id, e.target.value)}
                      className="input-field input-field-admin text-xs py-1 px-2 w-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {['pending', 'replied', 'closed'].map((s) => (
                        <option key={s} value={s} className="bg-[var(--bg-secondary)] capitalize">{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => setExpandedId(expandedId === inquiry.id ? null : inquiry.id)}
                  className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors flex-shrink-0"
                >
                  {expandedId === inquiry.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedId === inquiry.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-4 pb-4 border-t border-[var(--border-subtle)] pt-4 flex flex-col gap-4">
                      {/* Message */}
                      <div>
                        <p className="text-xs text-[var(--text-muted)] font-body uppercase tracking-wider mb-2">Message</p>
                        <p className="text-sm text-[var(--text-secondary)] font-body leading-relaxed bg-white/5 rounded-xl p-3">{inquiry.message}</p>
                      </div>

                      {/* Existing Reply */}
                      {inquiry.admin_reply && (
                        <div className="bg-[var(--admin-accent)]/5 border border-blue-500/20 rounded-xl p-3">
                          <p className="text-xs text-[var(--admin-accent)] font-body uppercase tracking-wider mb-1">Your Reply</p>
                          <p className="text-sm text-[var(--text-secondary)] font-body leading-relaxed">{inquiry.admin_reply}</p>
                          {inquiry.replied_at && (
                            <p className="text-xs text-[var(--text-muted)] font-body mt-1">{formatDate(inquiry.replied_at)}</p>
                          )}
                        </div>
                      )}

                      {/* Reply Form */}
                      {inquiry.status !== 'closed' && (
                        <div className="flex flex-col gap-2">
                          <Textarea
                            label={inquiry.admin_reply ? 'Update Reply' : 'Write a Reply'}
                            placeholder="Type your reply here..."
                            value={replyText[inquiry.id] || ''}
                            onChange={(e) => setReplyText((prev) => ({ ...prev, [inquiry.id]: e.target.value }))}
                            rows={3}
                            admin
                          />
                          <Button
                            variant="admin"
                            size="sm"
                            onClick={() => handleReply(inquiry.id)}
                            loading={sendingId === inquiry.id}
                            className="self-end flex items-center gap-2"
                          >
                            <Send size={14} />
                            Send Reply
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

      <Pagination currentPage={page} totalPages={Math.ceil(total / limit)} onPageChange={setPage} />
    </div>
  )
}
