import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, CalendarCheck, Clock, MessageSquare, DollarSign } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts'
import StatCard from '../../components/shared/StatCard'
import Badge from '../../components/ui/Badge'
import api from '../../services/api'
import { formatDate, formatRelativeTime } from '../../utils/formatters'

const COLORS = ['#FF6B00', '#3B82F6', '#22C55E', '#F59E0B', '#EF4444']

const containerVariants = {
  animate: { transition: { staggerChildren: 0.08 } },
}
const itemVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 text-xs font-body">
        <p className="text-[var(--text-secondary)] mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    )
  }
  return null
}

const WEEK_COUNT = 8
const REG_MONTHS = 6

const formatShortDate = (date) =>
  date.toLocaleDateString('en-MY', { month: 'short', day: 'numeric' })

const formatCategoryLabel = (category) =>
  category.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

const toDate = (value) => {
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

const buildWeeklyData = (bookings, weeksCount = WEEK_COUNT) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const start = new Date(today)
  start.setDate(start.getDate() - (weeksCount * 7 - 1))

  const buckets = Array.from({ length: weeksCount }, (_, i) => {
    const bucketStart = new Date(start)
    bucketStart.setDate(start.getDate() + i * 7)
    const bucketEnd = new Date(bucketStart)
    bucketEnd.setDate(bucketStart.getDate() + 6)
    return {
      start: bucketStart,
      end: bucketEnd,
      label: formatShortDate(bucketStart),
      bookings: 0,
    }
  })

  bookings.forEach((booking) => {
    const bookingDate = toDate(booking.booking_date || booking.created_at)
    if (!bookingDate) return
    bookingDate.setHours(0, 0, 0, 0)
    for (const bucket of buckets) {
      if (bookingDate >= bucket.start && bookingDate <= bucket.end) {
        bucket.bookings += 1
        break
      }
    }
  })

  return buckets.map((bucket) => ({ week: bucket.label, bookings: bucket.bookings }))
}

const buildCategoryData = (bookings) => {
  const counts = {}
  bookings.forEach((booking) => {
    const items = booking.booking_services || []
    items.forEach((item) => {
      const category = item?.services?.category
      if (!category) return
      const qty = Number(item.quantity) || 1
      counts[category] = (counts[category] || 0) + qty
    })
  })

  return Object.entries(counts).map(([category, value]) => ({
    name: formatCategoryLabel(category),
    value,
  }))
}

const buildRegistrationData = (customers, monthsCount = REG_MONTHS) => {
  const base = new Date()
  base.setDate(1)
  base.setHours(0, 0, 0, 0)

  const start = new Date(base)
  start.setMonth(start.getMonth() - (monthsCount - 1))

  const buckets = Array.from({ length: monthsCount }, (_, i) => {
    const monthStart = new Date(start)
    monthStart.setMonth(start.getMonth() + i)
    return {
      year: monthStart.getFullYear(),
      month: monthStart.getMonth(),
      label: monthStart.toLocaleString('default', { month: 'short' }),
      customers: 0,
    }
  })

  customers.forEach((customer) => {
    const createdAt = toDate(customer.created_at)
    if (!createdAt) return
    const bucket = buckets.find(
      (b) => b.year === createdAt.getFullYear() && b.month === createdAt.getMonth()
    )
    if (bucket) bucket.customers += 1
  })

  return buckets.map((bucket) => ({ month: bucket.label, customers: bucket.customers }))
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentBookings, setRecentBookings] = useState([])
  const [recentInquiries, setRecentInquiries] = useState([])
  const [weeklyData, setWeeklyData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [registrationData, setRegistrationData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const dateFrom = new Date()
    dateFrom.setDate(dateFrom.getDate() - (WEEK_COUNT * 7 - 1))
    const dateFromStr = dateFrom.toISOString().split('T')[0]

    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/bookings', { params: { limit: 5 } }),
      api.get('/admin/inquiries', { params: { limit: 5 } }),
      api.get('/admin/bookings', { params: { limit: 1000, date_from: dateFromStr } }),
      api.get('/admin/customers', { params: { limit: 1000 } }),
    ]).then(([statsRes, bookingsRes, inquiriesRes, chartBookingsRes, customersRes]) => {
      const chartBookings = chartBookingsRes.data.data || []
      const customers = customersRes.data.data || []

      setStats(statsRes.data)
      setRecentBookings(bookingsRes.data.data || [])
      setRecentInquiries(inquiriesRes.data.data || [])
      setWeeklyData(buildWeeklyData(chartBookings))
      setCategoryData(buildCategoryData(chartBookings))
      setRegistrationData(buildRegistrationData(customers))
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Admin Dashboard</h1>
        <p className="text-[var(--text-secondary)] font-body text-sm mt-1">Overview of workshop operations</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
      >
        {[
          { icon: Users, label: 'Total Customers', value: stats?.total_customers, color: 'blue' },
          { icon: CalendarCheck, label: 'Bookings Today', value: stats?.bookings_today, color: 'red' },
          { icon: Clock, label: 'Pending Bookings', value: stats?.pending_bookings, color: 'yellow' },
          { icon: MessageSquare, label: 'Open Inquiries', value: stats?.open_inquiries, color: 'purple' },
          { icon: DollarSign, label: 'Revenue (Month)', value: stats ? `RM ${stats.revenue_this_month}` : null, color: 'green' },
        ].map((s, i) => (
          <motion.div key={i} variants={itemVariants}>
            <StatCard {...s} loading={loading} />
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Bar Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="font-display font-semibold text-lg text-[var(--text-primary)] mb-4">Bookings Per Week</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="week" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="bookings" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="glass-card p-6">
          <h3 className="font-display font-semibold text-lg text-[var(--text-primary)] mb-4">Service Categories</h3>
          {categoryData.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)] font-body">No booking data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Line Chart */}
      <div className="glass-card p-6 mb-8">
        <h3 className="font-display font-semibold text-lg text-[var(--text-primary)] mb-4">New Customer Registrations</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={registrationData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="customers" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="font-display font-semibold text-lg text-[var(--text-primary)] mb-4">Recent Bookings</h3>
          {loading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-10 rounded-xl" />)}
            </div>
          ) : recentBookings.length === 0 ? (
            <p className="text-[var(--text-muted)] font-body text-sm">No bookings yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentBookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)] last:border-0">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)] font-body">{b.profiles?.full_name || 'Customer'}</p>
                    <p className="text-xs text-[var(--text-muted)] font-body">{formatDate(b.booking_date)}</p>
                  </div>
                  <Badge status={b.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card p-6">
          <h3 className="font-display font-semibold text-lg text-[var(--text-primary)] mb-4">Recent Inquiries</h3>
          {loading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-10 rounded-xl" />)}
            </div>
          ) : recentInquiries.length === 0 ? (
            <p className="text-[var(--text-muted)] font-body text-sm">No inquiries yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentInquiries.map((inq) => (
                <div key={inq.id} className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)] last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] font-body truncate">{inq.subject}</p>
                    <p className="text-xs text-[var(--text-muted)] font-body">{inq.sender_name} · {formatRelativeTime(inq.created_at)}</p>
                  </div>
                  <Badge status={inq.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
