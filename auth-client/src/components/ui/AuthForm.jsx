function AuthForm({ title, error, onSubmit, children }) {
  return (
    <>
      <h1>{title}</h1>

      {error && <p>{error}</p>}

      <form onSubmit={onSubmit}>
        {children}
      </form>
    </>
  )
}

export default AuthForm