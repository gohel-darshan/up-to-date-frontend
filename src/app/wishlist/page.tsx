'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import ProtectedRoute from '@/components/ProtectedRoute'

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

export default function Wishlist() {
  const { isAuthenticated } = useAuth()
  const { wishlistItems, loading, removeFromWishlist: contextRemoveFromWishlist } = useWishlist()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  const addToCart = (product: any) => {
    // Add to cart logic here
    toast.success(`${product.name} added to cart`)
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-48"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-96 bg-muted rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">My Wishlist</h1>
            <Badge variant="secondary">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
            </Badge>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">
                Save items you love to your wishlist and shop them later.
              </p>
              <Button asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square relative overflow-hidden">
                    <Link href={`/products/${item.product.slug}`}>
                      <img
                        src={item.product.images[0] || '/placeholder.svg'}
                        alt={item.product.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </Link>
                    
                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 space-y-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-white/80 backdrop-blur-sm hover:bg-white"
                        onClick={() => contextRemoveFromWishlist(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>

                    {/* Sale Badge */}
                    {item.product.salePrice && (
                      <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                        Sale
                      </Badge>
                    )}

                    {/* Stock Status */}
                    {item.product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="destructive">Out of Stock</Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4 space-y-3">
                    <Link href={`/products/${item.product.slug}`}>
                      <h3 className="font-semibold hover:text-primary transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>
                    
                    <p className="text-sm text-muted-foreground">
                      {item.product.category?.name || 'Product'} Fabric
                    </p>
                    
                    <div className="flex items-center justify-between">
                      {item.product.salePrice ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold">₹{item.product.salePrice}</span>
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{item.product.price}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold">₹{item.product.price}</span>
                      )}
                    </div>

                    {/* Colors */}
                    {item.product.colors && item.product.colors.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs text-muted-foreground">Colors:</span>
                        <div className="flex space-x-1">
                          {item.product.colors.slice(0, 4).map((color, index) => (
                            <div
                              key={index}
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                          {item.product.colors.length > 4 && (
                            <span className="text-xs text-muted-foreground">+{item.product.colors.length - 4}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Sizes */}
                    {item.product.sizes && item.product.sizes.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs text-muted-foreground">Sizes:</span>
                        <div className="flex flex-wrap gap-1">
                          {item.product.sizes.slice(0, 3).map((size, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {size}
                            </Badge>
                          ))}
                          {item.product.sizes.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{item.product.sizes.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2 pt-2">
                      <Button
                        className="flex-1"
                        onClick={() => addToCart(item.product)}
                        disabled={item.product.stock === 0 || !item.product.isActive}
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => contextRemoveFromWishlist(item.product.id)}
                      >
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}