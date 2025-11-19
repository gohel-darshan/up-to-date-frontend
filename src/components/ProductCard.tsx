'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product, ProductColor, useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, size?: string, color?: ProductColor) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  if (!product) {
    return <div className="animate-pulse bg-muted rounded-lg h-96" />;
  }
  
  if (!product.colors || !Array.isArray(product.colors) || product.colors.length === 0) {
    return <div className="animate-pulse bg-muted rounded-lg h-96" />;
  }
  
  if (!product.sizes || !Array.isArray(product.sizes) || product.sizes.length === 0) {
    return <div className="animate-pulse bg-muted rounded-lg h-96" />;
  }

  const { toast } = useToast();
  const addToWishlist = useStore(state => state.addToWishlist);
  const removeFromWishlist = useStore(state => state.removeFromWishlist);
  const isInWishlist = useStore(state => state.isInWishlist);
  const addToCart = useStore(state => state.addToCart);

  const [isHovered, setIsHovered] = useState(false);
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Safe initialization of selected size
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);

  const isWishlisted = isInWishlist(product.id);

  // Safe access to active color with bounds checking
  const safeActiveColorIndex = Math.max(0, Math.min(activeColorIndex, product.colors.length - 1));
  const activeColor = product.colors[safeActiveColorIndex];
  
  // Additional safety check for activeColor  
  if (!activeColor || !activeColor.images || !Array.isArray(activeColor.images) || activeColor.images.length === 0) {
    return <div className="animate-pulse bg-muted rounded-lg h-96" />;
  }

  const handleColorChange = (index: number) => {
    // Add bounds checking for color index
    if (index >= 0 && index < product.colors.length) {
      setActiveColorIndex(index);
      setActiveImageIndex(0);
    } else {
      console.warn('Invalid color index:', index, 'Max index:', product.colors.length - 1);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Safely check if second image exists before switching
    if (activeColor.images && activeColor.images.length > 1) {
      setActiveImageIndex(1);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setActiveImageIndex(0);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!selectedSize) {
      console.warn('No size selected');
      return;
    }
    if (onAddToCart) {
      onAddToCart(product, selectedSize, activeColor);
    } else {
      addToCart(product, selectedSize, activeColor);
      toast({
        title: "Added to cart",
        description: `${product.name} (Size ${selectedSize}) added to your cart.`,
      });
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.name} removed from your wishlist.`,
      });
    } else {
      addToWishlist(product.id);
      toast({
        title: "Added to wishlist",
        description: `${product.name} added to your wishlist.`,
      });
    }
  };

  return (
    <div className="group relative bg-card rounded-lg overflow-hidden shadow-card transition-smooth hover:shadow-product">
      {/* Product Image */}
      <Link href={`/product/${product.id}`}>
        <div 
          className="aspect-square bg-brand-gray-light relative overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Image switching based on color selection */}
          <div className="relative w-full h-full">
            <motion.img
              key={`${activeColor.name}-${activeImageIndex}`}
              src={activeColor.images[Math.min(activeImageIndex, activeColor.images.length - 1)]}
              alt={`${product.name} in ${activeColor.name}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              initial={{ opacity: 0, scale: 1 }}
              animate={{ 
                opacity: 1,
                scale: isHovered ? 1.05 : 1 
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          {/* Overlay Actions */}
          <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-smooth ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <Button 
              className="bg-white text-brand-black hover:bg-brand-gold hover:text-white transition-smooth"
              onClick={handleAddToCart}
              size="sm"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Quick Add
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3">
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/80 backdrop-blur-sm transition-smooth hover:bg-white"
              onClick={handleWishlistToggle}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </Button>
          </div>

          {/* Sale Badge */}
          {product.isOnSale && (
            <Badge className="absolute top-3 left-3 bg-red-500 text-white">
              Sale
            </Badge>
          )}

          {/* New Arrival Badge */}
          {product.isNewArrival && !product.isOnSale && (
            <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
              New
            </Badge>
          )}

          {/* Featured Badge */}
          {product.featured && !product.isOnSale && !product.isNewArrival && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
              Featured
            </Badge>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-foreground group-hover:text-accent transition-smooth">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-muted-foreground">{product.category} Fabric • Men's</p>
        
        <div className="flex items-center justify-between">
          {product.isOnSale && product.originalPrice ? (
            <div className="flex items-center space-x-2">
              <p className="text-lg font-bold text-foreground">₹{product.price}<span className="text-xs font-normal text-muted-foreground">/m</span></p>
              <p className="text-sm text-muted-foreground line-through">₹{product.originalPrice}/m</p>
            </div>
          ) : (
            <p className="text-lg font-bold text-foreground">₹{product.price}<span className="text-xs font-normal text-muted-foreground">/meter</span></p>
          )}
        </div>

        {/* Color Selection */}
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground">Colors:</span>
          <div className="flex space-x-2">
            {product.colors.map((color, index) => (
              <button
                key={color.name}
                className="relative w-6 h-6 rounded-full border-2 border-gray-300 transition-all duration-200 hover:scale-110"
                style={{ backgroundColor: color.value }}
                onClick={() => handleColorChange(index)}
                title={color.name}
              >
                {index === activeColorIndex && (
                  <motion.div
                    layoutId={`color-indicator-${product.id}`}
                    className="absolute -inset-1 rounded-full border-2 border-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Fabric Requirements Guide */}
        {product.fabricRequirements && product.fabricRequirements.length > 0 && (
          <div className="space-y-2 bg-brand-cream/30 p-3 rounded-lg border border-brand-gold/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-brand-navy">Fabric Guide:</span>
            </div>
            <div className="space-y-1">
              {product.fabricRequirements.slice(0, 3).map((req) => (
                <div key={req.size} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{req.size}</span>
                  <span className="font-medium text-foreground">{req.meters}m</span>
                </div>
              ))}
              {product.fabricRequirements.length > 3 && (
                <Link href={`/product/${product.id}`} className="text-xs text-primary hover:underline">
                  +{product.fabricRequirements.length - 3} more sizes →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;