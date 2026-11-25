import { Link } from 'react-router-dom'

function ArrowUpRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="7" y1="17" x2="17" y2="7"></line>
      <polyline points="7 7 17 7 17 17"></polyline>
    </svg>
  )
}

function Projects({ projects = [] }) {
  return (
    <section id="project_section" className="projects-glow-section py-5">
      <div className="container py-4">
        
        {/* Section Header */}
        <div className="projects-header mb-5">
          <div className="about-section-tag jump-text" style={{ '--delay': '0.05s' }}>
            <span className="section-num">03.</span>
            <span className="section-rule"></span>
            <span className="section-label">Featured Work</span>
          </div>
          <h2 className="projects-main-heading jump-text" style={{ '--delay': '0.12s' }}>
            Selected <span className="text-terracotta">Projects</span>
          </h2>
          <p className="projects-sub-lead jump-text" style={{ '--delay': '0.2s' }}>
            A curated showcase of applications, interfaces, and tools crafted with care, code, and attention to detail.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="row g-4 pt-2">
          {projects.map((project, idx) => (
            <div className="col-12 col-md-6 col-lg-6" key={project._id || project.slug || idx}>
              <article
                className="glow-project-card jump-card"
                style={{ '--delay': `${0.12 + (idx % 4) * 0.08}s` }}
              >
                {/* Project Image Frame */}
                <div className="glow-project-img-box">
                  <img
                    src={project.image || '/assets/Project1Tindog.png'}
                    alt={project.title}
                    className="glow-project-img"
                    loading="lazy"
                  />
                  {project.category && (
                    <span className="glow-project-category-tag">{project.category}</span>
                  )}
                </div>

                {/* Card Content */}
                <div className="glow-project-body">
                  <div className="d-flex align-items-baseline justify-content-between mb-2">
                    <span className="glow-project-index">0{idx + 1}.</span>
                    {project.createdAt && (
                      <span className="glow-project-date">
                        {new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>

                  <h3 className="glow-project-title">
                    <Link
                      to={`/projects/${project.slug}`}
                      state={{ fromProjects: true, scrollY: window.scrollY }}
                      onClick={() => sessionStorage.setItem('portfolioProjectsScrollY', String(window.scrollY))}
                    >
                      {project.title}
                    </Link>
                  </h3>

                  {project.description && (
                    <p className="glow-project-desc">{project.description}</p>
                  )}

                  {/* Technologies tags */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="glow-project-tags-group">
                      {project.technologies.map((tech) => (
                        <span className="glow-project-tech-pill" key={tech}>{tech}</span>
                      ))}
                    </div>
                  )}

                  {/* Actions: View Details & Live Demo */}
                  <div className="glow-project-links">
                    <Link
                      to={`/projects/${project.slug}`}
                      state={{ fromProjects: true, scrollY: window.scrollY }}
                      onClick={() => sessionStorage.setItem('portfolioProjectsScrollY', String(window.scrollY))}
                      className="glow-project-action-link"
                    >
                      <span>Explore Case</span>
                      <ArrowUpRight />
                    </Link>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="glow-project-live-btn"
                        aria-label={`Open live preview of ${project.title}`}
                      >
                        <span>Live Demo</span>
                        <ArrowUpRight />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <p className="text-muted text-center py-4">Projects will appear here when added.</p>
        )}

      </div>
    </section>
  )
}

export default Projects
