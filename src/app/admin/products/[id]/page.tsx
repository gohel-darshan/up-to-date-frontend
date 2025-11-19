'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
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
  Package,
  Star,
  ShoppingCart,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  Users,
  Heart
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

interface ProductDetails {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  salePrice?: number
  sku: string
  stock: number
  images: string[]
  colors: string[]
  sizes: string[]
  fabric?: string
  pattern?: string
  occasion?: string
  featured: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
  category: {
    id: string
    name: string
    slug: string
  }
  orderItems: Array<{
    id: string
    quantity: number
    price: number
    size: string
    color: string
    order: {
      orderNumber: string
      createdAt: string
      user: {
        firstName: string
        lastName: string
      }
    }
  }>
  reviews: Array<{
    id: string
    rating: number
    title?: string
    comment?: string
    createdAt: string
    user: {
      firstName: string
      lastName: string
    }
  }>
  _count: {
    orderItems: number
    reviews: number
    wishlistItems: number
  }
  avgRating: number
}

export default function ProductDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<ProductDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    price: '',
    salePrice: '',
    sku: '',
    stock: '',
    categoryId: '',
    images: '',
    colors: '',
    sizes: '',
    fabric: '',
    pattern: '',
    occasion: '',
    isActive: true,
    featured: false
  })
  const [categories, setCategories] = useState<Array<{id: string, name: string}>>([])

  useEffect(() => {
    if (params.id) {
      fetchProductDetails()
      fetchCategories()
    }
  }, [params.id])

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await axios.get('http://localhost:5000/api/categories', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setCategories(response.data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchProductDetails = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await axios.get(`http://localhost:5000/api/admin/products/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = response.data
      setProduct(data)
      setEditFormData({
        name: data.name,
        description: data.description || '',
        price: data.price.toString(),
        salePrice: data.salePrice?.toString() || '',
        sku: data.sku,
        stock: data.stock.toString(),
        categoryId: data.category.id,
        images: data.images.join(', '),
        colors: data.colors.join(', '),
        sizes: data.sizes.join(', '),
        fabric: data.fabric || '',
        pattern: data.pattern || '',
        occasion: data.occasion || '',
        isActive: data.isActive,
        featured: data.featured
      })
    } catch (error) {
      console.error('Failed to fetch product details:', error)
      router.push('/admin/products')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
        <p className="text-gray-600 mt-2">The product you're looking for doesn't exist.</p>
        <Link href="/admin/products">
          <Button className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>
      </div>
    )
  }

  const totalRevenue = product.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const totalSold = product.orderItems.reduce((sum, item) => sum + item.quantity, 0)

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('adminToken')
      const updateData = {
        ...editFormData,
        price: parseFloat(editFormData.price),
        salePrice: editFormData.salePrice ? parseFloat(editFormData.salePrice) : null,
        stock: parseInt(editFormData.stock) || 0,
        images: editFormData.images ? editFormData.images.split(',').map(img => img.trim()) : [],
        colors: editFormData.colors ? editFormData.colors.split(',').map(color => color.trim()) : [],
        sizes: editFormData.sizes ? editFormData.sizes.split(',').map(size => size.trim()) : []
      }

      await axios.put(`http://localhost:5000/api/products/${product?.id}`, updateData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      fetchProductDetails()
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error('Failed to update product:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/products">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600">SKU: {product.sku} • Category: {product.category.name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant={product.isActive ? 'default' : 'secondary'}>
            {product.isActive ? 'Active' : 'Inactive'}
          </Badge>
          {product.featured && (
            <Badge variant="outline">Featured</Badge>
          )}
          <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Product
          </Button>
          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Images and Details */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Images */}
                <div>
                  <h4 className="font-medium mb-3">Product Images</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {product.images.slice(0, 4).map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Pricing</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Regular Price:</span>
                        <span className="font-medium">₹{product.price.toLocaleString()}</span>
                      </div>
                      {product.salePrice && (
                        <div className="flex justify-between">
                          <span>Sale Price:</span>
                          <span className="font-medium text-green-600">₹{product.salePrice.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Inventory</h4>
                    <div className="flex justify-between">
                      <span>Stock:</span>
                      <Badge variant={product.stock > 10 ? 'default' : product.stock > 0 ? 'secondary' : 'destructive'}>
                        {product.stock} units
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Variants</h4>
                    <div className="space-y-2">
                      {product.colors.length > 0 && (
                        <div>
                          <span className="text-sm text-gray-600">Colors:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {product.colors.map((color) => (
                              <Badge key={color} variant="outline" className="text-xs">
                                {color}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {product.sizes.length > 0 && (
                        <div>
                          <span className="text-sm text-gray-600">Sizes:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {product.sizes.map((size) => (
                              <Badge key={size} variant="outline" className="text-xs">
                                {size}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {(product.fabric || product.pattern || product.occasion) && (
                    <div>
                      <h4 className="font-medium mb-2">Attributes</h4>
                      <div className="space-y-1 text-sm">
                        {product.fabric && <p><span className="text-gray-600">Fabric:</span> {product.fabric}</p>}
                        {product.pattern && <p><span className="text-gray-600">Pattern:</span> {product.pattern}</p>}
                        {product.occasion && <p><span className="text-gray-600">Occasion:</span> {product.occasion}</p>}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {product.description && (
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-gray-600 text-sm">{product.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders containing this product</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Variant</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product.orderItems.slice(0, 10).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <Link href={`/admin/orders/${item.order.orderNumber}`} className="hover:underline">
                          {item.order.orderNumber}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {item.order.user.firstName} {item.order.user.lastName}
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{item.size}</div>
                          <div className="text-gray-500">{item.color}</div>
                        </div>
                      </TableCell>
                      <TableCell>₹{item.price.toLocaleString()}</TableCell>
                      <TableCell>{new Date(item.order.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Statistics and Reviews */}
        <div className="space-y-6">
          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <ShoppingCart className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">Total Sold</span>
                </div>
                <span className="font-medium">{totalSold} units</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Package className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">Orders</span>
                </div>
                <span className="font-medium">{product._count.orderItems}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">Reviews</span>
                </div>
                <span className="font-medium">{product._count.reviews}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">Wishlisted</span>
                </div>
                <span className="font-medium">{product._count.wishlistItems}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Revenue</span>
                <span className="font-bold text-lg">₹{totalRevenue.toLocaleString()}</span>
              </div>
              {product.avgRating > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Rating</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium">{product.avgRating.toFixed(1)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Reviews */}
          {product.reviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Customer Reviews
                </CardTitle>
                <CardDescription>{product.reviews.length} reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {product.reviews.slice(0, 5).map((review) => (
                    <div key={review.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-medium">{review.rating}/5</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm font-medium mb-1">
                        {review.user.firstName} {review.user.lastName}
                      </p>
                      {review.title && <p className="text-sm font-medium mb-1">{review.title}</p>}
                      {review.comment && <p className="text-xs text-gray-600">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View on Store
              </Button>
              <Button className="w-full" variant="outline">
                <Package className="h-4 w-4 mr-2" />
                Update Stock
              </Button>
              <Button className="w-full" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                View Customers
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Product Name *</Label>
                <Input
                  id="edit-name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-sku">SKU *</Label>
                <Input
                  id="edit-sku"
                  value={editFormData.sku}
                  onChange={(e) => setEditFormData({...editFormData, sku: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-price">Price (₹) *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={editFormData.price}
                  onChange={(e) => setEditFormData({...editFormData, price: e.target.value})}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="edit-salePrice">Sale Price (₹)</Label>
                <Input
                  id="edit-salePrice"
                  type="number"
                  value={editFormData.salePrice}
                  onChange={(e) => setEditFormData({...editFormData, salePrice: e.target.value})}
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="edit-stock">Stock Quantity</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={editFormData.stock}
                  onChange={(e) => setEditFormData({...editFormData, stock: e.target.value})}
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="edit-categoryId">Category *</Label>
                <Select value={editFormData.categoryId} onValueChange={(value) => setEditFormData({...editFormData, categoryId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="edit-images">Images (URLs, comma separated)</Label>
                <Input
                  id="edit-images"
                  value={editFormData.images}
                  onChange={(e) => setEditFormData({...editFormData, images: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-colors">Colors (comma separated)</Label>
                <Input
                  id="edit-colors"
                  value={editFormData.colors}
                  onChange={(e) => setEditFormData({...editFormData, colors: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-sizes">Sizes (comma separated)</Label>
                <Input
                  id="edit-sizes"
                  value={editFormData.sizes}
                  onChange={(e) => setEditFormData({...editFormData, sizes: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-fabric">Fabric</Label>
                <Input
                  id="edit-fabric"
                  value={editFormData.fabric}
                  onChange={(e) => setEditFormData({...editFormData, fabric: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-pattern">Pattern</Label>
                <Input
                  id="edit-pattern"
                  value={editFormData.pattern}
                  onChange={(e) => setEditFormData({...editFormData, pattern: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-occasion">Occasion</Label>
                <Input
                  id="edit-occasion"
                  value={editFormData.occasion}
                  onChange={(e) => setEditFormData({...editFormData, occasion: e.target.value})}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-isActive"
                  checked={editFormData.isActive}
                  onCheckedChange={(checked) => setEditFormData({...editFormData, isActive: !!checked})}
                />
                <Label htmlFor="edit-isActive">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-featured"
                  checked={editFormData.featured}
                  onCheckedChange={(checked) => setEditFormData({...editFormData, featured: !!checked})}
                />
                <Label htmlFor="edit-featured">Featured</Label>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Update Product
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}