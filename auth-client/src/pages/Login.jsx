import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { login as loginRequest, getProfile } from '../services/auth.api'


function Login() {

  const navigate = useNavigate()

  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')


  const handleSubmit = async (e) => {
    e.preventDefault()

    try {

      setError('')
      console.log({
        email,
        password
      })

      const data = await loginRequest({
        email,
        password
      })

      const user = await getProfile(data.token)

await login(user, data.token)

navigate('/profile')

    } catch (error) {

      setError(
        error.response?.data?.error ||
        'Error al iniciar sesión'
      )

    }
  }


  return (
    <div>

    <h1>Login</h1>

    {error && (
      <p>
        {error}
      </p>
    )}

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />


        <input
          type="password"
          placeholder="Password"
          autoComplete="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />


        <button type="submit">
          Login
        </button>

      </form>

    </div>
  )
}


export default Login