import { api } from './auth.api'

export const getTeam = async (teamId) => {
  const response = await api.get(`/teams/${teamId}`)
  return response.data
}

export const getTeamMembers = async (teamId) => {
  const response = await api.get(`/teams/${teamId}/members`)
  return response.data
}

export const leaveTeam = async (teamId) => {
  const response = await api.delete(`/teams/${teamId}/members/me`)
  return response.data
}

export const removeTeamMember = async (teamId, userId) => {
  const response = await api.delete(
    `/teams/${teamId}/members/${userId}`
  )

  return response.data
}

export const updateTeamMemberRole = async (teamId, userId, role) => {
  const response = await api.patch(
    `/teams/${teamId}/members/${userId}/role`,
    { role }
  )

  return response.data
}

export const updateTeam = async (teamId, data) => {
  const response = await api.patch(
    `/teams/${teamId}`,
    data
  )

  return response.data
}

export const deleteTeam = async (teamId) => {
  const response = await api.delete(`/teams/${teamId}`)
  return response.data
}