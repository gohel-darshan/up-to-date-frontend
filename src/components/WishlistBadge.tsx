'use client'

import { useWishlist } from '@/contexts/WishlistContext'

const WishlistBadge = () => {
  const { wishlistCount } = useWishlist()

  if (wishlistCount === 0) return null

  return (
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
      {wishlistCount > 99 ? '99+' : wishlistCount}
    </span>
  )
}

export default WishlistBadge