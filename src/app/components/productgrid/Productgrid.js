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
    setVariants(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: value
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

          const allVariantsSelected = 
            (!requiresSize || selectedSize) &&
            (!requiresColor || selectedColor)

          const selectedVariant = {
            ...product,
            ...(product.sizes && { sizes: selectedSize }),
            ...(product.colors && { colors: selectedColor }),
          }

          return (
            <Card key={index} className={styles.card}>
              <Link href={`/products/${product.name}`} className={styles.link}>
                <CardHeader>
                  <CardTitle className={styles.cardTitle}>{product.name}</CardTitle>
                  {product.weekSale && <span className={styles.saleBadge}>On Sale</span>}
                </CardHeader>
                <CardContent>
                  <div className={styles.image_wrapper}>
                    <Image src='/next.svg' alt={product.name} fill />
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
                    {product.sizes.map((size, i) => (
                      <Button
                        key={i}
                        value={size}
                        onClick={() => updateVariant(index, 'selectedSize', size)}
                        className={`${styles.optionBtn} ${selectedSize === size ? styles.active : ''}`}
                        variant="outline"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color selector */}
              {requiresColor && (
                <div className={styles.variantSection}>
                  <p className={styles.variantLabel}>Color</p>
                  <div className={styles.options}>
                    {product.colors.map((color, i) => (
                      <Button
                        key={i}
                        value={color}
                        onClick={() => updateVariant(index, 'selectedColor', color)}
                        className={`${styles.optionBtn} ${selectedColor === color ? styles.active : ''}`}
                        variant="outline"
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <AddToCartButton product={selectedVariant} disabled={!allVariantsSelected} />

              <CardDescription className={styles.price}>R {product.price}</CardDescription>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default ProductGrid
