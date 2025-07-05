'use client'

import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import db from '../../libs/db.json'
import { Button } from '../../../components/ui/button'
import AddToCartButton from '@/app/components/AddToCartButton/AddToCartButton'
import styles from './product.module.css'

function Page() {
  const params = useParams()
  const regex = (text) => decodeURIComponent(text)

  const [prodinfo, setprodinfo] = useState({})
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)

  useEffect(() => {
    const items = db.categories.flatMap((e) => e.items)
    const item = items.find((e) => e.name === regex(params.id))
    setprodinfo(item || {})
  }, [params])

  const handleSizeChange = (e) => {
    e.preventDefault()
    setSelectedSize(e.target.value)
  }

  const handleColorChange = (e) => {
    e.preventDefault()
    setSelectedColor(e.target.value)
  }

  const requiresSize = Array.isArray(prodinfo?.sizes) && prodinfo.sizes.length > 0
  const requiresColor = Array.isArray(prodinfo?.colors) && prodinfo.colors.length > 0

  const isReadyToAdd =
    (!requiresSize || selectedSize) &&
    (!requiresColor || selectedColor)

  const selectedVariant = {
    ...prodinfo,
    ...(prodinfo?.sizes && { sizes: selectedSize }),
    ...(prodinfo?.colors && { colors: selectedColor }),
  }
  
  const hasVariants = requiresSize || requiresColor

  // Only allow add to cart if all required variants are selected
  const allVariantsSelected =
    (!requiresSize || selectedSize) &&
    (!requiresColor || selectedColor)

  const disableAddToCart = hasVariants && !allVariantsSelected
  
  return (
    <div className={styles.productPage}>
      <div className={styles.productGrid}>

        {/* Image */}
        <div className={styles.imageBox}>
          <img src={"/next.svg"} alt={prodinfo.name} className={styles.image} />
        </div>

        {/* Details */}
        <div className={styles.detailsBox}>

          <section className={styles.section}>
            <h1 className={styles.title}>{regex(params.id)}</h1>
          </section>

          <section className={styles.section}>
            <h4>{prodinfo?.description}</h4>
          </section>

          <section className={styles.section}>
            <h3>Price: <span>R {prodinfo?.price}</span></h3>
          </section>

          {/* Size Selector (Only if sizes exist) */}
          {requiresSize && (
            <section className={styles.section}>
              <h3>Sizes</h3>
              <div className={styles.options}>
                {prodinfo.sizes.map((size, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    value={size}
                    onClick={handleSizeChange}
                    className={`${styles.optionBtn} ${selectedSize === size ? styles.active : ''}`}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </section>
          )}

          {/* Color Selector (Only if colors exist) */}
          {requiresColor && (
            <section className={styles.section}>
              <h3>Colors</h3>
              <div className={styles.options}>
                {prodinfo.colors.map((color, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    value={color}
                    onClick={handleColorChange}
                    className={`${styles.optionBtn} ${selectedColor === color ? styles.active : ''}`}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </section>
          )}

          {/* Add to Cart */}
          <div className={styles.cartBtn}>
            <AddToCartButton product={selectedVariant} disabled={disableAddToCart} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
