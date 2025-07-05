'use client'

import { useCartStore } from '../../libs/store'
import styles from './AddToCart.module.css'

export default function AddToCartButton({ product, disabled = false }) {
  const addItem = useCartStore((state) => state.addItem)
  const { id, name, price, description, image, inStock, colors, sizes, currency } = product
  const sizeValue = sizes?.size
  const colorValue = colors?.color
  const sizeQty = sizes?.qty
  const colorQty = colors?.qty

  // Check if any variant was selected (regardless of stock)
  const hasVariantSelection = sizes !== undefined || colors !== undefined
  
  // Check if selected variant is out of stock
  const isSelectedVariantOutOfStock = 
    (sizeQty !== undefined && sizeQty === 0) ||
    (colorQty !== undefined && colorQty === 0)

  const shouldDisable = disabled || isSelectedVariantOutOfStock

  // Only show "variant out of stock" if:
  // 1. A variant was selected AND
  // 2. That variant is out of stock
  const buttonText = (hasVariantSelection && isSelectedVariantOutOfStock) 
    ? 'Variant out of stock' 
    : 'Add to bag'

  return (
    <button 
      disabled={shouldDisable}
      onClick={() => !disabled && addItem({
        id,
        name,
        price,
        description,
        image,
        inStock,
        currency,
        colorValue,
        quantity: 1,
        sizeValue
      })}
      className={`${styles.addToCartBtn} ${shouldDisable ? styles.disabled : ''}`}
    >
      {buttonText}
    </button>
  )
}