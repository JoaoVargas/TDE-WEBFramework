import axios from 'axios'

const TOKEN_KEY = 'auth-token'

const apiUrl: string = String(import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api')

const api = axios.create({
  baseURL: apiUrl,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
