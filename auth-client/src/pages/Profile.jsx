import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import ProfileField from '../components/profile/ProfileField.jsx'
import AppLayout from '../components/layout/AppLayout'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import { updateProfile } from '../services/auth.api'

function Profile() {

  const { user, token, logout, updateUser } = useAuth()

  const [editing, setEditing] = useState(false)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [username, setUsername] = useState(user?.username || '')
  const [email, setEmail] = useState(user?.email || '')

  const navigate = useNavigate()


  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    if (saving) return

    try {
      setError('')
      setSaving(true)

      const updatedUser = await updateProfile(token, {
        username,
        email
      })

      updateUser(updatedUser)
      setEditing(false)
    } catch (error) {
      setError(
        error.response?.data?.error ||
        'Error al actualizar el perfil'
      )
    } finally {
      setSaving(false)
    }
  }

return (
  <AppLayout>
    <div className="flex min-h-[calc(100vh-8rem)] w-full items-center justify-center">
      <Card>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-white">
            {editing ? 'Edit Profile' : 'Profile Page'}
          </h1>

          {!editing && (
            <Button
              onClick={() => {
                setUsername(user?.username || '')
                setEmail(user?.email || '')
                setEditing(true)
              }}
              className="w-auto"
            >
              Edit
            </Button>
          )}
        </div>

                  <form
            onSubmit={handleUpdate}
            className="space-y-4"
          >
          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}
          
          {editing ? (
            <>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </>
          ) : (
            <>
              <ProfileField
                label="Username"
                value={user?.username}
              />

              <ProfileField
                label="Email"
                value={user?.email}
              />
            </>
          )}

          <ProfileField
            label="Role"
            value={user?.role}
          />

          {editing ? (
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setUsername(user?.username || '')
                  setEmail(user?.email || '')
                  setEditing(false)
                }}
                className="w-auto bg-white/10 hover:bg-white/20"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={saving}
                className="w-auto"
              >
                {saving ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          ) : (
            <Button onClick={handleLogout}>
              Logout
            </Button>
          )}
        </form>
      </Card>
    </div>
  </AppLayout>
)
}

export default Profile