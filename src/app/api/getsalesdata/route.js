import { NextResponse } from "next/server"
import { getProductSales } from "../../libs/product"

export async function POST(req) {
    try {
      const data = await req.json()
      const {id}=data
      const updated = await getProductSales(id)

      const now = new Date()
    now.setHours(23, 59, 59, 999)

    const fourWeeksAgo = new Date(now) // clone now
    fourWeeksAgo.setDate(now.getDate() - 28)
    fourWeeksAgo.setHours(0, 0, 0, 0)

    const recentSales = updated.filter(sale => {
      if (!sale.soldAt) return false
      const soldAt = new Date(sale.soldAt) // handle 'YYYY-MM-DD HH:mm:ss' format
      return soldAt.getTime() >= fourWeeksAgo.getTime() && soldAt.getTime() <= now.getTime()
    })
     
      return NextResponse.json({updated,recentSales})
    } catch (err) {
      return NextResponse.json({ error: 'Failed to get data' }, { status: 500 })
    }
  }