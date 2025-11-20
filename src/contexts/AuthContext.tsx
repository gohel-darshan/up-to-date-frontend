'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { toast } from 'sonner'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: string
  addresses?: any[]
  orders?: any[]
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
  }) => Promise<boolean>
  logout: () => void
  updateProfile: (userData: {
    firstName?: string
    lastName?: string
    phone?: string
  }) => Promise<boolean>
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>
  refreshProfile: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = api.getUserToken()
      if (token) {
        api.setToken(token)
        const response = await api.getProfile()
        if (response.data) {
          setUser(response.data.user)
        } else {
          // Invalid token, clear it
          api.clearToken()
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      api.clearToken()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      const response = await api.login(email, password)
      
      if (response.data) {
        const { token, user: userData } = response.data
        api.setToken(token)
        setUser(userData)
        toast.success('Login successful!')
        return true
      } else {
        toast.error(response.error || 'Login failed')
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed')
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
  }): Promise<boolean> => {
    try {
      setLoading(true)
      const response = await api.register(userData)
      
      if (response.data) {
        const { token, user: newUser } = response.data
        api.setToken(token)
        setUser(newUser)
        toast.success('Registration successful!')
        return true
      } else {
        toast.error(response.error || 'Registration failed')
        return false
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Registration failed')
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    api.clearToken()
    setUser(null)
    toast.success('Logged out successfully')
  }

  const updateProfile = async (userData: {
    firstName?: string
    lastName?: string
    phone?: string
  }): Promise<boolean> => {
    try {
      const response = await api.updateProfile(userData)
      
      if (response.data) {
        setUser(response.data.user)
        toast.success('Profile updated successfully!')
        return true
      } else {
        toast.error(response.error || 'Profile update failed')
        return false
      }
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error('Profile update failed')
      return false
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const response = await api.changePassword(currentPassword, newPassword)
      
      if (response.data) {
        toast.success('Password changed successfully!')
        return true
      } else {
        toast.error(response.error || 'Password change failed')
        return false
      }
    } catch (error) {
      console.error('Password change error:', error)
      toast.error('Password change failed')
      return false
    }
  }

  const refreshProfile = async () => {
    try {
      const response = await api.getProfile()
      if (response.data) {
        setUser(response.data.user)
      }
    } catch (error) {
      console.error('Profile refresh error:', error)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshProfile,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}