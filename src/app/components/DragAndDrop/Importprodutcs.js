'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

export default function ProductsCsvUploader() {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState(null)

  // Handle dropped files
  const onDrop = useCallback(async (acceptedFiles) => {
    setUploading(true)
    setMessage(null)

    if (acceptedFiles.length === 0) {
      setMessage('No file selected')
      setUploading(false)
      return
    }

    const file = acceptedFiles[0]

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/import/products', {
        method: 'POST',
        
        body: formData,
      })

      if (!res.ok) throw new Error('Upload failed')

      const data = await res.json()
      setMessage(`Upload successful: ${data.message || 'Categories imported'}`)
    } catch (error) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv', '.tsv'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'application/vnd.ms-excel.sheet.binary.macroEnabled.12': ['.xlsb'],
    'application/vnd.oasis.opendocument.spreadsheet': ['.ods'],
    'application/json': ['.json'] },
    multiple: false,
  })

  return (
    <div
      {...getRootProps()}
      style={{
        border: '2px dashed #0070f3',
        padding: '30px',
        textAlign: 'center',
        cursor: 'pointer',
        background: isDragActive ? '#e0f0ff' : '',
      }}
    >
      <input {...getInputProps()} />
      {uploading ? (
        <p>Uploading...</p>
      ) : isDragActive ? (
        <p>Drop your CSV file here ...</p>
      ) : (
        <p>Drag & drop a supplier CSV file here, or click to select file</p>
      )}
      {message && <p>{message}</p>}
    </div>
  )
}
