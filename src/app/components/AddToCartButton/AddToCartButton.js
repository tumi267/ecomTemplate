'use client'

import { useCartStore } from '../../libs/store'

export default function AddToCartButton({ product }) {
  const addItem = useCartStore((state) => state.addItem)
  const items = useCartStore((state) => state.items)
  const {id,name,price,description,image,inStock,colors,currency}=product
  return (
    <button 
      onClick={() => addItem({
        id,
        name,
        price,
        description,
        image,
        inStock,
        currency,
        colors,
        quantity: 1
      })}
    >
      Add to bag 
    </button>
  )
}