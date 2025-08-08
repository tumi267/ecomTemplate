  import { NextResponse } from 'next/server'
  import crypto from 'crypto'

  export async function POST(req) {
    const body = await req.json()
    const { orderid, items, total, customer, } = body;

    const item_names = items.map(i => `${i.product.name} x${i.quantity}`).join(', ').slice(0, 255)

    const mode = process.env.NEXT_DEV
    const baseUrl = process.env.NEXT_PUBLIC_PUBLIC_URL || process.env.PUBLIC_URL
    const localenv = 'http://localhost:3000'
    const ngrokserver =process.env.NEXT_NGROK
    
  
  const data = {
    merchant_id: process.env.PAYFAST_MERCHANT_ID,
    merchant_key: process.env.PAYFAST_MERCHANT_KEY,
    
    
    return_url: `${mode === 'dev' ? localenv : baseUrl}/success`,
    cancel_url: `${mode === 'dev' ? localenv : baseUrl}/cancel`,
    notify_url: `${mode === 'dev' ? ngrokserver : baseUrl}/api/payfast/notify`,
    amount: (Math.floor(total * 100) / 100).toFixed(2),
    item_name: orderid || 'Cart Checkout',
    
  };

    // ✅ Official PayFast Signature Generator
    const generateSignature = (data, passPhrase = null) => {
      // Create parameter string
      let pfOutput = "";
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          const value = data[key];
          if (value !== "" && value !== null && value !== undefined) {
            // Convert value to string and trim if it’s a string
            const strValue = typeof value === "string" ? value.trim() : String(value);
            pfOutput += `${key}=${encodeURIComponent(strValue).replace(/%20/g, "+")}&`;
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


