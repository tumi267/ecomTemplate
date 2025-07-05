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
  const [VariantinStock,setVariantinStock]=useState(null)

  useEffect(() => {
    const items = db.categories.flatMap((e) => e.items)
    const item = items.find((e) => e.name === regex(params.id))
    setprodinfo(item || {})
  }, [params])

  const handleSizeChange = (e) => {
    e.preventDefault()
    setSelectedSize(JSON.parse(e.target.value))
    
    setVariantinStock(JSON.parse(e.target.value).qty)
  }

  const handleColorChange = (e) => {
    e.preventDefault()
    setSelectedColor(JSON.parse(e.target.value))
    setVariantinStock(JSON.parse(e.target.value).qty)
  }

  const requiresSize = Array.isArray(prodinfo?.sizes) && prodinfo.sizes.length > 0
  const requiresColor = Array.isArray(prodinfo?.colors) && prodinfo.colors.length > 0

  const isReadyToAdd =
    (!requiresSize || selectedSize) &&
    (!requiresColor || selectedColor)

  const selectedVariant = {
    ...prodinfo,
    ...(requiresSize && { sizes: selectedSize }),
    ...(requiresColor && { colors: selectedColor }),
  }

  const hasVariants = requiresSize || requiresColor
  const allVariantsSelected = isReadyToAdd
  const disableAddToCart = hasVariants && !allVariantsSelected

  return (
    <div className={styles.productPage}>
      <div className={styles.productGrid}>
        {/* Image */}
        <div className={styles.imageBox}>
        {VariantinStock >0 || VariantinStock === null ?
          <img src="/next.svg" alt={prodinfo.name} className={styles.image} />
          :<h2>out of stock</h2>}
        </div>

        {/* Details */}
        <div className={styles.detailsBox}>
          <section className={styles.section}>
            <h1 className={styles.title}>{regex(params.id)}</h1>
          </section>
          {/* can be a accordian */}
          <section className={styles.section}>
            <h4>{prodinfo?.description}</h4>
          </section>

          <section className={styles.section}>
            <h3>Price: <span>R {prodinfo?.price}</span></h3>
          </section>

          {/* Size Selector (if sizes exist) */}
          {requiresSize && (
            <section className={styles.section}>
              <h3>Sizes</h3>
              <div className={styles.options}>
                {prodinfo.sizes.map((size, i) => {
                  const sizeStr = JSON.stringify(size)
                  const selectedStr = JSON.stringify(selectedSize)
                  return (
                    <Button
                      key={i}
                      variant="outline"
                      value={sizeStr}
                      onClick={handleSizeChange}
                      className={`${styles.optionBtn} ${selectedStr === sizeStr ? styles.active : ''}`}
                    >
                      {size.size}
                    </Button>
                  )
                })}
              </div>
            </section>
          )}

          {/* Color Selector (if colors exist) */}
          {requiresColor && (
            <section className={styles.section}>
              <h3>Colors</h3>
              <div className={styles.options}>
                {prodinfo.colors.map((color, i) => {
                  const colorStr = JSON.stringify(color)
                  const selectedStr = JSON.stringify(selectedColor)
                  return (
                    <Button
                      key={i}
                      variant="outline"
                      value={colorStr}
                      onClick={handleColorChange}
                      className={`${styles.optionBtn} ${selectedStr === colorStr ? styles.active : ''}`}
                    >
                      {color.color}
                    </Button>
                  )
                })}
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
