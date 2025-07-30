'use client'
import React, { useState } from 'react'
import { updatecategory } from '../../utils/admincalls'
import styles from './updateCategory.module.css'
import Upload from '../Upload/Upload'
import Image from 'next/image'
function UpdateCategorie({ category, onSuccess,closemod }) {
  const [name, setName] = useState(category.name)
  const [description, setDescription] = useState(category.description || '')
  const[imagePath,setImagePath]=useState()
  const [status, setStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const image=imagePath.imagePath

    try {
      await updatecategory(category.id, name, description,image)
      setStatus('success')
      setTimeout(() => setStatus(null), 4000)
      onSuccess?.()
    } catch (err) {
      setStatus('error')
      setTimeout(() => setStatus(null), 4000)
    }
  }

  return (
    <div className={styles.contain}>
    <button onClick={()=>{closemod(null)}} className={styles.closeBtn}>x</button>
    <form onSubmit={handleSubmit} className={styles.from}>
      <input
        type='text'
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder='New name'
      />
      <div className={styles.imageContain}>
      <Image src={imagePath?.imagePath || category?.imagePath || '/next.svg'} alt={category.name} fill />
      </div>
      <label>Uplaod image</label>
      <br/>
      <Upload
       prod={category}
       onImageChange={setImagePath}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder='New description'
        className={styles.textArea}
      />
      <button type='submit'>Update</button>
      {status === 'success' && <p>✅ Category updated!</p>}
      {status === 'error' && <p>❌ Update failed.</p>}
    </form>
    </div>
  )
}

export default UpdateCategorie
