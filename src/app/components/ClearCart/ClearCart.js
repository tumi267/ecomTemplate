'use client'

import { useCartStore } from '../../libs/store'

export default function ClearCart({ product }) {
  const clearCart = useCartStore((state) => state.clearCart)

  return (
    <button 
      onClick={() => clearCart()}
    >
      clear cart
    </button>
  )
}