'use client'
import ProductGrid from '@/app/components/productgrid/Productgrid'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import db from '../../libs/db.json'
import ProductFillter from '../../components/productFilter/ProductFillter'
function CategoryPage() {
    const params = useParams()
    
    let category = db.categories.filter((e) => e.name === params.id)
    const items=category.flatMap((e)=>{return e.items})
    
    const [filtered,setFilterd]=useState([])
 
  return (
    <div>
      <ProductFillter
      items={items}
      setFilterd={setFilterd}
      />
    <ProductGrid
    title={params.id}
    items={filtered.length>0?filtered:items}
   
    />
    </div>
  )
}

export default CategoryPage