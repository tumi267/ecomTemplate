'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardDescription, CardTitle, CardContent, CardHeader } from '../../../components/ui/card'
import AddProduct from '../../components/AddProduct/AddProduct'
import Image from 'next/image'
import styles from './product.module.css'
import Link from 'next/link'
import CreateDiscount from '../../components/CreateDiscount/CreateDiscount'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table'
import AdminQty from '../../components/adminQty/AdminQty'
function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addProd,setAddProd]=useState(false)
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/product')
      if (!res.ok) throw new Error('Failed to fetch products')
      const data = await res.json()
      const sorted = [...data].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      )
      setProducts(sorted)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  if (loading) return <div className="p-6">Loading products...</div>
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>
 
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        {addProd?<AddProduct onSuccess={fetchProducts} closeAdd={setAddProd} />:<button onClick={()=>{setAddProd(true)}} className={styles.Btn}>Add Product</button>}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No products found</p>
        </div>
      ) : (
        <Table className={styles.Table}>
          <TableHeader>
            <TableRow className={styles.tablerow}>
              <TableHead className={styles.theader}>Image</TableHead>
              <TableHead className={styles.theader}>Name</TableHead>
              <TableHead className={styles.theader}>Description</TableHead>
              <TableHead className={styles.theader}>Price</TableHead>
              <TableHead className={styles.theader}>qty</TableHead>
              <TableHead className={styles.theader}>Discount</TableHead>
              <TableHead className={styles.theader}>Actions</TableHead>
            </TableRow>
          </TableHeader >
          <TableBody>
            {products.map((product) => (
             
              <TableRow key={product.id} className={styles.tablerow}>
                {renderCard(product, fetchProducts)}
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

const renderCard = (product, fetchProducts,salesdata) => {
  const inStock = product.variants?.some(
    (v) => v.trackQty === false || v.qty > 0
  )

  return (
    <>
      
        <TableCell className={styles.imageContain}>
          <Image 
            src={product.imagePath?product.imagePath:'/next.svg'} 
            alt={product.name} 
            fill 
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100px, 150px"
          />
        </TableCell>
      
      
      <TableCell>
        <div className="flex items-center gap-2">
          <CardTitle className={styles.cardTitle}>
            {product.name}
          </CardTitle>
          {product.weekSale && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              Sale
            </span>
          )}
          {!inStock && (
            <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded">
              Out of Stock
            </span>
          )}
        </div>
      </TableCell>

      <TableCell className="text-sm text-gray-700">
        {product.description?.split(' ').slice(0, 10).join(' ') + (product.description?.split(' ').length > 10 ? '...' : '')}
      </TableCell>

      <TableCell className="font-bold">
        R {product.weekSale ? (product.price - (product.discount || 0)).toFixed(2) : product?.price}
      </TableCell>
      <TableCell>

        {/* input sales data here */}
      <AdminQty
      product={product}
      />
      </TableCell>
      <TableCell>
        {product.weekSale ? (
          
            <select>
              <option>
            R{product.discount} 
            </option>
            <option>
          <CreateDiscount product={product} onSuccess={fetchProducts} />
          </option>
          </select>
        ) : (
          <CreateDiscount product={product} onSuccess={fetchProducts} />
        )}
      </TableCell>

      <TableCell>
        <Link 
          href={`/admin/products/${product.id}`}
          className="text-blue-600 hover:underline"
        >
          Edit
        </Link>
      </TableCell>
    </>
  )
}

export default Products
