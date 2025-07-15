'use client'

import React, { useState, useEffect } from 'react'
import { addProduct } from '../../utils/admincalls'

export default function AddProduct({ onSuccess }) {
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/getcategories')
        const data = await res.json()
        setCategories(data)
      } catch (err) {
        console.error('Failed to load categories', err)
      }
    }
    fetchCategories()
  }, [])

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await addProduct(formData)
      setFormData({
        name: '',
        description: '',
        price: '',
        categoryId: '',
      })
      setTimeout(() => {
        onSuccess && onSuccess()
        setLoading(false)
      }, 4000) // 500ms delay for better UX feedback
    } catch (err) {
      setError(err.message || 'Unknown error')
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
        className="bg-blue-600 text-white px-4 py-2 rounded col-span-1 md:col-span-2"
      >
        {loading ? 'Adding...' : 'Add Product'}
      </button>
    </form>
  )
}

