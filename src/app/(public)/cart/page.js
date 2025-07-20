'use client'
import React, { useState } from 'react'
import { useCartStore } from '../../libs/store'
import RemoveItem from '../../components/RemoveCartItem/RemoveCartItem'
import AddToCartButton from '../../components/AddToCartButton/AddToCartButton'
import ClearCart from '../../components/ClearCart/ClearCart'
import styles from './cart.module.css'
import Image from 'next/image'
import PayFastCheckoutButton from '../../components/PayFastCheckoutButton/PayFastCheckoutButton'

function Cart() {
  const items = useCartStore((state) => state.items)
  const incrementItem = useCartStore((state) => state.incrementItem)
  const decrementItem = useCartStore((state) => state.decrementItem)
  const totalCost = useCartStore((state) => state.total)
  const[customer,setCustomer]=useState({
    name:"",
    phone:"",
    email:"",
    streetAddress:"",
    postalCode:"",
    city:"",
    suburb:"",
  })
  const handleChange = (e) => {
    setCustomer((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }
  const isCustomerInfoValid = () => {
    return (
      customer.name.trim() !== '' &&
      customer.email.trim() !== '' &&
      customer.phone.trim() !== '' &&
      customer.streetAddress.trim() !== '' &&
      customer.postalCode.trim() !== '' &&
      customer.city.trim() !== ''
    )
  }
  return (
    <div className={styles.cartPage}>

      <div className={styles.cartItems}>
        {items.map((e) => (
          <div className={styles.cartItem} key={e.id}>
            <div className={styles.image}><Image src={e.product.imagePath!==""?e.product.imagePath:'/next.svg'} alt={e?.product?.name} fill /></div>
            <div className={styles.itemInfo}>
              <p className={styles.itemName}>{e?.product?.name}</p>
              <p className={styles.itemQty}>Qty: {e.quantity}</p>
              <p className={styles.itemPrice}>R {e.price} {e?.product?.discount>0&&<span>sale</span>}</p>
            </div>

            <div className={styles.controls}>
              <button className={styles.qtyBtn} onClick={() => incrementItem(e.id)}>+</button>
              <button className={styles.qtyBtn} onClick={() => decrementItem(e.id)}>-</button>
              <RemoveItem product={e} />
            </div>
          </div>
        ))}
      </div>
      <div className={styles.total_contain_box}>
        <div className={styles.total_contain}>
          <h1 className={styles.heading}>Your Cart</h1>
          <p className={styles.total}>Total Cost: R{Math.floor(totalCost*100)/100}</p>
        <div className={styles.clearBtnWrapper}>
          <ClearCart />
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="name">Full Name*</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Full Name"
            value={customer.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email*</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            value={customer.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="phone">Phone*</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            placeholder="Phone"
            value={customer.phone}
            onChange={handleChange}
            required
          />

          <label htmlFor="streetAddress">Street Address*</label>
          <input
            id="streetAddress"
            type="text"
            name="streetAddress"
            placeholder="Street Address"
            value={customer.streetAddress}
            onChange={handleChange}
            required
          />

          <label htmlFor="suburb">Suburb</label>
          <input
            id="suburb"
            type="text"
            name="suburb"
            placeholder="Suburb"
            value={customer.suburb}
            onChange={handleChange}
          />

          <label htmlFor="city">City*</label>
          <input
            id="city"
            type="text"
            name="city"
            placeholder="City"
            value={customer.city}
            onChange={handleChange}
            required
          />

          <label htmlFor="postalCode">Postal Code*</label>
          <input
            id="postalCode"
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            value={customer.postalCode}
            onChange={handleChange}
            required
          />
        </form>
        <div className={styles.clearBtnWrapper}>
        <PayFastCheckoutButton
        items={items} 
        total={Math.floor(totalCost*100)/100} 
        customer={customer}
        userId={null}
        disabled={!isCustomerInfoValid()}
        />
        </div>
        </div>
      </div>

    </div>
  )
}

export default Cart



