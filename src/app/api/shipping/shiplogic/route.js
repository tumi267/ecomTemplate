// app/api/webhook/shiplogic/route.js
import { NextResponse } from 'next/server'
import { getCourierByTracking, updateCourierTracking } from '../../../libs/shipping'
import mapStatus from '../../../utils/shippingcorrectin'
import { getSingleOrder } from '../../../libs/product'

export async function POST(req) {
  try {
    const event = await req.json()
    // console.log('Webhook received:', event)

    const { short_tracking_reference, status } = event

    // 1. Get courier tracking record
    const trackingData = await getCourierByTracking(short_tracking_reference)
    if (!trackingData) {
      return NextResponse.json({ error: 'Tracking number not found' }, { status: 404 })
    }

    // 2. Update DB with mapped status
    const mappedStatus = mapStatus(status)
    await updateCourierTracking(short_tracking_reference, { status: mappedStatus })

    // 3. Get customer email
    const orderData = await getSingleOrder(trackingData.orderId)
    if (!orderData) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    const { customerEmail } = orderData

    const baseurl=process.env.NEXT_DEV=='dev'?'http://localhost:3000/':process.env.NEXT_PUBLIC_BASE_URL
    // 4. Send email via internal route
    const emailRes = await fetch(`${baseurl}/api/sendemail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: customerEmail,
        subject: `Your order is now ${mappedStatus.replace(/_/g, ' ').toLowerCase()}`,
        htmlContent: `<p>Hello,</p>
                      <p>Your order with tracking number <strong>${short_tracking_reference}</strong> 
                      is now <strong>${mappedStatus.replace(/_/g, ' ').toLowerCase()}</strong>.</p>
                      <p>Thank you for shopping with us!</p>`
      })
    })

    if (!emailRes.ok) {
      const errMsg = await emailRes.text()
      console.error('Email sending failed:', errMsg)
    }

    return NextResponse.json({ received: true, status: 200 })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

