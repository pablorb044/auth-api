import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../services/auth.api'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import AuthForm from '../components/ui/AuthForm'
import AuthLayout from '../components/layout/AuthLayout'

function Register() {

  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')


  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      setError('')

      await register({
        username,
        email,
        password
      })

      navigate('/login')

    } catch (error) {

      setError(
        error.response?.data?.error || 
        'Error al registrar usuario'
      )

    }

  }


  return (
    <AuthLayout>
      <AuthForm
        title="Register"
        error={error}
        onSubmit={handleSubmit}
      >
          <Input
            type="text"
            placeholder="Username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />


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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />


          <Button type="submit">
            Register
          </Button>

      </AuthForm>
    </AuthLayout>
  )
}


export default Register