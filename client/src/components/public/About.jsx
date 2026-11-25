import { useEffect, useRef, useState } from 'react'
import profileImage from '../../assets/portfolio/myImg.jpeg'

function LinkedInIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.8v8.37h-2.8V10.9M7.86 6.88a1.45 1.45 0 0 0-1.45 1.45c0 .8.65 1.45 1.45 1.45a1.45 1.45 0 0 0 1.45-1.45c0-.8-.65-1.45-1.45-1.45Z" />
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function ArrowUpRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="7" y1="17" x2="17" y2="7"></line>
      <polyline points="7 7 17 7 17 17"></polyline>
    </svg>
  )
}

function SparkleStar({ className = '' }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 0L14.4 9.6L24 12L14.4 14.4L12 24L9.6 14.4L0 12L9.6 9.6L12 0Z" fill="#C49A6C" />
    </svg>
  )
}

function HandDrawnUnderline() {
  return (
    <svg className="about-brush-stroke" viewBox="0 0 190 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M2 9.5C38 3.5 110 2 188 8C142 11 88 12.5 12 11"
        stroke="#A85A32"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function HangingPortrait({ src, alt }) {
  const sceneRef = useRef(null)
  const pendulumRef = useRef(null)
  const orbitRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const physicsRef = useRef({
    angle: 0,
    velocity: 0,
    dragging: false,
    hovering: false,
    hoverTarget: 0,
    dragTarget: 0,
    lastClientX: null,
    orbitOffsetX: 0,
    orbitOffsetY: 0,
  })

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let rafId = 0
    let lastTime = performance.now()
    let elapsed = 0

    const step = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.032)
      lastTime = now
      elapsed += dt

      const state = physicsRef.current

      if (state.dragging) {
        const prevAngle = state.angle
        state.angle += (state.dragTarget - state.angle) * 0.35
        state.velocity = dt > 0 ? (state.angle - prevAngle) / dt : 0
      } else {
        const idleAngle = prefersReducedMotion ? 0 : Math.sin(elapsed * 1.15) * 1.8
        const target = state.hovering ? state.hoverTarget : idleAngle
        const stiffness = 28
        const damping = 2.6
        const accel = stiffness * (target - state.angle) - damping * state.velocity
        state.velocity += accel * dt
        state.angle += state.velocity * dt
      }

      if (pendulumRef.current) {
        pendulumRef.current.style.transform = `rotate(${state.angle.toFixed(3)}deg)`
      }

      if (orbitRef.current) {
        const targetOX = state.hovering || state.dragging ? state.orbitOffsetX : 0
        const targetOY = state.hovering || state.dragging ? state.orbitOffsetY : 0
        orbitRef.current.style.transform = `translate(${targetOX.toFixed(2)}px, ${targetOY.toFixed(2)}px) rotate(-18deg)`
      }

      rafId = window.requestAnimationFrame(step)
    }

    rafId = window.requestAnimationFrame(step)
    return () => window.cancelAnimationFrame(rafId)
  }, [])

  useEffect(() => {
    const handleWindowPointerMove = (event) => {
      const state = physicsRef.current
      if (!state.dragging || !pendulumRef.current) return

      const rect = pendulumRef.current.getBoundingClientRect()
      const pivotX = rect.left + rect.width / 2
      const pivotY = rect.top + 9
      const dx = event.clientX - pivotX
      const dy = Math.max(event.clientY - pivotY, 60)

      // Negative dx aligns bottom swing direction with cursor (top pivot)
      const deg = (Math.atan2(-dx, dy) * 180) / Math.PI
      state.dragTarget = Math.max(-28, Math.min(28, deg))
    }

    const handleWindowPointerUp = () => {
      if (!physicsRef.current.dragging) return
      physicsRef.current.dragging = false
      setIsDragging(false)
    }

    window.addEventListener('pointermove', handleWindowPointerMove)
    window.addEventListener('pointerup', handleWindowPointerUp)
    window.addEventListener('pointercancel', handleWindowPointerUp)

    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove)
      window.removeEventListener('pointerup', handleWindowPointerUp)
      window.removeEventListener('pointercancel', handleWindowPointerUp)
    }
  }, [])

  const handleScenePointerMove = (event) => {
    const state = physicsRef.current
    if (!sceneRef.current || state.dragging) return

    const rect = sceneRef.current.getBoundingClientRect()
    const normX = ((event.clientX - rect.left) / rect.width - 0.5) * 2
    const normY = ((event.clientY - rect.top) / rect.height - 0.5) * 2

    state.hovering = true
    // Gentle equilibrium tilt toward pointer side (top pivot -> inverted sign)
    state.hoverTarget = Math.max(-10, Math.min(10, -normX * 8))
    state.orbitOffsetX = -normX * 7
    state.orbitOffsetY = -normY * 5

    // Apply physical velocity impulse from cursor horizontal swipe speed
    if (state.lastClientX !== null) {
      const deltaX = event.clientX - state.lastClientX
      const clampedDelta = Math.max(-36, Math.min(36, deltaX))
      state.velocity -= clampedDelta * 2.2
    }
    state.lastClientX = event.clientX
  }

  const handleScenePointerLeave = () => {
    const state = physicsRef.current
    state.hovering = false
    state.hoverTarget = 0
    state.lastClientX = null
    state.orbitOffsetX = 0
    state.orbitOffsetY = 0
  }

  const handlePendulumPointerDown = (event) => {
    if (event.button !== 0 && event.pointerType === 'mouse') return
    const state = physicsRef.current
    state.dragging = true
    state.hovering = true
    setIsDragging(true)

    if (pendulumRef.current) {
      const rect = pendulumRef.current.getBoundingClientRect()
      const pivotX = rect.left + rect.width / 2
      const pivotY = rect.top + 9
      const dx = event.clientX - pivotX
      const dy = Math.max(event.clientY - pivotY, 60)
      const deg = (Math.atan2(-dx, dy) * 180) / Math.PI
      state.dragTarget = Math.max(-28, Math.min(28, deg))
    }
  }

  return (
    <div
      ref={sceneRef}
      className="hanging-portrait-scene"
      onPointerMove={handleScenePointerMove}
      onPointerLeave={handleScenePointerLeave}
    >
      {/* Wall anchor pin */}
      <div className="hanging-wall-pin" title="Anchor pin">
        <div className="pin-head"></div>
        <div className="pin-shadow"></div>
      </div>

      {/* Swaying interactive pendulum assembly */}
      <div
        ref={pendulumRef}
        className={`hanging-pendulum ${isDragging ? 'is-dragging' : ''}`}
        onPointerDown={handlePendulumPointerDown}
        role="img"
        aria-label={`Interactive hanging portrait of ${alt || 'Abhirup Biswas'}`}
      >
        {/* Suspension strings */}
        <svg className="hanging-strings-svg" viewBox="0 0 320 95" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Main braided cords from pin (160, 10) to frame eyelets (95, 90) and (225, 90) */}
          <line x1="160" y1="10" x2="95" y2="90" stroke="#B38A5B" strokeWidth="2" strokeDasharray="4 2" />
          <line x1="160" y1="10" x2="225" y2="90" stroke="#B38A5B" strokeWidth="2" strokeDasharray="4 2" />

          {/* Top pin metal knot ring */}
          <circle cx="160" cy="10" r="7" fill="#C49A6C" stroke="#7A4C24" strokeWidth="1.5" />
          <circle cx="160" cy="10" r="3" fill="#FAF8F5" />

          {/* Left and right frame eyelets / hooks */}
          <circle cx="95" cy="90" r="5" fill="#C49A6C" stroke="#7A4C24" strokeWidth="1.5" />
          <circle cx="225" cy="90" r="5" fill="#C49A6C" stroke="#7A4C24" strokeWidth="1.5" />
        </svg>

        {/* Circular portrait frame with orbital ring and sparkle */}
        <div className="hanging-portrait-frame-wrap">
          {/* Orbital wireframe ring tilted around portrait */}
          <div ref={orbitRef} className="hanging-orbital-ring" aria-hidden="true">
            <SparkleStar className="orbital-sparkle-star" />
          </div>

          {/* Picture circle */}
          <div className="hanging-portrait-circle">
            <img
              src={src || profileImage}
              alt={alt || 'Abhirup Biswas'}
              className="hanging-portrait-img"
              loading="lazy"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function About({ profile }) {
  const linkedIn = profile?.socialLinks?.linkedIn || 'https://www.linkedin.com/in/abhirup-biswas-260167322/'
  const twitter = profile?.socialLinks?.twitter || 'https://x.com/AbhirupCode'
  const imageSource = profileImage || profile?.profileImage

  return (
    <section id="aboutme_section" className="about-glow-section">
      <div className="container pt-3 pb-5">
        <div className="row align-items-center g-5 py-4">
          
          {/* Left Column: Editorial Story & Bio */}
          <div className="col-lg-7 order-2 order-lg-1">
            
            {/* 01. About Me section tag */}
            <div className="about-section-tag jump-text" style={{ '--delay': '0.05s' }}>
              <span className="section-num">01.</span>
              <span className="section-rule"></span>
              <span className="section-label">About Me</span>
            </div>

            {/* Main Headline */}
            <h2 className="about-editorial-heading jump-text" style={{ '--delay': '0.12s' }}>
              Hi, I’m <br />
              <span className="name-lead">Abhirup </span>
              <span className="name-highlight">
                Biswas
                <HandDrawnUnderline />
              </span>
            </h2>

            {/* Tagline / Roles */}
            <p className="about-editorial-subheading jump-text" style={{ '--delay': '0.2s' }}>
              <span>Software Engineer</span>
              <span className="dot-sep">•</span>
              <span>Problem Solver</span>
              <span className="dot-sep">•</span>
              <span>Lifelong Learner</span>
            </p>

            {/* Callout Quote Bar */}
            <div className="about-callout-quote jump-text" style={{ '--delay': '0.28s' }}>
              <p>
                I’m Abhirup Biswas, a <strong className="highlight-text">3rd-year</strong> Computer Engineering student at <strong className="highlight-text">ICFAI University, Dehradun</strong>. I have a strong interest in problem-solving and software development, with a focus on mastering <strong className="highlight-text">Data Structures and Algorithms in Java</strong>.
              </p>
            </div>

            {/* Narrative Body */}
            <p className="about-narrative-paragraph jump-text" style={{ '--delay': '0.36s' }}>
              With around <strong className="highlight-text">2 years</strong> of development experience, I’ve developed an understanding of how real-world applications are built. I’m currently focused on building <strong className="highlight-text">scalable backend</strong> systems, exploring <strong className="highlight-text">system design</strong>, and strengthening my understanding of backend technologies while continuously improving my <strong className="highlight-text">DSA</strong> skills. I enjoy building practical projects, exploring new technologies, and understanding how things work behind the scenes. I’m always looking for opportunities to learn, contribute, and grow as a software engineer.
            </p>

            {/* Action Buttons: LinkedIn & Twitter */}
            <div className="about-action-cluster jump-text" style={{ '--delay': '0.44s' }}>
              {linkedIn && (
                <a
                  href={linkedIn}
                  target="_blank"
                  rel="noreferrer"
                  className="about-pill-button linkedin-pill magnet"
                >
                  <LinkedInIcon />
                  <span>LinkedIn</span>
                  <ArrowUpRight />
                </a>
              )}
              {twitter && (
                <a
                  href={twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="about-pill-button twitter-pill magnet"
                >
                  <TwitterIcon />
                  <span>Twitter</span>
                  <ArrowUpRight />
                </a>
              )}
            </div>

            {/* Editorial Colophon Micro-tag */}
            <div className="about-colophon-tag jump-text" style={{ '--delay': '0.5s' }}>
              <code>// build • learn • grow</code>
            </div>

          </div>

          {/* Right Column: Hanging from string Portrait Frame */}
          <div className="col-lg-5 order-1 order-lg-2 text-center jump-text" style={{ '--delay': '0.2s' }}>
            <HangingPortrait src={imageSource} alt={profile?.name || 'Abhirup Biswas'} />
          </div>

        </div>
      </div>
    </section>
  )
}

export default About
