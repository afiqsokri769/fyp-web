import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { FullPageSpinner } from '../ui/Spinner'
import { ROUTES } from '../../utils/constants'

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, isLoading, user } = useAuthStore()
  const location = useLocation()

  if (isLoading) {
    return <FullPageSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location.pathname }} replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate dashboard based on actual role
    const redirect = user?.role === 'admin' ? ROUTES.ADMIN : ROUTES.DASHBOARD
    return <Navigate to={redirect} replace />
  }

  return children
}
