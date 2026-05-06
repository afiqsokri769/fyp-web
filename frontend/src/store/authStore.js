import { create } from 'zustand'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const normalizeUser = (user) => {
  if (!user) return null
  return { role: user.role || 'customer', ...user }
}

const fetchMe = (token) =>
  axios.get(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })

const useAuthStore = create((set, get) => ({
  user: null,           // { id, email, full_name, role, avatar_url, mfa_enabled }
  token: null,          // JWT access token
  isLoading: true,      // True while checking initial auth state
  isAuthenticated: false,

  login: async (user, token) => {
    localStorage.setItem('ccm_token', token)
    set({ token, isAuthenticated: true, isLoading: true })

    const fallbackUser = normalizeUser(user)
    try {
      const response = await fetchMe(token)
      const normalized = normalizeUser(response.data)
      set({ user: normalized, token, isAuthenticated: true, isLoading: false })
      return normalized
    } catch {
      set({ user: fallbackUser, token, isAuthenticated: true, isLoading: false })
      return fallbackUser
    }
  },

  logout: () => {
    localStorage.removeItem('ccm_token')
    localStorage.removeItem('ccm_refresh_token')
    set({ user: null, token: null, isAuthenticated: false, isLoading: false })
  },

  setUser: (user) => set({ user }),

  setLoading: (isLoading) => set({ isLoading }),

  initialize: async () => {
    const token = localStorage.getItem('ccm_token')
    if (!token) {
      set({ isLoading: false, isAuthenticated: false })
      return
    }

    try {
      const response = await fetchMe(token)
      set({
        user: normalizeUser(response.data),
        token,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch {
      localStorage.removeItem('ccm_token')
      set({ user: null, token: null, isAuthenticated: false, isLoading: false })
    }
  },
}))

export default useAuthStore
