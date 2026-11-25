function Experience({ experience = [] }) {
  if (!experience || experience.length === 0) return null

  return (
    <section id="experience_section" className="experience-glow-section py-5">
      <div className="container py-4">
        
        <div className="experience-header mb-5">
          <div className="about-section-tag jump-text" style={{ '--delay': '0.05s' }}>
            <span className="section-num">04.</span>
            <span className="section-rule"></span>
            <span className="section-label">Milestones</span>
          </div>
          <h2 className="projects-main-heading jump-text" style={{ '--delay': '0.12s' }}>
            Work <span className="text-terracotta">Experience</span>
          </h2>
        </div>

        <div className="experience-timeline-stream">
          {experience.map((item, idx) => (
            <article
              className="timeline-ledger-card jump-card"
              style={{ '--delay': `${0.1 + idx * 0.1}s` }}
              key={item._id || idx}
            >
              <div className="timeline-date-col">
                <span className="timeline-date-badge">
                  {item.startDate ? new Date(item.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : ''}
                  {' — '}
                  {item.currentlyWorking
                    ? 'Present'
                    : item.endDate
                      ? new Date(item.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
                      : ''}
                </span>
              </div>
              <div className="timeline-content-col">
                <h3 className="timeline-role-title">{item.position}</h3>
                <h4 className="timeline-company-name">{item.company}</h4>
                {item.description && <p className="timeline-desc">{item.description}</p>}
                {item.responsibilities?.length > 0 && (
                  <ul className="timeline-bullets">
                    {item.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                )}
                {item.technologies?.length > 0 && (
                  <div className="glow-project-tags-group mt-3">
                    {item.technologies.map((t) => (
                      <span className="glow-project-tech-pill" key={t}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Experience
