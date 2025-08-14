import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Parse the JSON body
    const body = await req.json();
    const res = await fetch(`${process.env.NEXT_Shipping_BaseURL}/shipments`,
    {
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_Shipping}`
          },
        body:JSON.stringify(body)
    }
    )
    if (!res.ok) {
        const errorText = await res.text();
        return NextResponse.json({ error: errorText }, { status: res.status });
      }
  
      // Parse JSON response from ShipLogic
      const data = await res.json();
  
      // Return it directly
      return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return NextResponse.json(
      { msg: 'Invalid JSON', status: 400 },
      { status: 400 }
    );
  }
}
