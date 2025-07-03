'use client'
import ProductGrid from '@/app/components/productgrid/Productgrid'
import { useParams } from 'next/navigation'
import React from 'react'
import db from '../../libs/db.json'
function CategoryPage() {
    const params = useParams()
  return (
    <div>
    <ProductGrid
    title={params.id}
    items={db.categories}
    selector={params.id}
    />
    </div>
  )
}

export default CategoryPage