import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req) {
  const body = await req.json()
  const { items, total } = body

  const item_names = items.map(i => `${i.product.name} x${i.quantity}`).join(', ').slice(0, 255)

  const mode = process.env.NEXT_DEV
  const baseUrl = process.env.NEXT_PUBLIC_PUBLIC_URL || process.env.PUBLIC_URL
  const localenv = 'http://localhost:3000'

  const data = {
    merchant_id: process.env.PAYFAST_MERCHANT_ID,
    merchant_key: process.env.PAYFAST_MERCHANT_KEY,
    return_url: `${mode === 'dev' ? localenv : baseUrl}/success`,
    cancel_url: `${mode === 'dev' ? localenv : baseUrl}/cancel`,
    amount: (Math.floor(total * 100) / 100).toFixed(2), // must be string like '199.99'
    item_name: item_names || 'Cart Checkout',
  }

  // ✅ Official PayFast Signature Generator
  const generateSignature = (data, passPhrase = null) => {
    // Create parameter string
    let pfOutput = "";
    for (let key in data) {
      if(data.hasOwnProperty(key)){
        if (data[key] !== "") {
          pfOutput +=`${key}=${encodeURIComponent(data[key].trim()).replace(/%20/g, "+")}&`
        }
      }
    }
  
    // Remove last ampersand
    let getString = pfOutput.slice(0, -1);
    if (passPhrase !== null) {
      getString +=`&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, "+")}`;
    }
  
    return crypto.createHash("md5").update(getString).digest("hex");
  }; 

  const signature = generateSignature(data, process.env.PAYFAST_PASSPHRASE || '')

  return NextResponse.json({
    ...data,
    signature,
  })
}
