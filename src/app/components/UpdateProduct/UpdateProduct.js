'use client'

import React, { useState, useEffect } from 'react'
import { editProduct } from '../../utils/admincalls'
import Upload from '../Upload/Upload'
import Image from 'next/image'

export default function UpdateProduct({ product, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imagePath: '',
    price: '',
    cost:'',
    categoryId: '',
  })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/getcategories')
        const data = await res.json()
        setCategories(data)
      } catch {
        // optionally handle errors
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
        cost:product.cost||'',
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
      const dataToSend = {
        ...formData,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
      }
      await editProduct(product.id, dataToSend)
      onSuccess && onSuccess()
    } catch (err) {
      setError(err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const isFormValid =
    formData.name &&
    formData.description &&
    formData.price &&
    formData.categoryId

   
  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
    >
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
      <Image src={formData?.imagePath} alt={formData.name} height={300} width={300} />
      <Upload
        prod={formData}
        onImageChange={setFormData}
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
      <input
              type="number"
              name="cost"
              placeholder="cost"
              value={formData.cost}
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
        disabled={loading || !isFormValid}
        className="bg-yellow-600 text-white px-4 py-2 rounded col-span-1 md:col-span-2"
      >
        {loading ? 'Updating...' : 'Update Product'}
      </button>
    </form>
  )
}
