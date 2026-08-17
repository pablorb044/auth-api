import AppLayout from '../components/layout/AppLayout'
import Card from '../components/ui/Card'
import { useDashboard } from '../hooks/useDashboard'

function Dashboard() {
  const {
    user,
    team,
    organization,
    loading,
    error
  } = useDashboard()

  if (loading) {
    return (
      <AppLayout>
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
          <p className="text-sm text-[var(--text-secondary)]">
            Loading dashboard...
          </p>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-6xl space-y-6">

        <div>
          <p className="text-sm text-[var(--text-secondary)]">
            Welcome back
          </p>

          <h1 className="mt-1 text-3xl font-semibold">
            {user?.username}
          </h1>
        </div>

        {error && (
          <Card>
            <p className="text-sm text-red-400">
              {error}
            </p>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2">

          <Card>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">
                  Account
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  Your Profile
                </h2>
              </div>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-[var(--text-secondary)]">
                    Username:
                  </span>{' '}
                  {user?.username}
                </p>

                <p>
                  <span className="text-[var(--text-secondary)]">
                    Email:
                  </span>{' '}
                  {user?.email}
                </p>

                <p>
                  <span className="text-[var(--text-secondary)]">
                    Role:
                  </span>{' '}
                  {user?.role}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">
                  Organization
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  {organization?.name || 'No organization'}
                </h2>
              </div>

              <p className="text-sm text-[var(--text-secondary)]">
                {organization
                  ? 'You are currently part of this organization.'
                  : 'You are not currently part of an organization.'
                }
              </p>
            </div>
          </Card>

          <Card>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">
                  Team
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  {team?.name || 'No Team'}
                </h2>
              </div>

              {team ? (
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-[var(--text-secondary)]">
                      Manager:
                    </span>{' '}
                    {team.manager?.username || 'Unknown'}
                  </p>

                  <p>
                    <span className="text-[var(--text-secondary)]">
                      Team ID:
                    </span>{' '}
                    {team.id}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-[var(--text-secondary)]">
                  You are not currently a member of a Team.
                </p>
              )}
            </div>
          </Card>

        </div>
      </div>
    </AppLayout>
  )
}

export default Dashboard