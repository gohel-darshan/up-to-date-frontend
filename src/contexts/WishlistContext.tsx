'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { useAuth } from './AuthContext'
import { toast } from 'sonner'

interface WishlistItem {
  id: string
  product: {
    id: string
    name: string
    slug: string
    price: number
    salePrice?: number
    images: string[]
    colors: string[]
    sizes: string[]
    stock: number
    isActive: boolean
    category: {
      name: string
    }
  }
  createdAt: string
}

interface WishlistContextType {
  wishlistItems: WishlistItem[]
  loading: boolean
  addToWishlist: (productId: string) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
  refreshWishlist: () => Promise<void>
  wishlistCount: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      refreshWishlist()
    } else {
      setWishlistItems([])
    }
  }, [isAuthenticated])

  const refreshWishlist = async () => {
    if (!isAuthenticated) return

    try {
      setLoading(true)
      const response = await api.getUserWishlist()
      if (response.data) {
        setWishlistItems(response.data.wishlist)
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist')
      return
    }

    try {
      const response = await api.addToWishlist(productId)
      if (response.data) {
        await refreshWishlist()
        toast.success('Added to wishlist')
      } else {
        toast.error(response.error || 'Failed to add to wishlist')
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      toast.error('Failed to add to wishlist')
    }
  }

  const removeFromWishlist = async (productId: string) => {
    if (!isAuthenticated) return

    try {
      const response = await api.removeFromWishlist(productId)
      if (response.data) {
        setWishlistItems(prev => prev.filter(item => item.product.id !== productId))
        toast.success('Removed from wishlist')
      } else {
        toast.error(response.error || 'Failed to remove from wishlist')
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      toast.error('Failed to remove from wishlist')
    }
  }

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some(item => item.product.id === productId)
  }

  const value: WishlistContextType = {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refreshWishlist,
    wishlistCount: wishlistItems.length
  }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}