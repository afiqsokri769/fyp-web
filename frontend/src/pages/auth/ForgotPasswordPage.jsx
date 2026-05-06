import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Mail, CheckCircle } from 'lucide-react'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { forgotPasswordSchema } from '../../utils/validators'
import authService from '../../services/authService'
import useNotificationStore from '../../store/notificationStore'
import { ROUTES } from '../../utils/constants'

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { error: showError } = useNotificationStore()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await authService.forgotPassword(data.email)
      setSent(true)
    } catch {
      showError('Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-10 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-bold font-display text-[var(--text-primary)] mb-3">Email Sent!</h2>
          <p className="text-[var(--text-secondary)] font-body text-sm leading-relaxed mb-6">
            If an account exists with that email, you'll receive a password reset link shortly.
          </p>
          <Link to={ROUTES.LOGIN} className="btn-primary w-full text-center block">
            Back to Login
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[var(--accent-primary)]/10 border border-[var(--border-active)] flex items-center justify-center mx-auto mb-4">
              <Mail size={24} className="text-[var(--accent-primary)]" />
            </div>
            <h1 className="text-2xl font-bold font-display text-[var(--text-primary)]">Forgot Password?</h1>
            <p className="text-[var(--text-secondary)] font-body text-sm mt-1">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              required
              {...register('email')}
            />
            <Button type="submit" loading={loading} fullWidth>
              Send Reset Link
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to={ROUTES.LOGIN}
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors font-body"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
