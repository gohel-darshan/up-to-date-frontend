'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/lib/store'

const CartBadge = () => {
  const [mounted, setMounted] = useState(false)
  const { cartCount } = useStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const count = cartCount()
  
  if (count === 0) {
    return null
  }

  return (
    <Badge 
      variant="destructive" 
      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
    >
      {count}
    </Badge>
  )
}

export default CartBadge