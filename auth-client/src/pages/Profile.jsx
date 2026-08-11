import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import ProfileField from '../components/profile/ProfileField.jsx'
import AppLayout from '../components/layout/AppLayout'
import Card from '../components/ui/Card'

function Profile() {

  const { user, logout } = useAuth()

  const navigate = useNavigate()


  const handleLogout = () => {
    logout()
    navigate('/login')
  }

return (
  <AppLayout>
    <div className="flex min-h-[calc(100vh-8rem)] w-full items-center justify-center">
      <Card>
        <h1 className="mb-6 text-3xl font-semibold text-white">
          Profile Page
        </h1>

        <div className="space-y-4">
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
        </div>
      </Card>
    </div>
  </AppLayout>
)
}

export default Profile