import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import api, { getCsrfToken } from '../../services/api'
import '../../styles/admin.css'

const navigation = [
  ['Overview', '/admin', 'grid'],
  ['Projects', '/admin/projects', 'folder'],
  ['Experience', '/admin/experience', 'briefcase'],
  ['Certificates', '/admin/certificates', 'award'],
  ['Skills', '/admin/skills', 'tool'],
  ['Education', '/admin/education', 'book'],
  ['Profile', '/admin/profile', 'user'],
]

function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const navigate = useNavigate()

  const logout = async () => {
    setLoggingOut(true)
    try {
      await getCsrfToken()
      await api.post('/api/auth/logout')
    } catch {
      // Clear the client route even if the server cookie has already expired.
    } finally {
      navigate('/admin/login', { replace: true })
      setLoggingOut(false)
    }
  }

  return (
    <div className="admin-shell">
      <button
        className="admin-mobile-menu"
        type="button"
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span></span><span></span><span></span>
      </button>

      {menuOpen ? <button className="admin-sidebar-backdrop" aria-label="Close navigation" onClick={() => setMenuOpen(false)} /> : null}

      <aside className={`admin-sidebar ${menuOpen ? 'is-open' : ''}`}>
        <div className="admin-sidebar-brand">
          <span className="brand-mark">A</span>
          <div>
            <strong>Portfolio</strong>
            <span>Admin console</span>
          </div>
        </div>
        <nav className="admin-nav" aria-label="Admin navigation">
          {navigation.map(([label, href, icon]) => (
            <NavLink
              key={href}
              to={href}
              end={href === '/admin'}
              onClick={() => setMenuOpen(false)}
            >
              <span className={`admin-nav-icon icon-${icon}`} aria-hidden="true"></span>
              {label}
            </NavLink>
          ))}
        </nav>
        <button className="admin-logout" type="button" onClick={logout} disabled={loggingOut}>
          <span className="admin-nav-icon icon-logout" aria-hidden="true"></span>
          {loggingOut ? 'Logging out...' : 'Log out'}
        </button>
      </aside>

      <div className="admin-workspace">
        <header className="admin-topbar">
          <div>
            <p>Personal portfolio</p>
            <strong>Content management</strong>
          </div>
          <span className="admin-status"><i></i> Live</span>
        </header>
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
