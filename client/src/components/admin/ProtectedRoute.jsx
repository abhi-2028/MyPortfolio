import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import api from '../../services/api'

function ProtectedRoute({ children }) {
  const [status, setStatus] = useState('loading')
  const location = useLocation()

  useEffect(() => {
    let active = true

    api
      .get('/api/auth/me')
      .then(() => active && setStatus('authenticated'))
      .catch((error) => {
        if (!active) return
        if (error.response?.status === 401) {
          setStatus('unauthenticated')
          return
        }
        setStatus('error')
      })

    return () => {
      active = false
    }
  }, [])

  if (status === 'loading') {
    return <div className="admin-loading">Checking administrator session...</div>
  }
  if (status === 'unauthenticated') {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }
  if (status === 'error') {
    return <div className="admin-loading">Unable to verify your session. Please try again.</div>
  }
  return children
}

export default ProtectedRoute
