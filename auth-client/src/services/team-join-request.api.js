import { api } from './auth.api'

export const createTeamJoinRequest = async (teamId) => {
  const response = await api.post('/team-join-requests', {
    teamId
  })

  return response.data
}

export const getPendingTeamJoinRequests = async () => {
  const response = await api.get('/team-join-requests')
  return response.data
}

export const approveTeamJoinRequest = async (requestId) => {
  const response = await api.patch(
    `/team-join-requests/${requestId}/approve`
  )

  return response.data
}

export const rejectTeamJoinRequest = async (requestId) => {
  const response = await api.patch(
    `/team-join-requests/${requestId}/reject`
  )

  return response.data
}