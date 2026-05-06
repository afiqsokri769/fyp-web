import api from './api'

const bookingService = {
  getBookings: () => api.get('/bookings'),

  createBooking: (data) => api.post('/bookings', data),

  getBooking: (id) => api.get(`/bookings/${id}`),

  updateBooking: (id, data) => api.put(`/bookings/${id}`, data),

  cancelBooking: (id) => api.put(`/bookings/${id}`, { status: 'cancelled' }),

  getAvailableSlots: (date) =>
    api.get('/bookings/available-slots', { params: { booking_date: date } }),
}

export default bookingService
