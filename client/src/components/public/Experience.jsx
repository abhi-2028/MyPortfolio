function Experience({ experience = [] }) {
  if (experience.length === 0) return null

  return (
    <section id="experience_section" className="container my-5">
      <h2 className="subhead__ mb-4" data-aos="fade-right">Work Experience</h2>
      <div className="row g-4">
        {experience.map((item) => (
          <article className="col-12" key={item._id} data-aos="fade-up">
            <div className="p-4 border rounded-3 bg-white">
              <h3 className="h4">{item.position}</h3>
              <p className="fw-semibold text-danger mb-2">{item.company}</p>
              <p className="text-muted">
                {item.startDate ? new Date(item.startDate).toLocaleDateString() : ''}
                {' - '}
                {item.currentlyWorking
                  ? 'Present'
                  : item.endDate
                    ? new Date(item.endDate).toLocaleDateString()
                    : ''}
              </p>
              {item.description ? <p>{item.description}</p> : null}
              {item.responsibilities?.length ? (
                <ul>{item.responsibilities.map((responsibility) => <li key={responsibility}>{responsibility}</li>)}</ul>
              ) : null}
              {item.technologies?.length ? <p><strong>Technologies:</strong> {item.technologies.join(', ')}</p> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Experience
