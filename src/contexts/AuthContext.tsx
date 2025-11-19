'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '@/lib/api'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'ADMIN' | 'SUPER_ADMIN'
  isActive: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  adminLogin: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem('adminToken')
        const userData = localStorage.getItem('adminUser')
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData)
          // Only allow admin users
          if (parsedUser.role === 'ADMIN' || parsedUser.role === 'SUPER_ADMIN') {
            setUser(parsedUser)
            api.setToken(token)
          } else {
            localStorage.removeItem('adminToken')
            localStorage.removeItem('adminUser')
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
      } finally {
        setLoading(false)
        setMounted(true)
      }
    }

    initAuth()
  }, [])

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.adminLogin(email, password)
      
      if (response.error || !response.data) {
        return false
      }

      const { token, user: userData } = response.data
      
      // Only allow admin users
      if (userData.role !== 'ADMIN' && userData.role !== 'SUPER_ADMIN') {
        return false
      }
      
      setUser(userData)
      api.setToken(token)
      localStorage.setItem('adminToken', token)
      localStorage.setItem('adminUser', JSON.stringify(userData))
      
      // Force re-render
      window.dispatchEvent(new Event('auth-change'))
      
      return true
    } catch (error) {
      console.error('Admin login error:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    api.clearToken()
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    
    // Force re-render
    window.dispatchEvent(new Event('auth-change'))
  }

  const isAuthenticated = mounted && !!user
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'
  
  // Listen for auth changes
  useEffect(() => {
    const handleAuthChange = () => {
      const token = localStorage.getItem('adminToken')
      const userData = localStorage.getItem('adminUser')
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData)
          if (parsedUser.role === 'ADMIN' || parsedUser.role === 'SUPER_ADMIN') {
            setUser(parsedUser)
          } else {
            setUser(null)
          }
        } catch (error) {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    }
    
    window.addEventListener('auth-change', handleAuthChange)
    return () => window.removeEventListener('auth-change', handleAuthChange)
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      adminLogin,
      logout,
      isAuthenticated,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}