// app/orders/[id]/page.jsx
'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getSingleOrder, processOrder, timeAgo } from '../../../utils/admincalls'
import styles from './OrdersId.module.css'
import Image from 'next/image'
import mapStatus from '../../../utils/shippingcorrectin'

function OrdersId() {
  const params = useParams()
  const { id } = params
  const [orderinfo, setOrderinfo] = useState(null)
  const [productinfo, setproductinfo] = useState([])
  const [processproduct, setprocessproduct] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [tracking,setTracking]=useState({
    trackingNumber:null,
    trackingStat:null
  })

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

  useEffect(()=>{
    
    const getShipping=async (id)=>{
      const res=await fetch('/api/shipping/create/getshipping',{method:'POST',headers:{"Content-Type":"application/json"},body:JSON.stringify({id:id})})
      let data=await res.json()
      setTracking({
        trackingNumber: data?.data?.trackingNumber,
        trackingStat: data?.data?.status
      })
    }
    if(orderinfo?.id){
      getShipping(orderinfo.id)
    }
  },[orderinfo])

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
      // create shipping
      const shippingBody = {
        collection_address: {
          type: "business",
          company: "My Warehouse",          // your business/warehouse name
          street_address: "267 Monaheng Sec",
          local_area: "Tshabala Street",
          city: "Katlehong",
          zone: "GP",
          country: "ZA",
          code: "0181",
        },
        collection_contact: {
          name: "Warehouse Manager",
          mobile_number: "0123456789",      // optional
          email: "warehouse@example.com",   // optional
        },
        delivery_address: {
          type: "residential",
          company: "",
          street_address: orderinfo.shippingAddressLine1,
          local_area: orderinfo.shippingAddressLine2 || "",
          city: orderinfo.shippingCity,
          zone: orderinfo.shippingProvince,
          country: "ZA",
          code: orderinfo.shippingPostalCode,

        },
        delivery_contact: {
          name: orderinfo.customerName || "",
          mobile_number: orderinfo.customerPhone || "",
          email: orderinfo.customerEmail || "",
        },
        // this can be a bug in real life 
        parcels: [
          {
            parcel_description: "Standard parcel",
            submitted_length_cm: 20,
            submitted_width_cm: 20,
            submitted_height_cm: 10,
            submitted_weight_kg: 2,
          },
        ],
        special_instructions_collection: "This is a test shipment - DO NOT COLLECT",
        special_instructions_delivery: "This is a test shipment - DO NOT DELIVER",
        declared_value:parseFloat(orderinfo.price||0),
    
        collection_after: "08:00",
        collection_before: "16:00",
    
        delivery_after: "10:00",
        delivery_before: "17:00",

        customer_reference: orderinfo.id,
        service_level_code: "ECO",
        mute_notifications: false,
      }
      const res = await fetch('/api/shipping/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shippingBody),
      })
      if (!res.ok) {
        const errText = await res.text()
        throw new Error('Shipping creation failed: ' + errText)
      }
      
      const shippingdata = await res.json()
      const trackingData = {
        orderId: orderinfo.id,
        trackingNumber: shippingdata.short_tracking_reference,
        carrier: "the courier guy",
        status: mapStatus(shippingdata.status),
        estimatedArrival: shippingdata.estimated_delivery_to
          ? new Date(shippingdata.estimated_delivery_to)
          : undefined,
      }
      
      // call your API to store tracking info
      await fetch('/api/shipping/create/front',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({...trackingData})
      })
      // await processOrder(id, updated, status)
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
            {tracking.trackingNumber&&<p>Tracking # {tracking.trackingNumber}</p>}
            {tracking.trackingStat&&<p>Tracking status {tracking.trackingStat}</p>}
           
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
              <Image 
                src={e.product?.imagePath} 
                alt={e.product?.name} 
                className={styles.productImage}
                width={100}
                height={100}
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