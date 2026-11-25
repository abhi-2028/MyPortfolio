function Education({ education = [] }) {
  if (!education || education.length === 0) return null

  return (
    <section id="education_section" className="education-glow-section py-5">
      <div className="container py-4">
        
        <div className="education-header mb-5">
          <div className="about-section-tag jump-text" style={{ '--delay': '0.05s' }}>
            <span className="section-num">05.</span>
            <span className="section-rule"></span>
            <span className="section-label">Academic Foundations</span>
          </div>
          <h2 className="projects-main-heading jump-text" style={{ '--delay': '0.12s' }}>
            Education & <span className="text-terracotta">Degree</span>
          </h2>
        </div>

        <div className="education-stream">
          {education.map((item, idx) => (
            <article
              className="timeline-ledger-card jump-card"
              style={{ '--delay': `${0.1 + idx * 0.1}s` }}
              key={item._id || idx}
            >
              <div className="timeline-date-col">
                <span className="timeline-date-badge">
                  {item.startDate ? new Date(item.startDate).toLocaleDateString(undefined, { year: 'numeric' }) : '2023'}
                  {' — '}
                  {item.endDate ? new Date(item.endDate).toLocaleDateString(undefined, { year: 'numeric' }) : '2027'}
                </span>
              </div>
              <div className="timeline-content-col">
                <h3 className="timeline-role-title">
                  {item.degree || item.fieldOfStudy || 'Computer Engineering'}
                </h3>
                <h4 className="timeline-company-name">{item.institution}</h4>
                {item.description && <p className="timeline-desc">{item.description}</p>}
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Education
