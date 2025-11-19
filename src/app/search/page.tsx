'use client'

import { useState, useMemo } from 'react'
import { Search as SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import ProductCard from '@/components/ProductCard'
import { useStore } from '@/lib/store'

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const { products } = useStore()

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    
    const query = searchQuery.toLowerCase()
    return products.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    )
  }, [products, searchQuery])

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Search Products</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Find your perfect fabric from our premium collection
          </p>
          
          <div className="max-w-md mx-auto relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for fabrics, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>

        {searchQuery.trim() && (
          <div className="mb-8">
            <p className="text-muted-foreground">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
            </p>
          </div>
        )}

        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {searchResults.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : searchQuery.trim() ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">No products found for "{searchQuery}"</p>
            <p className="text-sm text-muted-foreground">Try different keywords or browse our categories</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Search