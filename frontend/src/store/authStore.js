import { create } from 'zustand'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const normalizeUser = (user) => {
  if (!user) return null
  return { role: user.role || 'customer', ...user }
}

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  // Synchronous login — sets state immediately, no async fetch
  // The user object from the login API response already has the role
  login: (user, token) => {
    const normalized = normalizeUser(user)
    localStorage.setItem('ccm_token', token)
    set({ user: normalized, token, isAuthenticated: true, isLoading: false })
    return normalized
  },

  logout: () => {
    localStorage.removeItem('ccm_token')
    set({ user: null, token: null, isAuthenticated: false, isLoading: false })
  },

  setUser: (user) => set({ user: normalizeUser(user) }),

  setLoading: (isLoading) => set({ isLoading }),

  initialize: async () => {
    const token = localStorage.getItem('ccm_token')
    if (!token) {
      set({ isLoading: false, isAuthenticated: false })
      return
    }

    try {
      const response = await axios.get(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      set({
        user: normalizeUser(response.data),
        token,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch {
      // Token invalid or expired — clear it silently
      localStorage.removeItem('ccm_token')
      set({ user: null, token: null, isAuthenticated: false, isLoading: false })
    }
  },
}))

export default useAuthStore
