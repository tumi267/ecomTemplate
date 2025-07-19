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

// Compare two option sets for exact match
const isMatchingOptions = (optionsA = {}, optionsB = {}) => {
  const keysA = Object.keys(optionsA)
  const keysB = Object.keys(optionsB)
  if (keysA.length !== keysB.length) return false
  return keysA.every(key => optionsA[key] === optionsB[key])
}

function ProductGrid({ title, items, selector, param, categories }) {
  const [cardinfo, setCardInfo] = useState([])
  const [variantsState, setVariantsState] = useState({})

  useEffect(() => {
    if (selector?.toLowerCase() === 'best seller' || selector?.toLowerCase() === 'week sale') {
      setCardInfo(items)
    } else if (selector) {
      const seller = items.find(e => e.name === selector)
      setCardInfo(seller?.items || [])
    } else {
      setCardInfo(items)
    }
  }, [items, selector])

  // Shorten description text
  const truncateText = (text = '', numWords = 7) => {
    const words = text.trim().split(/\s+/).filter(Boolean)
    return words.slice(0, numWords).join(' ') + (words.length > numWords ? '...' : '')
  }

  // Handle selecting a variant option by label (e.g. size: 'M')
  const handleVariantSelect = (productIndex, optionType, label) => {

    const product = cardinfo[productIndex]
    const variants = product?.variants || []

    const prevState = variantsState[productIndex] || {}
    const updatedOptions = {
      ...prevState.selectedOptions,
      [optionType]: label,
    }

    // Find variant matching all selected options
    const matchingVariant = variants.find(variant =>
      isMatchingOptions(variant.options, updatedOptions)
    ) || null

    setVariantsState(prev => ({
      ...prev,
      [productIndex]: {
        selectedOptions: updatedOptions,
        selectedVariant: matchingVariant,
        variantInStock: matchingVariant?.trackQty === false || matchingVariant?.qty > 0,
        isValid: !!matchingVariant,
      }
    }))
  }

  // Define size order for sorting size labels nicely
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
          <li>
            <Link href="/products" className={param === 1 ? styles.active : ''}>
              Products
            </Link>
          </li>
          {categories?.map(cat => (
            <li key={cat.id}>
              <Link
                href={`/category/${cat.name}?id=${cat.id}`}
                className={param === cat.name ? styles.active : ''}
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className={styles.card_contain}>
        {cardinfo.map((product, index) => {
          const variants = product.variants || []
          const optionTypes = [...new Set(variants.flatMap(v => Object.keys(v.options || {})))]
          const selected = variantsState[index] || {}
          const selectedOptions = selected.selectedOptions || {}
          const selectedVariant = selected.selectedVariant

          const allSelected = optionTypes.every(type => selectedOptions[type])
          const isOutOfStock = selectedVariant
            ? (selectedVariant.trackQty !== false && selectedVariant.qty <= 0)
            : false
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
                    {selected.variantInStock !== false ? (
                      <Image src={product?.imagePath} alt={product.name} fill />
                    ) : (
                      <div className={styles.outOfStockOverlay}>Out of Stock</div>
                    )}
                  </div>
                </CardContent>
              </Link>

              <CardDescription className={styles.description}>
                {truncateText(product.description, 7)}
              </CardDescription>

              {/* Variant selectors */}
              {optionTypes.map(type => {
                const labels = Array.from(new Set(
                  variants.map(v => v.options?.[type])
                )).filter(Boolean)

                const sortedLabels = sortLabels(labels, type)

                return (
                  <div className={styles.variantSection} key={type}>
                    <p className={styles.variantLabel}>{type}</p>
                    <div className={styles.options}>
                      {sortedLabels.map(label => {
                        const isSelected = selectedOptions[type] === label
                        return (
                          <Button
                            key={label}
                            variant={isSelected ? 'default' : 'outline'}
                            className={`${styles.optionBtn} ${isSelected ? styles.active : ''}`}
                            onClick={() => handleVariantSelect(index, type, label)}
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
                  variant: selectedVariant,
                }}
                disabled={variants.length == 0
                  ? (product.trackQty ? product.qty <= 0 : false)
                  : (!selectedVariant || isOutOfStock)}
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
