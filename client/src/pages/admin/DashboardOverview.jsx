import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

function DashboardOverview() {
  const navigate = useNavigate()
  const [stats, setStats] = useState([
    { label: 'Projects', value: 0, change: 'Loading...', tone: 'blue' },
    { label: 'Experience', value: 0, change: 'Loading...', tone: 'amber' },
    { label: 'Certificates', value: 0, change: 'Loading...', tone: 'violet' },
    { label: 'Skills', value: 0, change: 'Loading...', tone: 'green' },
  ])
  const [recent, setRecent] = useState([])

  useEffect(() => {
    let active = true
    Promise.all([
      api.get('/api/projects'),
      api.get('/api/experience'),
      api.get('/api/certificates'),
      api.get('/api/skills'),
    ]).then(([projects, experience, certificates, skills]) => {
      if (!active) return
      setStats([
        { label: 'Projects', value: projects.data.pagination?.total ?? projects.data.data.length, change: 'Portfolio projects', tone: 'blue' },
        { label: 'Experience', value: experience.data.pagination?.total ?? experience.data.data.length, change: 'Work entries', tone: 'amber' },
        { label: 'Certificates', value: certificates.data.pagination?.total ?? certificates.data.data.length, change: 'Certificates', tone: 'violet' },
        { label: 'Skills', value: skills.data.pagination?.total ?? skills.data.data.length, change: 'Portfolio skills', tone: 'green' },
      ])
      const items = [
        ...projects.data.data.slice(0, 3).map((item) => ({ name: item.title, type: 'Project', date: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : '', status: 'Published' })),
        ...certificates.data.data.slice(0, 2).map((item) => ({ name: item.title, type: 'Certificate', date: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : '', status: 'Published' })),
      ].sort((left, right) => left.date.localeCompare(right.date)).slice(0, 5)
      setRecent(items)
    }).catch(() => {})
    return () => { active = false }
  }, [])

  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">Dashboard</p>
          <h1>Portfolio overview</h1>
        </div>
        <button className="admin-primary-button compact" type="button" onClick={() => navigate('/')}>View portfolio</button>
      </div>

      <section className="admin-stat-grid" aria-label="Portfolio statistics">
        {stats.map((stat) => (
          <article className="admin-stat-card" key={stat.label}>
            <div className={`admin-stat-icon tone-${stat.tone}`} aria-hidden="true"></div>
            <div>
              <p>{stat.label}</p>
              <strong>{stat.value}</strong>
              <span>{stat.change}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-eyebrow">Activity</p>
            <h2>Recent content</h2>
          </div>
          <button className="admin-secondary-button" type="button" onClick={() => navigate('/admin/projects')}>View all</button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Title</th><th>Type</th><th>Updated</th><th>Status</th></tr>
            </thead>
            <tbody>
              {recent.map((item) => (
                <tr key={item.name}>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.type}</td>
                  <td>{item.date}</td>
                  <td><span className="admin-status-pill">{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default DashboardOverview
