
'use client'
import Image from 'next/image'

import ProductGrid from '../../components/productgrid/Productgrid'
import ProductFillter from '../../components/productFilter/ProductFillter'
import { useEffect, useState } from 'react'
import { fetchProducts } from '../../utils/admincalls'
import { useMenuStore } from '../../libs/menu'

function Product() {
  const [items,setItems]=useState([])
  const [filtered,setFilterd]=useState([])
  const { categories, fetchCategories, loading, error } = useMenuStore()
  useEffect(()=>{
    let getprod=async()=>{
      const res=await fetchProducts()
      setItems(res)
    }
    getprod()
  },[items])
  useEffect(()=>{
    if (categories.length === 0) {
      fetchCategories()
    }
      
  },[categories.length, fetchCategories])
  return (
    <div>
      <ProductFillter
      items={items}
      setFilterd={setFilterd}
      categories={categories}
      />
     <ProductGrid
    title='Products'
    items={filtered.length>0?filtered:items}
    param={1}
    categories={categories}
    />
    </div>
  )
}

export default Product