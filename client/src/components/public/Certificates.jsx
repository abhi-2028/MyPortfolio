function Certificates({ certificates = [] }) {
  return (
    <section id="certificates_section" className="container my-5">
      <h2 className="subhead__ mb-4" data-aos="fade-up">Certificates</h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {certificates.map((certificate) => (
          <div className="col" data-aos="zoom-in" key={certificate._id}>
            <div className="card h-100 shadow-sm border-0 p-3 bg-light">
              <div className="card-body">
                <h5 className="card-title">{certificate.title}</h5>
                <p className="card-text">
                  Issued by {certificate.issuingOrganization}
                  {certificate.issueDate
                    ? ` · ${new Date(certificate.issueDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}`
                    : ''}
                </p>
                {certificate.credentialUrl || certificate.image ? (
                  <a
                    href={certificate.credentialUrl || certificate.image}
                    target="_blank"
                    rel="noreferrer"
                    className="btn cert-btn"
                  >
                    View Certificate
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
      {certificates.length === 0 ? <p className="text-muted">Certificates will appear here when added.</p> : null}
    </section>
  )
}

export default Certificates
