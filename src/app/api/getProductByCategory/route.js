import {getProductsByCategory} from '../../libs/product'
import { NextResponse } from 'next/server'

export async function POST(req) {
    const body = await req.json()
    
  const products = await getProductsByCategory(body)
  return NextResponse.json({products})
}
