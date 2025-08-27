import prisma from './prisma'
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