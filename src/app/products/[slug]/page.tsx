'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star, Heart, ShoppingCart, ArrowLeft, Truck, Shield, RotateCcw } from 'lucide-react'
import { useStore } from '@/lib/store'
import api from '@/lib/api'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  salePrice?: number
  images: string[]
  colors: string[]
  sizes: string[]
  fabric?: string
  pattern?: string
  occasion?: string
  stock: number
  category: {
    name: string
    slug: string
  }
  reviews: Array<{
    id: string
    rating: number
    title?: string
    comment?: string
    user: {
      firstName: string
      lastName: string
    }
    createdAt: string
  }>
}

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  
  const { addToCart, addToWishlist, isInWishlist, addToRecentlyViewed, products } = useStore()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        console.log('Product detail page - searching for slug:', slug)
        
        // Try API first
        const response = await api.getProduct(slug)
        
        if (response.data && !response.error) {
          setProduct(response.data)
          addToRecentlyViewed(response.data.id)
          
          if (response.data.sizes?.length > 0) {
            setSelectedSize(response.data.sizes[0])
          }
          if (response.data.colors?.length > 0) {
            setSelectedColor(response.data.colors[0])
          }
        } else {
          // Fallback to store products - try multiple matching strategies
          console.log('API failed, trying store products. Available products:', products.map(p => ({ id: p.id, name: p.name, slug: p.slug })))
          
          const storeProduct = products.find(p => 
            p.slug === slug || 
            p.id === slug || 
            p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === slug
          )
          
          if (storeProduct) {
            const productData = {
              id: storeProduct.id,
              name: storeProduct.name,
              slug: storeProduct.slug || storeProduct.id,
              description: storeProduct.description,
              price: storeProduct.price,
              salePrice: storeProduct.originalPrice ? storeProduct.price : undefined,
              images: storeProduct.colors[0]?.images || [storeProduct.image],
              colors: storeProduct.colors.map(c => c.name),
              sizes: storeProduct.sizes,
              stock: 100,
              category: {
                name: storeProduct.category,
                slug: storeProduct.category.toLowerCase()
              },
              reviews: []
            }
            
            setProduct(productData)
            addToRecentlyViewed(storeProduct.id)
            
            if (productData.sizes.length > 0) {
              setSelectedSize(productData.sizes[0])
            }
            if (productData.colors.length > 0) {
              setSelectedColor(productData.colors[0])
            }
          } else {
            toast.error('Product not found')
            router.push('/products')
            return
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        
        // Fallback to store products on error - try multiple matching strategies
        console.log('Error occurred, trying store products')
        const storeProduct = products.find(p => 
          p.slug === slug || 
          p.id === slug || 
          p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === slug
        )
        
        if (storeProduct) {
          const productData = {
            id: storeProduct.id,
            name: storeProduct.name,
            slug: storeProduct.slug || storeProduct.id,
            description: storeProduct.description,
            price: storeProduct.price,
            salePrice: storeProduct.originalPrice ? storeProduct.price : undefined,
            images: storeProduct.colors[0]?.images || [storeProduct.image],
            colors: storeProduct.colors.map(c => c.name),
            sizes: storeProduct.sizes,
            stock: 100,
            category: {
              name: storeProduct.category,
              slug: storeProduct.category.toLowerCase()
            },
            reviews: []
          }
          
          setProduct(productData)
          addToRecentlyViewed(storeProduct.id)
          
          if (productData.sizes.length > 0) {
            setSelectedSize(productData.sizes[0])
          }
          if (productData.colors.length > 0) {
            setSelectedColor(productData.colors[0])
          }
        } else {
          toast.error('Failed to load product')
          router.push('/products')
        }
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchProduct()
    }
  }, [slug, router, addToRecentlyViewed, products])

  const handleAddToCart = () => {
    if (!product) return
    
    if (!selectedSize) {
      toast.error('Please select a size')
      return
    }
    
    if (!selectedColor) {
      toast.error('Please select a color')
      return
    }

    const productForStore = {
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      originalPrice: product.salePrice ? product.price : undefined,
      image: product.images[0] || '/placeholder.svg',
      category: product.category.name,
      sizes: product.sizes,
      colors: product.colors.map(color => ({
        name: color,
        value: color,
        images: product.images
      })),
      fabricRequirements: [],
      description: product.description,
      gender: 'men' as const,
      stock: { [selectedSize]: product.stock }
    }

    const selectedColorObj = {
      name: selectedColor,
      value: selectedColor,
      images: product.images
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(productForStore, selectedSize, selectedColorObj)
    }
    
    toast.success(`Added ${quantity} item(s) to cart`)
  }

  const handleAddToWishlist = () => {
    if (!product) return
    
    addToWishlist(product.id)
    toast.success('Added to wishlist')
  }

  const averageRating = product?.reviews.length 
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length 
    : 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => router.push('/products')}>
            Back to Products
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="p-0 h-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <span>/</span>
          <span>Products</span>
          <span>/</span>
          <span>{product.category.name}</span>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
              <Image
                src={product.images[selectedImage] || '/placeholder.svg'}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.salePrice && (
                <Badge className="absolute top-4 left-4 bg-red-500">
                  Save ₹{product.price - product.salePrice}
                </Badge>
              )}
            </div>
            
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-muted'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.category.name}
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              {product.reviews.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(averageRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviews.length} reviews)
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold">
                  ₹{product.salePrice || product.price}
                </span>
                {product.salePrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{product.price}
                  </span>
                )}
              </div>
            </div>

            {product.sizes.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {product.colors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= product.stock}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={handleAddToCart}
                className="flex-1"
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleAddToWishlist}
                disabled={isInWishlist(product.id)}
              >
                <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On orders over ₹500</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Quality Assured</p>
                <p className="text-xs text-muted-foreground">Premium fabrics</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-muted-foreground">7-day return policy</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviews.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.fabric && (
                      <div>
                        <h4 className="font-semibold">Fabric</h4>
                        <p className="text-muted-foreground">{product.fabric}</p>
                      </div>
                    )}
                    {product.pattern && (
                      <div>
                        <h4 className="font-semibold">Pattern</h4>
                        <p className="text-muted-foreground">{product.pattern}</p>
                      </div>
                    )}
                    {product.occasion && (
                      <div>
                        <h4 className="font-semibold">Occasion</h4>
                        <p className="text-muted-foreground">{product.occasion}</p>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold">Available Sizes</h4>
                      <p className="text-muted-foreground">{product.sizes.join(', ')}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Available Colors</h4>
                      <p className="text-muted-foreground">{product.colors.join(', ')}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Stock</h4>
                      <p className="text-muted-foreground">{product.stock} units available</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {product.reviews.length > 0 ? (
                  product.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-semibold">
                              {review.user.firstName} {review.user.lastName}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-muted-foreground'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        {review.title && (
                          <h5 className="font-medium mb-2">{review.title}</h5>
                        )}
                        {review.comment && (
                          <p className="text-muted-foreground">{review.comment}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}