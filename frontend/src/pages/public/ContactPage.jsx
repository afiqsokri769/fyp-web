import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, CheckCircle } from 'lucide-react'
import Input, { Textarea } from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { inquirySchema } from '../../utils/validators'
import inquiryService from '../../services/inquiryService'
import useNotificationStore from '../../store/notificationStore'
import { WORKSHOP_INFO } from '../../utils/constants'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { success: showSuccess, error: showError } = useNotificationStore()

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(inquirySchema),
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await inquiryService.createInquiry(data)
      showSuccess('Message sent! We will get back to you soon.')
      setSubmitted(true)
      reset()
    } catch (err) {
      showError(err.response?.data?.detail || 'Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-primary)]" />
        <div className="relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[var(--accent-primary)] font-body text-sm font-semibold tracking-widest uppercase mb-3">Get In Touch</p>
            <h1 className="font-display font-bold text-5xl sm:text-6xl text-[var(--text-primary)]">CONTACT US</h1>
          </motion.div>
        </div>
      </section>

      <section className="px-4 max-w-6xl mx-auto pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="glass-card p-8">
              <h2 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-6">Send a Message</h2>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-green-400" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-[var(--text-primary)] mb-2">Message Sent!</h3>
                  <p className="text-[var(--text-secondary)] font-body text-sm mb-6">We'll get back to you as soon as possible.</p>
                  <Button variant="ghost" onClick={() => setSubmitted(false)}>Send Another</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
                  <Input label="Your Name" placeholder="Ahmad bin Abdullah" error={errors.sender_name?.message} required {...register('sender_name')} />
                  <Input label="Email Address" type="email" placeholder="you@example.com" error={errors.sender_email?.message} required {...register('sender_email')} />
                  <Input label="Phone Number" type="tel" placeholder="012-3456789" error={errors.sender_phone?.message} {...register('sender_phone')} />
                  <Input label="Subject" placeholder="What is this about?" error={errors.subject?.message} required {...register('subject')} />
                  <Textarea label="Message" placeholder="Tell us how we can help..." error={errors.message?.message} required {...register('message')} />
                  <Button type="submit" loading={loading} fullWidth>Send Message</Button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Workshop Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <div className="glass-card p-6">
              <h2 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-6">Workshop Details</h2>
              <div className="flex flex-col gap-5">
                {[
                  { icon: MapPin, label: 'Address', value: WORKSHOP_INFO.address },
                  { icon: Phone, label: 'Phone', value: WORKSHOP_INFO.phone },
                  { icon: Mail, label: 'Email', value: WORKSHOP_INFO.email },
                  { icon: Clock, label: 'Hours', value: `${WORKSHOP_INFO.hours}\n${WORKSHOP_INFO.closed}` },
                ].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--border-active)] flex items-center justify-center flex-shrink-0">
                        <Icon size={18} className="text-[var(--accent-primary)]" />
                      </div>
                      <div>
                        <p className="text-xs text-[var(--text-muted)] font-body uppercase tracking-wider mb-0.5">{item.label}</p>
                        <p className="text-sm text-[var(--text-primary)] font-body whitespace-pre-line">{item.value}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Map */}
            <div className="glass-card overflow-hidden p-0 h-56">
              <iframe
                title="Workshop Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.7!2d101.6!3d3.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwMDYnMDAuMCJOIDEwMcKwMzYnMDAuMCJF!5e0!3m2!1sen!2smy!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
