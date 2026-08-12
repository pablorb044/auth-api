import { createContext, useEffect, useState } from 'react'
import { saveToken, getToken, removeToken } from '../utils/token'
import { getProfile } from '../services/auth.api'

export const AuthContext = createContext()


export function AuthProvider({ children }) {

  const [user, setUser] = useState(null)

  const [loading, setLoading] = useState(true)

  const [token, setToken] = useState(getToken())

  const login = async (userData, jwt) => {
    saveToken(jwt)
    setToken(jwt)
    setUser(userData)
    setLoading(false)
  }


  const logout = () => {
  setUser(null)
  setToken(null)
  removeToken()
  }

  useEffect(() => {
  const loadUser = async () => {

    if (!token) {
      setLoading(false)
      return
    }

    try {

      const user = await getProfile(token)

      setUser(user)

    } catch (error) {

      logout()

    } finally {

      setLoading(false)

    }
  }

  loadUser()

}, [token])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}