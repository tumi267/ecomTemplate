
import { NextResponse } from "next/server";
import { getOrders } from "../../libs/product";

export async function GET(req) {
  try {
    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}