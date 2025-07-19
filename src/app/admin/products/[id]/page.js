'use client'

import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import UpdateProduct from '../../../components/UpdateProduct/UpdateProduct'
import { getSingleProduct } from '../../../utils/admincalls'
import AddVariantForm from '../../../components/AddVariant/AddVariant'
import UpdateVariantForm from '../../../components/UpdateVariantForm/UpdateVariantForm'
import { calculateDiscount } from '../../../utils/salesdiscount'

function EditProduct() {
  const params = useParams()
  const { id } = params

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editVariantId, setEditVariantId] = useState(null)

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const res = await getSingleProduct(id)
      setProduct(res)
    } catch (err) {
      console.error('Failed to load product', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id])

  if (loading) return <p>Loading product...</p>
  if (!product) return <p>Product not found.</p>

  return (
    <div>
      <h1>Edit Product</h1>

      <UpdateProduct
        product={product}
        onSuccess={fetchProduct}
      />

      {/* Variant list */}
      {product.variants && product.variants.length > 0 && (
        <ul className="mt-2 text-sm text-gray-700">
          {product.variants.map((variant) => (
            <li key={variant.id} className="mb-1">
              {editVariantId === variant.id ? (
                <UpdateVariantForm
                  variant={variant}
                  onSuccess={() => {
                    setEditVariantId(null)
                    fetchProduct()
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

      {/* Add Variant */}
      <AddVariantForm
        productId={product.id}
        onSuccess={fetchProduct}
      />
    </div>
  )
}

export default EditProduct
