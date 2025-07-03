'use client'

import { useCartStore } from '../../libs/store'

export default function RemoveItem({ product }) {
  const removeItem = useCartStore((state) => state.removeItem)
  const {id}=product
  return (
    <button 
      onClick={() => removeItem(id)}
    >
      remove item
    </button>
  )
}