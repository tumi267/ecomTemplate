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


function ProductGrid({ title, items, selector, param ,categories}) {
  const [cardinfo, setcardinfo] = useState([])
 
  useEffect(() => {
    if (selector && selector.toLowerCase() === "best seller") {
      setcardinfo(items)
    } else if (selector && selector.toLowerCase() === "week sale") {
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

  const [variants, setVariants] = useState({})

  const updateVariant = (index, type, value) => {
    const variantValue = JSON.parse(value)
    setVariants(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        [type]: variantValue,
        variantInStock: variantValue.trackQty === false || variantValue.qty > 0
      }
    }))
  }

  return (
    <div>
      <h1 className={styles.title}>{title}</h1>

      {param !== undefined && (
        <ul className={styles.navList}>
          <li><Link href="/products" className={param === 1 ? styles.active : ''}>Products</Link></li>
          {categories?.map((e)=>{
            return<li key={e.id}>
              <Link href={`/category/${e.name}?id=${e.id}`} className={param === e.name ? styles.active : ''}>{e.name}</Link>
            </li>
          })}
        </ul>
      )}

      <div className={styles.card_contain}>
        {cardinfo?.map((product, index) => {
          const uniqueTypes = [...new Set(product.variants?.map(v => v.type))]

          const selectedVariantState = variants[index] || {}
          const allSelected = uniqueTypes.every(type => selectedVariantState[type])

          const selectedVariant = {
            ...product,
            ...uniqueTypes.reduce((acc, type) => {
              const selected = selectedVariantState[type]
              if (selected) {
                acc[type] = {
                  ...selected,
                  trackQty: selected.trackQty !== undefined ? selected.trackQty : true
                }
              }
              return acc
            }, {})
          }

          const isOutOfStock = uniqueTypes.some(type => {
            const selected = selectedVariantState[type]
            return selected?.trackQty !== false && selected?.qty <= 0
          })

          const shouldDisable = !allSelected || isOutOfStock

          return (
            <Card key={index} className={styles.card}>
              <Link href={`/products/${product.name}?id=${product.id}`} className={styles.link}>
                <CardHeader>
                  <CardTitle className={styles.cardTitle}>{product.name}</CardTitle>
                  {product.weekSale && <span className={styles.saleBadge}>On Sale</span>}
                </CardHeader>
                <CardContent>
                  <div className={styles.image_wrapper}>
                    {selectedVariantState?.variantInStock !== false ? (
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

              {/* Variant Selector */}
              {uniqueTypes.map((type) => (
                <div className={styles.variantSection} key={type}>
                  <p className={styles.variantLabel}>{type}</p>
                  <div className={styles.options}>
                    {product.variants
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
                        const selectedStr = JSON.stringify(selectedVariantState[type] || {})
                        return (
                          <Button
                            key={i}
                            value={valueStr}
                            onClick={(e) => {
                              e.preventDefault()
                              updateVariant(index, type, valueStr)
                            }}
                            className={`${styles.optionBtn} ${selectedStr === valueStr ? styles.active : ''}`}
                            variant="outline"
                          >
                            {variant.label}
                          </Button>
                        )
                      })}
                  </div>
                </div>
              ))}

              <AddToCartButton
                product={selectedVariant}
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
