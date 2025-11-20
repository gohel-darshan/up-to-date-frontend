import axios, { AxiosResponse } from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

interface ApiResponse<T> {
  data?: T
  message?: string
  error?: string
}

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    if (typeof window !== 'undefined') {
      // Prioritize user token for general API calls
      this.token = localStorage.getItem('userToken') || localStorage.getItem('adminToken')
    }
  }

  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
    data?: any
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const config = {
      method,
      url,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      ...(data && { data }),
    }

    try {
      const response: AxiosResponse<T> = await axios(config)
      return { data: response.data }
    } catch (error: any) {
      console.error('API Error:', error)
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        return { error: 'Backend server is not running. Please start the server on port 5000.' }
      }
      if (error.response?.status === 404) {
        return { error: 'Server not running. Please start the backend server.' }
      }
      return { error: error.response?.data?.message || error.message || 'Unknown error' }
    }
  }

  setToken(token: string, isAdmin = false) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (isAdmin) {
        localStorage.setItem('adminToken', token)
      } else {
        localStorage.setItem('userToken', token)
      }
    }
  }

  clearToken(isAdmin = false) {
    this.token = null
    if (typeof window !== 'undefined') {
      if (isAdmin) {
        localStorage.removeItem('adminToken')
      } else {
        localStorage.removeItem('userToken')
        localStorage.removeItem('adminToken')
      }
    }
  }

  getUserToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userToken')
    }
    return null
  }

  getAdminToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminToken')
    }
    return null
  }

  // User Auth endpoints
  async register(userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
  }) {
    return this.request<{ token: string; user: any }>('/auth/register', 'POST', userData)
  }

  async login(email: string, password: string) {
    return this.request<{ token: string; user: any }>('/auth/login', 'POST', { email, password })
  }

  async getProfile() {
    return this.request<{ user: any }>('/auth/profile')
  }

  async updateProfile(userData: {
    firstName?: string
    lastName?: string
    phone?: string
  }) {
    return this.request<{ user: any }>('/auth/profile', 'PUT', userData)
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request<{ message: string }>('/auth/change-password', 'PUT', {
      currentPassword,
      newPassword
    })
  }

  // Admin Auth endpoints
  async adminLogin(email: string, password: string) {
    return this.request<{ token: string; user: any }>('/auth/admin/login', 'POST', { email, password })
  }

  // Products endpoints
  async getProducts(params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
    minPrice?: number
    maxPrice?: number
    sortBy?: string
    sortOrder?: string
    featured?: boolean
  }) {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }
    
    return this.request<{
      products: any[]
      pagination: {
        total: number
        pages: number
        currentPage: number
        limit: number
      }
    }>(`/products?${queryParams}`)
  }

  async getProduct(slug: string) {
    return this.request<any>(`/products/${slug}`)
  }

  async createProduct(productData: any) {
    return this.request<any>('/products', 'POST', productData)
  }

  async updateProduct(id: string, productData: any) {
    return this.request<any>(`/products/${id}`, 'PUT', productData)
  }

  async deleteProduct(id: string) {
    return this.request<any>(`/products/${id}`, 'DELETE')
  }

  // Categories endpoints
  async getCategories() {
    return this.request<any[]>('/categories')
  }

  async createCategory(categoryData: {
    name: string
    description?: string
    image?: string
  }) {
    return this.request<any>('/categories', 'POST', categoryData)
  }

  async updateCategory(id: string, categoryData: any) {
    return this.request<any>(`/admin/categories/${id}`, 'PUT', categoryData)
  }

  async deleteCategory(id: string) {
    return this.request<any>(`/admin/categories/${id}`, 'DELETE')
  }

  // Admin endpoints
  async getDashboardStats() {
    return this.request<{
      stats: {
        totalUsers: number
        totalProducts: number
        totalOrders: number
        totalRevenue: number
      }
      recentOrders: any[]
      topProducts: any[]
      monthlyStats: any[]
    }>('/admin/dashboard/stats')
  }

  async getAdminProducts(params?: {
    page?: number
    limit?: number
    search?: string
    category?: string
    status?: string
  }) {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }
    
    return this.request<{
      products: any[]
      pagination: any
    }>(`/admin/products?${queryParams}`)
  }

  async getAdminOrders(params?: {
    page?: number
    limit?: number
    status?: string
    search?: string
  }) {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }
    
    return this.request<{
      orders: any[]
      pagination: any
    }>(`/admin/orders?${queryParams}`)
  }

  async updateOrderStatus(orderId: string, status: string) {
    return this.request<any>(`/admin/orders/${orderId}/status`, 'PATCH', { status })
  }

  async getAdminUsers(params?: {
    page?: number
    limit?: number
    search?: string
    role?: string
  }) {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }
    
    return this.request<{
      users: any[]
      pagination: any
    }>(`/admin/users?${queryParams}`)
  }

  async updateUserStatus(userId: string, isActive: boolean) {
    return this.request<any>(`/admin/users/${userId}/status`, 'PATCH', { isActive })
  }

  // User Profile endpoints
  async getUserAddresses() {
    return this.request<{ addresses: any[] }>('/user/addresses')
  }

  async addUserAddress(addressData: {
    firstName: string
    lastName: string
    company?: string
    address1: string
    address2?: string
    city: string
    state: string
    postalCode: string
    country?: string
    phone?: string
    isDefault?: boolean
  }) {
    return this.request<{ address: any }>('/user/addresses', 'POST', addressData)
  }

  async updateUserAddress(addressId: string, addressData: any) {
    return this.request<{ address: any }>(`/user/addresses/${addressId}`, 'PUT', addressData)
  }

  async deleteUserAddress(addressId: string) {
    return this.request<{ message: string }>(`/user/addresses/${addressId}`, 'DELETE')
  }

  async getUserOrders(params?: {
    page?: number
    limit?: number
  }) {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }
    
    return this.request<{
      orders: any[]
      pagination: any
    }>(`/user/orders?${queryParams}`)
  }

  async getUserOrder(orderId: string) {
    return this.request<{ order: any }>(`/user/orders/${orderId}`)
  }

  async addToWishlist(productId: string) {
    return this.request<{ message: string }>(`/user/wishlist/${productId}`, 'POST')
  }

  async removeFromWishlist(productId: string) {
    return this.request<{ message: string }>(`/user/wishlist/${productId}`, 'DELETE')
  }

  async getUserWishlist() {
    return this.request<{ wishlist: any[] }>('/user/wishlist')
  }

  // Order endpoints
  async createOrder(orderData: {
    items: Array<{
      productId: string
      quantity: number
      size: string
      color: string
    }>
    addressId: string
    paymentMethod: string
    notes?: string
  }) {
    return this.request<{ order: any }>('/orders', 'POST', orderData)
  }

  async getOrders(params?: {
    page?: number
    limit?: number
  }) {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }
    
    return this.request<{
      orders: any[]
      pagination: any
    }>(`/orders?${queryParams}`)
  }

  async getOrder(orderId: string) {
    return this.request<{ order: any }>(`/orders/${orderId}`)
  }

  async cancelOrder(orderId: string) {
    return this.request<{ message: string }>(`/orders/${orderId}/cancel`, 'PATCH')
  }
}

export const api = new ApiClient(API_BASE_URL)
export default api