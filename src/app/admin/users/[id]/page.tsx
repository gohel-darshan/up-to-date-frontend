'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingCart,
  Star,
  Calendar,
  UserCheck,
  UserX
} from 'lucide-react'

interface UserDetails {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: string
  isActive: boolean
  createdAt: string
  addresses: Array<{
    id: string
    firstName: string
    lastName: string
    company?: string
    address1: string
    address2?: string
    city: string
    state: string
    postalCode: string
    country: string
    phone?: string
    isDefault: boolean
  }>
  orders: Array<{
    id: string
    orderNumber: string
    status: string
    totalAmount: number
    createdAt: string
    orderItems: Array<{
      product: {
        name: string
        images: string[]
      }
    }>
  }>
  reviews: Array<{
    id: string
    rating: number
    title?: string
    comment?: string
    createdAt: string
    product: {
      name: string
    }
  }>
  _count: {
    orders: number
    reviews: number
    wishlist: number
  }
}

export default function UserDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchUserDetails()
    }
  }, [params.id])

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await axios.get(`http://localhost:5000/api/admin/users/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      setUser(response.data)
    } catch (error) {
      console.error('Failed to fetch user details:', error)
      router.push('/admin/users')
    } finally {
      setLoading(false)
    }
  }

  const toggleUserStatus = async (isActive: boolean) => {
    if (!user) return
    
    try {
      const token = localStorage.getItem('adminToken')
      await axios.patch(`http://localhost:5000/api/admin/users/${user.id}/status`, 
        { isActive },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      setUser({ ...user, isActive })
    } catch (error) {
      console.error('Failed to update user status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800'
      case 'PROCESSING': return 'bg-purple-100 text-purple-800'
      case 'SHIPPED': return 'bg-indigo-100 text-indigo-800'
      case 'DELIVERED': return 'bg-green-100 text-green-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'bg-red-100 text-red-800'
      case 'ADMIN': return 'bg-purple-100 text-purple-800'
      case 'CUSTOMER': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">User not found</h2>
        <p className="text-gray-600 mt-2">The user you're looking for doesn't exist.</p>
        <Link href="/admin/users">
          <Button className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.firstName} {user.lastName}</h1>
              <p className="text-gray-600">Customer since {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className={getRoleColor(user.role)}>
            {user.role.replace('_', ' ')}
          </Badge>
          <div className="flex items-center space-x-2">
            <Switch
              checked={user.isActive}
              onCheckedChange={toggleUserStatus}
            />
            <span className="text-sm">
              {user.isActive ? (
                <span className="flex items-center text-green-600">
                  <UserCheck className="h-4 w-4 mr-1" />
                  Active
                </span>
              ) : (
                <span className="flex items-center text-red-600">
                  <UserX className="h-4 w-4 mr-1" />
                  Inactive
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Information */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-3 text-gray-500" />
                <span>{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-3 text-gray-500" />
                  <span>{user.phone}</span>
                </div>
              )}
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-3 text-gray-500" />
                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Orders</span>
                <span className="font-medium">{user._count.orders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Reviews Written</span>
                <span className="font-medium">{user._count.reviews}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Wishlist Items</span>
                <span className="font-medium">{user._count.wishlist}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Spent</span>
                <span className="font-medium">
                  ₹{user.orders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Addresses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Addresses ({user.addresses.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.addresses.map((address) => (
                  <div key={address.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">
                        {address.firstName} {address.lastName}
                      </span>
                      {address.isDefault && (
                        <Badge variant="secondary" className="text-xs">Default</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      {address.company && <p>{address.company}</p>}
                      <p>{address.address1}</p>
                      {address.address2 && <p>{address.address2}</p>}
                      <p>{address.city}, {address.state} {address.postalCode}</p>
                      <p>{address.country}</p>
                      {address.phone && <p>{address.phone}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders and Reviews */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Recent Orders ({user.orders.length})
                </CardTitle>
                <CardDescription>Customer's order history</CardDescription>
              </div>
              <Link href={`/admin/orders?user=${user.id}`}>
                <Button variant="outline" size="sm">
                  View All Orders
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.orders.slice(0, 10).map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>{order.orderItems.length} items</TableCell>
                      <TableCell>₹{order.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Reviews */}
          {user.reviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Reviews ({user.reviews.length})
                </CardTitle>
                <CardDescription>Customer's product reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.reviews.slice(0, 5).map((review) => (
                    <div key={review.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{review.rating}/5</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="font-medium text-sm mb-1">{review.product.name}</p>
                      {review.title && <p className="font-medium text-sm mb-1">{review.title}</p>}
                      {review.comment && <p className="text-sm text-gray-600">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}