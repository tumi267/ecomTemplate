
'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardDescription, CardTitle } from '../../../components/ui/card'
import AddCategorie from '../../components/AddCategorie/AddCategorie'
import UpdateCategorie from '../../components/updatecategory/updatecategory'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table'
import styles from './categories.module.css'
function Categories() {
  const [categories, setCategories] = useState([])
  const [editId, setEditId] = useState(null)
  const [isloading,setisloading]=useState(true)
  const [addCategorie,setAddcategory]=useState(false)
  const fetchCategories = async () => {
    const res = await fetch('/api/getcategories')
    const data = await res.json()
    setCategories(data)
    setisloading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])
if(isloading){
  return <div>
    loading
  </div>
}
  return (
    <div>
      <h2>Categories</h2>
      <button onClick={()=>{setAddcategory(true)}} className={styles.Btn}>Add Category</button>
      {addCategorie&&<AddCategorie onSuccess={fetchCategories} closemod={setAddcategory} />}

      {categories.map((cat) => (
        <div key={cat.id} style={{ marginBottom: '1.5rem' }}>
          {renderTable(cat.name, cat.description, cat.products,cat.id,editId,setEditId )}
          
          {editId === cat.id && (
            <UpdateCategorie
              category={cat}
              onSuccess={() => {
                setEditId(null)
                fetchCategories()
              }}
              closemod={setEditId}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default Categories

const renderTable = (name, description, products, catId,editId,setEditId) => (
  <Table className={styles.Table}>
    <TableHeader>
      <TableRow>
        <TableHead className={styles.theader}>Category</TableHead>
        <TableHead className={styles.theader}>Description</TableHead>
        <TableHead className={styles.theader}>Products</TableHead>
        <TableHead className={styles.theader}>Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell className="font-medium">{name}</TableCell>
        <TableCell>{description}</TableCell>
        <TableCell>{Array.isArray(products) ? products.length : 0}</TableCell>
        <TableCell><button
            style={{ marginTop: '0.5rem' }}
            onClick={() => setEditId(editId === catId ? null : catId)}
          >
            {editId === catId ? 'Cancel' : 'Edit'}
          </button></TableCell>
      </TableRow>
    </TableBody>
  </Table>
);
