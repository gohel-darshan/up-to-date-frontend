'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowRight, Star, Truck, Shield, Headphones } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useStore, ProductColor } from '@/lib/store'
import { TextRotate } from '@/components/ui/text-rotate'
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect'
import { StaggerTestimonials } from '@/components/ui/stagger-testimonials'
import { motion } from 'framer-motion'
import RecentlyViewed from '@/components/RecentlyViewed'
import SocialMediaFeed from '@/components/SocialMediaFeed'
import api from '@/lib/api'
import { toast } from 'sonner'

const Home = () => {
  const router = useRouter()
  const { addToCart } = useStore()
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [newArrivals, setNewArrivals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchHomeData()
  }, [])
  
  const fetchHomeData = async () => {
    try {
      setLoading(true)
      
      // Fetch featured products
      const featuredResponse = await api.getProducts({ featured: true, limit: 6 })
      if (featuredResponse.data) {
        setFeaturedProducts(featuredResponse.data.products)
      }
      
      // Fetch new arrivals
      const newArrivalsResponse = await api.getProducts({ 
        sortBy: 'createdAt', 
        sortOrder: 'desc', 
        limit: 4 
      })
      if (newArrivalsResponse.data) {
        setNewArrivals(newArrivalsResponse.data.products)
      }
      
    } catch (error) {
      console.error('Failed to fetch products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleQuickAdd = (product: any, size?: string, color?: ProductColor) => {
    console.log('handleQuickAdd called with:', { product, size, color })
    
    // Comprehensive validation
    if (!product) {
      console.error('handleQuickAdd: No product provided')
      return
    }
    
    if (!product.sizes || !Array.isArray(product.sizes) || product.sizes.length === 0) {
      console.error('handleQuickAdd: Invalid sizes array:', product)
      return
    }
    
    if (!product.colors || !Array.isArray(product.colors) || product.colors.length === 0) {
      console.error('handleQuickAdd: Invalid colors array:', product)
      return
    }
    
    const selectedSize = size || product.sizes[0]
    const selectedColor = color || product.colors[0]
    
    if (!selectedSize || !selectedColor) {
      console.error('handleQuickAdd: Could not determine size or color', { selectedSize, selectedColor })
      return
    }
    
    addToCart(product, selectedSize, selectedColor)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-30">
          <Image
            src="/assets/hero-tailoring.jpg"
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* Elegant overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/60 via-primary/50 to-transparent" />
        
        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              <span className="block text-white drop-shadow-lg">UP TO DATE SELECTION</span>
              <TextRotate
                texts={[
                  "TAILORING",
                  "CRAFTSMANSHIP", 
                  "EXCELLENCE",
                  "SOPHISTICATION",
                  "PERFECTION",
                  "LUXURY"
                ]}
                mainClassName="inline-flex bg-accent text-accent-foreground px-6 py-3 rounded-lg overflow-hidden justify-center items-center text-center min-w-fit shadow-gold"
                staggerFrom="last"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={3000}
              />
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/95 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Experience the finest selection of premium fabrics for custom tailoring. 
              Choose from our exclusive collection of shirt, pant, kurta, pajama, suit, and koti fabrics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" variant="secondary" className="text-lg px-8 shadow-gold">
                  Browse Fabrics
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/new-arrivals">
                <Button size="lg" className="bg-black text-brand-navy hover:bg-brand-cream border-2 border-white text-lg px-8 font-semibold shadow-lg">
                  New Arrivals
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-brand-cream">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center shadow-elegant border-brand-gray-medium">
              <CardContent className="p-6">
                <Truck className="h-12 w-12 mx-auto mb-4 text-brand-gold" />
                <h3 className="text-lg font-semibold mb-2 text-brand-navy">Complimentary Delivery</h3>
                <p className="text-muted-foreground">Free shipping on orders over $500</p>
              </CardContent>
            </Card>
            
            <Card className="text-center shadow-elegant border-brand-gray-medium">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 mx-auto mb-4 text-brand-gold" />
                <h3 className="text-lg font-semibold mb-2 text-brand-navy">Expert Craftsmanship</h3>
                <p className="text-muted-foreground">Handcrafted with precision and care</p>
              </CardContent>
            </Card>
            
            <Card className="text-center shadow-elegant border-brand-gray-medium">
              <CardContent className="p-6">
                <Headphones className="h-12 w-12 mx-auto mb-4 text-brand-gold" />
                <h3 className="text-lg font-semibold mb-2 text-brand-navy">Personal Consultation</h3>
                <p className="text-muted-foreground">Dedicated tailoring advisors at your service</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-brand-navy">Premium Fabric Collection</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Handpicked premium fabrics from our exclusive collection. Each fabric carefully selected for superior quality and finish.
            </p>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredProducts.map((product) => {
                const handleProductClick = () => {
                  router.push(`/products/${product.slug || product.id}`)
                }
                
                return (
                  <Card key={product.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleProductClick}>
                    <CardContent className="p-0">
                      <div className="aspect-square relative overflow-hidden rounded-t-lg">
                        <img
                          src={product.images?.[0] || '/assets/fabric-collection.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        {product.salePrice && (
                          <Badge className="absolute top-2 left-2 bg-red-500">
                            Sale
                          </Badge>
                        )}
                        {product.featured && (
                          <Badge className="absolute top-2 right-2 bg-yellow-500">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <div className="p-4">
                        <Badge variant="outline" className="mb-2">
                          {product.category?.name || 'Fabric'}
                        </Badge>
                        <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg">
                              ₹{product.salePrice || product.price}
                            </span>
                            {product.salePrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                ₹{product.price}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {product.stock || 100} in stock
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No featured products available</p>
            </div>
          )}

          <div className="text-center">
            <Link href="/products">
              <Button size="lg" variant="outline" className="text-lg px-8 border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white">
                View All Fabrics
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Collection Showcase */}
      <section className="py-20 bg-brand-cream">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-brand-navy">
                Crafted for
                <span className="block text-brand-gold">Excellence</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                From premium shirting to luxurious suit fabrics, our collection features the finest 
                imported materials and traditional weaving techniques. Each fabric is a masterpiece 
                of quality and craftsmanship.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-brand-gold fill-brand-gold" />
                  <span className="text-brand-navy">Premium Italian & British fabrics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-brand-gold fill-brand-gold" />
                  <span className="text-brand-navy">Bespoke tailoring services</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-brand-gold fill-brand-gold" />
                  <span className="text-brand-navy">Expert fit consultations</span>
                </div>
              </div>
              <Link href="/products">
                <Button size="lg" className="bg-brand-navy text-white hover:bg-brand-gray-dark shadow-elegant">
                  Browse Fabrics
                </Button>
              </Link>
            </div>
            
            <div className="relative">
              <Image 
                src="/assets/fabric-collection.jpg"
                alt="Premium Fabric Collection"
                width={600}
                height={400}
                className="w-full rounded-lg shadow-premium"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto">
          <StaggerTestimonials />
        </div>
      </section>

      {/* Social Media Feed */}
      <SocialMediaFeed />

      {/* Newsletter */}
      <section className="py-20 gradient-luxury text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-brand-gold rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-brand-gold rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="mb-8">
            <TypewriterEffectSmooth 
              words={[
                { text: "Join" },
                { text: "Our" },
                { text: "Elite", className: "text-brand-gold" },
                { text: "Circle", className: "text-brand-gold" }
              ]}
              className="justify-center mb-6"
              cursorClassName="bg-brand-gold"
            />
          </div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.5 }}
            className="text-lg md:text-xl text-brand-cream/90 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Be the first to discover new collections, exclusive fabrics, and bespoke tailoring services. 
            Join our community of distinguished clientele.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 3 }}
            className="max-w-xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-brand-gold/20">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="flex-1 w-full sm:w-auto px-6 py-4 bg-transparent text-white placeholder:text-brand-cream/60 focus:outline-none text-lg border-none"
              />
              <Button className="bg-brand-gold text-white hover:bg-brand-gold-light px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-brand-gold/40 whitespace-nowrap">
                Subscribe
              </Button>
            </div>
            
            <p className="text-sm text-brand-cream/60 mt-4 text-center">
              Exclusive access to premium collections. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home