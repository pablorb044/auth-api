import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginRequest } from '../services/auth.api'
import { useAuth } from '../hooks/useAuth'

function Login() {

  const navigate = useNavigate()

  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


  const handleSubmit = async (e) => {
    e.preventDefault()

    try {

      const data = await loginRequest({
        email,
        password
      })

      login(null, data.token)

      navigate('/profile')

    } catch (error) {

      console.error(error)

    }
  }


  return (
    <div>

      <h1>Login</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />


        <input
          type="password"
          placeholder="Password"
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