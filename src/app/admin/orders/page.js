
'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { timeAgo } from '../../utils/admincalls'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table'
import { Card } from '../../../components/ui/card'
import styles from './order.module.css'

function Orders() {
  const [orderlist, setorderlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true)
        const res = await fetch('/api/getorders')
        if (res.ok) {
          const data = await res.json()
          setorderlist(data)
        } else {
          throw new Error('Failed to fetch orders')
        }
      } catch (err) {
        setError(err.message)
        console.error('Error fetching orders:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <Card className={styles.card}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading orders...</p>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={styles.card}>
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className={styles.retryButton}
          >
            Retry
          </button>
        </div>
      </Card>
    )
  }

  return (
    <Card className={styles.card}>
      <Table className={styles.Table}>
        <TableHeader className={styles.head}>
          <TableRow>
            <TableHead className={styles.theader}>Customer</TableHead>
            <TableHead className={styles.theader}>Date</TableHead>
            <TableHead className={styles.theader}>Amount</TableHead>
            <TableHead className={styles.theader}>Items</TableHead>
            <TableHead className={styles.theader}>Payment</TableHead>
            <TableHead className={styles.theader}>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderlist.length > 0 ? (
            orderlist.map((order) => (
              <TableRow
                key={order.id}
                className={styles.itemselect}
                onClick={() => router.push(`/admin/orders/${order.id}`)}
              >
                <TableCell className="font-medium">{order.customerName}</TableCell>
                <TableCell>{timeAgo(order.createdAt)}</TableCell>
                <TableCell>R{order.price}</TableCell>
                <TableCell>
                  {JSON.parse(order?.productJSON || '[]').reduce(
                    (sum, item) => sum + (item.quantity || 0),
                    0
                  )}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs ${
                    order.paymentStatus === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs ${
                    order.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : order.status === 'pending'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className={styles.noOrders}>
                No orders found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  )
}

export default Orders