
'use client'
import Image from 'next/image'
import db from '../libs/db.json'
import ProductGrid from '../components/productgrid/Productgrid'
import ProductFillter from '../components/productFilter/ProductFillter'
import { useEffect, useState } from 'react'

function product() {
  const items=db.categories.flatMap((e)=>{return e.items})
  const [filtered,setFilterd]=useState([])

  return (
    <div>
      <ProductFillter
      items={items}
      setFilterd={setFilterd}
      />
     <ProductGrid
    title='Products'
    items={filtered.length>0?filtered:items}
    param={1}
    />
    </div>
  )
}

export default product