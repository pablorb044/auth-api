import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Page from '../components/ui/Page'
import Card from '../components/ui/Card'
import ProfileField from '../components/profile/ProfileField'

function Profile() {

  const { user, logout } = useAuth()
  console.log(user)

  const navigate = useNavigate()


  const handleLogout = () => {
    logout()
    navigate('/login')
  }


  return (
  <Page>
    <Card>
      <h1>Profile Page</h1>
      <ProfileField
        label="Username"
        value={user?.username}
      />

      <ProfileField
        label="Email"
        value={user?.email}
      />

      <ProfileField
        label="Role"
        value={user?.role}
      />

      <Button onClick={handleLogout}>
        Logout
      </Button>
    </Card>
  </Page>
)
}

export default Profile