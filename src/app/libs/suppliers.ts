import prisma from './prisma'

export async function getSingleSupplier(id: string) {
    return await prisma.supplier.findUnique({
      where: {
        id,
      },
    })
  }
  export async function createSupplier(data: {
    name: string
    email: string
    phone: string
    address: string
    notes:string
  }) {
    return await prisma.supplier.create({
      data,
    })
  }
//   update category
  export async function updateSupplier(id: string, data: {
    name: string
    email: string
    phone: string
    address: string
    notes:string
  }) {
    return await prisma.supplier.update({
      where: { id },
      data,
    })
  }