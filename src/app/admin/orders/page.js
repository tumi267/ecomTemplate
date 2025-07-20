'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

function Orders() {
  const [orderlist, setorderlist] = useState([])
  const router = useRouter()

  useEffect(() => {
    async function fetchOrders() {
      const res = await fetch('/api/getorders')
      if (res.ok) {
        const data = await res.json()
        setorderlist(data)
      } else {
        console.error('Failed to fetch orders')
      }
    }
    fetchOrders()
  }, [])

  function timeAgo(date) {
    const now = new Date()
    const past = new Date(date)
    const diffMs = now - past

    const seconds = Math.floor(diffMs / 1000)
    const minutes = Math.floor(diffMs / (1000 * 60))
    const hours = Math.floor(diffMs / (1000 * 60 * 60))

    if (hours >= 24) {
      const day = String(past.getDate()).padStart(2, '0')
      const month = String(past.getMonth() + 1).padStart(2, '0')
      const year = past.getFullYear()
      return `${day}/${month}/${year}`
    }

    if (hours > 0) {
      return hours === 1 ? 'less than an hour ago' : `${hours} hours ago`
    }

    if (minutes > 5) {
      return `${minutes} minutes ago`
    }

    return 'just now'
  }

  return (
    <div>
      <table className="">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Items</th>
            <th>Payment</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orderlist.map((order) => (
            <tr
              key={order.id}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => router.push(`/admin/orders/${order.id}`)}
            >
              <td>{order.customerName}</td>
              <td>{timeAgo(order.createdAt)}</td>
              <td>R{order.price}</td>
              <td>
                {JSON.parse(order?.productJSON || '[]').reduce(
                  (sum, item) => sum + (item.quantity || 0),
                  0
                )}
              </td>
              <td>{order.paymentStatus}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Orders




// createdAt
// : 
// "2025-07-20T22:00:06.967Z"
// customerEmail
// : 
// "itu.matlala4@gmail.com"
// customerName
// : 
// "Mr ISM Matlala"
// customerPhone
// : 
// "+27725098757"
// id
// : 
// "81ef4182-494f-4602-acf1-9cbfd45d171d"
// paidAt
// : 
// null
// paymentId
// : 
// null
// paymentMethod
// : 
// null
// paymentStatus
// : 
// "PENDING"
// price
// : 
// "673.3"
// productJSON
// : 
// "[{\"id\":\"fc59d57e-408a-449f-914a-70da7e117956\",\"productId\":\"fc59d57e-408a-449f-914a-70da7e117956\",\"product\":{\"id\":\"fc59d57e-408a-449f-914a-70da7e117956\",\"sku\":null,\"categoryId\":\"db11a3f2-1f21-4906-9c3d-6c0bc4568925\",\"name\":\"Flat Brim Snapback\",\"description\":\"Top off your streetwear fit with this flat brim snapback — structured, stylish, and adjustable for all sizes.\",\"imagePath\":\"\",\"currency\":\"ZAR\",\"isAvailableForPurchase\":true,\"bestSeller\":false,\"weekSale\":false,\"discount\":0,\"cost\":\"0\",\"price\":\"149.99\",\"createdAt\":\"2025-07-17T21:29:22.104Z\",\"updatedAt\":\"2025-07-17T21:29:22.104Z\",\"qty\":6,\"trackQty\":true,\"category\":{\"id\":\"db11a3f2-1f21-4906-9c3d-6c0bc4568925\",\"name\":\"Caps\",\"description\":\"Cap off your look with street-savvy styles made for sun, shade, and swag.\",\"image\":null},\"variants\":[]},\"quantity\":1,\"price\":149.99,\"options\":[]},{\"id\":\"9aa8c81b-ae18-4d8d-af1d-74a041710021\",\"productId\":\"3af87799-7c1e-413b-a5b7-f1508dcc914e\",\"product\":{\"id\":\"3af87799-7c1e-413b-a5b7-f1508dcc914e\",\"sku\":null,\"categoryId\":\"8c740561-c037-4b2c-a581-17f659cd4ccc\",\"name\":\"White Logo Tee\",\"description\":\"Rock the brand loud and proud with our signature white logo tee. Lightweight, bold, and made for everyday hustle.\",\"imagePath\":\"https://tpmjohhfasdshvfvicxc.supabase.co/storage/v1/object/public/product/undefined/street ware T.jpg\",\"currency\":\"ZAR\",\"isAvailableForPurchase\":true,\"bestSeller\":false,\"weekSale\":false,\"discount\":0,\"cost\":\"100\",\"price\":\"219.99\",\"createdAt\":\"2025-07-17T21:28:30.350Z\",\"updatedAt\":\"2025-07-19T20:22:08.678Z\",\"qty\":10,\"trackQty\":true,\"category\":{\"id\":\"8c740561-c037-4b2c-a581-17f659cd4ccc\",\"name\":\"T-Shirts\",\"description\":\"Fresh, bold, and effortlessly cool — our tees are made to move with your lifestyle.\",\"image\":null},\"variants\":[{\"id\":\"9aa8c81b-ae18-4d8d-af1d-74a041710021\",\"productId\":\"3af87799-7c1e-413b-a5b7-f1508dcc914e\",\"options\":{\"size\":\"S\"},\"price\":\"219.99\",\"qty\":2,\"trackQty\":true,\"createdAt\":\"2025-07-19T09:24:21.547Z\",\"updatedAt\":\"2025-07-19T09:24:21.547Z\"},{\"id\":\"43b950d3-b73a-4c75-82a6-a456ea947990\",\"productId\":\"3af87799-7c1e-413b-a5b7-f1508dcc914e\",\"options\":{\"size\":\"M\"},\"price\":\"219.99\",\"qty\":3,\"trackQty\":true,\"createdAt\":\"2025-07-19T09:25:01.114Z\",\"updatedAt\":\"2025-07-19T09:25:01.114Z\"},{\"id\":\"cb437c51-afce-485a-bb86-0f91e02bf26d\",\"productId\":\"3af87799-7c1e-413b-a5b7-f1508dcc914e\",\"options\":{\"size\":\"L\"},\"price\":\"219.99\",\"qty\":4,\"trackQty\":true,\"createdAt\":\"2025-07-19T09:25:42.565Z\",\"updatedAt\":\"2025-07-19T09:25:42.565Z\"}],\"variant\":{\"id\":\"43b950d3-b73a-4c75-82a6-a456ea947990\",\"productId\":\"3af87799-7c1e-413b-a5b7-f1508dcc914e\",\"options\":{\"size\":\"M\"},\"price\":\"219.99\",\"qty\":3,\"trackQty\":true,\"createdAt\":\"2025-07-19T09:25:01.114Z\",\"updatedAt\":\"2025-07-19T09:25:01.114Z\"}},\"variantId\":\"9aa8c81b-ae18-4d8d-af1d-74a041710021\",\"quantity\":1,\"price\":219.99,\"options\":{\"size\":\"S\"}},{\"id\":\"bbcbe2fa-0928-4e5b-a928-4c5412d33ab9\",\"productId\":\"31578365-a1b9-4c9a-aff8-7e7d6ed2f73a\",\"product\":{\"id\":\"31578365-a1b9-4c9a-aff8-7e7d6ed2f73a\",\"sku\":null,\"categoryId\":\"8c740561-c037-4b2c-a581-17f659cd4ccc\",\"name\":\"Classic Black Tee\",\"description\":\"Keep it clean and classic with this black tee — the ultimate wardrobe staple made from 100% soft cotton.\",\"imagePath\":\"https://tpmjohhfasdshvfvicxc.supabase.co/storage/v1/object/public/product/undefined/black shrit.jpg\",\"currency\":\"ZAR\",\"isAvailableForPurchase\":true,\"bestSeller\":false,\"weekSale\":true,\"discount\":26.66,\"cost\":\"52\",\"price\":\"199.99\",\"createdAt\":\"2025-07-17T21:26:48.450Z\",\"updatedAt\":\"2025-07-19T21:59:45.698Z\",\"qty\":10,\"trackQty\":true,\"category\":{\"id\":\"8c740561-c037-4b2c-a581-17f659cd4ccc\",\"name\":\"T-Shirts\",\"description\":\"Fresh, bold, and effortlessly cool — our tees are made to move with your lifestyle.\",\"image\":null},\"variants\":[{\"id\":\"bbcbe2fa-0928-4e5b-a928-4c5412d33ab9\",\"productId\":\"31578365-a1b9-4c9a-aff8-7e7d6ed2f73a\",\"options\":{\"size\":\"M\",\"color\":\"grey\"},\"price\":\"199.99\",\"qty\":2,\"trackQty\":true,\"createdAt\":\"2025-07-20T12:31:33.769Z\",\"updatedAt\":\"2025-07-20T12:34:42.700Z\"},{\"id\":\"8449bb53-c989-49d4-a9f7-470145dcc306\",\"productId\":\"31578365-a1b9-4c9a-aff8-7e7d6ed2f73a\",\"options\":{\"size\":\"L\",\"color\":\"light\"},\"price\":\"199.99\",\"qty\":2,\"trackQty\":true,\"createdAt\":\"2025-07-20T12:32:33.323Z\",\"updatedAt\":\"2025-07-20T12:35:11.390Z\"},{\"id\":\"85a840ce-1810-4df3-86f7-54b728901b15\",\"productId\":\"31578365-a1b9-4c9a-aff8-7e7d6ed2f73a\",\"options\":{\"size\":\"S\",\"color\":\"dark\"},\"price\":\"199.99\",\"qty\":2,\"trackQty\":true,\"createdAt\":\"2025-07-20T12:32:10.420Z\",\"updatedAt\":\"2025-07-20T12:35:33.305Z\"}],\"variant\":{\"id\":\"85a840ce-1810-4df3-86f7-54b728901b15\",\"productId\":\"31578365-a1b9-4c9a-aff8-7e7d6ed2f73a\",\"options\":{\"size\":\"S\",\"color\":\"dark\"},\"price\":\"199.99\",\"qty\":2,\"trackQty\":true,\"createdAt\":\"2025-07-20T12:32:10.420Z\",\"updatedAt\":\"2025-07-20T12:35:33.305Z\"}},\"variantId\":\"bbcbe2fa-0928-4e5b-a928-4c5412d33ab9\",\"quantity\":1,\"price\":173.33,\"options\":{\"size\":\"M\",\"color\":\"grey\"}},{\"id\":\"ccdf5ebd-fbef-4752-8417-4b45b0739e84\",\"productId\":\"ccdf5ebd-fbef-4752-8417-4b45b0739e84\",\"product\":{\"id\":\"ccdf5ebd-fbef-4752-8417-4b45b0739e84\",\"sku\":null,\"categoryId\":\"db11a3f2-1f21-4906-9c3d-6c0bc4568925\",\"name\":\"Curved Cap With Logo\",\"description\":\"A classic curved brim cap with a minimalist logo design. Pairs perfectly with any outfit, any day.\",\"imagePath\":\"\",\"currency\":\"ZAR\",\"isAvailableForPurchase\":true,\"bestSeller\":false,\"weekSale\":false,\"discount\":0,\"cost\":\"0\",\"price\":\"129.99\",\"createdAt\":\"2025-07-17T21:30:02.577Z\",\"updatedAt\":\"2025-07-17T21:30:02.577Z\",\"qty\":6,\"trackQty\":true,\"category\":{\"id\":\"db11a3f2-1f21-4906-9c3d-6c0bc4568925\",\"name\":\"Caps\",\"description\":\"Cap off your look with street-savvy styles made for sun, shade, and swag.\",\"image\":null},\"variants\":[],\"variant\":null},\"quantity\":1,\"price\":129.99,\"options\":[]}]"
// shippingAddressLine1
// : 
// "25 Dolabella Dr"
// shippingAddressLine2
// : 
// "Cape Town"
// shippingCity
// : 
// "Cape Town"
// shippingCountry
// : 
// ""
// shippingPostalCode
// : 
// "7441"
// shippingProvince
// : 
// ""
// status
// : 
// "PENDING"
// updatedAt
// : 
// "2025-07-20T22:00:06.967Z"
// userId
// : 
// null