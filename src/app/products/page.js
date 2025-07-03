
import Image from 'next/image'
import db from '../libs/db.json'
import ProductGrid from '../components/productgrid/Productgrid'

function product() {
  const items=db.categories.flatMap((e)=>{return e.items})
  
  return (
    <div>
     <ProductGrid
    title='Products'
    items={items}
    />
    </div>
  )
}

export default product