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
  refreshToken: null,
  isLoading: true,
  isAuthenticated: false,

  // Synchronous login — sets state immediately, no async fetch
  // The user object from the login API response already has the role
  login: (user, token, refreshToken = null) => {
    const normalized = normalizeUser(user)
    localStorage.setItem('ccm_token', token)
    if (refreshToken) {
      localStorage.setItem('ccm_refresh_token', refreshToken)
    }
    set({ user: normalized, token, refreshToken, isAuthenticated: true, isLoading: false })
    return normalized
  },

  logout: () => {
    localStorage.removeItem('ccm_token')
    localStorage.removeItem('ccm_refresh_token')
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false, isLoading: false })
  },

  setUser: (user) => set({ user: normalizeUser(user) }),

  setLoading: (isLoading) => set({ isLoading }),

  // Update tokens after a successful refresh
  setTokens: (token, refreshToken) => {
    localStorage.setItem('ccm_token', token)
    if (refreshToken) {
      localStorage.setItem('ccm_refresh_token', refreshToken)
    }
    set({ token, refreshToken })
  },

  initialize: async () => {
    const token = localStorage.getItem('ccm_token')
    const refreshToken = localStorage.getItem('ccm_refresh_token')
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
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (err) {
      // Token might be expired — try refreshing it
      if (err.response?.status === 401 && refreshToken) {
        try {
          const refreshResp = await axios.post(`${API_BASE}/auth/refresh`, {
            refresh_token: refreshToken,
          })
          const newToken = refreshResp.data.access_token
          const newRefreshToken = refreshResp.data.refresh_token || refreshToken

          localStorage.setItem('ccm_token', newToken)
          localStorage.setItem('ccm_refresh_token', newRefreshToken)

          // Retry /auth/me with the new token
          const retryResp = await axios.get(`${API_BASE}/auth/me`, {
            headers: { Authorization: `Bearer ${newToken}` },
          })
          set({
            user: normalizeUser(retryResp.data),
            token: newToken,
            refreshToken: newRefreshToken,
            isAuthenticated: true,
            isLoading: false,
          })
          return
        } catch {
          // Refresh also failed — clear everything
        }
      }
      // Token invalid/expired and refresh failed — clear it silently
      localStorage.removeItem('ccm_token')
      localStorage.removeItem('ccm_refresh_token')
      set({ user: null, token: null, refreshToken: null, isAuthenticated: false, isLoading: false })
    }
  },
}))

export default useAuthStore
