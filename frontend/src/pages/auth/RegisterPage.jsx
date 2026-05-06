import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { registerSchema } from '../../utils/validators'
import authService from '../../services/authService'
import useNotificationStore from '../../store/notificationStore'
import { ROUTES } from '../../utils/constants'

function PasswordStrength({ password }) {
  if (!password) return null
  const checks = [
    { label: '8+ characters', pass: password.length >= 8 },
    { label: 'Contains letter', pass: /[a-zA-Z]/.test(password) },
    { label: 'Contains number', pass: /[0-9]/.test(password) },
  ]
  const score = checks.filter((c) => c.pass).length
  const colors = ['bg-red-500', 'bg-yellow-500', 'bg-green-500']

  return (
    <div className="flex flex-col gap-2 mt-2">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < score ? colors[score - 1] : 'bg-[var(--border-subtle)]'
            }`}
          />
        ))}
      </div>
      <div className="flex gap-3 flex-wrap">
        {checks.map((c) => (
          <span
            key={c.label}
            className={`text-xs font-body ${c.pass ? 'text-green-400' : 'text-[var(--text-muted)]'}`}
          >
            {c.pass ? '✓' : '○'} {c.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [termsError, setTermsError] = useState('')
  const { error: showError } = useNotificationStore()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })

  const watchedPassword = watch('password', '')

  const onSubmit = async (data) => {
    // Validate terms manually
    if (!termsAccepted) {
      setTermsError('You must accept the terms and conditions')
      return
    }
    setTermsError('')
    setLoading(true)

    try {
      await authService.register({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone || null,
        password: data.password,
      })
      setSuccess(true)
    } catch (err) {
      const msg = err.response?.data?.detail || 'Registration failed. Please try again.'
      showError(msg)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-10 max-w-md w-full text-center shadow-[0_0_60px_var(--accent-glow)]"
        >
          <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-bold font-display text-[var(--text-primary)] mb-3">
            Check Your Email!
          </h2>
          <p className="text-[var(--text-secondary)] font-body text-sm leading-relaxed mb-6">
            We've sent a verification link to your email address. Please verify your account to
            continue.
          </p>
          <Link to={ROUTES.LOGIN} className="btn-primary w-full text-center block">
            Go to Login
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-primary)]/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <div className="glass-card p-8 shadow-[0_0_60px_var(--accent-glow)]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center mx-auto mb-4 shadow-[0_0_24px_var(--accent-glow)]">
              <span className="text-white font-display font-bold text-xl">CC</span>
            </div>
            <h1 className="text-3xl font-bold font-display text-[var(--text-primary)]">
              Create Account
            </h1>
            <p className="text-[var(--text-secondary)] font-body text-sm mt-1">
              Join Cabin Crew Motorsport
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
            <Input
              label="Full Name"
              placeholder="Ahmad bin Abdullah"
              error={errors.full_name?.message}
              required
              {...register('full_name')}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              required
              {...register('email')}
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="012-3456789"
              hint="Malaysian format: 01X-XXXXXXX (optional)"
              error={errors.phone?.message}
              {...register('phone')}
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Min. 8 characters with letter & number"
                error={errors.password?.message}
                required
                {...register('password')}
              />
              <PasswordStrength password={watchedPassword} />
            </div>

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
              error={errors.confirm_password?.message}
              required
              {...register('confirm_password')}
            />

            {/* Terms — handled with local state, not Zod */}
            <div className="flex flex-col gap-1">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked)
                    if (e.target.checked) setTermsError('')
                  }}
                  className="w-4 h-4 mt-0.5 rounded accent-[var(--accent-primary)] flex-shrink-0"
                />
                <span className="text-sm text-[var(--text-secondary)] font-body leading-relaxed">
                  I agree to the{' '}
                  <a href="#" className="text-[var(--accent-primary)] hover:underline">
                    Terms & Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-[var(--accent-primary)] hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
              {termsError && (
                <p className="text-xs text-[var(--danger)] font-body ml-7" role="alert">
                  {termsError}
                </p>
              )}
            </div>

            <Button type="submit" loading={loading} fullWidth size="lg">
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--text-secondary)] font-body">
              Already have an account?{' '}
              <Link
                to={ROUTES.LOGIN}
                className="text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
