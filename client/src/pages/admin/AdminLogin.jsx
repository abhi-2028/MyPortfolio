import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import api, { getCsrfToken } from '../../services/api'
import '../../styles/admin.css'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [authenticated, setAuthenticated] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    let active = true
    api
      .get('/api/auth/me')
      .then(() => active && setAuthenticated(true))
      .catch(() => active && setAuthenticated(false))
    return () => {
      active = false
    }
  }, [])

  const submit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await getCsrfToken()
      await api.post('/api/auth/login', { email, password })
      navigate(location.state?.from || '/admin', { replace: true })
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to log in.')
    } finally {
      setSubmitting(false)
    }
  }

  if (authenticated === true) return <Navigate to={location.state?.from || '/admin'} replace />

  return (
    <main className="admin-login-page">
      <section className="admin-login-card" aria-labelledby="admin-login-title">
        <div className="admin-login-brand">
          <span className="brand-mark">A</span>
          <span>Portfolio Admin</span>
        </div>
        <div>
          <p className="admin-eyebrow">Secure access</p>
          <h1 id="admin-login-title">Welcome back</h1>
          <p className="admin-login-subtitle">Sign in to manage your portfolio content.</p>
        </div>
        {error ? <div className="admin-alert admin-alert-error" role="alert">{error}</div> : null}
        <form className="admin-login-form" onSubmit={submit}>
          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              minLength="12"
              required
            />
          </label>
          <button className="admin-primary-button" type="submit" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default AdminLogin
