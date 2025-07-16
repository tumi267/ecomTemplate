'use client'

import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import Image from 'next/image'
import styles from './ProductGrid.module.css'
import Link from 'next/link'
import AddToCartButton from '../AddToCartButton/AddToCartButton'

function ProductGrid({ title, items, selector, param, categories }) {
  const [cardinfo, setcardinfo] = useState([])

  useEffect(() => {
    if (selector?.toLowerCase() === 'best seller' || selector?.toLowerCase() === 'week sale') {
      setcardinfo(items)
    } else if (selector) {
      const seller = items.find(e => e.name === selector)
      setcardinfo(seller?.items || [])
    } else {
      setcardinfo(items)
    }
  }, [items, selector])

  const regex = (text, numWords) => {
    if (!text) return ''
    const words = text.trim().split(/\s+/).filter(word => word.length > 0)
    return words.slice(0, numWords).join(' ') + (words.length > numWords ? '...' : '')
  }

  const [variantsState, setVariantsState] = useState({})

  const handleVariantSelect = (productIndex, type, value) => {
    const parsed = JSON.parse(value)

    setVariantsState(prev => {
      const current = prev[productIndex] || {}

      const newState = {
        ...current,
        [type]: parsed
      }

      return {
        ...prev,
        [productIndex]: {
          ...newState,
          variantInStock: parsed.trackQty === false || parsed.qty > 0
        }
      }
    })
  }

  const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  const sortLabels = (labels, type) => {
    if (type.toLowerCase() === 'size') {
      return labels.sort((a, b) => {
        const aIndex = sizeOrder.indexOf(a.toUpperCase())
        const bIndex = sizeOrder.indexOf(b.toUpperCase())
        return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex)
      })
    }
    return labels.sort()
  }

  return (
    <div>
      <h1 className={styles.title}>{title}</h1>

      {param !== undefined && (
        <ul className={styles.navList}>
          <li><Link href="/products" className={param === 1 ? styles.active : ''}>Products</Link></li>
          {categories?.map((cat) => (
            <li key={cat.id}>
              <Link href={`/category/${cat.name}?id=${cat.id}`} className={param === cat.name ? styles.active : ''}>
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className={styles.card_contain}>
        {cardinfo.map((product, index) => {
          const allVariants = product.variants || []
          const optionTypes = [...new Set(allVariants.flatMap(v => Object.keys(v.options || {})))]
          const selected = variantsState[index] || {}

          // Determine which combinations are valid
          const validCombos = allVariants.filter(v =>
            (!v.trackQty || v.qty > 0)
          ).map(v => v.options)

          const allSelected = optionTypes.every(type => selected[type])
          const isOutOfStock = optionTypes.some(type => selected[type]?.trackQty !== false && selected[type]?.qty <= 0)
          const shouldDisable = !allSelected || isOutOfStock

          return (
            <Card key={product.id || index} className={styles.card}>
              <Link href={`/products/${product.name}?id=${product.id}`} className={styles.link}>
                <CardHeader>
                  <CardTitle className={styles.cardTitle}>{product.name}</CardTitle>
                  {product.weekSale && <span className={styles.saleBadge}>On Sale</span>}
                </CardHeader>
                <CardContent>
                  <div className={styles.image_wrapper}>
                    {selected?.variantInStock !== false ? (
                      <Image src="/next.svg" alt={product.name} fill />
                    ) : (
                      <div className={styles.outOfStockOverlay}>Out of Stock</div>
                    )}
                  </div>
                </CardContent>
              </Link>

              <CardDescription className={styles.description}>
                {regex(product.description, 7)}
              </CardDescription>

              {/* Variant selectors */}
              {optionTypes.map((type) => {
                const labels = Array.from(new Set(
                  allVariants.map(v => v.options?.[type])
                )).filter(Boolean)

                const sortedLabels = sortLabels(labels, type)

                return (
                  <div className={styles.variantSection} key={type}>
                    <p className={styles.variantLabel}>{type}</p>
                    <div className={styles.options}>
                      {sortedLabels.map((label, i) => {
                        // Is this option part of any valid combination with other selected options?
                        const tempOptions = {
                          ...Object.fromEntries(optionTypes.map(t => [t, null])),
                          ...Object.fromEntries(Object.entries(selected).map(([t, val]) => [t, val?.options?.[t]])),
                          [type]: label,
                        }

                        const isValid = validCombos.some(combo =>
                          optionTypes.every(optType => {
                            return !tempOptions[optType] || combo[optType] === tempOptions[optType]
                          })
                        )

                        const variantObj = allVariants.find(v => v.options?.[type] === label)
                        const isSelected = selected[type]?.id === variantObj?.id

                        return (
                          <Button
                            key={i}
                            value={JSON.stringify(variantObj)}
                            onClick={(e) => handleVariantSelect(index, type, e.target.value)}
                            className={`${styles.optionBtn} ${isSelected ? styles.active : ''}`}
                            variant="outline"
                            disabled={!isValid}
                          >
                            {label}
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

              <AddToCartButton
                product={{
                  ...product,
                  ...optionTypes.reduce((acc, type) => {
                    if (selected[type]) acc[type] = selected[type]
                    return acc
                  }, {})
                }}
                disabled={shouldDisable}
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
