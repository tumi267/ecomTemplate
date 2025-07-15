'use client'
import React, { useState } from 'react'
import { updatecategory } from '../../utils/admincalls'

function UpdateCategorie({ category, onSuccess }) {
  const [name, setName] = useState(category.name)
  const [description, setDescription] = useState(category.description || '')
  const [status, setStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updatecategory(category.id, name, description)
      setStatus('success')
      setTimeout(() => setStatus(null), 4000)
      onSuccess?.()
    } catch (err) {
      setStatus('error')
      setTimeout(() => setStatus(null), 4000)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='text'
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder='New name'
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder='New description'
      />
      <button type='submit'>Update</button>
      {status === 'success' && <p>✅ Category updated!</p>}
      {status === 'error' && <p>❌ Update failed.</p>}
    </form>
  )
}

export default UpdateCategorie
