'use client'
import React from 'react'
import { useParams } from 'next/navigation'

function OrdersId() {
    const params =useParams()
    const {id}=params
  return (
    <div>OrdersId
        orderid:{id}
    </div>
  )
}

export default OrdersId