'use client'

import { useState } from 'react'
import { editVariant } from '../../utils/admincalls'

export default function UpdateVariantForm({ variant, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    price: variant.price,
    qty: variant.qty,
    trackQty: variant.trackQty,
  })

  const [options, setOptions] = useState(variant.options || {})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleOptionChange = (key, value) => {
    setOptions((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleAddOption = () => {
    setOptions((prev) => ({
      ...prev,
      ['']: '',
    }))
  }

  const handleRemoveOption = (keyToRemove) => {
    const updated = { ...options }
    delete updated[keyToRemove]
    setOptions(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await editVariant(variant.id, {
        ...formData,
        price: parseFloat(formData.price),
        qty: parseInt(formData.qty),
        options,
      })
      onSuccess()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 grid grid-cols-2 gap-2 text-sm bg-gray-50 p-3 rounded">
      <div className="col-span-2 font-medium">Options</div>
      {Object.entries(options).map(([key, value], index) => (
        <div key={index} className="col-span-2 flex gap-2">
          <input
            placeholder="Key (e.g. size)"
            value={key}
            onChange={(e) => {
              const newKey = e.target.value
              const updated = { ...options }
              delete updated[key]
              updated[newKey] = value
              setOptions(updated)
            }}
            className="w-1/2 border px-2 py-1 rounded"
          />
          <input
            placeholder="Value (e.g. M)"
            value={value}
            onChange={(e) => handleOptionChange(key, e.target.value)}
            className="w-1/2 border px-2 py-1 rounded"
          />
          <button
            type="button"
            onClick={() => handleRemoveOption(key)}
            className="text-red-600 text-xs"
          >
            ✕
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddOption}
        className="col-span-2 text-xs text-blue-600 underline"
      >
        + Add Option
      </button>

      <input
        name="price"
        value={formData.price}
        onChange={handleChange}
        type="number"
        step="0.01"
        placeholder="Price"
        className="col-span-1 border px-2 py-1 rounded"
      />

      <input
        name="qty"
        value={formData.qty}
        onChange={handleChange}
        type="number"
        placeholder="Quantity"
        className="col-span-1 border px-2 py-1 rounded"
      />

      <label className="col-span-2 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="trackQty"
          checked={formData.trackQty}
          onChange={handleChange}
        />
        Track Quantity
      </label>

      <button
        type="submit"
        disabled={loading}
        className="col-span-1 bg-blue-600 text-white px-3 py-1 rounded"
      >
        {loading ? 'Updating...' : 'Update'}
      </button>

      <button
        type="button"
        onClick={onCancel}
        className="col-span-1 bg-gray-500 text-white px-3 py-1 rounded"
      >
        Cancel
      </button>
    </form>
  )
}
