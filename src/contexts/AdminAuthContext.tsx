'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '@/lib/api'

interface AdminUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

interface AdminAuthContextType {
  adminUser: AdminUser | null
  loading: boolean
  adminLogin: (email: string, password: string) => Promise<boolean>
  adminLogout: () => void
  isAdminAuthenticated: boolean
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAdminAuthStatus()
  }, [])

  const checkAdminAuthStatus = async () => {
    try {
      const token = api.getAdminToken()
      if (token) {
        api.setToken(token, true)
        // Try to fetch admin dashboard stats to verify token
        const response = await api.getDashboardStats()
        if (response.data) {
          // Token is valid, set a mock admin user
          setAdminUser({
            id: 'admin',
            email: 'admin@uptodateselection.com',
            firstName: 'Admin',
            lastName: 'User',
            role: 'SUPER_ADMIN'
          })
        } else {
          api.clearToken(true)
        }
      }
    } catch (error) {
      console.error('Admin auth check failed:', error)
      api.clearToken(true)
    } finally {
      setLoading(false)
    }
  }

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      const response = await api.adminLogin(email, password)
      
      if (response.data) {
        const { token, user } = response.data
        api.setToken(token, true)
        setAdminUser(user)
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Admin login error:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const adminLogout = () => {
    api.clearToken(true)
    setAdminUser(null)
  }

  const value: AdminAuthContextType = {
    adminUser,
    loading,
    adminLogin,
    adminLogout,
    isAdminAuthenticated: !!adminUser
  }

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}