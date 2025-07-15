import { NextResponse } from 'next/server'
import {
  getVariants,
  createVariant,
} from '../../libs/product'

// GET /api/variants?productId=xxx
export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId')

  try {
    const variants = await getVariants(productId)
    return NextResponse.json(variants)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch variants' }, { status: 500 })
  }
}

// POST /api/variants
export async function POST(req) {
  try {
    const body = await req.json()
    const newVariant = await createVariant(body)
    return NextResponse.json(newVariant)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create variant' }, { status: 500 })
  }
}