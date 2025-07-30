'use client'

import React, { useState, useEffect } from 'react'
import { editProduct } from '../../utils/admincalls'
import Upload from '../Upload/Upload'
import Image from 'next/image'
import styles from './updateProduct.module.css'
import {Button} from '../../../components/ui/button'
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
      <label className={styles.label}>Product Name</label>
      <br/>
      <div className={styles.prodInputsContain}>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="border px-3 py-2 rounded"
      />
      </div>
      <hr/>
      <label className={styles.label}>Description</label>
      <br/>
      <div className={styles.prodInputsContain}>
      <textarea
        type="text"
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
        className={styles.textArea}
      />
      <div>
      <div className={styles.imageContain}>
      <Image src={formData?.imagePath?formData.imagePath:'/next.svg'} alt={formData.name} fill />
      </div>
      <label>Uplaod image</label>
      <br/>
      <Upload
        prod={formData}
        onImageChange={setFormData}
      />
      </div>
      </div>
      <hr/>
      <div className={styles.prodInputsContain}>
      <span>
      <label className={styles.label}>Price</label>
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
      </span>
      <span>
      <label className={styles.label}>Cost</label>
      <br/>
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
      </span>
      <span>
      <label className={styles.label}>categoy</label>
      <br/>
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
      </span>
      </div>
      <div className={styles.prodInputsContain}>
      <button
        type="submit"
        disabled={loading || !isFormValid}
        className={styles.Btn}
      >
        {loading ? 'Updating...' : 'Update Product'}
      </button>
      </div>
    </form>
  )
}
