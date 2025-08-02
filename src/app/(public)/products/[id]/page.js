'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '../../../../components/ui/button'
import AddToCartButton from '../../../components/AddToCartButton/AddToCartButton'
import styles from './product.module.css'
import { getSingleProduct } from '../../../utils/admincalls'
import Image from 'next/image'
import { useMemo } from 'react';
// Compare two sets of options for equality
const isMatchingOptions = (optionsA = {}, optionsB = {}) => {
  const keysA = Object.keys(optionsA)
  const keysB = Object.keys(optionsB)
  if (keysA.length !== keysB.length) return false
  return keysA.every(key => optionsA[key] === optionsB[key])
}

function Page() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const [prodinfo, setProdinfo] = useState({})
  const [selectedOptions, setSelectedOptions] = useState({})
  const [selectedVariant, setSelectedVariant] = useState(null)
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

  const variants = useMemo(() => prodinfo.variants || [], [prodinfo.variants]);

  const uniqueTypes = useMemo(() => {
    return [
      ...new Set(
        variants.flatMap(v => Object.keys(v.options || {}))
      )
    ];
  }, [variants]);

  useEffect(() => {
    if (!variants.length) return

    const selectedKeys = uniqueTypes.reduce((acc, type) => {
      if (selectedOptions[type]) acc[type] = selectedOptions[type]
      return acc
    }, {})

    const match = variants.find(v =>
      isMatchingOptions(v.options, selectedKeys)
    )

    setSelectedVariant(match || null)
  }, [selectedOptions, variants, uniqueTypes])

  const handleSelect = (type, label) => {
    setSelectedOptions(prev => ({
      ...prev,
      [type]: label
    }))
  }

  // Check if all required options are selected
  const isMissingOption = uniqueTypes.some(type => !selectedOptions[type])

  // Check if selectedVariant is out of stock
  const isOutOfStock =
    selectedVariant &&
    selectedVariant.trackQty !== false &&
    selectedVariant.qty <= 0

  // Disable Add to Cart if options are missing OR variant doesn't exist OR out of stock
  const disableAddToCart = variants.length == 0
  ? (prodinfo.trackQty ? prodinfo.qty <= 0 : false)
  : (isMissingOption || !selectedVariant || isOutOfStock)


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
            <div className={styles.imageContain}>
    
            <Image src={prodinfo.imagePath} alt={prodinfo.name} fill objectFit='cover' />
          </div>
          )}
        </div>

        {/* Product Details */}
        <div className={styles.detailsBox}>
          <section className={styles.section}>
            <h1 className={styles.title}>{prodinfo.name}</h1>
          </section>

          <section className={styles.section}>
            <h4>{prodinfo.description}</h4>
          </section>

          <section className={styles.section}>
            <h3>Price: <span>R {prodinfo.weekSale?prodinfo.price-prodinfo.discount:prodinfo.price}</span></h3>
          </section>

          {/* Variant Selectors */}
          {uniqueTypes.map(type => {
            const labels = [
              ...new Set(variants.map(v => v.options?.[type]).filter(Boolean))
            ]

            const sortedOptions = type.toLowerCase() === 'size'
              ? labels.sort((a, b) => {
                  const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
                  return (order.indexOf(a) === -1 ? 999 : order.indexOf(a)) -
                         (order.indexOf(b) === -1 ? 999 : order.indexOf(b))
                })
              : labels.sort()

            return (
              <section className={styles.section} key={type}>
                <h3>{type}</h3>
                <div className={styles.options}>
                  {sortedOptions.map(label => (
                    <Button
                      key={label}
                      variant={selectedOptions[type] === label ? 'default' : 'outline'}
                      onClick={() => handleSelect(type, label)}
                      className={`${styles.optionBtn} ${
                        selectedOptions[type] === label ? styles.active : ''
                      }`}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </section>
            )
          })}

          {/* Add to Cart */}
          <div className={styles.cartBtn}>
            <AddToCartButton
              product={{ ...prodinfo, variant: selectedVariant }}
              disabled={disableAddToCart}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
