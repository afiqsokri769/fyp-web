import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Plus, ChevronDown, Upload, X, Paperclip } from 'lucide-react'
import { z } from 'zod'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input, { Textarea } from '../../components/ui/Input'
import inquiryService from '../../services/inquiryService'
import { uploadInquiryAttachment } from '../../services/storageService'
import useAuthStore from '../../store/authStore'
import useNotificationStore from '../../store/notificationStore'
import { formatDate, formatRelativeTime } from '../../utils/formatters'

const newInquirySchema = z.object({
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [attachmentFile, setAttachmentFile] = useState(null)
  const [attachmentPreview, setAttachmentPreview] = useState(null)
  const { user } = useAuthStore()
  const { success: showSuccess, error: showError } = useNotificationStore()

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(newInquirySchema),
  })

  const fetchInquiries = () => {
    inquiryService.getInquiries()
      .then((res) => setInquiries(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchInquiries() }, [])

  const handleAttachmentChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      showError('File must be under 10MB')
      return
    }
    setAttachmentFile(file)
    if (file.type.startsWith('image/')) {
      setAttachmentPreview(URL.createObjectURL(file))
    } else {
      setAttachmentPreview(null)
    }
  }

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      let attachmentUrl = null

      // Upload attachment if provided
      if (attachmentFile) {
        try {
          attachmentUrl = await uploadInquiryAttachment(attachmentFile, user.id)
        } catch {
          showError('Attachment upload failed. Submitting without attachment.')
        }
      }

      await inquiryService.createInquiry({
        sender_name: user.full_name,
        sender_email: user.email,
        subject: data.subject,
        message: attachmentUrl
          ? `${data.message}\n\n[Attachment: ${attachmentUrl}]`
          : data.message,
        customer_id: user.id,
      })
      showSuccess('Inquiry submitted successfully!')
      setModalOpen(false)
      setAttachmentFile(null)
      setAttachmentPreview(null)
      reset()
      fetchInquiries()
    } catch {
      showError('Failed to submit inquiry')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">My Inquiries</h1>
          <p className="text-[var(--text-secondary)] font-body text-sm mt-1">Track your questions and admin replies</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
          <Plus size={16} />
          New Inquiry
        </Button>
      </motion.div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card p-5 h-24">
              <div className="skeleton h-4 w-1/2 rounded mb-2" />
              <div className="skeleton h-3 w-1/3 rounded" />
            </div>
          ))}
        </div>
      ) : inquiries.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <MessageSquare size={48} className="text-[var(--text-muted)] mx-auto mb-4" />
          <h3 className="font-display font-bold text-xl text-[var(--text-primary)] mb-2">No inquiries yet</h3>
          <p className="text-[var(--text-secondary)] font-body text-sm mb-6">Have a question? We're here to help.</p>
          <Button onClick={() => setModalOpen(true)}>Submit Inquiry</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {inquiries.map((inquiry) => (
            <motion.div
              key={inquiry.id}
              className="glass-card overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button
                onClick={() => setExpandedId(expandedId === inquiry.id ? null : inquiry.id)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="min-w-0">
                    <p className="font-display font-semibold text-[var(--text-primary)] truncate">{inquiry.subject}</p>
                    <p className="text-xs text-[var(--text-muted)] font-body mt-0.5">{formatRelativeTime(inquiry.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <Badge status={inquiry.status} />
                  <motion.div animate={{ rotate: expandedId === inquiry.id ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={16} className="text-[var(--text-muted)]" />
                  </motion.div>
                </div>
              </button>

              <AnimatePresence>
                {expandedId === inquiry.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-5 pb-5 border-t border-[var(--border-subtle)] pt-4 flex flex-col gap-4">
                      <div>
                        <p className="text-xs text-[var(--text-muted)] font-body uppercase tracking-wider mb-1">Your Message</p>
                        <p className="text-sm text-[var(--text-secondary)] font-body leading-relaxed">{inquiry.message}</p>
                      </div>
                      {inquiry.admin_reply && (
                        <div className="bg-[var(--accent-primary)]/5 border border-[var(--border-active)] rounded-xl p-4">
                          <p className="text-xs text-[var(--accent-primary)] font-body uppercase tracking-wider mb-1">Admin Reply</p>
                          <p className="text-sm text-[var(--text-primary)] font-body leading-relaxed">{inquiry.admin_reply}</p>
                          {inquiry.replied_at && (
                            <p className="text-xs text-[var(--text-muted)] font-body mt-2">{formatDate(inquiry.replied_at)}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* New Inquiry Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Submit New Inquiry">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
          <Input label="Subject" placeholder="What is your question about?" error={errors.subject?.message} required {...register('subject')} />
          <Textarea label="Message" placeholder="Describe your question in detail..." error={errors.message?.message} required {...register('message')} />

          {/* Attachment Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--text-secondary)] font-body">
              Attachment <span className="text-[var(--text-muted)]">(optional)</span>
            </label>

            {attachmentPreview && (
              <div className="relative w-full h-40 rounded-xl overflow-hidden border border-[var(--border-subtle)]">
                <img src={attachmentPreview} alt="Attachment preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setAttachmentFile(null); setAttachmentPreview(null) }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {attachmentFile && !attachmentPreview && (
              <div className="flex items-center gap-3 p-3 rounded-xl glass-card">
                <Paperclip size={16} className="text-[var(--accent-primary)]" />
                <span className="text-sm text-[var(--text-secondary)] font-body flex-1 truncate">{attachmentFile.name}</span>
                <button
                  type="button"
                  onClick={() => setAttachmentFile(null)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {!attachmentFile && (
              <label className="flex items-center gap-2 px-4 py-3 rounded-xl glass-card cursor-pointer hover:border-[var(--accent-primary)] transition-all text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] font-body">
                <Upload size={16} />
                Upload image or file
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={handleAttachmentChange}
                />
              </label>
            )}
            <p className="text-xs text-[var(--text-muted)] font-body">Images or PDF. Max 10MB.</p>
          </div>

          <div className="flex gap-3">
            <Button variant="ghost" type="button" onClick={() => { setModalOpen(false); setAttachmentFile(null); setAttachmentPreview(null) }} className="flex-1">Cancel</Button>
            <Button type="submit" loading={submitting} className="flex-1">Submit</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
