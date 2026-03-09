import { createContext, useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../services/api'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const { data } = await api.get('/auth/me')
      setUser(data)
    } catch (error) {
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      setUser(data)
      toast.success('Welcome back!')
      navigate('/dashboard')
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
      return false
    }
  }

  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData)
      localStorage.setItem('token', data.token)
      setUser(data)
      toast.success('Account created successfully!')
      navigate('/dashboard')
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    toast.success('Logged out successfully')
    navigate('/')
  }

  const updateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }))
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loading,
      updateUser,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
