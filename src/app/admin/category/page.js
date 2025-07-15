'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardDescription, CardTitle } from '../../../components/ui/card'
import AddCategorie from '../../components/AddCategorie/AddCategorie'
import UpdateCategorie from '../../components/updatecategory/updatecategory'

function Categories() {
  const [categories, setCategories] = useState([])
  const [editId, setEditId] = useState(null)

  const fetchCategories = async () => {
    const res = await fetch('/api/getcategories')
    const data = await res.json()
    setCategories(data)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <div>
      <h2>Categories</h2>
      <AddCategorie onSuccess={fetchCategories} />

      {categories.map((cat) => (
        <div key={cat.id} style={{ marginBottom: '1.5rem' }}>
          {rendercard(cat.name, cat.description, cat.products)}

          <button
            style={{ marginTop: '0.5rem' }}
            onClick={() => setEditId(editId === cat.id ? null : cat.id)}
          >
            {editId === cat.id ? 'Cancel' : 'Edit'}
          </button>

          {editId === cat.id && (
            <UpdateCategorie
              category={cat}
              onSuccess={() => {
                setEditId(null)
                fetchCategories()
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default Categories

const rendercard = (name, description, products) => (
  <Card>
    <CardTitle>{name}</CardTitle>
    <CardDescription>{description}</CardDescription>
    <div>
      <p>{Array.isArray(products) ? products.length : 0}</p>
    </div>
  </Card>
)
