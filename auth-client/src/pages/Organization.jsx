import AppLayout from '../components/layout/AppLayout'
import Card from '../components/ui/Card'
import { useDashboard } from '../hooks/useDashboard'

function Organization() {
  const {
    organization,
    loading,
    error
  } = useDashboard()

  if (loading) {
    return (
      <AppLayout>
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
          <p className="text-sm text-[var(--text-secondary)]">
            Loading organization...
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
            Organization
          </p>

          <h1 className="mt-1 text-3xl font-semibold">
            {organization?.name || 'No organization'}
          </h1>
        </div>

        {error && (
          <Card>
            <p className="text-sm text-red-400">
              {error}
            </p>
          </Card>
        )}

        {!organization ? (
          <Card>
            <p className="text-[var(--text-secondary)]">
              You are not currently part of an organization.
            </p>
          </Card>
        ) : (
          <Card>
            <h2 className="text-xl font-semibold">
              {organization.name}
            </h2>

            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Organization overview coming soon.
            </p>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}

export default Organization