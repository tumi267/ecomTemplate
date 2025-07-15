import { NextResponse } from 'next/server'
import { getProducts} from '../../libs/product'

export async function GET() {
  const products = await getProducts()
  return NextResponse.json(products)
}

