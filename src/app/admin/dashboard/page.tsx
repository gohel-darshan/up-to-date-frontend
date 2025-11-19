'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  MoreHorizontal,
  AlertTriangle,
  Clock,
  CheckCircle,
  ArrowUpRight,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalProducts: number
  activeProducts: number
  lowStockProducts: number
  totalOrders: number
  pendingOrders: number
  totalRevenue: number
  monthlyRevenue: number
  userGrowth: number
  productGrowth: number
  orderGrowth: number
  revenueGrowth: number
}

interface RecentOrder {
  id: string
  orderNumber: string
  user: {
    firstName: string
    lastName: string
    email: string
  }
  totalAmount: number
  status: string
  createdAt: string
  orderItems: Array<{
    product: {
      name: string
      images: string[]
    }
  }>
}

interface TopProduct {
  id: string
  name: string
  price: number
  images: string[]
  stock: number
  totalSold: number
  orderCount: number
  revenue: number
}

interface CategoryStat {
  id: string
  name: string
  _count: {
    products: number
  }
}

interface OrderStatusStat {
  status: string
  _count: {
    status: number
  }
}

interface Alerts {
  lowStock: number
  pendingOrders: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalProducts: 0,
    activeProducts: 0,
    lowStockProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    userGrowth: 0,
    productGrowth: 0,
    orderGrowth: 0,
    revenueGrowth: 0
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([])
  const [orderStatusStats, setOrderStatusStats] = useState<OrderStatusStat[]>([])
  const [alerts, setAlerts] = useState<Alerts>({ lowStock: 0, pendingOrders: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await axios.get('http://localhost:5000/api/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = response.data
      setStats(data.stats)
      setRecentOrders(data.recentOrders)
      setTopProducts(data.topProducts)
      setCategoryStats(data.categoryStats)
      setOrderStatusStats(data.orderStatusStats)
      setAlerts(data.alerts)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to your admin dashboard</p>
        </div>
        <div className="flex space-x-2">
          <Link href="/admin/products">
            <Button variant="outline" size="sm">
              <Package className="h-4 w-4 mr-2" />
              Manage Products
            </Button>
          </Link>
          <Link href="/admin/orders">
            <Button size="sm">
              <ShoppingCart className="h-4 w-4 mr-2" />
              View Orders
            </Button>
          </Link>
        </div>
      </div>

      {/* Alerts */}
      {(alerts.lowStock > 0 || alerts.pendingOrders > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.lowStock > 0 && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>{alerts.lowStock}</strong> products are running low on stock.
                <Link href="/admin/products?filter=lowStock" className="ml-2 underline">
                  View Products
                </Link>
              </AlertDescription>
            </Alert>
          )}
          {alerts.pendingOrders > 0 && (
            <Alert className="border-blue-200 bg-blue-50">
              <Clock className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>{alerts.pendingOrders}</strong> orders are pending confirmation.
                <Link href="/admin/orders?status=PENDING" className="ml-2 underline">
                  View Orders
                </Link>
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/admin/users">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <div className="text-xs text-muted-foreground">
                <span className="text-green-600">{stats.activeUsers} active</span>
              </div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                {stats.userGrowth >= 0 ? (
                  <TrendingUp className="inline h-3 w-3 mr-1 text-green-600" />
                ) : (
                  <TrendingDown className="inline h-3 w-3 mr-1 text-red-600" />
                )}
                {Math.abs(stats.userGrowth)}% from last month
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/admin/products">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <div className="text-xs text-muted-foreground">
                <span className="text-green-600">{stats.activeProducts} active</span>
                {stats.lowStockProducts > 0 && (
                  <span className="text-orange-600 ml-2">{stats.lowStockProducts} low stock</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                {stats.productGrowth >= 0 ? (
                  <TrendingUp className="inline h-3 w-3 mr-1 text-green-600" />
                ) : (
                  <TrendingDown className="inline h-3 w-3 mr-1 text-red-600" />
                )}
                {Math.abs(stats.productGrowth)}% from last month
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/admin/orders">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <div className="text-xs text-muted-foreground">
                {stats.pendingOrders > 0 && (
                  <span className="text-orange-600">{stats.pendingOrders} pending</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                {stats.orderGrowth >= 0 ? (
                  <TrendingUp className="inline h-3 w-3 mr-1 text-green-600" />
                ) : (
                  <TrendingDown className="inline h-3 w-3 mr-1 text-red-600" />
                )}
                {Math.abs(stats.orderGrowth)}% from last month
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRevenue?.toLocaleString() || 0}</div>
            <div className="text-xs text-muted-foreground">
              <span className="text-blue-600">₹{stats.monthlyRevenue?.toLocaleString() || 0} this month</span>
            </div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              {stats.revenueGrowth >= 0 ? (
                <TrendingUp className="inline h-3 w-3 mr-1 text-green-600" />
              ) : (
                <TrendingDown className="inline h-3 w-3 mr-1 text-red-600" />
              )}
              {Math.abs(stats.revenueGrowth)}% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>Best selling products this month</CardDescription>
            </div>
            <Link href="/admin/products">
              <Button variant="outline" size="sm">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Package className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.totalSold} sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">₹{product.revenue?.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{product.orderCount} orders</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Order Status</CardTitle>
              <CardDescription>Current order distribution</CardDescription>
            </div>
            <Link href="/admin/orders">
              <Button variant="outline" size="sm">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Manage Orders
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orderStatusStats.map((stat) => (
                <div key={stat.status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(stat.status)}>
                      {stat.status}
                    </Badge>
                  </div>
                  <span className="font-medium">{stat._count.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders from your customers</CardDescription>
          </div>
          <Link href="/admin/orders">
            <Button variant="outline" size="sm">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              View All Orders
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.user.firstName} {order.user.lastName}</div>
                      <div className="text-sm text-gray-500">{order.user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {order.orderItems?.length || 0} item{(order.orderItems?.length || 0) > 1 ? 's' : ''}
                    </div>
                  </TableCell>
                  <TableCell>₹{order.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}