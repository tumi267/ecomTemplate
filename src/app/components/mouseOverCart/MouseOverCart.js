// components/MouseOverCart.js
'use client'
import React from 'react'
import styles from './MouseOverCart.module.css'
import { useCartStore } from '../../../app/libs/store'


function MouseOverCart() {
  const items = useCartStore((state) => state.items)

  return (
    <div className={styles.cartPreview}>
      <h4>Your Cart</h4>
      {items.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <ul>
          {items.map((item, i) => (
            <li key={i}>
              {item.name} x{item.quantity}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MouseOverCart
