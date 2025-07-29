'use client'
import React from 'react'

function PayFastCheckoutButton({ items, total, customer, userId }) {
  const handleCheckout = async () => {
    try {
      // 1. First create the order
      const orderResponse = await fetch('/api/createOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, items, total, customer }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }
      const orderData = await orderResponse.json();
   
      // 2. Get PayFast payment data
      const payfastResponse = await fetch('/api/payfast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderid:orderData.id,items, total,customer }),
      });

      if (!payfastResponse.ok) {
        throw new Error('Failed to initialize payment');
      }

      const paymentData = await payfastResponse.json();

      // 3. Create and submit PayFast form
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://sandbox.payfast.co.za/eng/process'; // Updated sandbox URL
      
      // Add all payment data as hidden inputs
      Object.entries(paymentData).forEach(([key, value]) => {
        
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      
      form.submit();
      
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
    }
  };

  return (
    <button 
      onClick={handleCheckout} 
      style={{ marginTop: '1rem', padding: '10px 20px' }}
      className="bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Checkout
    </button>
  );
}

export default PayFastCheckoutButton;
