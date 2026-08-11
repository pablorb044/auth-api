import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { login as loginRequest, getProfile } from '../services/auth.api'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import AuthForm from '../components/ui/AuthForm'
import AuthLayout from '../components/layout/AuthLayout'

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
    <AuthLayout>
      <AuthForm
        title="Login"
        error={error}
        onSubmit={handleSubmit}
      >
        <Input
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit">
          Login
        </Button>
      </AuthForm>
    </AuthLayout>
  )
}

export default Login
