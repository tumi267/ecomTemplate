import { NextResponse } from 'next/server'
import { createCourierTracking } from '../../../../libs/shipping'

export async function POST(req) {
  try {
    const body = await req.json()
 
    // Await the tracking creation if it returns a promise
    const result = await createCourierTracking(body)

    // Return success
    return NextResponse.json({ success: true, data: result }, { status: 200 })
  } catch (error) {
    console.error('Error creating courier tracking:', error)
    return NextResponse.json({ success: false, error: error?.message || 'Unknown error' }, { status: 500 })
  }
}


