// /app/api/payfast/notify/route.js
import { NextResponse } from 'next/server';
import { getSingleOrder, proccessOrder, updateProductSale } from '../../../libs/product';
import { sendEmail } from '../../../libs/sendemail';

export async function POST(req) {
  const rawText = await req.text();

  // Parse raw PayFast data (e.g., key1=value1&key2=value2)
  const data = {};
  rawText.split('&').forEach((pair) => {
    const [key, value] = pair.split('=');
    data[key] = decodeURIComponent(value.replace(/\+/g, ' '));
  });

  const orderid = data.item_name;
  const paymentStatus = data.payment_status;

  const orderdetails = await getSingleOrder(orderid);
  if (!orderdetails) {
    console.warn('No order found');
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  const productItems = typeof orderdetails.productJSON === 'string'
    ? JSON.parse(orderdetails.productJSON)
    : orderdetails.productJSON;

  const productHtml = productItems.map((item) => {
    return `
      <p>
        <strong>Product:</strong> ${item.product}<br/>
        <strong>Option:</strong> ${item.option}<br/>
        <strong>Price:</strong> ${item.price}<br/>
        <strong>Quantity:</strong> ${item.quantity}<br/>
        <strong>Options:</strong> ${item.options}
      </p>
    `;
  }).join('');

  switch (paymentStatus) {
    case 'COMPLETE':
      await proccessOrder(orderid, productItems, 'PENDING', 'PAID');
      
      // await sendEmail(
      //   orderdetails.customerEmail,
      //   `Order ${orderdetails.id} Confirmation`,
      //   `
      //     <h1>Thank you for your purchase!</h1>
      //     <p>Your order #${orderdetails.id} has been received.</p>
      //     ${productHtml}
      //     <p>We’ll send a confirmation when it ships.</p>
      //   `
      // );

      for (const item of productItems) {
        const { productId, variantId, quantity } = item;
        await updateProductSale(productId,  quantity,variantId);
      }
      break;

    case 'FAILED':
      await proccessOrder(orderid, productItems, 'PENDING', 'FAILED');

      // await sendEmail(
      //   orderdetails.customerEmail,
      //   `Order ${orderdetails.id} Failed`,
      //   `
      //     <h1>Payment Failed</h1>
      //     <p>Your payment for order #${orderdetails.id} was unsuccessful.</p>
      //     <p>Please try again or contact support if the issue persists.</p>
      //   `
      // );
      break;

    case 'PENDING':
      await proccessOrder(orderid, productItems, 'PENDING', 'PENDING');

      // await sendEmail(
      //   orderdetails.customerEmail,
      //   `Order ${orderdetails.id} Pending`,
      //   `
      //     <h1>Payment Pending</h1>
      //     <p>Your payment for order #${orderdetails.id} is pending.</p>
      //     <p>We’ll notify you once it clears.</p>
      //   `
      // );
      break;

    case 'CANCELLED':
      await proccessOrder(orderid, productItems, 'PENDING', 'FAILED');

      // await sendEmail(
      //   orderdetails.customerEmail,
      //   `Order ${orderdetails.id} Cancelled`,
      //   `
      //     <h1>Order Cancelled</h1>
      //     <p>Your order #${orderdetails.id} has been cancelled.</p>
      //     <p>If this was a mistake, you can reorder on our site.</p>
      //   `
      // );
      break;

    default:
      console.warn(`Unhandled payment status: ${paymentStatus}`);
      // await sendEmail(
      //   orderdetails.customerEmail,
      //   `Order ${orderdetails.id} Pending`,
      //   `
      //     <h1>Payment Pending</h1>
      //     <p>Your payment for order #${orderdetails.id} is pending.</p>
      //     <p>We’ll notify you once it clears.</p>
      //   `
      // );
      await proccessOrder(orderid, productItems, 'PENDING', paymentStatus);
      break;
  }

  return NextResponse.json({ success: true });
}
