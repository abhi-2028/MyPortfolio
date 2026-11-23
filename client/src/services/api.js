import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
})

let csrfToken = ''

export const getCsrfToken = async () => {
  const response = await api.get('/api/auth/csrf')
  csrfToken = response.data.data.csrfToken
  return csrfToken
}

api.interceptors.request.use(async (config) => {
  const method = config.method ? config.method.toLowerCase() : ''
  if (['post', 'put', 'patch', 'delete'].includes(method)) {
    if (!csrfToken) {
      try {
        await getCsrfToken()
      } catch {
        // Allow request to proceed and let backend handle auth/csrf validation
      }
    }
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken
    }
  }
  return config
})

export default api
