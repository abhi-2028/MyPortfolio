function ArrowUpRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="7" y1="17" x2="17" y2="7"></line>
      <polyline points="7 7 17 7 17 17"></polyline>
    </svg>
  )
}

function CertificateBadgeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A85A32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="6"></circle>
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
    </svg>
  )
}

function Certificates({ certificates = [] }) {
  return (
    <section id="certificates_section" className="certificates-glow-section py-5">
      <div className="container py-4">
        
        <div className="certificates-header mb-5">
          <div className="about-section-tag jump-text" style={{ '--delay': '0.05s' }}>
            <span className="section-num">06.</span>
            <span className="section-rule"></span>
            <span className="section-label">Certifications</span>
          </div>
          <h2 className="projects-main-heading jump-text" style={{ '--delay': '0.12s' }}>
            Verified <span className="text-terracotta">Credentials</span>
          </h2>
          <p className="projects-sub-lead jump-text" style={{ '--delay': '0.2s' }}>
            Course completions, specializations, and validated technical achievements.
          </p>
        </div>

        <div className="row g-4">
          {certificates.map((cert, idx) => (
            <div className="col-12 col-md-6" key={cert._id || idx}>
              <div
                className="glow-cert-card jump-card"
                style={{ '--delay': `${0.1 + (idx % 4) * 0.08}s` }}
              >
                <div className="glow-cert-icon">
                  <CertificateBadgeIcon />
                </div>
                <div className="glow-cert-info">
                  <h3 className="glow-cert-title">{cert.title}</h3>
                  <p className="glow-cert-meta">
                    Issued by <strong>{cert.issuingOrganization}</strong>
                    {cert.issueDate && (
                      <span> • {new Date(cert.issueDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                    )}
                  </p>
                </div>
                {(cert.credentialUrl || cert.image) && (
                  <a
                    href={cert.credentialUrl || cert.image}
                    target="_blank"
                    rel="noreferrer"
                    className="glow-cert-link magnet"
                    aria-label={`View ${cert.title} credential`}
                  >
                    <span>View Credential</span>
                    <ArrowUpRight />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {certificates.length === 0 && (
          <p className="text-muted text-center py-4">Certificates will appear here when added.</p>
        )}

      </div>
    </section>
  )
}

export default Certificates
