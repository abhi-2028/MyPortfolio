import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import AOS from 'aos'
import Navbar from '../../components/public/Navbar'
import Hero from '../../components/public/Hero'
import TickerStraps from '../../components/public/TickerStraps'
import About from '../../components/public/About'
import Skills from '../../components/public/Skills'
import Projects from '../../components/public/Projects'
import Certificates from '../../components/public/Certificates'
import Contact from '../../components/public/Contact'
import Footer from '../../components/public/Footer'
import Experience from '../../components/public/Experience'
import Education from '../../components/public/Education'
import { usePortfolioData } from '../../hooks/usePortfolioData'

function PublicPortfolio() {
  const portfolio = usePortfolioData()
  const location = useLocation()
  const portfolioRef = useRef(null)

  useEffect(() => {
    const navigationEntry = performance.getEntriesByType('navigation')[0]
    if (navigationEntry?.type === 'reload' && window.location.hash) {
      history.scrollRestoration = 'manual'
      const cleanUrl = `${window.location.pathname}${window.location.search}`
      window.history.replaceState(null, '', cleanUrl)
      const previousScrollBehavior = document.documentElement.style.scrollBehavior
      document.documentElement.style.scrollBehavior = 'auto'
      window.scrollTo(0, 0)
      requestAnimationFrame(() => {
        document.documentElement.style.scrollBehavior = previousScrollBehavior
      })
    }

    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: false,
    })

    // "Jumped into the screen" IntersectionObserver
    // Observes all text elements, headings, paragraphs, and cards
    const jumpTargets = document.querySelectorAll('.jump-text, .jump-card')
    const jumpObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-jumped')
          }
        })
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    )

    jumpTargets.forEach((target) => jumpObserver.observe(target))

    const magnets = document.querySelectorAll('.magnet')
    const cleanups = []

    magnets.forEach((element) => {
      const move = (event) => {
        const rect = element.getBoundingClientRect()
        const x = event.clientX - rect.left - rect.width / 2
        const y = event.clientY - rect.top - rect.height / 2
        element.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`
      }
      const leave = () => {
        element.style.transform = 'translate(0, 0)'
      }
      element.addEventListener('mousemove', move)
      element.addEventListener('mouseleave', leave)
      cleanups.push(() => {
        element.removeEventListener('mousemove', move)
        element.removeEventListener('mouseleave', leave)
      })
    })

    return () => {
      cleanups.forEach((cleanup) => cleanup())
      jumpObserver.disconnect()
    }
  }, [portfolio.loading])

  useLayoutEffect(() => {
    if (portfolio.loading) return
    if (!location.state?.fromProjects) return

    const savedScrollY =
      Number(sessionStorage.getItem('portfolioProjectsScrollY') || 0)
      || Number(location.state.scrollY)
    if (!Number.isFinite(savedScrollY)) return
    if (savedScrollY <= 0) return

    const root = document.documentElement
    const previousScrollBehavior = root.style.scrollBehavior
    const previousVisibility = root.style.visibility
    root.style.scrollBehavior = 'auto'
    root.style.visibility = 'hidden'
    history.scrollRestoration = 'manual'

    window.scrollTo(0, savedScrollY)
    window.history.replaceState({}, '', '/')
    sessionStorage.removeItem('portfolioProjectsScrollY')
    if (portfolioRef.current) portfolioRef.current.style.visibility = 'visible'

    requestAnimationFrame(() => {
      root.style.scrollBehavior = previousScrollBehavior
      root.style.visibility = previousVisibility
      history.scrollRestoration = 'auto'
    })
  }, [location.state, portfolio.loading])

  return (
    <div ref={portfolioRef} style={location.state?.fromProjects ? { visibility: 'hidden' } : undefined}>
      <Navbar />
      <main>
        {portfolio.error ? (
          <div className="public-data-error" role="alert">{portfolio.error}</div>
        ) : null}
        <Hero profile={portfolio.profile} />
        
        {/* Infinite Ticker Straps: Eat Code Sleep Repeat + Infinite Skills */}
        <TickerStraps skills={portfolio.skills} />
        
        <About profile={portfolio.profile} />
        <Skills skills={portfolio.skills} />
        <Projects projects={portfolio.projects} />
        <Experience experience={portfolio.experience} />
        <Certificates certificates={portfolio.certificates} />
        <Education education={portfolio.education} />
        <Contact />
      </main>
      <Footer profile={portfolio.profile} />
    </div>
  )
}

export default PublicPortfolio
