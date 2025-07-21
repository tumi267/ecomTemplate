// app/orders/[id]/page.jsx
'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getSingleOrder, timeAgo } from '../../../utils/admincalls'
import styles from './OrdersId.module.css'

function OrdersId() {
  const params = useParams()
  const { id } = params
  const [orderinfo, setOrderinfo] = useState()
  const [productinfo, setproductinfo] = useState([])

  useEffect(() => {
    const getData = async () => {
      const res = await getSingleOrder(id)
      let data = await res
      setOrderinfo(data.data)

      let orderdetails = JSON.parse(data.data.productJSON).map((e) => ({
        product: e.product,
        option: e.option,
        price: e.price,
        quantity: e.quantity,
        options: e.options,
      }))

      setproductinfo(orderdetails)
    }

    getData()
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h2>Order Status</h2>
        <p>{orderinfo?.status}</p>
        <p>{orderinfo && timeAgo(orderinfo.createdAt)}</p>

        <h2>Order Number</h2>
        <p>{orderinfo?.id}</p>
      </div>

      <div className={styles.section}>
        <h2>Customer</h2>
        <p>{orderinfo?.customerName}</p>
        <p>{orderinfo?.customerPhone}</p>
        <p>{orderinfo?.customerEmail}</p>
      </div>

      <div className={styles.section}>
        <h2>Payment Status</h2>
        <p>{orderinfo?.paymentStatus}</p>
        <h3>
          {orderinfo?.paymentStatus === 'PAID'
            ? 'Amount Paid'
            : 'Amount to be Paid'}
        </h3>
        <p>{orderinfo?.price}</p>
      </div>

      <div className={styles.section}>
        <h2>Shipping Address</h2>
        <p>{orderinfo?.shippingAddressLine1}</p>
        <p>{orderinfo?.shippingAddressLine2}</p>
        <p>{orderinfo?.shippingCity}</p>
        <p>{orderinfo?.shippingCountry}</p>
        <p>{orderinfo?.shippingProvince}</p>
        <p>{orderinfo?.shippingPostalCode}</p>
      </div>

      <div className={styles.section}>
        <h2>Order Details</h2>
        {productinfo?.map((e, i) => (
          <div key={i} className={styles.productCard}>
            <p><strong>Product:</strong> {e.product?.name}</p>
            <img src={e.product?.imagePath} alt={e.product?.name} className={styles.image} />
            <p><strong>Quantity:</strong> {e.quantity}</p>

            {e.options && typeof e.options === 'object' &&
              Object.entries(e.options).map(([key, value], index) => (
                <p key={index}><strong>{key}:</strong> {value}</p>
              ))}

            <p><strong>Price:</strong> R{e.price}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrdersId
