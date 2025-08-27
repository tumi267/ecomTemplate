'use client'

import { useCartStore } from '../../libs/store'
import styles from './AddToCart.module.css'

export default function AddToCartButton({ product, disabled = false }) {
  const addItem = useCartStore((state) => state.addItem)

  const hasVariants = product?.variants?.length > 0
  const variant = hasVariants ? product.variants[0] : product.variant || null

  const id = hasVariants ? variant.id : product.id
  const basePrice = hasVariants ? variant.price : product.price
  const discount = parseFloat(product.discount || 0)
  const weekSale = product.weekSale === true

  // Only apply discount if weekSale is true
  const finalPrice = weekSale ? Math.max(0, basePrice - discount) : basePrice

  const trackQty = hasVariants ? variant.trackQty : product.trackQty
  const qty = hasVariants ? variant.qty : product.qty
  const options = hasVariants ? variant.options || [] : []

  const isOutOfStock = trackQty && qty <= 0
  const shouldDisable = disabled || isOutOfStock
  const buttonText = isOutOfStock ? 'Out of stock' : 'Add to bag'

  const handleClick = () => {
    if (shouldDisable) return
    addItem({
      id,
      productId: product.id,
      product,
      variantId: variant?.id,
      quantity: 1,
      price: Number(finalPrice),
      options,
    })
  }

  return (
    <button
      disabled={shouldDisable}
      onClick={handleClick}
      className={`${styles.addToCartBtn} ${shouldDisable ? styles.disabled : ''}`}
    >
      {buttonText}
    </button>
  )
}

