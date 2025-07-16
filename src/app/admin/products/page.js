'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardDescription, CardTitle, CardContent, CardHeader } from '../../../components/ui/card'
import AddProduct from '../../components/AddProduct/AddProduct'
import UpdateProduct from '../../components/UpdateProduct/UpdateProduct'
import AddVariantForm from '../../components/AddVariant/AddVariant'
import UpdateVariantForm from '../../components/UpdateVariantForm/UpdateVariantForm'

function Products() {
  const [products, setProducts] = useState([])
  const [editId, setEditId] = useState(null)
  const [editVariantId, setEditVariantId] = useState(null)

  const fetchProducts = async () => {
    const res = await fetch('/api/product')
    const data = await res.json()
    setProducts(data)
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
          <div key={product.id}>
            {renderCard(
              product,
              () => setEditId(editId === product.id ? null : product.id),
              fetchProducts,
              editVariantId,
              setEditVariantId
            )}

            {editId === product.id && (
              <UpdateProduct
                product={product}
                onSuccess={() => {
                  setEditId(null)
                  fetchProducts()
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products

// ✅ Updated renderCard for dynamic options
const renderCard = (product, onEditToggle, fetchProducts, editVariantId, setEditVariantId) => {
  const inStock = product.variants?.some(
    (v) => v.trackQty === false || v.qty > 0
  )

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {product.name}
          {product.weekSale && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              On Sale
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="relative h-40 w-full mb-2 bg-gray-100 rounded overflow-hidden" />

        <CardDescription className="mb-1 text-sm text-gray-700">
          {product.description?.split(' ').slice(0, 10).join(' ') + '...'}
        </CardDescription>

        <CardDescription className="font-bold text-lg text-black">
          R {product.price}
        </CardDescription>

        {/* ✅ Dynamic Variant Listing */}
        {product.variants && product.variants.length > 0 && (
          <ul className="mt-2 text-sm text-gray-700">
            {product.variants.map((variant) => (
              <li key={variant.id} className="mb-1">
                {editVariantId === variant.id ? (
                  <UpdateVariantForm
                    variant={variant}
                    onSuccess={() => {
                      setEditVariantId(null)
                      fetchProducts()
                    }}
                    onCancel={() => setEditVariantId(null)}
                  />
                ) : (
                  <>
                    <strong>
                      {Object.entries(variant.options || {})
                        .map(([key, val]) => `${key}: ${val}`)
                        .join(', ')}
                    </strong>{' '}
                    – R {variant.price} ({variant.qty} in stock)
                    <button
                      onClick={() => setEditVariantId(variant.id)}
                      className="ml-2 text-sm text-blue-600 underline"
                    >
                      Edit
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* ✅ Add Variant Button */}
        <AddVariantForm productId={product.id} onSuccess={fetchProducts} />

        <button
          onClick={onEditToggle}
          className="mt-3 bg-yellow-500 text-white px-3 py-1 rounded text-sm"
        >
          Edit
        </button>
      </CardContent>
    </Card>
  )
}
