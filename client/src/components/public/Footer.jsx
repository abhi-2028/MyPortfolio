const copyrightYear = new Date().getFullYear()

function Footer({ profile }) {
  const linkedIn = profile?.socialLinks?.linkedIn
  const twitter = profile?.socialLinks?.twitter
  const ownerName = profile?.name || 'Abhirup Biswas'
  return (
    <section className="gradient-background py-4">
      <div className="container">
        <footer className="d-flex flex-wrap justify-content-between align-items-center border-top">
          <div className="col-md-4 d-flex align-items-center">
            <span className="mb-3 mb-md-0 magnet" style={{ color: 'white' }}>© {copyrightYear} {ownerName}, Portfolio</span>
          </div>
          <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
            <li className="ms-3">
              {linkedIn ? <a className="text-body-secondary" href={linkedIn} aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 48 48">
                  <path fill="#ffffff" d="M41 4H9a5 5 0 0 0-5 5v32a5 5 0 0 0 5 5h32a5 5 0 0 0 5-5V9a5 5 0 0 0-5-5ZM17 39h-6V20h6Zm-3-21.53C12.2 17.47 11 16.4 11 15c0-1.4 1.2-2.47 3-2.47 1.8 0 2.93 1.07 3 2.47C17 16.4 15.88 17.53 14 17.53ZM39 39h-6V29c0-2-1-4-3.5-4.04h-.08C27 24.96 26 27.02 26 29v10h-6V20h6v2.56S27.93 20 31.81 20C35.78 20 39 22.73 39 28.26Z" />
                </svg>
              </a> : null}
            </li>
            <li className="ms-3">
              {twitter ? <a className="text-body-secondary" href={twitter} aria-label="Twitter X">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 50 50">
                  <path fill="#ffffff" d="M5.92 6l14.66 21.375L6.23 44h3.18l12.576-14.578L32 44h12.014L28.695 21.67 42.213 6h-3.17L27.289 19.617 17.947 6zM9.717 8h7.164l23.322 34h-7.164z" />
                </svg>
              </a> : null}
            </li>
          </ul>
        </footer>
      </div>
    </section>
  )
}

export default Footer
