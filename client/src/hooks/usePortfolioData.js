import { useEffect, useState } from 'react'
import api from '../services/api'

const initialState = {
  profile: null,
  skills: [],
  projects: [],
  experience: [],
  certificates: [],
  education: [],
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
        result.status === 'fulfilled' ? result.value.data.data : null
      const profileResult = responses[0]
      const rejected = responses.filter((result) => result.status === 'rejected')

      setData({
        profile: getData(profileResult),
        skills: getData(responses[1]) || [],
        projects: getData(responses[2]) || [],
        experience: getData(responses[3]) || [],
        certificates: getData(responses[4]) || [],
        education: getData(responses[5]) || [],
      })
      setError(rejected.length ? 'Some portfolio data could not be loaded.' : '')
      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [])

  return { ...data, loading, error }
}
