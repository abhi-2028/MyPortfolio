const copyrightYear = new Date().getFullYear()

function Footer({ profile }) {
  const linkedIn = profile?.socialLinks?.linkedIn || 'https://www.linkedin.com/in/abhirup-biswas-260167322/'
  const twitter = profile?.socialLinks?.twitter || 'https://x.com/AbhirupCode'
  const ownerName = profile?.name || 'Abhirup Biswas'

  return (
    <footer className="glow-colophon-footer py-4">
      <div className="container">
        <div className="d-flex flex-wrap justify-content-between align-items-center py-3">
          <div className="col-md-6 d-flex align-items-center mb-3 mb-md-0">
            <span className="glow-footer-copyright">
              © {copyrightYear} <strong>{ownerName}</strong> — Designed with care & code.
            </span>
          </div>
          <div className="col-md-6 d-flex justify-content-md-end gap-3">
            {linkedIn && (
              <a
                href={linkedIn}
                target="_blank"
                rel="noreferrer"
                className="glow-footer-social-link magnet"
                aria-label="LinkedIn Profile"
              >
                LinkedIn
              </a>
            )}
            {twitter && (
              <a
                href={twitter}
                target="_blank"
                rel="noreferrer"
                className="glow-footer-social-link magnet"
                aria-label="Twitter Profile"
              >
                Twitter / X
              </a>
            )}
            <a
              href="#hero_section"
              className="glow-footer-social-link magnet"
            >
              Back to Top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
