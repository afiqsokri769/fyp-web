import api from './api'

const inquiryService = {
  getInquiries: () => api.get('/inquiries'),

  createInquiry: (data) => api.post('/inquiries', data),

  getInquiry: (id) => api.get(`/inquiries/${id}`),

  // Admin
  getAllInquiries: (params) => api.get('/admin/inquiries', { params }),

  replyToInquiry: (id, reply) =>
    api.put(`/admin/inquiries/${id}/reply`, { admin_reply: reply, status: 'replied' }),

  updateInquiryStatus: (id, status) =>
    api.put(`/admin/inquiries/${id}/status`, { status }),
}

export default inquiryService
