import { NextResponse } from "next/server";

export async function POST(req) {
    const body = await req.json()
    try {
      console.log(body)
        // const res = await createCart(body)
       
        return NextResponse.json(res)
      } catch (error) {
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
      }
}
