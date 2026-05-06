import api from './api'

const authService = {
  register: (data) => api.post('/auth/register', data),

  login: (email, password, rememberMe = false) =>
    api.post('/auth/login', { email, password, remember_me: rememberMe }),

  verifyOtp: (email, token) =>
    api.post('/auth/verify-otp', { email, token, type: 'email' }),

  logout: () => api.post('/auth/logout'),

  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),

  resetPassword: (accessToken, newPassword) =>
    api.post('/auth/reset-password', { access_token: accessToken, new_password: newPassword }),

  getMe: () => api.get('/auth/me'),

  refreshToken: (refreshToken) =>
    api.post('/auth/refresh', { refresh_token: refreshToken }),
}

export default authService
