/**
 * Format a date string to a readable format
 * @param {string|Date} date
 * @returns {string} e.g. "12 Jan 2025"
 */
export const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-MY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Format a time string to 12-hour format
 * @param {string} time - "HH:MM" or "HH:MM:SS"
 * @returns {string} e.g. "9:00 AM"
 */
export const formatTime = (time) => {
  if (!time) return '—'
  const [hours, minutes] = time.split(':')
  const h = parseInt(hours)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

/**
 * Format a price in Malaysian Ringgit
 * @param {number} amount
 * @returns {string} e.g. "RM 150.00"
 */
export const formatPrice = (amount) => {
  if (amount === null || amount === undefined) return '—'
  return `RM ${parseFloat(amount).toFixed(2)}`
}

/**
 * Format a price range
 * @param {number} min
 * @param {number} max
 * @returns {string} e.g. "RM 30 – RM 60"
 */
export const formatPriceRange = (min, max) => {
  if (!min && !max) return 'Price on request'
  if (!max || min === max) return `RM ${parseFloat(min).toFixed(0)}`
  return `RM ${parseFloat(min).toFixed(0)} – RM ${parseFloat(max).toFixed(0)}`
}

/**
 * Format a Malaysian phone number
 * @param {string} phone
 * @returns {string} e.g. "012-3456789"
 */
export const formatPhone = (phone) => {
  if (!phone) return '—'
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
  }
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`
  }
  return phone
}

/**
 * Format duration in minutes to human-readable
 * @param {number} minutes
 * @returns {string} e.g. "1h 30min"
 */
export const formatDuration = (minutes) => {
  if (!minutes) return '—'
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

/**
 * Format a datetime string to relative time
 * @param {string} dateString
 * @returns {string} e.g. "2 hours ago"
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return '—'
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(dateString)
}

/**
 * Truncate text to a max length
 */
export const truncate = (text, maxLength = 100) => {
  if (!text) return ''
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
}
