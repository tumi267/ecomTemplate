'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardDescription, CardTitle, CardContent, CardHeader } from '../../../components/ui/card'
import AddProduct from '../../components/AddProduct/AddProduct'
import Image from 'next/image'
import styles from './product.module.css'
import Link from 'next/link'
import CreateDiscount from '../../components/CreateDiscount/CreateDiscount'
function Products() {
  const [products, setProducts] = useState([])
  const [editId, setEditId] = useState(null)
  const [editVariantId, setEditVariantId] = useState(null)

  const fetchProducts = async () => {
    const res = await fetch('/api/product')
    const data = await res.json()
    const sorted = [...data].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    )
    setProducts(sorted)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <AddProduct onSuccess={fetchProducts} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
        {products.map((product) => (
          <div key={product.id} className={styles.cardConatin}>
            {renderCard(
              product,
              fetchProducts,
            )}


            <hr/>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products


// ✅ Updated renderCard for dynamic options
const renderCard = (product,  fetchProducts, editVariantId, setEditVariantId) => {
  const inStock = product.variants?.some(
    (v) => v.trackQty === false || v.qty > 0
  )

  return (
    <Card className={styles.card}>
            {product.imagePath && (
  <div className={styles.imageContain}>
    
    <Image src={product.imagePath} alt="Product" fill objectFit='cover' />
  </div>
)}
      <CardHeader>
        <CardTitle className={styles.cardTitle}>
          {product.name}
          {product.weekSale && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              On Sale
            </span>
          )}
        </CardTitle>

      </CardHeader>

      
        <div className="relative h-40 w-full mb-2 bg-gray-100 rounded overflow-hidden" />

        <CardDescription className="mb-1 text-sm text-gray-700">
          {product.description?.split(' ').slice(0, 10).join(' ') + '...'}
        </CardDescription>

        <CardDescription className="font-bold text-lg text-black">
          R {product.weekSale?product.price-product.discount:product.price}{product.weekSale&&<p>sale</p>}
        </CardDescription>
        <div>
          add discount
          <CreateDiscount
          product={product}
          />
        </div>

        <Link href={`/admin/products/${product.id}`}>
        Edit
        </Link>
    </Card>
  )
}
