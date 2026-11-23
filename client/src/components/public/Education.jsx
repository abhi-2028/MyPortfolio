function Education({ education = [] }) {
  if (education.length === 0) return null

  return (
    <section id="education_section" className="container my-5">
      <h2 className="subhead__ mb-4" data-aos="fade-right">Education</h2>
      <div className="row g-4">
        {education.map((item) => (
          <article className="col-12" key={item._id} data-aos="fade-up">
            <div className="p-4 border rounded-3 bg-white">
              <h3 className="h4">{item.degree || item.fieldOfStudy || item.institution}</h3>
              <p className="fw-semibold text-danger mb-2">{item.institution}</p>
              {(item.startDate || item.endDate) ? (
                <p className="text-muted">
                  {item.startDate ? new Date(item.startDate).toLocaleDateString() : ''}
                  {' - '}
                  {item.endDate ? new Date(item.endDate).toLocaleDateString() : ''}
                </p>
              ) : null}
              {item.description ? <p>{item.description}</p> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Education
