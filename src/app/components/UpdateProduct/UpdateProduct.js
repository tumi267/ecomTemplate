'use client'

import React, { useState, useEffect } from 'react'
import { editProduct } from '../../utils/admincalls'


export default function UpdateProduct({ product, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imagePath: '',  // optional
    price: '',
    categoryId: '',
  })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load categories for the dropdown
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/getcategories')
        const data = await res.json()
        setCategories(data)
      } catch {
        // handle errors silently or show a message
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        imagePath: product.imagePath || '',
        price: product.price || '',
        categoryId: product.categoryId || '',
      })
    }
  }, [product])

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await editProduct(product.id, formData)
      onSuccess && onSuccess()
    } catch (err) {
      setError(err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {error && <div className="text-red-600">{error}</div>}

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="border px-3 py-2 rounded"
      />

      <input
        type="text"
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
        className="border px-3 py-2 rounded"
      />

      {/* Optional imagePath input
      <input
        type="text"
        name="imagePath"
        placeholder="Image Path (optional)"
        value={formData.imagePath}
        onChange={handleChange}
        className="border px-3 py-2 rounded"
      /> */}

      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        required
        step="0.01"
        className="border px-3 py-2 rounded"
      />

      <select
        name="categoryId"
        value={formData.categoryId}
        onChange={handleChange}
        required
        className="border px-3 py-2 rounded"
      >
        <option value="" disabled>
          Select Category
        </option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <button
        type="submit"
        disabled={loading}
        className="bg-yellow-600 text-white px-4 py-2 rounded col-span-1 md:col-span-2"
      >
        {loading ? 'Updating...' : 'Update Product'}
      </button>
    </form>
  )
}
