import { api } from './auth.api'

export const createOrganization = async (data) => {
  const response = await api.post('/organizations', data)
  return response.data
}

export const getOrganization = async (organizationId) => {
  const response = await api.get(`/organizations/${organizationId}`)
  return response.data
}

export const getOrganizationMembers = async (organizationId) => {
  const response = await api.get(
    `/organizations/${organizationId}/members`
  )
  return response.data
}

export const updateOrganization = async (organizationId, data) => {
  const response = await api.patch(
    `/organizations/${organizationId}`,
    data
  )

  return response.data
}