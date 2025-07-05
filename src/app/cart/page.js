'use client'
import React from 'react'
import { useCartStore } from '../libs/store'
import RemoveItem from '../components/RemoveCartItem/RemoveCartItem'
import AddToCartButton from '../components/AddToCartButton/AddToCartButton'
import ClearCart from '../components/ClearCart/ClearCart'
import styles from './cart.module.css'
import Image from 'next/image'
import PayFastCheckoutButton from '../components/PayFastCheckoutButton/PayFastCheckoutButton'

function Cart() {
  const items = useCartStore((state) => state.items)
  const incrementItem = useCartStore((state) => state.incrementItem)
  const decrementItem = useCartStore((state) => state.decrementItem)
  const totalCost = useCartStore((state) => state.total)

  return (
    <div className={styles.cartPage}>

      <div className={styles.cartItems}>
        {items.map((e) => (
          <div className={styles.cartItem} key={e.id}>
            <div className={styles.image}><Image src='/next.svg' alt={e.name} fill /></div>
            <div className={styles.itemInfo}>
              <p className={styles.itemName}>{e.name}</p>
              <p className={styles.itemQty}>Qty: {e.quantity}</p>
              <p className={styles.itemPrice}>R {e.price}</p>
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
        <div className={styles.clearBtnWrapper}>
        <PayFastCheckoutButton
        items={items} 
        total={Math.floor(totalCost*100)/100} 
        />
        </div>
        </div>
      </div>

    </div>
  )
}

export default Cart



