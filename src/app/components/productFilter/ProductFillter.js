'use client'
import React, { useState, useEffect } from 'react'

function ProductFillter({ items, setFilterd }) {
  const categories = [
    { id: 'cat001', name: 'T-Shirts' },
    { id: 'cat002', name: 'Caps' },
    { id: 'cat003', name: 'Tracksuits' }
  ]

  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedPrice, setSelectedPrice] = useState('')
  const [inStockOnly, setInStockOnly] = useState(false)

  useEffect(() => {
    let filtered = [...items]

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((item) => item.categoryId === selectedCategory)
    }

    // Price filter
    if (selectedPrice === 'low') {
      filtered = filtered.filter((item) => item.price < 200)
    } else if (selectedPrice === 'mid') {
      filtered = filtered.filter((item) => item.price >= 200 && item.price <= 400)
    } else if (selectedPrice === 'high') {
      filtered = filtered.filter((item) => item.price > 400)
    }

    // In-stock filter
    if (inStockOnly) {
      filtered = filtered.filter((item) => item.inStock === true)
    }

    setFilterd(filtered)
  }, [selectedCategory, selectedPrice, inStockOnly])

  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
      {/* Category Filter */}
      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Price Filter */}
      <select value={selectedPrice} onChange={(e) => setSelectedPrice(e.target.value)}>
        <option value="">All Prices</option>
        <option value="low">Under R200</option>
        <option value="mid">R200 - R400</option>
        <option value="high">Over R400</option>
      </select>

      {/* In Stock Filter */}
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
        />{' '}
        In Stock Only
      </label>
    </div>
  )
}

export default ProductFillter