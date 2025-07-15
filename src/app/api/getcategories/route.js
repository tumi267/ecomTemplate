// app/api/getcategories/route.ts
import { NextResponse } from 'next/server'
import { getCategory } from '../../libs/category'

export async function GET() {
  const categories = await getCategory()
  
  return NextResponse.json(categories)
}
