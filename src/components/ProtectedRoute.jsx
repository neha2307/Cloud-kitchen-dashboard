import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children, accessKey }) {
  const { user, can } = useAuth()
  const location = useLocation()

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (accessKey && !can(accessKey)) {
    // Send them to the first page they can access
    return <Navigate to="/app/orders" replace />
  }
  return children
}
