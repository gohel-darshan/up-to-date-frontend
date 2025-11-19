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
      this.token = localStorage.getItem('adminToken')
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

  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminToken', token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminToken')
    }
  }

  // Admin Auth endpoints
  async adminLogin(email: string, password: string) {
    return this.request<{ token: string; user: any }>('/auth/login', 'POST', { email, password })
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
}

export const api = new ApiClient(API_BASE_URL)
export default api