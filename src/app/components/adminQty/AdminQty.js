'use client'

import React, { useEffect, useState } from 'react'

function AdminQty({ product }) {
  const [stockQty, setStockQty] = useState(null)
  const [salesQty, setSalesQty] = useState(0)
  const [lowStockWarning, setLowStockWarning] = useState(false)
  const [recommendedQty, setRecommendedQty] = useState(null)

  useEffect(() => {
    const productvals = async () => {
      // 1. Total current stock
      const totalStock = product.variants.length > 0
        ? product.variants.reduce((acc, variant) => acc + (variant.qty || 0), 0)
        : product.qty || 0

      setStockQty(totalStock)

      // 2. Date range for sales history
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(endDate.getDate() - 28) // last 4 weeks

      // 3. Fetch sales data
      const res = await fetch('/api/getsalesdata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id, startDate, endDate }),
      })

      const salesdata = await res.json()
      const recentSales = salesdata?.recentSales || []

      const totalSales = recentSales.reduce((acc, sale) => acc + sale.quantity, 0)
      setSalesQty(totalSales)

      if (recentSales.length === 0) return

      // 4. Calculate sales period in days
      const firstSaleDate = new Date(recentSales[0].soldAt)
      const lastSaleDate = new Date(recentSales[recentSales.length - 1].soldAt)
      const daysActive = Math.max(1, Math.ceil((lastSaleDate - firstSaleDate) / (1000 * 60 * 60 * 24)))

      // 5. Daily sales rate
      const dailyRate = totalSales / daysActive

      // 6. Predict how long current stock will last
      const predictedDaysLeft = totalStock / dailyRate

      if (predictedDaysLeft <= 7) {
        setLowStockWarning(true)
      }

      // 7. Recommendation: How much stock to order for next 30 days
      const targetCoverageDays = 30
      const idealQty = Math.ceil(targetCoverageDays * dailyRate)
      const qtyToOrder = Math.max(0, idealQty - totalStock)

      setRecommendedQty(qtyToOrder)
    }

    productvals()
  }, [product])

  return (
    <div>
      <p>Stock: {stockQty}</p>
      <p>Last Month's Sales: {salesQty}</p>
      {lowStockWarning && (
        <p style={{ color: 'red' }}>
          ⚠️ Low stock – projected to run out in less than a week
        </p>
      )}
      {recommendedQty > 0 && (
        <p style={{ color: 'orange' }}>
          📦 Recommend ordering at least <strong>{recommendedQty}</strong> units to cover the next 30 days
        </p>
      )}
    </div>
  )
}

export default AdminQty
