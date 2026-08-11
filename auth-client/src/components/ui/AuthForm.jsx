import Card from './Card'

function AuthForm({ title, error, onSubmit, children }) {
  return (
    <Card>
      <div className="mx-auto w-full max-w-md">

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-white">
            {title}
          </h1>
        </div>

        {error && (
          <p className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <form
          onSubmit={onSubmit}
          className="space-y-4"
        >
          {children}
        </form>

      </div>
    </Card>
  )
}

export default AuthForm