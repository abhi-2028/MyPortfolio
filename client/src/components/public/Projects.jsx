import { Link } from 'react-router-dom'

function Projects({ projects = [] }) {
  return (
    <section id="project_section">
      <div className="container px-4 py-5" id="custom-cards">
        <h2 className="pb-2 border-bottom subhead__" data-aos="fade-right">Projects</h2>
        <div className="row row-cols-1 row-cols-lg-3 align-items-stretch g-4 py-5">
          {projects.map((project) => (
            <div className="col" key={project._id || project.slug}>
              <div
                className="card card-cover h-100 overflow-hidden text-bg-dark rounded-4 shadow-lg"
                style={project.image ? { backgroundImage: `url("${project.image}")` } : undefined}
                data-aos="fade-up"
                data-aos-duration="800"
              >
                <div className="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
                  <Link
                    to={`/projects/${project.slug}`}
                    state={{ fromProjects: true, scrollY: window.scrollY }}
                    onClick={() => sessionStorage.setItem('portfolioProjectsScrollY', String(window.scrollY))}
                    style={{ textDecoration: 'none', color: 'white' }}
                  >
                    <h3 className="pt-5 mt-5 mb-4 display-6 lh-1 fw-bold">{project.title}</h3>
                  </Link>
                  <ul className="d-flex list-unstyled mt-auto">
                    <li className="me-auto">
                      {project.liveUrl ? (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label="Open live project">
                          <span className="badge text-bg-light">Live</span>
                        </a>
                      ) : null}
                    </li>
                    <li className="d-flex align-items-center me-3">
                      <svg className="bi me-2" width="1em" height="1em" aria-hidden="true"><use href="#geo-fill"></use></svg>
                      {project.createdAt ? <small>{new Date(project.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</small> : null}
                    </li>
                    <li className="d-flex align-items-center">
                      <svg className="bi me-2" width="1em" height="1em" aria-hidden="true"><use href="#calendar3"></use></svg>
                      {project.category ? <small>{project.category}</small> : null}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
        {projects.length === 0 ? <p className="text-muted">Projects will appear here when added.</p> : null}
      </div>
    </section>
  )
}

export default Projects
