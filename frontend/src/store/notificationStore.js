import { create } from 'zustand'

let toastId = 0

const useNotificationStore = create((set, get) => ({
  toasts: [],

  addToast: (message, type = 'info', duration = 4000) => {
    const id = ++toastId
    const toast = { id, message, type, duration }

    set((state) => {
      // Keep max 3 toasts
      const toasts = [...state.toasts, toast].slice(-3)
      return { toasts }
    })

    // Auto-dismiss
    setTimeout(() => {
      get().removeToast(id)
    }, duration)

    return id
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  success: (message) => get().addToast(message, 'success'),
  error: (message) => get().addToast(message, 'error'),
  warning: (message) => get().addToast(message, 'warning'),
  info: (message) => get().addToast(message, 'info'),
}))

export default useNotificationStore
