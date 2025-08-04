// /app/api/payfast/notify/route.js
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSingleOrder, proccessOrder, updateProductSale } from '../../../libs/product'; // You must implement this

export async function POST(req) {
  const rawText = await req.text();

  // Parse raw PayFast data (e.g., key1=value1&key2=value2)
  const data = {};
  rawText.split('&').forEach((pair) => {
    const [key, value] = pair.split('=');
    data[key] = decodeURIComponent(value.replace(/\+/g, ' '));
  });
  const orderid=data.item_name
  let orderdetails=await getSingleOrder(orderid)
  if(!orderdetails){
    conosole.warn('no order')
  }
  let product=orderdetails.productJSON
  const paymentStatus=data.payment_status

  
  if (paymentStatus === 'COMPLETE') {
    await proccessOrder( orderid,product,"PENDING",'PAID');
  }
 // 5. Handle all payment statuses
 switch (paymentStatus) {
  case 'COMPLETE':
    await proccessOrder( orderid,product,"PENDING",'PAID');
    for (const item of productItems) {
      const { productId, variantId, quantity } = item;
    await updateProductSale(productId,variantId,quantity)
    }
    break;

  case 'FAILED':
    await proccessOrder( orderid,product,"PENDING",'FAILED');
    break;

  case 'PENDING':
    await proccessOrder( orderid,product,"PENDING",'PENDING');
    break;

  case 'CANCELLED':
    await proccessOrder( orderid,product,"PENDING",'FAILED');
    break;

  default:
    console.warn(`Unhandled payment status: ${paymentStatus}`);
    await updateOrderStatus(orderid, `${paymentStatus}`);
}
  return NextResponse.json({ success: true });
}
