'use client'

import { useCartStore } from '../../libs/store'
import styles from './AddToCart.module.css'
export default function AddToCartButton({ product,disabled = false }) {
  const addItem = useCartStore((state) => state.addItem)
  const items = useCartStore((state) => state.items)
  const {id,name,price,description,image,inStock,colors,sizes,currency}=product



  return (
    <button 
    disabled={disabled}
    onClick={() => !disabled && addItem({
      id,
      name,
      price,
      description,
      image,
      inStock,
      currency,
      colors,
      quantity: 1,
      sizes
    })}
      className={`${styles.addToCartBtn} ${disabled ? styles.disabled : ''}`}
    >
      Add to bag 
    </button>
  )
}