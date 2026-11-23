import { useEffect, useState } from 'react'
function Hero({ profile }) {
  const [displayText, setDisplayText] = useState('')

  useEffect(() => {
    let timeout
    let wordIndex = 0
    let charIndex = 0
    let erased = false

    const tick = () => {
      const roleLines = profile?.headline
        ? profile.headline.split('|').map((line) => line.trim()).filter(Boolean)
        : ['a Programmer', 'a Web Developer', 'a Coder']
      const word = roleLines[wordIndex]

      if (!erased) {
        charIndex += 1
        setDisplayText(word.slice(0, charIndex))
        if (charIndex === word.length) {
          erased = true
          timeout = window.setTimeout(tick, 1500)
          return
        }
        timeout = window.setTimeout(tick, 150)
      } else {
        charIndex -= 1
        setDisplayText(word.slice(0, charIndex))
        if (charIndex === 0) {
          erased = false
          const roleLines = profile?.headline
            ? profile.headline.split('|').map((line) => line.trim()).filter(Boolean)
            : ['a Programmer', 'a Web Developer', 'a Coder']
          wordIndex = (wordIndex + 1) % roleLines.length
          timeout = window.setTimeout(tick, 150)
          return
        }
        timeout = window.setTimeout(tick, 90)
      }
    }

    timeout = window.setTimeout(tick, 1000)
    return () => window.clearTimeout(timeout)
  }, [profile])

  return (
    <section id="hero_section" className="gradient-background hero_landing">
      <div className="container col-xxl-8 px-1 py-5">
        <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
          <div className="col-lg-7 ms-0 me-auto text-start" data-aos="fade-right">
            <h1 className="display-5 fw-bold lh-1 mb-3 hero_name text">
              {profile?.name ? `I'm ${profile.name.split(' ')[0]}` : "I'm Abhirup"}
            </h1>
            <h2 className="display-5 fw-bold lh-1 mb-lg-4 hero_sub text">
              <span className="typed_text" style={{ color: '#ff4d4d' }}>{displayText}</span>
              <span className="cursor">|</span>
            </h2>
            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
              <a href="#contact_section" className="btn btn-outline-light btn-lg px-4 magnet">Contact</a>
              <a href={profile?.resumeUrl || '/assets/Resume.pdf'} download className="btn resume-btn btn-lg px-4 magnet">
                Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
