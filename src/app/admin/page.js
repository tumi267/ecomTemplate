import React from 'react'
import { Card, CardDescription, CardTitle } from '../../components/ui/card'
import styles from './admin.module.css'
import { getOrders, getOrdersPAID } from '../libs/product'

export const revalidate = 600 //revalidate every 10min
async function Admin() {
  let res = await getOrders()
  let customerNum = res.map(e => e.customerName).length

  let paidOrders = await getOrdersPAID()
  let salesData = paidOrders.map(e => JSON.parse(e.productJSON)) // This is an array of arrays

  // Flatten the nested arrays
  let flatSales = salesData.flat()

  // Calculate total sales amount
  let totalSalesAmount = salesData.length

  let totalSales = flatSales.map(e=>{return{price:e.product.price,qty:e.quantity,discount:e.product.discount}}).reduce((acc,item)=>{
    return acc + (item.price-item.discount)*item.qty
  },0)
  
  return (
    <div className={styles.cardContain}>
      {renderCard('sales', `total sales: ${totalSalesAmount}`)}
      {renderCard('customers', `total customers: ${customerNum}`)}
      {renderCard('products', `product sales: ${totalSales.toFixed(2)}`)}
    </div>
  )
}

export default Admin

// Fixed: parameter names and typo in function name
const renderCard = (title, description) => {
  return (
    <Card className={styles.card}>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </Card>
  )
}