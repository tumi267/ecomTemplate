'use client'

import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card.jsx"
import { Button } from "../../../components/ui/button"
import Image from 'next/image.js'
import styles from './ProductGrid.module.css'
import Link from 'next/link.js'
import AddToCartButton from '../AddToCartButton/AddToCartButton.js'

function ProductGrid({ title, items, selector, param }) {
  const [cardinfo, setcardinfo] = useState([])

  useEffect(() => {
    if (selector && selector.toLowerCase() === "best seller") {
      const bestSellers = items.flatMap(cat => cat.items).filter(item => item.bestSeller === true)
      setcardinfo(bestSellers)
    } else if (selector && selector.toLowerCase() === "week sale") {
      const weekSales = items.flatMap(cat => cat.items).filter(item => item.weekSale === true)
      setcardinfo(weekSales)
    } else if (selector) {
      const seller = items.find(e => e.name === selector)
      setcardinfo(seller?.items)
    } else {
      setcardinfo(items)
    }
  }, [items, selector])

  const regex = (text, numWords) => {
    if (!text) return ''
    const words = text.trim().split(/\s+/).filter(word => word.length > 0)
    return words.slice(0, numWords).join(' ') + (words.length > numWords ? '...' : '')
  }

  // Store selected variants per product index
  const [variants, setVariants] = useState({})

  const updateVariant = (index, field, value) => {
    const variantValue = JSON.parse(value)
    setVariants(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: variantValue,
        variantInStock: variantValue.qty > 0
      }
    }))
  }

  return (
    <div>
      <h1 className={styles.title}>{title}</h1>

      {param !== undefined && (
        <ul className={styles.navList}>
          <li><Link href="/products" className={param === 1 ? styles.active : ''}>Products</Link></li>
          <li><Link href="/category/T-Shirts" className={param === 'T-Shirts' ? styles.active : ''}>T-Shirts</Link></li>
          <li><Link href="/category/Caps" className={param === 'Caps' ? styles.active : ''}>Caps</Link></li>
          <li><Link href="/category/Tracksuits" className={param === 'Tracksuits' ? styles.active : ''}>Tracksuits</Link></li>
        </ul>
      )}

      <div className={styles.card_contain}>
        {cardinfo?.map((product, index) => {
          const requiresSize = Array.isArray(product.sizes) && product.sizes.length > 0
          const requiresColor = Array.isArray(product.colors) && product.colors.length > 0

          const selectedSize = variants[index]?.selectedSize || null
          const selectedColor = variants[index]?.selectedColor || null
          const variantInStock = variants[index]?.variantInStock

          const allVariantsSelected = 
            (!requiresSize || selectedSize) &&
            (!requiresColor || selectedColor)

          const selectedVariant = {
            ...product,
            ...(requiresSize && { sizes: selectedSize }),
            ...(requiresColor && { colors: selectedColor }),
          }

          const shouldDisable = 
            !allVariantsSelected || 
            (selectedSize && selectedSize.qty <= 0) || 
            (selectedColor && selectedColor.qty <= 0)

          return (
            <Card key={index} className={styles.card}>
              <Link href={`/products/${product.name}`} className={styles.link}>
                <CardHeader>
                  <CardTitle className={styles.cardTitle}>{product.name}</CardTitle>
                  {product.weekSale && <span className={styles.saleBadge}>On Sale</span>}
                </CardHeader>
                <CardContent>
                  <div className={styles.image_wrapper}>
                    {variantInStock !== false ? (
                      <Image src='/next.svg' alt={product.name} fill />
                    ) : (
                      <div className={styles.outOfStockOverlay}>Out of Stock</div>
                    )}
                  </div>
                </CardContent>
              </Link>

              <CardDescription className={styles.description}>
                {regex(product.description, 7)}
              </CardDescription>

              {/* Size selector */}
              {requiresSize && (
                <div className={styles.variantSection}>
                  <p className={styles.variantLabel}>Size</p>
                  <div className={styles.options}>
                    {product.sizes.map((size, i) => {
                      const sizeStr = JSON.stringify(size)
                      const selectedStr = selectedSize ? JSON.stringify(selectedSize) : ''
                      return (
                        <Button
                          key={i}
                          value={sizeStr}
                          onClick={(e) => {
                            e.preventDefault()
                            updateVariant(index, 'selectedSize', sizeStr)
                          }}
                          className={`${styles.optionBtn} ${selectedStr === sizeStr ? styles.active : ''}`}
                          variant="outline"
                        >
                          {size.size}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Color selector */}
              {requiresColor && (
                <div className={styles.variantSection}>
                  <p className={styles.variantLabel}>Color</p>
                  <div className={styles.options}>
                    {product.colors.map((color, i) => {
                      const colorStr = JSON.stringify(color)
                      const selectedStr = selectedColor ? JSON.stringify(selectedColor) : ''
                      return (
                        <Button
                          key={i}
                          value={colorStr}
                          onClick={(e) => {
                            e.preventDefault()
                            updateVariant(index, 'selectedColor', colorStr)
                          }}
                          className={`${styles.optionBtn} ${selectedStr === colorStr ? styles.active : ''}`}
                          variant="outline"
                        >
                          {color.color}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              )}

              <AddToCartButton 
                product={selectedVariant} 
                disabled={shouldDisable}
                variant={(isDisabled) => {
                  // This callback can be used if needed
                }}
              />

              <CardDescription className={styles.price}>R {product.price}</CardDescription>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default ProductGrid