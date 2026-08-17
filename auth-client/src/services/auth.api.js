import axios from 'axios'
import { getToken } from '../utils/token'

export const api = axios.create({
  baseURL: 'http://localhost:3000'
})

api.interceptors.request.use((config) => {
  const token = getToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const register = async (data) => {
  const response = await api.post('/auth/register', data)
  return response.data
}

export const login = async (data) => {
  const response = await api.post('/auth/login', data)
  return response.data
}

export const getProfile = async () => {
  const response = await api.get('/auth/me')
  return response.data
}

export const updateProfile = async (data) => {
  const response = await api.put('/auth/me', data)
  return response.data
}