import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuthStore } from '../hooks/useAuthStore'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const { user, token, isAuthenticated, login, logout, updateUser } = useAuthStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      if (token && !user) {
        try {
          const response = await api.get('/auth/me')
          updateUser(response.data.user)
        } catch (error) {
          console.error('Auth initialization error:', error)
          logout()
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [token, user, updateUser, logout])

  const handleLogin = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials)
      const { user, token } = response.data
      login(user, token)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      }
    }
  }

  const handleRegister = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      const { user, token } = response.data
      login(user, token)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed',
      }
    }
  }

  const handleLogout = async () => {
    try {
      if (token) {
        await api.post('/auth/logout')
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      logout()
    }
  }

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}