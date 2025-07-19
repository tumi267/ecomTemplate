import { NextResponse } from 'next/server'
import { addDiscount } from '../../libs/product'

export async function POST(req) {
  const body = await req.json()
  
  try {
    const { id, discount, weekSale } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing product ID' }, { status: 400 })
    }

    const sale = await addDiscount(id, { discount, weekSale })

    return NextResponse.json(sale)
  } catch (error) {
    console.error('Error updating discount:', error)
    return NextResponse.json({ error: 'Failed to update discount' }, { status: 500 })
  }
}
