'use client'
import ProductGrid from '../../../components/productgrid/Productgrid'
import { useParams ,useSearchParams} from 'next/navigation'
import React, { useEffect, useState } from 'react'
import ProductFillter from '../../../components/productFilter/ProductFillter'
import {fetchcategory, getProductsByCategory} from '../../../utils/admincalls'
import { useMenuStore } from '../../../libs/menu'
function CategoryPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const categoryId = searchParams.get('id')
    const [items,setitems]=useState([])

    useEffect(() => {
      const fetchProducts = async () => {
        try {
          if (!categoryId) return
          const prod = await getProductsByCategory(categoryId)
          let {products}=prod
          setitems(products)
        } catch (err) {
          console.error('Error fetching products by category:', err)
        }
      }
  
      fetchProducts()
    }, [categoryId])
    
    const [filtered,setFilterd]=useState([])
    const { categories, fetchCategories, loading, error } = useMenuStore()
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
    title={params.id}
    items={filtered.length>0?filtered:items}
    param={params.id}
    categories={categories}
    />
    </div>
  )
}

export default CategoryPage