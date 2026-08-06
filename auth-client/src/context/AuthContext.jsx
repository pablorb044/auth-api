import { createContext, useEffect, useState } from 'react'
import { saveToken, getToken, removeToken } from '../utils/token'
import { getProfile } from '../services/auth.api'

export const AuthContext = createContext()


export function AuthProvider({ children }) {

  const [user, setUser] = useState(null)

  const [token, setToken] = useState(getToken())

  const login = (userData, jwt) => {
    setUser(userData)
    setToken(jwt)
    saveToken(jwt)
  }


  const logout = () => {
  setUser(null)
  setToken(null)
  removeToken()
  }

  useEffect(() => {
  const loadUser = async () => {
    if (!token) return

    try {
      const user = await getProfile(token)
      setUser(user)
    } catch (error) {
      logout()
    }
  }
  loadUser()
}, [])


  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}