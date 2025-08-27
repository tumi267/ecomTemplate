import { NextResponse } from "next/server";
import { createCart, updateCart } from "../../../libs/cart";

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, cartId, items } = body;

    if (cartId) {
      // Update cart
      const res = await updateCart(cartId, items);
      return NextResponse.json(res);
    }
    // Create cart
    const res = await createCart(userId ?? null, items);
    return NextResponse.json(res);

  } catch (error) {
    console.error("Cart API error:", error);
    return NextResponse.json(
      { error: "Failed to create or update cart" },
      { status: 500 }
    );
  }
}
