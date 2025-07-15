'use client'

import React, { useState } from 'react'
import { addVariant } from '../../utils/admincalls'

export default function AddVariantForm({ productId, onSuccess }) {
  const [formData, setFormData] = useState({
    type: '',
    label: '',
    price: '',
    qty: '',
    trackQty: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
  
    try {
      await addVariant({
        ...formData,
        price: parseFloat(formData.price),
        qty: parseInt(formData.qty),
        productId,
      })
  
      setFormData({
        type: '',
        label: '',
        price: '',
        qty: '',
        trackQty: false,
      })
  
      onSuccess && onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 grid grid-cols-2 gap-2 text-sm">
      {error && <div className="text-red-500 col-span-2">{error}</div>}

      <input
        name="type"
        value={formData.type}
        onChange={handleChange}
        placeholder="Type (e.g. size)"
        className="border px-2 py-1 rounded"
        required
      />
      <input
        name="label"
        value={formData.label}
        onChange={handleChange}
        placeholder="Label (e.g. M)"
        className="border px-2 py-1 rounded"
        required
      />
      <input
        name="price"
        type="number"
        step="0.01"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price"
        className="border px-2 py-1 rounded"
        required
      />
      <input
        name="qty"
        type="number"
        value={formData.qty}
        onChange={handleChange}
        placeholder="Qty"
        className="border px-2 py-1 rounded"
        required
      />
      <label className="flex items-center col-span-2">
        <input
          name="trackQty"
          type="checkbox"
          checked={formData.trackQty}
          onChange={handleChange}
          className="mr-2"
        />
        Track Quantity
      </label>

      <button
        type="submit"
        disabled={loading}
        className="col-span-2 bg-green-600 text-white px-3 py-1 rounded"
      >
        {loading ? 'Adding...' : 'Add Variant'}
      </button>
    </form>
  )
}
