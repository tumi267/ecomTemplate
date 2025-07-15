import { NextResponse } from 'next/server'
import { createCategory } from '../../libs/category' // adjust path as needed

export async function POST(req) {
  try {
    const body = await req.json()
    const { name, description } = body

    const data = await createCategory({ name, description })

    return NextResponse.json({ success: true, data })
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}
