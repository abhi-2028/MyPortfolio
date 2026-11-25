import { useEffect, useState } from 'react'
import api from '../services/api'

const defaultProfile = {
  name: 'Abhirup Biswas',
  headline: 'Software Engineer • Problem Solver • Lifelong Learner',
  bio: "I'm Abhirup Biswas, a 3rd-year Computer Engineering student at ICFAI University, Dehradun. I have a strong interest in problem-solving and software development, with a focus on mastering Data Structures and Algorithms in Java.",
  profileImage: '/assets/myImg.jpeg',
  location: 'Dehradun, India',
  socialLinks: {
    linkedIn: 'https://www.linkedin.com/in/abhirup-biswas-260167322/',
    twitter: 'https://x.com/AbhirupCode',
  },
  resumeUrl: '/assets/Resume.pdf',
}

const defaultSkills = [
  { name: 'Java', category: 'Programming', icon: 'java', proficiency: 90 },
  { name: 'JavaScript', category: 'Frontend', icon: 'javascript', proficiency: 88 },
  { name: 'React', category: 'Frontend', icon: 'react', proficiency: 85 },
  { name: 'Node.js', category: 'Backend', icon: 'node', proficiency: 82 },
  { name: 'Express', category: 'Backend', icon: 'express', proficiency: 80 },
  { name: 'MongoDB', category: 'Database', icon: 'mongodb', proficiency: 80 },
  { name: 'HTML 5', category: 'Frontend', icon: 'html', proficiency: 95 },
  { name: 'CSS 3', category: 'Frontend', icon: 'css', proficiency: 92 },
  { name: 'Bootstrap 5', category: 'Frontend', icon: 'bootstrap', proficiency: 88 },
  { name: 'Tailwind CSS', category: 'Frontend', icon: 'tailwind', proficiency: 85 },
  { name: 'Git & GitHub', category: 'Tools', icon: 'git', proficiency: 86 },
  { name: 'MySQL', category: 'Database', icon: 'mysql', proficiency: 78 },
]

const defaultProjects = [
  {
    title: 'Spotify Clone - Music Player',
    slug: 'spotify-clone-music-player',
    image: '/assets/Project2Spotify.png',
    liveUrl: 'https://abhi-2028.github.io/Spotify-Clone-HTML-CSS-/',
    category: 'Web Application',
    featured: true,
    description: 'A responsive music player clone featuring playlist browsing, audio playback controls, and modern sleek UI inspired by Spotify.',
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
  },
  {
    title: "TinDog - Dog's Love Life",
    slug: 'tindog-dogs-love-life',
    image: '/assets/Project1Tindog.png',
    liveUrl: 'https://abhi-2028.github.io/TinDog/',
    category: 'Landing Page',
    featured: true,
    description: 'A charming, high-converting dating website concept for dogs built with Bootstrap 5, featuring responsive grids, reviews carousel, and pricing cards.',
    technologies: ['HTML5', 'Bootstrap 5', 'CSS3'],
  },
  {
    title: 'Aesthetic Calculator',
    slug: 'aeshtetic-calculator',
    image: '/assets/aesthetic calculator.png',
    liveUrl: 'https://aesthetic-calculator-eta.vercel.app/',
    category: 'Utility Tool',
    featured: true,
    description: 'A minimalist, beautifully animated online calculator with smooth button physics, dark/light aesthetics, and keyboard calculation support.',
    technologies: ['React', 'CSS3', 'Vite'],
  },
  {
    title: 'Simon Says Game',
    slug: 'simon-says-game',
    image: '/assets/SimonSays.png',
    liveUrl: 'https://simon-game-xi-beryl.vercel.app',
    category: 'Interactive Game',
    featured: true,
    description: 'Classic memory pattern game with interactive audio cues, score tracking, responsive button flashes, and progressive difficulty stages.',
    technologies: ['JavaScript', 'DOM', 'CSS3'],
  },
]

const defaultCertificates = [
  {
    _id: 'cert-1',
    title: 'DSA with Java',
    issuingOrganization: 'Apna College',
    issueDate: '2025-07-01',
    credentialUrl: '/assets/certificate-sigma-70-683b0542b486128d080d455d (2).pdf',
  },
]

const defaultEducation = [
  {
    _id: 'edu-1',
    institution: 'ICFAI University, Dehradun',
    degree: 'B.Tech in Computer Science & Engineering',
    fieldOfStudy: 'Computer Engineering',
    startDate: '2023-08-01',
    endDate: '2027-06-30',
    description: '3rd-year Computer Engineering student focusing on core Data Structures, Algorithms, Software Engineering principles, and full-stack development.',
  },
]

const initialState = {
  profile: defaultProfile,
  skills: defaultSkills,
  projects: defaultProjects,
  experience: [],
  certificates: defaultCertificates,
  education: defaultEducation,
}

export const usePortfolioData = () => {
  const [data, setData] = useState(initialState)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    Promise.allSettled([
      api.get('/api/profile'),
      api.get('/api/skills'),
      api.get('/api/projects'),
      api.get('/api/experience'),
      api.get('/api/certificates'),
      api.get('/api/education'),
    ]).then((responses) => {
      if (!active) return

      const getData = (result) =>
        result.status === 'fulfilled' && result.value?.data?.data ? result.value.data.data : null
      const profileResult = responses[0]
      const rejected = responses.filter((result) => result.status === 'rejected')

      const fetchedProfile = getData(profileResult)
      const fetchedSkills = getData(responses[1])
      const fetchedProjects = getData(responses[2])
      const fetchedExperience = getData(responses[3])
      const fetchedCertificates = getData(responses[4])
      const fetchedEducation = getData(responses[5])

      setData({
        profile: fetchedProfile || defaultProfile,
        skills: (fetchedSkills && fetchedSkills.length > 0) ? fetchedSkills : defaultSkills,
        projects: (fetchedProjects && fetchedProjects.length > 0) ? fetchedProjects : defaultProjects,
        experience: fetchedExperience || [],
        certificates: (fetchedCertificates && fetchedCertificates.length > 0) ? fetchedCertificates : defaultCertificates,
        education: (fetchedEducation && fetchedEducation.length > 0) ? fetchedEducation : defaultEducation,
      })
      if (rejected.length === responses.length) {
        setError('')
      }
      setLoading(false)
    }).catch(() => {
      if (active) setLoading(false)
    })

    return () => {
      active = false
    }
  }, [])

  return { ...data, loading, error }
}
