import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import { getTeam } from '../services/team.api'
import { getOrganization } from '../services/organization.api'
import {
  getMyTasks,
  getTeamTasks
} from '../services/task.api'

export function useDashboard() {
  const { user } = useAuth()

  const [team, setTeam] = useState(null)
  const [organization, setOrganization] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      if (!user.teamId) {
        setTeam(null)
        setOrganization(null)
        setTasks([])
        setError('')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')

        const teamData = await getTeam(user.teamId)
        setTeam(teamData)

        if (teamData.organizationId) {
          const organizationData = await getOrganization(
            teamData.organizationId
          )

          setOrganization(organizationData)
        } else {
          setOrganization(null)
        }

        const tasksData =
          user.role === 'manager'
            ? await getTeamTasks(user.teamId)
            : await getMyTasks()

        setTasks(tasksData)

      } catch (error) {
        setError(
          error.response?.data?.error ||
          'Error al cargar el dashboard'
        )
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [user, refreshKey])

  const refreshDashboard = () => {
    setRefreshKey((current) => current + 1)
  }

  return {
    user,
    team,
    organization,
    tasks,
    loading,
    error,
    refreshDashboard
  }
}