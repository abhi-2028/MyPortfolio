import "../../styles/skills.css";


const skillIcons = {
  html: "html",
  css: "css",
  javascript: "js",
  java: "java",
  bootstrap: "bootstrap",
  git: "git",
  github: "github",
  react: "react",
  node: "nodejs",
  express: "express",
  mongodb: "mongodb",
  mysql: "mysql",
  tailwind: "tailwind",
  typescript: "ts",
  nextjs: "nextjs",
  postgresql: "postgres",
  docker: "docker"
};

function SkillIcon({ icon }) {
  const iconName = skillIcons[icon?.toLowerCase()];

  if (!iconName) return null;

  return (
    <div className="skill_icon">
      <img
        src={`https://skillicons.dev/icons?i=${iconName}`}
        alt={`${icon} logo`}
        loading="lazy"
      />
    </div>
  );
}

function Skills({ skills = [] }) {
  return (
    <section className="resume_section skills_section">
      <div className="container py-5" id="icon-grid">

        <h2
          className="pb-3 border-bottom subhead__"
          data-aos="fade-right"
        >
          Technical Skills
        </h2>

        <div className="skills_grid">
          {skills.map((skill) => (
            <div
              className="skill_card"
              data-aos="zoom-in"
              key={skill.name}
            >
              <SkillIcon icon={skill.icon} />

              <div className="skill_info">
                <h3>{skill.name}</h3>

                {skill.description && (
                  <p>{skill.description}</p>
                )}

                {!skill.description && skill.proficiency && (
                  <p>
                    Proficiency: {skill.proficiency}%
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {skills.length === 0 && (
          <p className="text-muted">
            Skills will appear here when added.
          </p>
        )}

      </div>
    </section>
  );
}

export default Skills;
