'use client'
import React, { useState } from 'react'
import { addcategory } from '../../utils/admincalls'
import styles from './addCategory.module.css'
function AddCategorie({ onSuccess,closemod }) {
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
    <div className={styles.contain}>
    <button onClick={()=>{closemod(false)}} className={styles.closeBtn}>x</button>
    <form onSubmit={handleSubmit} className={styles.from}>
    <label>Category Name</label>
      <input
        type='text'
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder='Name'
      />
      <lable>Description</lable>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder='Description'
        className={styles.textArea}
      />
      <button type='submit' className={styles.Btn}>Add Category</button>
      {status === 'success' && <p>✅ Category added!</p>}
      {status === 'error' && <p>❌ Failed to add category.</p>}
    </form>
    </div>
  )
}

export default AddCategorie

