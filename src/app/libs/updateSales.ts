import prisma from './prisma'

export async function addDiscount(id: string, data: {
    discount?: number | string
    weekSale?: boolean
  }) {
    const updateData: any = {}
  
    if (data.discount !== undefined) {
      updateData.discount = parseFloat(data.discount as string)
    }
  
    if (data.weekSale !== undefined) {
      updateData.weekSale = data.weekSale
    }
  
    return await prisma.product.update({
      where: { id },
      data: updateData,
    })
  }
  