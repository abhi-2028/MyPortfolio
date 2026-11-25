import React from 'react'

const skillIconsMap = {
  html: 'html',
  'html 5': 'html',
  css: 'css',
  'css 3': 'css',
  javascript: 'js',
  js: 'js',
  java: 'java',
  bootstrap: 'bootstrap',
  'bootstrap 5': 'bootstrap',
  git: 'git',
  github: 'github',
  'git & github': 'git',
  react: 'react',
  node: 'nodejs',
  'node.js': 'nodejs',
  express: 'express',
  mongodb: 'mongodb',
  mysql: 'mysql',
  tailwind: 'tailwind',
  'tailwind css': 'tailwind',
  typescript: 'ts',
  nextjs: 'nextjs',
  postgresql: 'postgres',
  docker: 'docker',
}

const defaultTickerSkills = [
  { name: 'Java', icon: 'java' },
  { name: 'JavaScript', icon: 'javascript' },
  { name: 'React', icon: 'react' },
  { name: 'Node.js', icon: 'node' },
  { name: 'Express', icon: 'express' },
  { name: 'MongoDB', icon: 'mongodb' },
  { name: 'DSA in Java', icon: 'java' },
  { name: 'HTML 5', icon: 'html' },
  { name: 'CSS 3', icon: 'css' },
  { name: 'Bootstrap 5', icon: 'bootstrap' },
  { name: 'Tailwind CSS', icon: 'tailwind' },
  { name: 'Git & GitHub', icon: 'git' },
  { name: 'MySQL', icon: 'mysql' },
]

export function EatCodeSleepStrap({ direction = 'left', speed = '28s', className = '' }) {
  const mantraItems = [
    { text: 'EAT', icon: '☕' },
    { text: 'CODE', icon: '⚡' },
    { text: 'SLEEP', icon: '✦' },
    { text: 'REPEAT', icon: '↻' },
  ]

  // Repeat 6x so each track easily exceeds ultrawide viewport width
  const repeated = Array.from({ length: 6 }, () => mantraItems).flat()

  return (
    <div
      className={`strap-marquee-container strap-mantra ${className}`.trim()}
      aria-label="Eat Code Sleep Repeat Ticker"
    >
      <div
        className={`strap-marquee-track ${direction === 'right' ? 'track-reverse' : 'track-forward'}`}
        style={{ animationDuration: speed }}
      >
        {repeated.map((item, idx) => (
          <span className="strap-mantra-token" key={`m1-${idx}`}>
            <span className="strap-word">{item.text}</span>
            <span className="strap-sparkle">{item.icon}</span>
          </span>
        ))}
      </div>
      <div
        className={`strap-marquee-track ${direction === 'right' ? 'track-reverse' : 'track-forward'}`}
        style={{ animationDuration: speed }}
        aria-hidden="true"
      >
        {repeated.map((item, idx) => (
          <span className="strap-mantra-token" key={`m2-${idx}`}>
            <span className="strap-word">{item.text}</span>
            <span className="strap-sparkle">{item.icon}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export function InfiniteSkillsStrap({ skills = [], speed = '34s', className = '' }) {
  const displaySkills = skills && skills.length > 0 ? skills : defaultTickerSkills
  const repeated = [...displaySkills, ...displaySkills, ...displaySkills]

  const getIconKey = (item) => {
    const raw = (item.icon || item.name || '').toLowerCase()
    return skillIconsMap[raw] || 'java'
  }

  return (
    <div
      className={`strap-marquee-container strap-skills ${className}`.trim()}
      aria-label="Infinite Skills Ticker"
    >
      <div className="strap-marquee-track track-reverse" style={{ animationDuration: speed }}>
        {repeated.map((skill, idx) => {
          const iconSlug = getIconKey(skill)
          return (
            <div className="strap-skill-badge" key={`sk1-${skill.name}-${idx}`}>
              <img
                src={`https://skillicons.dev/icons?i=${iconSlug}`}
                alt={`${skill.name} icon`}
                className="strap-skill-icon"
                loading="lazy"
              />
              <span className="strap-skill-name">{skill.name}</span>
            </div>
          )
        })}
      </div>
      <div className="strap-marquee-track track-reverse" style={{ animationDuration: speed }} aria-hidden="true">
        {repeated.map((skill, idx) => {
          const iconSlug = getIconKey(skill)
          return (
            <div className="strap-skill-badge" key={`sk2-${skill.name}-${idx}`}>
              <img
                src={`https://skillicons.dev/icons?i=${iconSlug}`}
                alt={`${skill.name} icon`}
                className="strap-skill-icon"
                loading="lazy"
              />
              <span className="strap-skill-name">{skill.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function TickerStraps({ skills = [] }) {
  return (
    <section className="ticker-straps-section" aria-label="Crossed Infinite Ticker Straps">
      <div className="ticker-straps-stage">
        <div className="ticker-straps-band">
          <EatCodeSleepStrap direction="left" speed="28s" className="strap-crossed-ribbon strap-crossed-back" />
          <InfiniteSkillsStrap skills={skills} speed="34s" className="strap-crossed-ribbon strap-crossed-front" />
        </div>
      </div>
    </section>
  )
}
