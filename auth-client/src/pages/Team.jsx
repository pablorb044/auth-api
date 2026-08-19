import AppLayout from '../components/layout/AppLayout'
import Card from '../components/ui/Card'
import { useDashboard } from '../hooks/useDashboard'
import { getTeamMembers, leaveTeam } from '../services/team.api'
import { useEffect, useState } from 'react'
import Button from '../components/ui/Button'

function Team() {
  const { user, team, loading: dashboardLoading, error: dashboardError } =
    useDashboard()

  const [members, setMembers] = useState([])
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [error, setError] = useState('')
  const [leaving, setLeaving] = useState(false)
  const [leaveError, setLeaveError] = useState('')

  useEffect(() => {
    if (!team?.id) {
    return
    }

    const loadMembers = async () => {
      try {
        setLoadingMembers(true)
        setError('')

        const data = await getTeamMembers(team.id)
        setMembers(data)
      } catch (error) {
        setError(
          error.response?.data?.error ||
          'Error al cargar los miembros del Team'
        )
      } finally {
        setLoadingMembers(false)
      }
    }

    loadMembers()
  }, [team?.id])

  const errorMessage = dashboardError || error

  if (dashboardLoading) {
    return (
      <AppLayout>
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
          <p className="text-sm text-[var(--text-secondary)]">
            Loading team...
          </p>
        </div>
      </AppLayout>
    )
  }

  const handleLeaveTeam = async () => {
  const confirmed = window.confirm(
    'Are you sure you want to leave this Team?'
  )

  if (!confirmed || leaving) {
    return
  }

  try {
    setLeaving(true)
    setLeaveError('')

    await leaveTeam(team.id)

    window.location.reload()
  } catch (error) {
    setLeaveError(
      error.response?.data?.error ||
      'Error leaving the Team'
    )
  } finally {
    setLeaving(false)
  }
}

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div>
          <p className="text-sm text-[var(--text-secondary)]">
            Team
          </p>

          <h1 className="mt-1 text-3xl font-semibold">
            {team?.name || 'No Team'}
          </h1>
        </div>

        {errorMessage && (
          <Card>
            <p className="text-sm text-red-400">
              {errorMessage}
            </p>
          </Card>
        )}

        {!team ? (
          <Card>
            <p className="text-[var(--text-secondary)]">
              You are not currently a member of a Team.
            </p>
          </Card>
        ) : (
          <>
            <Card>
              <div className="space-y-2">
                <p>
                  <span className="text-[var(--text-secondary)]">
                    Manager:
                  </span>{' '}
                  {team.manager?.username || 'Unknown'}
                </p>

                <p>
                  <span className="text-[var(--text-secondary)]">
                    Your role:
                  </span>{' '}
                  {user?.role}
                </p>
                {user?.role === 'user' && (
                <div className="pt-4">
                  <Button
                    onClick={handleLeaveTeam}
                    disabled={leaving}
                    className="
                      bg-red-500/80
                      hover:bg-red-500
                    "
                  >
                    {leaving ? 'Leaving...' : 'Leave Team'}
                  </Button>
                </div>  
              )}

              {leaveError && (
              <p className="mt-3 text-sm text-red-400">
                {leaveError}
              </p>
            )}
              </div>
            </Card>

            <Card>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    Members
                  </h2>

                  <p className="text-sm text-[var(--text-secondary)]">
                    {loadingMembers
                      ? 'Loading members...'
                      : `${members.length} member${members.length === 1 ? '' : 's'}`
                    }
                  </p>
                </div>

              <div className="space-y-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="
                      flex
                      items-center
                      justify-between
                      rounded-xl
                      border
                      border-white/10
                      bg-white/5
                      px-4
                      py-3
                      transition
                      hover:bg-white/10
                    "
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-gradient-to-br
                          from-violet-500
                          to-blue-500
                          text-sm
                          font-semibold
                          text-white
                        "
                      >
                        {member.username?.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <p className="font-medium text-[var(--text-primary)]">
                          {member.username}
                        </p>

                        <p className="text-sm text-[var(--text-secondary)]">
                          {member.email}
                        </p>
                      </div>
                    </div>

                    <span
                      className="
                        rounded-full
                        border
                        border-white/10
                        bg-white/5
                        px-3
                        py-1
                        text-xs
                        font-medium
                        text-[var(--text-secondary)]
                      "
                    >
                      {member.role}
                    </span>
                  </div>
                    ))}
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  )
}

export default Team