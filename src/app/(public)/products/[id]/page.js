'use client'

import { useParams, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Button } from '../../../../components/ui/button'
import AddToCartButton from '../../../components/AddToCartButton/AddToCartButton'
import styles from './product.module.css'
import { getSingleProduct } from '../../../utils/admincalls'

function Page() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [prodinfo, setProdinfo] = useState({})
  const [selectedVariants, setSelectedVariants] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return
      try {
        const res = await getSingleProduct(id)
        setProdinfo(res)
      } catch (err) {
        console.error('Failed to load product', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const uniqueTypes = [...new Set(prodinfo.variants?.map(v => v.type))]
  const allSelected = uniqueTypes.every(type => selectedVariants[type])
  const isOutOfStock = uniqueTypes.some(type => {
    const selected = selectedVariants[type]
    return selected?.trackQty !== false && selected?.qty <= 0
  })

  const selectedVariant = {
    ...prodinfo,
    ...uniqueTypes.reduce((acc, type) => {
      const selected = selectedVariants[type]
      if (selected) {
        acc[type] = {
          ...selected,
          trackQty: selected.trackQty !== undefined ? selected.trackQty : true,
        }
      }
      return acc
    }, {})
  }

  const updateVariant = (type, valueStr) => {
    const variantValue = JSON.parse(valueStr)
    setSelectedVariants(prev => ({
      ...prev,
      [type]: variantValue,
    }))
  }

  const disableAddToCart = !allSelected || isOutOfStock

  if (loading) return <p>Loading...</p>
  if (!prodinfo?.id) return <p>Product not found.</p>

  return (
    <div className={styles.productPage}>
      <div className={styles.productGrid}>
        {/* Image */}
        <div className={styles.imageBox}>
          {isOutOfStock ? (
            <h2>Out of Stock</h2>
          ) : (
            <img src="/next.svg" alt={prodinfo.name} className={styles.image} />
          )}
        </div>

        {/* Details */}
        <div className={styles.detailsBox}>
          <section className={styles.section}>
            <h1 className={styles.title}>{prodinfo.name}</h1>
          </section>

          <section className={styles.section}>
            <h4>{prodinfo.description}</h4>
          </section>

          <section className={styles.section}>
            <h3>Price: <span>R {prodinfo.price}</span></h3>
          </section>

          {/* Variant Selectors */}
          {uniqueTypes.map((type) => (
            <section className={styles.section} key={type}>
              <h3>{type}</h3>
              <div className={styles.options}>
                {prodinfo.variants
                  .filter(v => v.type === type)
                  .sort((a, b) => {
                    if (type.toLowerCase() !== 'size') return 0
                    const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
                    const indexA = order.indexOf(a.label.toUpperCase())
                    const indexB = order.indexOf(b.label.toUpperCase())
                    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
                  })
                  .map((variant, i) => {
                    const valueStr = JSON.stringify(variant)
                    const selectedStr = JSON.stringify(selectedVariants[type] || {})
                    return (
                      <Button
                        key={i}
                        variant="outline"
                        value={valueStr}
                        onClick={(e) => {
                          e.preventDefault()
                          updateVariant(type, valueStr)
                        }}
                        className={`${styles.optionBtn} ${selectedStr === valueStr ? styles.active : ''}`}
                      >
                        {variant.label}
                      </Button>
                    )
                  })}
              </div>
            </section>
          ))}

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
