import profileImage from '../../assets/portfolio/myImg.jpeg'

function LinkedInIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="about_linkedIn" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#0078d4" d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z" />
      <path fill="#fff" d="M12,19h5v17h-5V19z M14.485,17h-0.028C12.965,17,12,15.888,12,14.499C12,13.08,12.995,12,14.514,12c1.521,0,2.458,1.08,2.486,2.499C17,15.887,16.035,17,14.485,17z M36,36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698c-1.501,0-2.313,1.012-2.707,1.99C24.957,25.543,25,26.511,25,27v9h-5V19h5v2.616C25.721,20.5,26.85,19,29.738,19c3.578,0,6.261,2.25,6.261,7.274L36,36z" />
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 50 50" aria-hidden="true">
      <path d="M11 4C7.134 4 4 7.134 4 11v28c0 3.866 3.134 7 7 7h28c3.866 0 7-3.134 7-7V11c0-3.866-3.134-7-7-7H11zm2.086 9h7.938l5.636 8.01L33.5 13H36l-8.211 9.613L37.914 37H29.979l-6.541-9.293L15.5 37H13l9.309-10.897L13.086 13zm3.828 2 15.021 20H31.05l-14.136-20h.886z" />
    </svg>
  )
}

function About({ profile }) {
  const linkedIn = profile?.socialLinks?.linkedIn
  const twitter = profile?.socialLinks?.twitter
  return (
    <section id="aboutme_section">
      <div className="container my-5">
        <h2 className="pb-2 subhead__" data-aos="fade-right">About</h2>
        <div className="p-5 text-center bg-body-tertiary rounded-3">
          <img
            className="bi mt-4 mb-3"
            style={{ color: 'var(--bs-indigo)', borderRadius: '50%' }}
            width="200"
            height="200"
            src={profile?.profileImage || profileImage}
            alt={profile?.name || 'Portfolio owner'}
            data-aos="zoom-in"
          />
          <h1 className="text-body-emphasis magnet">{profile?.name || 'Abhirup Biswas'}</h1>
          <p className="col-lg-8 mx-auto fs-5 text-muted" data-aos="fade-up" data-aos-delay="100">
            {profile?.bio || "Hi! I'm Abhirup Biswas. I enjoy building projects and growing as a full-stack developer."}
          </p>
          <div className="d-inline-flex gap-2 mb-5">
            {linkedIn ? <a href={linkedIn} target="_blank" rel="noreferrer">
              <button className="d-inline-flex align-items-center btn btn-outline-primary btn-lg magnet" type="button">
                LinkedIn <LinkedInIcon />
              </button>
            </a> : null}
            {twitter ? <a href={twitter} target="_blank" rel="noreferrer">
              <button className="btn btn-outline-secondary btn-lg magnet" type="button">
                Twitter <TwitterIcon />
              </button>
            </a> : null}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
