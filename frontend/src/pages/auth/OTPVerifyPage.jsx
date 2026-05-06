import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, RefreshCw } from 'lucide-react'
import Button from '../../components/ui/Button'
import authService from '../../services/authService'
import useAuthStore from '../../store/authStore'
import useNotificationStore from '../../store/notificationStore'
import { ROUTES } from '../../utils/constants'

export default function OTPVerifyPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(600) // 10 minutes
  const inputRefs = useRef([])
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email
  const { login } = useAuthStore()
  const { error: showError, success: showSuccess } = useNotificationStore()

  useEffect(() => {
    if (!email) navigate(ROUTES.LOGIN)
  }, [email, navigate])

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatCountdown = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setOtp(pasted.split(''))
      inputRefs.current[5]?.focus()
    }
  }

  const handleVerify = async () => {
    const token = otp.join('')
    if (token.length !== 6) {
      showError('Please enter the complete 6-digit OTP')
      return
    }

    setLoading(true)
    try {
      const res = await authService.verifyOtp(email, token)
      const { access_token, user } = res.data
      const loggedInUser = await login(user, access_token)
      const redirect = loggedInUser?.role === 'admin' ? ROUTES.ADMIN : ROUTES.DASHBOARD
      navigate(redirect, { replace: true })
    } catch (err) {
      showError(err.response?.data?.detail || 'Invalid or expired OTP')
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    try {
      await authService.login(email, '')
      setCountdown(600)
      showSuccess('New OTP sent to your email')
    } catch {
      showError('Failed to resend OTP')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--accent-primary)]/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 max-w-md w-full text-center shadow-[0_0_60px_var(--accent-glow)]"
      >
        <div className="w-16 h-16 rounded-2xl bg-[var(--accent-primary)]/10 border border-[var(--border-active)] flex items-center justify-center mx-auto mb-6">
          <Shield size={28} className="text-[var(--accent-primary)]" />
        </div>

        <h1 className="text-2xl font-bold font-display text-[var(--text-primary)] mb-2">Verify Your Identity</h1>
        <p className="text-sm text-[var(--text-secondary)] font-body mb-2">
          Enter the 6-digit code sent to
        </p>
        <p className="text-sm font-semibold text-[var(--accent-primary)] font-body mb-6">{email}</p>

        {/* OTP Input */}
        <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`
                w-12 h-14 text-center text-xl font-bold font-display
                bg-[var(--bg-glass)] border rounded-xl
                text-[var(--text-primary)] outline-none transition-all
                ${digit ? 'border-[var(--accent-primary)] shadow-[0_0_12px_var(--accent-glow)]' : 'border-[var(--border-subtle)]'}
                focus:border-[var(--accent-primary)] focus:shadow-[0_0_12px_var(--accent-glow)]
              `}
              aria-label={`OTP digit ${index + 1}`}
            />
          ))}
        </div>

        {/* Countdown */}
        <p className="text-sm text-[var(--text-muted)] font-body mb-6">
          {countdown > 0 ? (
            <>Code expires in <span className="text-[var(--accent-primary)] font-semibold">{formatCountdown(countdown)}</span></>
          ) : (
            <span className="text-[var(--danger)]">Code expired. Please request a new one.</span>
          )}
        </p>

        <Button onClick={handleVerify} loading={loading} fullWidth size="lg" className="mb-4">
          Verify OTP
        </Button>

        <button
          onClick={handleResend}
          disabled={resending || countdown > 540}
          className="flex items-center gap-2 mx-auto text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors font-body disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
          Resend OTP
        </button>
      </motion.div>
    </div>
  )
}
