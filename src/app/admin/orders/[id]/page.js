// app/orders/[id]/page.jsx
'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getSingleOrder, processOrder, timeAgo } from '../../../utils/admincalls'
import styles from './OrdersId.module.css'

function OrdersId() {
  const params = useParams()
  const { id } = params
  const [orderinfo, setOrderinfo] = useState(null)
  const [productinfo, setproductinfo] = useState([])
  const [processproduct, setprocessproduct] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true)
        const res = await getSingleOrder(id)
        const data = await res
        
        if (!data.data) {
          throw new Error('Order not found')
        }

        setOrderinfo(data.data)

        const orderdetails = JSON.parse(data.data.productJSON).map((e) => ({
          product: e.product,
          option: e.option,
          price: e.price,
          quantity: e.quantity,
          options: e.options,
        }))

        setproductinfo(orderdetails)
        setprocessproduct(JSON.parse(data.data.productJSON))
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setLoading(false)
      }
    }

    getData()
  }, [id])

  const handleProcess = async () => {
    if (!orderinfo || !processproduct) return
    setProcessing(true)

    try {
      const original = JSON.parse(orderinfo.productJSON)
      const changed = processproduct.filter((item, index) => {
        return item.quantity !== original[index].quantity
      })

      const updated = original.map((item, index) => {
        const changedItem = changed.find((c) => c.id === item.id)
        if (changedItem) {
          return {
            ...item,
            sentQuantity: changedItem.quantity,
          }
        }
        return item
      })

      const updatedItems = updated.filter((e) => 'sentQuantity' in e)
      const totalProcessed = processproduct.reduce((sum, item) => sum + item.quantity, 0)
      const totalOriginal = original.reduce((sum, item) => sum + item.quantity, 0)
      const status = totalProcessed === totalOriginal ? 'FULFILLED' : 'PARTIALLY_PROCESSED'

      await processOrder(id, updated, status)
      alert('Order processed successfully!')
    } catch (error) {
      console.error('Error processing order:', error)
      alert('Failed to process order')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!orderinfo) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p>Order not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {/* Order Status Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Order Status</h2>
          <div className={styles.cardContent}>
            <p className={styles.statusBadge}>{orderinfo.status}</p>
            <p className={styles.date}>{timeAgo(orderinfo.createdAt)}</p>
            <p className={styles.orderId}>Order #{orderinfo.id}</p>
          </div>
        </div>

        {/* Customer Info Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Customer</h2>
          <div className={styles.cardContent}>
            <p>{orderinfo.customerName}</p>
            <p>{orderinfo.customerPhone}</p>
            <p>{orderinfo.customerEmail}</p>
          </div>
        </div>

        {/* Payment Info Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Payment</h2>
          <div className={styles.cardContent}>
            <p className={orderinfo.paymentStatus === 'PAID' ? styles.paid : styles.pending}>
              {orderinfo.paymentStatus}
            </p>
            <p className={styles.amount}>
              {orderinfo.paymentStatus === 'PAID' ? 'Amount Paid' : 'Amount Due'}: R{orderinfo.price}
            </p>
          </div>
        </div>

        {/* Shipping Info Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Shipping Address</h2>
          <div className={styles.cardContent}>
            <p>{orderinfo.shippingAddressLine1}</p>
            {orderinfo.shippingAddressLine2 && <p>{orderinfo.shippingAddressLine2}</p>}
            <p>{orderinfo.shippingCity}, {orderinfo.shippingProvince}</p>
            <p>{orderinfo.shippingPostalCode}</p>
            <p>{orderinfo.shippingCountry}</p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className={styles.orderItems}>
        <h2 className={styles.sectionTitle}>Order Items</h2>
        {productinfo.map((e, i) => (
          <div key={i} className={styles.productCard}>
            <div className={styles.productImageContainer}>
              <img 
                src={e.product?.imagePath} 
                alt={e.product?.name} 
                className={styles.productImage}
                onError={(e) => {
                  e.target.src = '/placeholder-product.png'
                }}
              />
            </div>
            <div className={styles.productDetails}>
              <h3 className={styles.productName}>{e.product?.name}</h3>
              <p className={styles.productPrice}>R{e.price}</p>
              <p className={styles.productQuantity}>Quantity: {e.quantity}</p>
              
              {e.options && typeof e.options === 'object' && (
                <div className={styles.productOptions}>
                  {Object.entries(e.options).map(([key, value], index) => (
                    <p key={index} className={styles.option}>
                      <span className={styles.optionKey}>{key}:</span> {value}
                    </p>
                  ))}
                </div>
              )}
              
              <div className={styles.quantityControl}>
                <label>Process Quantity:</label>
                <input
                  type="number"
                  min="0"
                  max={e.quantity}
                  value={processproduct[i]?.quantity || 0}
                  onChange={(e) => {
                    const newArr = [...processproduct]
                    newArr[i].quantity = Math.max(0, Math.min(Number(e.target.value), e.quantity))
                    setprocessproduct(newArr)
                  }}
                  className={styles.quantityInput}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <button
          onClick={handleProcess}
          disabled={processing}
          className={`${styles.processButton} ${processing ? styles.processing : ''}`}
        >
          {processing ? 'Processing...' : 'Process Order'}
        </button>
      </div>
    </div>
  )
}

export default OrdersId