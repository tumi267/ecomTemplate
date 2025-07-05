'use client'
import React from 'react'

function PayFastCheckoutButton({ items, total }) {
  const handleCheckout = async () => {
    const res = await fetch('/api/payfast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, total }),
    })

    const data = await res.json()
   

    const form = document.createElement('form')
form.method = 'POST'
form.action = 'https://sandbox.payfast.co.za/eng/process'  // use sandbox URL for testing

for (const key in data) {
  const input = document.createElement('input')
  input.type = 'hidden'
  input.name = key
  input.value = String(data[key])
  form.appendChild(input)
 
}

document.body.appendChild(form)
console.log(form)
form.submit()
  }

  return (
    <button onClick={handleCheckout} style={{ marginTop: '1rem', padding: '10px 20px' }}>
      Checkout
    </button>
  )
}

export default PayFastCheckoutButton
