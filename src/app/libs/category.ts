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

  // hero

  export async function getHeroes() {
    return await prisma.hero.findMany({
      orderBy: { position: 'asc' }
    });
  }
// create hero
  export async function createHeroes(data: {
    id: number;
    imageUrl: string;
    altText: string;
    position: number; // ✅ Required
  }) {
    return await prisma.hero.create({
      data,
    });
  }
// update hero
  export async function updateHero(data: {
    id: number;
    imageUrl?: string;
    altText?: string;
    position?: number;
  }) {
    const { id, ...updateData } = data;
  
    return await prisma.hero.update({
      where: { id },
      data: updateData,
    });
  }
  // delete hero
  export async function deleteHero(id: number) {
    return await prisma.hero.delete({
      where: { id },
    });
  }