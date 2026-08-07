import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../services/auth.api'


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
    <div>

        <h1>Register</h1>

        {error && (
          <p>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>


        <input
          type="text"
          placeholder="Username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />


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
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />


        <button type="submit">
          Register
        </button>


      </form>


    </div>
  )
}


export default Register