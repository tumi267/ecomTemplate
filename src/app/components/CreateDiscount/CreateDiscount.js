'use client'
import React, { useState } from 'react'
import { calculateDiscount } from '../../utils/salesdiscount'
import { addDiscount } from '../../utils/admincalls'

function CreateDiscount({ product }) {
  const [isDiscount, setIsDiscount] = useState(false)
  const [margin, setMargin] = useState(100) // input as whole number (e.g., 50 for 50%)

  const handleToggle = async () => {
    const newToggleState = !isDiscount
    setIsDiscount(newToggleState)

    // If toggled OFF, reset discount to 0 and weekSale to false
    if (!newToggleState) {
      try {
        const res = await addDiscount({
          id: product.id,
          discount: 0,
          weekSale: false
        })
        console.log('Discount cleared:', res)
      } catch (err) {
        console.error('Failed to clear discount:', err)
      }
    }
  }

  const handleDiscount = async (e) => {
    e.preventDefault()
    const discount = calculateDiscount(product.cost, product.price, margin / 100).toFixed(2)

    const body = {
      id: product.id,
      discount,
      weekSale: true
    }

    try {
      const res = await addDiscount(body)
      console.log('Updated product:', res)
    } catch (err) {
      console.error('Failed to apply discount:', err)
    }
  }

  return (
    <div>
      <button onClick={handleToggle}>
        {isDiscount ? 'Remove Discount' : 'Create Discount'}
      </button>

      {isDiscount && (
        <div>
          <form onSubmit={handleDiscount}>
            <input
              type='number'
              placeholder='50'
              value={margin}
              onChange={(e) => setMargin(Number(e.target.value))}
              min="0"
              max="100"
            />
            %
            <button type='submit'>Submit</button>
          </form>

          <p>
            Discount amount: {calculateDiscount(product.cost, product.price, margin / 100).toFixed(2)}
          </p>
          <p>
            Minimum sale price: {(product.price - calculateDiscount(product.cost, product.price, margin / 100)).toFixed(2)}
          </p>
        </div>
      )}
    </div>
  )
}

export default CreateDiscount
