import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

function Profile() {

  const { user, logout } = useAuth()

  const navigate = useNavigate()


  const handleLogout = () => {
    logout()
    navigate('/login')
  }


  return (
    <div>

      <h1>Profile Page</h1>

      <h2>{user?.username}</h2>

      <p>{user?.email}</p>

      <button onClick={handleLogout}>
        Logout
      </button>

    </div>
  )
}

export default Profile