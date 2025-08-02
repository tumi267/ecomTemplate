'use client'

import React, { useState, useEffect } from 'react'
import { addProduct } from '../../utils/admincalls'
import styles from './AddProduct.module.css'
export default function AddProduct({ onSuccess,closeAdd }) {
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    qty: '',
    trackQty: true,
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
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'trackQty' ? value === 'true' : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        qty: parseInt(formData.qty),
      }

      await addProduct(payload)

      setFormData({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        qty: '',
        trackQty: true,
      })

      setTimeout(() => {
        onSuccess && onSuccess()
        setLoading(false)
      }, 400)
    } catch (err) {
      setError(err.message || 'Unknown error')
      setLoading(false)
    }
  }

  return (
    <div className={styles.contain}>
      <button className={styles.closeBtn} onClick={()=>{closeAdd(false)}}>x</button>
    <form onSubmit={handleSubmit} className={styles.from}>
      {error && <div className="text-red-600 col-span-full">{error}</div>}
      <label>Product Name</label>
      <br/>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="border px-3 py-2 rounded"
      />
      <br/>
      <lable>Description</lable>
      <br/>
      <textarea
        type="text"
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
        className={styles.textArea}
      />
      <br/>
      <lable>Price</lable>
      <br/>
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
      <br/>
      <lable>Quantity</lable>
      <br/>
      <input
        type="number"
        name="qty"
        placeholder="Quantity"
        value={formData.qty}
        onChange={handleChange}
        required
        className="border px-3 py-2 rounded"
      />
      <br/>

      <select
        name="trackQty"
        value={formData.trackQty}
        onChange={handleChange}
        className="border px-3 py-2 rounded"
      >
        <option value="true">Track Quantity</option>
        <option value="false">Don&#39;t Track Quantity</option>
      </select>
      <br/>
      <select
        name="categoryId"
        value={formData.categoryId}
        onChange={handleChange}
        required
        className="border px-3 py-2 rounded"
      >
        <option value="" disabled>Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <br/>
      <button
        type="submit"
        disabled={loading}
        className={styles.Btn}
      >
        {loading ? 'Adding...' : 'Add Product'}
      </button>
    </form>
    </div>
  )
}
