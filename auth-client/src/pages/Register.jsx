import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../services/auth.api'


function Register() {

  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      await register({
        username,
        email,
        password
      })

      navigate('/login')

    } catch (error) {

      console.error(error)

    }

  }


  return (
    <div>

      <h1>Register</h1>


      <form onSubmit={handleSubmit}>


        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />


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
          Register
        </button>


      </form>


    </div>
  )
}


export default Register