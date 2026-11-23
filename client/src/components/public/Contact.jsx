function Contact() {
  return (
    <section id="contact_section">
      <div className="container my-2">
        <h2 className="pb-3 subhead__" data-aos="fade-right">Let's Connect</h2>
        <form action="https://formspree.io/f/xqabrpda" method="POST" data-aos="fade-up" data-aos-delay="100">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Your Name</label>
            <input type="text" className="form-control" id="name" name="name" placeholder="Enter your name" required />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Your Email</label>
            <input type="email" className="form-control" id="email" name="email" placeholder="Enter your email" required />
          </div>
          <div className="mb-3">
            <label htmlFor="message" className="form-label">Message</label>
            <textarea className="form-control" id="message" name="message" rows="4" placeholder="Type your message" required></textarea>
          </div>
          <button type="submit" className="btn btn-outline-danger magnet">Send Message</button>
        </form>
      </div>
    </section>
  )
}

export default Contact
