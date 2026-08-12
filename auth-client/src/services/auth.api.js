import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3000'
})

export const register = async (data) => {
  const response = await api.post('/auth/register', data)
  return response.data
}

export const login = async (data) => {
  const response = await api.post('/auth/login', data)
  return response.data
}

export const getProfile = async (token) => {
  const response = await api.get('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}

export const updateProfile = async (token, data) => {
  const response = await api.put('/auth/me', data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}