import { NextResponse } from "next/server";
import { createOrder } from "../../libs/product";

export async function POST(req) {
    const body = await req.json()
    try {
      
      const res = await createOrder(body)
     
      return NextResponse.json(res)
    } catch (error) {
      return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
    }
  }
  