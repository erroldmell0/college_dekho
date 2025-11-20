import React, { createContext, useContext, useEffect, useState } from 'react'
import { request } from '../utils/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // initialize from localStorage token
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    // try to fetch simple profile (we have token but no profile endpoint yet)
    // for now, decode minimal info stored in localStorage if available
    const storedUser = localStorage.getItem('user')
    if (storedUser) setUser(JSON.parse(storedUser))
    setLoading(false)
  }, [])

  const login = (data) => {
    if (data.token) localStorage.setItem('token', data.token)
    if (data.name) {
      const u = { id: data.id, name: data.name, email: data.email }
      localStorage.setItem('user', JSON.stringify(u))
      setUser(u)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

export default AuthContext
