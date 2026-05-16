import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (stored && token) {
      setUser(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (credentials) => {
    const res = await authApi.login(credentials)
    const data = res.data
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify({
      userId: data.userId,
      username: data.username,
      email: data.email,
      role: data.role
    }))
    setUser({ userId: data.userId, username: data.username, email: data.email, role: data.role })
    navigate('/dashboard')
    return data
  }, [navigate])

  const register = useCallback(async (data) => {
    const res = await authApi.register(data)
    const result = res.data
    localStorage.setItem('token', result.token)
    localStorage.setItem('user', JSON.stringify({
      userId: result.userId,
      username: result.username,
      email: result.email,
      role: result.role
    }))
    setUser({ userId: result.userId, username: result.username, email: result.email, role: result.role })
    navigate('/dashboard')
    return result
  }, [navigate])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }, [navigate])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
