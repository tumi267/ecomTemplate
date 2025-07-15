'use client'

import { useState } from 'react'
import { editVariant } from '../../utils/admincalls'

export default function UpdateVariantForm({ variant, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    type: variant.type,
    label: variant.label,
    price: variant.price,
    qty: variant.qty,
    trackQty: variant.trackQty,
  })
  const [loading, setLoading] = useState(false)

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

    try {
      await editVariant(variant.id, {
        ...formData,
        price: parseFloat(formData.price),
        qty: parseInt(formData.qty),
      })
      onSuccess()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 grid grid-cols-2 gap-2 text-sm bg-gray-50 p-2 rounded">
      <input name="type" value={formData.type} onChange={handleChange} placeholder="Type" />
      <input name="label" value={formData.label} onChange={handleChange} placeholder="Label" />
      <input name="price" value={formData.price} onChange={handleChange} type="number" />
      <input name="qty" value={formData.qty} onChange={handleChange} type="number" />
      <label className="col-span-2">
        <input type="checkbox" name="trackQty" checked={formData.trackQty} onChange={handleChange} />
        Track Qty
      </label>
      <button type="submit" disabled={loading} className="col-span-1 bg-blue-500 text-white px-2 py-1 rounded">
        Update
      </button>
      <button type="button" onClick={onCancel} className="col-span-1 bg-gray-400 text-white px-2 py-1 rounded">
        Cancel
      </button>
    </form>
  )
}
