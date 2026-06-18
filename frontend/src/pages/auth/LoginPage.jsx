import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { loginSchema } from '../../utils/validators'
import authService from '../../services/authService'
import useAuthStore from '../../store/authStore'
import useNotificationStore from '../../store/notificationStore'
import { ROUTES } from '../../utils/constants'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)
  const { login } = useAuthStore()
  const { error: showError } = useNotificationStore()
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo = location.state?.from || null

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await authService.login(data.email, data.password, data.remember_me)
      const { access_token, refresh_token, user, mfa_required, email } = res.data

      if (mfa_required) {
        navigate('/otp-verify', { state: { email } })
        return
      }

      // login() is synchronous — returns the normalized user immediately
      const loggedInUser = login(user, access_token, refresh_token)

      // Use role from the returned user object
      const role = loggedInUser?.role || user?.role || 'customer'
      const redirect = returnTo || (role === 'admin' ? ROUTES.ADMIN : ROUTES.DASHBOARD)
      navigate(redirect, { replace: true })
    } catch (err) {
      setShake(true)
      setTimeout(() => setShake(false), 600)
      const msg = err.response?.data?.detail || 'Invalid email or password'
      showError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-primary)]/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 shadow-[0_0_60px_var(--accent-glow)]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center mx-auto mb-4 shadow-[0_0_24px_var(--accent-glow)]">
              <span className="text-white font-display font-bold text-xl">CC</span>
            </div>
            <h1 className="text-3xl font-bold font-display text-[var(--text-primary)]">Welcome Back</h1>
            <p className="text-[var(--text-secondary)] font-body text-sm mt-1">Sign in to your account</p>
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

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              error={errors.password?.message}
              required
              {...register('password')}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded accent-[var(--accent-primary)]"
                  {...register('remember_me')}
                />
                <span className="text-sm text-[var(--text-secondary)] font-body">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors font-body"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" loading={loading} fullWidth size="lg">
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-[var(--border-subtle)]" />
              <span className="text-xs text-[var(--text-muted)] font-body">OR</span>
              <div className="flex-1 h-px bg-[var(--border-subtle)]" />
            </div>
            <p className="text-sm text-[var(--text-secondary)] font-body">
              Don't have an account?{' '}
              <Link
                to={ROUTES.REGISTER}
                className="text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] font-medium transition-colors"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
