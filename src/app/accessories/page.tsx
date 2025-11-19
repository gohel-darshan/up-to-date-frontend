'use client'

import { useStore } from '@/lib/store'
import ProductCard from '@/components/ProductCard'
import { useMemo } from 'react'

const Accessories = () => {
  const { products } = useStore()
  
  const accessoryProducts = useMemo(() => 
    products.filter(product => 
      product.category.toLowerCase().includes('accessory') || 
      product.category.toLowerCase().includes('sock') ||
      product.category.toLowerCase().includes('care') ||
      product.category.toLowerCase().includes('insole')
    ), 
    [products]
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Accessories</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Complete your look with our premium accessories collection including socks, shoe care, and more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {accessoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Accessories