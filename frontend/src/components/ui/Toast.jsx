import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import useNotificationStore from '../../store/notificationStore'

const toastConfig = {
  success: {
    icon: CheckCircle,
    bg: 'bg-green-500/15 border-green-500/30',
    text: 'text-green-400',
    iconColor: 'text-green-400',
  },
  error: {
    icon: XCircle,
    bg: 'bg-red-500/15 border-red-500/30',
    text: 'text-red-300',
    iconColor: 'text-red-400',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-yellow-500/15 border-yellow-500/30',
    text: 'text-yellow-300',
    iconColor: 'text-yellow-400',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-500/15 border-blue-500/30',
    text: 'text-blue-300',
    iconColor: 'text-blue-400',
  },
}

function ToastItem({ toast }) {
  const { removeToast } = useNotificationStore()
  const config = toastConfig[toast.type] || toastConfig.info
  const Icon = config.icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`
        flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl
        shadow-2xl min-w-[280px] max-w-[380px]
        ${config.bg}
      `}
      role="alert"
      aria-live="polite"
    >
      <Icon size={20} className={`flex-shrink-0 mt-0.5 ${config.iconColor}`} />
      <p className={`flex-1 text-sm font-body ${config.text}`}>{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="flex-shrink-0 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
        aria-label="Dismiss notification"
      >
        <X size={16} />
      </button>
    </motion.div>
  )
}

export default function ToastContainer() {
  const { toasts } = useNotificationStore()

  return (
    <div
      className="fixed z-[100] flex flex-col gap-3
        bottom-6 right-6
        sm:bottom-6 sm:right-6
        max-sm:top-4 max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:right-auto max-sm:bottom-auto"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  )
}
