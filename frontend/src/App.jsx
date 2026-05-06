import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

// Layouts
import PublicLayout from './components/layout/PublicLayout'
import CustomerLayout from './components/layout/CustomerLayout'
import AdminLayout from './components/layout/AdminLayout'

// Shared
import ProtectedRoute from './components/shared/ProtectedRoute'
import ToastContainer from './components/ui/Toast'

// Auth
import useAuthStore from './store/authStore'

// Public Pages
import HomePage from './pages/public/HomePage'
import AboutPage from './pages/public/AboutPage'
import ServicesPage from './pages/public/ServicesPage'
import ContactPage from './pages/public/ContactPage'
import FAQPage from './pages/public/FAQPage'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import OTPVerifyPage from './pages/auth/OTPVerifyPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'

// Customer Pages
import DashboardPage from './pages/customer/DashboardPage'
import ProfilePage from './pages/customer/ProfilePage'
import BookServicePage from './pages/customer/BookServicePage'
import MyBookingsPage from './pages/customer/MyBookingsPage'
import InquiriesPage from './pages/customer/InquiriesPage'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageCustomers from './pages/admin/ManageCustomers'
import ManageServices from './pages/admin/ManageServices'
import ManageBookings from './pages/admin/ManageBookings'
import ViewInquiries from './pages/admin/ViewInquiries'

export default function App() {
  const { initialize } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [])

  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/otp-verify" element={<OTPVerifyPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Customer Routes */}
        <Route
          element={
            <ProtectedRoute requiredRole="customer">
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/profile" element={<ProfilePage />} />
          <Route path="/dashboard/book" element={<BookServicePage />} />
          <Route path="/dashboard/bookings" element={<MyBookingsPage />} />
          <Route path="/dashboard/inquiries" element={<InquiriesPage />} />
        </Route>

        {/* Admin Routes */}
        <Route
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/customers" element={<ManageCustomers />} />
          <Route path="/admin/services" element={<ManageServices />} />
          <Route path="/admin/bookings" element={<ManageBookings />} />
          <Route path="/admin/inquiries" element={<ViewInquiries />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
