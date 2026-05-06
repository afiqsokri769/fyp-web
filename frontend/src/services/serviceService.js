import api from './api'

const serviceService = {
  getServices: (category = null, includeInactive = false) =>
    api.get('/services', { params: { category, include_inactive: includeInactive } }),

  getService: (id) => api.get(`/services/${id}`),

  createService: (data) => api.post('/services', data),

  updateService: (id, data) => api.put(`/services/${id}`, data),

  deleteService: (id) => api.delete(`/services/${id}`),

  reorderServices: (serviceIds) => api.post('/services/reorder', { service_ids: serviceIds }),
}

export default serviceService
