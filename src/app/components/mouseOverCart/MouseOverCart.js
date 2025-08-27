// components/MouseOverCart.js
'use client'
import React from 'react'
import styles from './MouseOverCart.module.css'
import { useCartStore } from '../../../app/libs/store'
import Image from 'next/image'
import RemoveItem from '../RemoveCartItem/RemoveCartItem'


function MouseOverCart() {
  const items = useCartStore((state) => state.items)
  const incrementItem = useCartStore((state) => state.incrementItem)
  const decrementItem = useCartStore((state) => state.decrementItem)

  return (
    <div className={styles.cartPreview}>
      <h4>Your Cart</h4>
      {items.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <ul>
          {items.map((item, i) => (
            <li className={styles.item} key={i}>
              <div className={styles.image}><Image src={item.product.imagePath!==""?item.product.imagePath:'/next.svg'} alt={item?.product?.name} fill /></div>
              {item.product?.name} x{item.quantity}
              {Object.entries(item?.options || {}).map(([key, value]) => (
                <div key={key} className="flex gap-2">
                  <span className="font-medium capitalize">{key}:</span>
                <span>{value}</span>
                </div>
              ))}
              <div className={styles.qtyBtnContain}>
              <button className={styles.qtyBtn} onClick={() => incrementItem(item.id)}>+</button>
              <button className={styles.qtyBtn} onClick={() => decrementItem(item.id)}>-</button>
              </div>
              <RemoveItem product={item} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MouseOverCart
