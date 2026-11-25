import { InfiniteSkillsStrap } from './TickerStraps'

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

function SkillIcon({ icon, name }) {
  const key = (icon || name || '').toLowerCase()
  const iconSlug = skillIconsMap[key] || 'java'

  return (
    <div className="glow-skill-icon-wrap">
      <img
        src={`https://skillicons.dev/icons?i=${iconSlug}`}
        alt={`${name} icon`}
        className="glow-skill-img"
        loading="lazy"
      />
    </div>
  )
}

function Skills({ skills = [] }) {
  const displaySkills = skills && skills.length > 0 ? skills : [
    { name: 'Java', category: 'Core & Algorithms', icon: 'java', proficiency: 90, description: 'Core OOP, Collections, Multithreading, DSA' },
    { name: 'JavaScript', category: 'Frontend', icon: 'javascript', proficiency: 88, description: 'ES6+, Asynchronous JS, DOM manipulation' },
    { name: 'React', category: 'Frontend', icon: 'react', proficiency: 85, description: 'Hooks, State Management, Responsive SPAs' },
    { name: 'Node.js', category: 'Backend', icon: 'node', proficiency: 82, description: 'REST APIs, Event Loop, Server-side logic' },
    { name: 'Express', category: 'Backend', icon: 'express', proficiency: 80, description: 'Middleware, Routing, API architectures' },
    { name: 'MongoDB', category: 'Database', icon: 'mongodb', proficiency: 80, description: 'Mongoose schemas, Aggregations, NoSQL design' },
    { name: 'HTML 5 & CSS 3', category: 'Frontend', icon: 'html', proficiency: 95, description: 'Semantic markup, Flexbox, Grids, Responsive UI' },
    { name: 'Bootstrap 5', category: 'Frontend', icon: 'bootstrap', proficiency: 88, description: 'Rapid responsive layouts, utility classes' },
    { name: 'Tailwind CSS', category: 'Frontend', icon: 'tailwind', proficiency: 85, description: 'Utility-first modern interface styling' },
    { name: 'Git & GitHub', category: 'Tools', icon: 'git', proficiency: 86, description: 'Version control, branching, PR workflows' },
    { name: 'MySQL', category: 'Database', icon: 'mysql', proficiency: 78, description: 'Relational data modeling, SQL queries' },
  ]

  return (
    <section id="icon-grid" className="skills-glow-section py-5">
      <div className="container py-4">
        
        {/* Section Header */}
        <div className="skills-header mb-5">
          <div className="about-section-tag jump-text" style={{ '--delay': '0.05s' }}>
            <span className="section-num">02.</span>
            <span className="section-rule"></span>
            <span className="section-label">Technical Stack</span>
          </div>
          <h2 className="skills-main-heading jump-text" style={{ '--delay': '0.12s' }}>
            Skills & <span className="text-terracotta">Capabilities</span>
          </h2>
          <p className="skills-sub-lead jump-text" style={{ '--delay': '0.2s' }}>
            Technologies, frameworks, and engineering tools I utilize to craft robust, high-performance web applications.
          </p>
        </div>

        {/* Dedicated Infinite Skills Rotating Strap within Section */}
        <div className="skills-strap-featured mb-5 jump-text" style={{ '--delay': '0.25s' }}>
          <InfiniteSkillsStrap skills={displaySkills} speed="30s" />
        </div>

        {/* Detailed Minimalist Skill Cards Grid */}
        <div className="row g-4 pt-2">
          {displaySkills.map((skill, index) => (
            <div className="col-12 col-md-6 col-lg-4" key={skill.name || index}>
              <div
                className="glow-skill-card jump-card"
                style={{ '--delay': `${0.1 + (index % 6) * 0.06}s` }}
              >
                <SkillIcon icon={skill.icon} name={skill.name} />
                <div className="glow-skill-content">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <h3 className="glow-skill-title">{skill.name}</h3>
                    {skill.category && (
                      <span className="glow-skill-category">{skill.category}</span>
                    )}
                  </div>
                  {skill.description ? (
                    <p className="glow-skill-desc">{skill.description}</p>
                  ) : skill.proficiency ? (
                    <div className="glow-skill-meter">
                      <div className="meter-label">Proficiency: {skill.proficiency}%</div>
                      <div className="meter-track">
                        <div className="meter-fill" style={{ width: `${skill.proficiency}%` }}></div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Skills
