function SendIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  )
}

function Contact() {
  return (
    <section id="contact_section" className="contact-glow-section py-5">
      <div className="container py-4">
        
        <div className="contact-header mb-5">
          <div className="about-section-tag jump-text" style={{ '--delay': '0.05s' }}>
            <span className="section-num">07.</span>
            <span className="section-rule"></span>
            <span className="section-label">Get in Touch</span>
          </div>
          <h2 className="projects-main-heading jump-text" style={{ '--delay': '0.12s' }}>
            Let’s Build Something <span className="text-terracotta">Remarkable</span>
          </h2>
          <p className="projects-sub-lead jump-text" style={{ '--delay': '0.2s' }}>
            Have a project in mind, an internship opportunity, or just want to chat tech and DSA? Reach out!
          </p>
        </div>

        <div className="row g-5 align-items-start">
          
          {/* Contact Details Column */}
          <div className="col-lg-5 jump-card" style={{ '--delay': '0.15s' }}>
            <div className="contact-info-panel">
              <h3 className="contact-info-heading">Communication Channel</h3>
              <p className="contact-info-text">
                I am actively seeking software engineering internships and collaborative development opportunities.
              </p>
              
              <div className="contact-direct-card">
                <span className="direct-label">Location</span>
                <span className="direct-value">Dehradun, Uttarakhand, India</span>
              </div>

              <div className="contact-direct-card mt-3">
                <span className="direct-label">Availability</span>
                <span className="direct-value">Summer 2025 / 2026 Internships • Open to Remote & Onsite</span>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="col-lg-7 jump-card" style={{ '--delay': '0.25s' }}>
            <div className="contact-form-panel">
              <form action="https://formspree.io/f/xqabrpda" method="POST">
                <div className="mb-4">
                  <label htmlFor="name" className="glow-form-label">Your Name</label>
                  <input
                    type="text"
                    className="glow-form-input"
                    id="name"
                    name="name"
                    placeholder="Abhirup Biswas"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="glow-form-label">Email Address</label>
                  <input
                    type="email"
                    className="glow-form-input"
                    id="email"
                    name="email"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="message" className="glow-form-label">Message</label>
                  <textarea
                    className="glow-form-input glow-textarea"
                    id="message"
                    name="message"
                    rows="5"
                    placeholder="Tell me about your project, team, or opportunity..."
                    required
                  ></textarea>
                </div>
                <button type="submit" className="glow-submit-btn magnet">
                  <span>Send Message</span>
                  <SendIcon />
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}

export default Contact
