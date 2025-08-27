import prisma from './prisma'
import { OrderStatus, PaymentStatus, Prisma } from '@prisma/client'
// get sigele user
 export async function getsingleUsers(id:string) {
    return await prisma.user.findUnique({ where: { id } })
   } 
// user 
export async function getUsers() {
    return await prisma.user.findMany()
   } 