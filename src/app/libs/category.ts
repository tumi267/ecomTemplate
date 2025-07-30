import prisma from './prisma'
//  get all category
export async function getCategory() {
    return await prisma.category.findMany(
      {include: {
        products: true, // ✅ include products
      }}
    )
}
// create categoy
export async function createCategory(data: {
    name: string
    description?: string
    imagePath?: string
  }) {
    return await prisma.category.create({
      data,
    })
  }
//   update category
  export async function updateCategory(id: string, data: {
    name?: string
    description?: string
    imagePath?: string
  }) {
    return await prisma.category.update({
      where: { id },
      data,
    })
  }
// delete category
  export async function deleteCategory(id: string) {
    return await prisma.category.delete({
      where: { id },
    })
  }