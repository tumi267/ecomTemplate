import prisma from './prisma'
import { OrderStatus, PaymentStatus, Prisma } from '@prisma/client'
// libs/cart.js


export async function getCart( userId:string, cartId:string ) {
  if (!userId && !cartId) return null

  // If we have a user, get their cart; otherwise fallback to cartId (guest cart)
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { id: cartId },
  })

  return cart
}

export async function createCart(userId:string, items = [] ) {
  const productJSON = JSON.stringify(items)
  return prisma.cart.create({
    data: { userId, productJSON },
  })
}

export async function updateCart(cartId:string, items=[]) {
  const productJSON = JSON.stringify(items)
  return prisma.cart.update({
    where: { id: cartId },
    data: { productJSON },
  })
}

// Optional: Assign a guest cart to a user on login
export async function assignCartToUser(cartId:string, userId :string) {
  return prisma.cart.update({
    where: { id: cartId },
    data: { userId },
  })
}

export async function clearCart(cartId:string) {
  return prisma.cart.update({
    where: { id: cartId },
    data: { productJSON: '[]' },
  })
}

export async function deleteCart(cartId:string) {
  return prisma.cart.delete({ where: { id: cartId } })
}
