import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import api from '../../services/api'

const fallbackProjects = [
  {
    title: 'Spotify Clone - Music Player',
    slug: 'spotify-clone-music-player',
    image: '/assets/Project2Spotify.png',
    liveUrl: 'https://abhi-2028.github.io/Spotify-Clone-HTML-CSS-/',
    category: 'Web Application',
    description: 'A responsive music player clone featuring playlist browsing, audio playback controls, and modern sleek UI inspired by Spotify.',
    detailedDescription: 'Built with semantic HTML5, CSS3 transitions, and JavaScript. Includes audio controls, playback progress bar, album card hover interactions, and mobile-friendly responsiveness.',
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
  },
  {
    title: "TinDog - Dog's Love Life",
    slug: 'tindog-dogs-love-life',
    image: '/assets/Project1Tindog.png',
    liveUrl: 'https://abhi-2028.github.io/TinDog/',
    category: 'Landing Page',
    description: 'A charming, high-converting dating website concept for dogs built with Bootstrap 5, featuring responsive grids, reviews carousel, and pricing cards.',
    detailedDescription: 'Engineered as a modern responsive promotional landing page with high visual polish, Bootstrap 5 grid architecture, pricing tiers, and client testimonial sliders.',
    technologies: ['HTML5', 'Bootstrap 5', 'CSS3'],
  },
  {
    title: 'Aesthetic Calculator',
    slug: 'aeshtetic-calculator',
    image: '/assets/aesthetic calculator.png',
    liveUrl: 'https://aesthetic-calculator-eta.vercel.app/',
    category: 'Utility Tool',
    description: 'A minimalist, beautifully animated online calculator with smooth button physics, dark/light aesthetics, and keyboard calculation support.',
    detailedDescription: 'Features smooth button click feedback, expression parsing, mathematical error handling, and clean visual themes.',
    technologies: ['React', 'CSS3', 'Vite'],
  },
  {
    title: 'Simon Says Game',
    slug: 'simon-says-game',
    image: '/assets/SimonSays.png',
    liveUrl: 'https://simon-game-xi-beryl.vercel.app',
    category: 'Interactive Game',
    description: 'Classic memory pattern game with interactive audio cues, score tracking, responsive button flashes, and progressive difficulty stages.',
    detailedDescription: 'Demonstrates JavaScript DOM manipulation, sequence generators, user input timing evaluation, and custom CSS animation states.',
    technologies: ['JavaScript', 'DOM', 'CSS3'],
  },
]

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
        if (!active) return
        const match = fallbackProjects.find((p) => p.slug === slug)
        if (match) {
          setProject(match)
          document.title = `${match.title} | Abhirup Biswas Portfolio`
        } else {
          setError(requestError.response?.data?.message || 'Unable to load this project.')
        }
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
      <Link
        className="about-pill-button mb-4 d-inline-flex"
        to="/"
        state={backState}
        style={{ width: 'fit-content', textDecoration: 'none' }}
      >
        ← Back to portfolio
      </Link>
      <article className="project-detail-card glow-project-card p-4 p-md-5">
        {project.image ? (
          <div className="glow-project-img-box rounded-3 mb-4" style={{ maxHeight: '480px' }}>
            <img src={project.image} alt={project.title} className="glow-project-img" />
          </div>
        ) : null}
        
        {project.category && (
          <span className="about-section-tag mb-2">
            <span className="section-num">✦</span>
            <span className="section-label">{project.category}</span>
          </span>
        )}

        <h1 className="projects-main-heading mb-3">{project.title}</h1>
        
        {project.description ? (
          <p className="lead text-muted mb-4" style={{ fontSize: '1.2rem', lineHeight: '1.7' }}>
            {project.description}
          </p>
        ) : null}

        {project.detailedDescription ? (
          <div className="about-callout-quote mb-4">
            <p>{project.detailedDescription}</p>
          </div>
        ) : null}

        {project.technologies?.length ? (
          <div className="mb-4">
            <span className="glow-form-label mb-2">Technologies Used:</span>
            <div className="glow-project-tags-group">
              {project.technologies.map((tech) => (
                <span className="glow-project-tech-pill" key={tech}>{tech}</span>
              ))}
            </div>
          </div>
        ) : null}

        {project.gallery?.length ? (
          <div className="project-gallery mb-4">
            {project.gallery.map((image) => <img src={image} alt="" key={image} />)}
          </div>
        ) : null}

        <div className="d-flex gap-3 flex-wrap mt-3 pt-3 border-top">
          {project.liveUrl ? (
            <a className="glow-project-live-btn px-4 py-2" href={project.liveUrl} target="_blank" rel="noreferrer">
              Live Preview ↗
            </a>
          ) : null}
          {project.githubUrl ? (
            <a className="about-pill-button px-4 py-2" href={project.githubUrl} target="_blank" rel="noreferrer">
              Source Code ↗
            </a>
          ) : null}
        </div>
      </article>
    </main>
  )
}

export default ProjectDetail
