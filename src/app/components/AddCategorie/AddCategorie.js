'use client'
import React, { useState } from 'react'
import { addcategory } from '../../utils/admincalls'

function AddCategorie({ onSuccess }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await addcategory(name, description)
      setStatus('success')
      setTimeout(() => setStatus(null), 2000)
      setName('')
      setDescription('')
      onSuccess?.() // 👈 call parent to refresh categories
    } catch (err) {
      setStatus('error')
      setTimeout(() => setStatus(null), 2000)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='text'
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder='Name'
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder='Description'
      />
      <button type='submit'>Add Category</button>
      {status === 'success' && <p>✅ Category added!</p>}
      {status === 'error' && <p>❌ Failed to add category.</p>}
    </form>
  )
}

export default AddCategorie

