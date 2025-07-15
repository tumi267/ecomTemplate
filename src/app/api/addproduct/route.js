import { NextResponse } from 'next/server'
import { createProduct } from '../../libs/product'


export async function POST(req) {
  const body = await req.json()
  try {
    const product = await createProduct(body)
    
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
