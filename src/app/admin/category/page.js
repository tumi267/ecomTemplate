import React from 'react'
import { getCategory } from '../../libs/category'
import { Card, CardDescription, CardTitle } from '../../../components/ui/card'

async function categories() {
    const categories =await getCategory()

  return (
    <div>
        categories
        {categories.map((y)=>{
            return<div key={y.id}>
            {rendercard(y.name,y.description,y.Products)}
        </div>})}
    </div>
  )
}

export default categories

const rendercard=(e,d,p)=>{
    
    return <Card >
    <CardTitle>{e}</CardTitle>
    <CardDescription>{d}</CardDescription>
    <div><p>{p !== null && p !== undefined ? p.length : 0}</p></div>
  </Card>
  }