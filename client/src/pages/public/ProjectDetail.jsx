import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import api from '../../services/api'

function ProjectDetail() {
  const { slug } = useParams()
  const location = useLocation()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Project | Abhirup Biswas Portfolio'
    let active = true
    api
      .get(`/api/projects/${slug}`)
      .then((response) => {
        if (!active) return
        setProject(response.data.data)
        document.title = `${response.data.data.title} | Abhirup Biswas Portfolio`
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || 'Unable to load this project.')
      })
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [slug])

  const backState = {
    fromProjects: true,
    scrollY: Number(sessionStorage.getItem('portfolioProjectsScrollY') || 0)
      || location.state?.scrollY
      || 0,
  }

  if (loading) return <main className="public-loading">Loading project...</main>
  if (error) {
    return (
      <main className="container py-5">
        <div className="public-data-error" role="alert">{error}</div>
        <Link className="btn btn-outline-dark" to="/" state={backState}>Back to projects</Link>
      </main>
    )
  }

  return (
    <main className="container py-5">
      <Link className="btn btn-outline-dark mb-4" to="/" state={backState}>Back to projects</Link>
      <article className="project-detail-card">
        {project.image ? <img src={project.image} alt={project.title} className="project-detail-cover" /> : null}
        <h1 className="subhead__">{project.title}</h1>
        {project.description ? <p className="lead">{project.description}</p> : null}
        {project.detailedDescription ? <p>{project.detailedDescription}</p> : null}
        {project.technologies?.length ? <p><strong>Technologies:</strong> {project.technologies.join(', ')}</p> : null}
        {project.gallery?.length ? (
          <div className="project-gallery">
            {project.gallery.map((image) => <img src={image} alt="" key={image} />)}
          </div>
        ) : null}
        <div className="d-flex gap-2 flex-wrap mt-4">
          {project.liveUrl ? <a className="btn btn-danger" href={project.liveUrl} target="_blank" rel="noreferrer">Live demo</a> : null}
          {project.githubUrl ? <a className="btn btn-dark" href={project.githubUrl} target="_blank" rel="noreferrer">GitHub</a> : null}
        </div>
      </article>
    </main>
  )
}

export default ProjectDetail
