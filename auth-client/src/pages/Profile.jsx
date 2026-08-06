import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

function Profile() {
  const { user } = useContext(AuthContext)

  return (
    <>
      <h1>Profile Page</h1>

      <pre>
        {JSON.stringify(user, null, 2)}
      </pre>
    </>
  )
}

export default Profile