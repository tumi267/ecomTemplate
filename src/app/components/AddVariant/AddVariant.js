'use client'

import React, { useState } from 'react'
import { addVariant } from '../../utils/admincalls'

export default function AddVariantForm({ productId, onSuccess }) {
  const [fields, setFields] = useState([{ key: '', value: '' }])
  const [price, setPrice] = useState('')
  const [qty, setQty] = useState('')
  const [trackQty, setTrackQty] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFieldChange = (index, type, val) => {
    const updated = [...fields]
    updated[index][type] = val
    setFields(updated)
  }

  const addField = () => {
    setFields([...fields, { key: '', value: '' }])
  }

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const options = fields.reduce((acc, field) => {
        if (field.key.trim()) acc[field.key.trim()] = field.value.trim()
        return acc
      }, {})

      await addVariant({
        productId,
        options,
        price: parseFloat(price),
        qty: parseInt(qty),
        trackQty,
      })

      // Reset
      setFields([{ key: '', value: '' }])
      setPrice('')
      setQty('')
      setTrackQty(false)

      onSuccess && onSuccess()
    } catch (err) {
      setError(err.message || 'Error adding variant')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}

      <div className="space-y-2">
        <h3 className="font-medium">Variant Options</h3>
        {fields.map((field, index) => (
          <div key={index} className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Option Name (e.g. size)"
              value={field.key}
              onChange={(e) => handleFieldChange(index, 'key', e.target.value)}
              className="border px-2 py-1 rounded w-1/2"
              required
            />
            <input
              type="text"
              placeholder="Option Value (e.g. M)"
              value={field.value}
              onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
              className="border px-2 py-1 rounded w-1/2"
              required
            />
            {fields.length > 1 && (
              <button type="button" onClick={() => removeField(index)} className="text-red-500">
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addField}
          className="text-sm text-blue-600 underline"
        >
          + Add Another Option
        </button>
      </div>

      <input
        type="number"
        step="0.01"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="border px-2 py-1 rounded w-full"
        required
      />

      <input
        type="number"
        placeholder="Quantity"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
        className="border px-2 py-1 rounded w-full"
        required
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={trackQty}
          onChange={(e) => setTrackQty(e.target.checked)}
        />
        Track Quantity
      </label>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Adding...' : 'Add Variant'}
      </button>
    </form>
  )
}
