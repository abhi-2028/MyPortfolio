import { useEffect, useState } from 'react'

const links = [
  ['#hero_section', 'Home'],
  ['#aboutme_section', 'About'],
  ['#icon-grid', 'Skills'],
  ['#project_section', 'Projects'],
  ['#certificates_section', 'Certificates'],
  ['#contact_section', 'Contact'],
]

function Navbar() {
  const [onLanding, setOnLanding] = useState(true)

  useEffect(() => {
    const updateNavbar = () => setOnLanding(window.scrollY < window.innerHeight)
    updateNavbar()
    window.addEventListener('scroll', updateNavbar, { passive: true })
    return () => window.removeEventListener('scroll', updateNavbar)
  }, [])

  return (
    <nav className={`navbar navbar-expand-lg fixed-top z-3 ${onLanding ? 'navbar_landing' : 'navbar_scrolled bg-white border-bottom'}`}>
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <a href="#hero_section" className="navbar-brand fw-bold text-dark ms-2">
          <h1 className="display-6 fw-bold lh-1 mx-3 magnet">Portfolio</h1>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="mainNavbar">
          <ul className="nav nav-pills">
            {links.map(([href, label], index) => (
              <li className="nav-item" key={href}>
                <a
                  href={href}
                  className={`nav-link ${index === 0 ? 'active bg-dark text-white' : ''}`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
