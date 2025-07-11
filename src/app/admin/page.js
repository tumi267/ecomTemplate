import React from 'react'
import { Card, CardDescription, CardTitle } from '../../components/ui/card'
import styles from './admin.module.css'
function Admin() {
  return (
    <div className={styles.cardContain}>
      {rendercard('sale','total sales:R0.00')}
      {rendercard('cutomers','total cutomers:0')}
      {rendercard('products','product sales:R0.00')}
    </div>
  )
}

export default Admin

const rendercard=(e,d)=>{
  return <Card className={styles.card}>
  <CardTitle>{e}</CardTitle>
  <CardDescription>{d}</CardDescription>
</Card>
}