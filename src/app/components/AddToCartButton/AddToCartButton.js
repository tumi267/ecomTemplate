'use client'

import { useCartStore } from '../../libs/store'
import styles from './AddToCart.module.css'

export default function AddToCartButton({ product, disabled = false }) {
  const addItem = useCartStore((state) => state.addItem)
  const { id, name, price, description, image, inStock, colors, sizes, currency } = product
  
  // Get values
  const sizeValue = sizes?.size
  const colorValue = colors?.color
  
  // Determine if we should track quantity
  const trackQty = 
    sizes?.trackQty !== undefined ? sizes.trackQty :
    colors?.trackQty !== undefined ? colors.trackQty :
    false // Default to not tracking quantity

  // Only check quantities if trackQty is true
  const sizeQty = trackQty ? sizes?.qty : undefined
  const colorQty = trackQty ? colors?.qty : undefined

  // Check if any variant was selected
  const hasVariantSelection = sizes !== undefined || colors !== undefined 
  
  // Check if selected variant is out of stock (only if trackQty is true)
  const isSelectedVariantOutOfStock = 
    (sizeQty !== undefined && sizeQty <= 0) ||
    (colorQty !== undefined && colorQty <= 0)

  // Button should be disabled only if:
  // 1. Explicitly disabled via prop OR
  // 2. We're tracking quantity AND the variant is out of stock
  const shouldDisable = disabled || (trackQty && isSelectedVariantOutOfStock)

  // Button text logic
  const buttonText = (trackQty && hasVariantSelection && isSelectedVariantOutOfStock) 
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