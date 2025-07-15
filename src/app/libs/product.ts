import prisma from './prisma'
import { Prisma } from '@prisma/client'

// Get all products
export async function getProducts() {
  return await prisma.product.findMany({
    include: {
      category: true,
      variants: true,
    },
  })
}
// get single product
export async function getSingleProduct(id: string) {
  return await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
      variants: true,
    },
  })
}


// get all category products

export async function getProductsByCategory(categoryId: string) {
  if (!categoryId) {
    throw new Error('Missing required categoryId')
  }

  return await prisma.product.findMany({
    where: {
      categoryId,
    },
    include: {
      category: true,
      variants: true,
    },
  })
}


// get all product where best seller == true
export async function getBestSellers() {
  return await prisma.product.findMany({
    where: {
      bestSeller: true,
    },
    include: {
      category: true,
      variants: true,
    },
  })
}

// 
// get all prooducts where weeklysale == true
export async function getWeekSales() {
  return await prisma.product.findMany({
    where: {
      weekSale: true,
    },
    include: {
      category: true,
      variants: true,
    },
  })
}


// Create a product
export async function createProduct(data: {
    name: string
    description: string
    imagePath?: string  // optional now
    sku?: string
    categoryId: string
    currency?: 'ZAR' | 'USD' | 'EUR' | 'GBP'
    isAvailableForPurchase?: boolean
    bestSeller?: boolean
    weekSale?: boolean
    price: Prisma.Decimal | string | number
  }) {
    // Validate required fields
    if (!data.name || !data.description || !data.categoryId || !data.price) {
      throw new Error('Missing required product fields')
    }
  
    // Convert price safely
    let priceDecimal
    try {
      priceDecimal = new Prisma.Decimal(data.price)
    } catch {
      throw new Error('Invalid price format')
    }
  
    return await prisma.product.create({
      data: {
        ...data,
        price: priceDecimal,
        imagePath: data.imagePath || '', // provide default empty string if optional
      },
    })
  }
// Update a product
export async function updateProduct(id: string, data: {
  name?: string
  description?: string
  imagePath?: string
  sku?: string
  categoryId?: string
  currency?: 'ZAR' | 'USD' | 'EUR' | 'GBP'
  isAvailableForPurchase?: boolean
  bestSeller?: boolean
  weekSale?: boolean
  price?: Prisma.Decimal | string | number
}) {
  const updateData = { ...data }

  // Ensure price is a Decimal if provided
  if (updateData.price !== undefined) {
    updateData.price = new Prisma.Decimal(updateData.price)
  }

  return await prisma.product.update({
    where: { id },
    data: updateData,
  })
}

// Delete a product
export async function deleteProduct(id: string) {
  return await prisma.product.delete({
    where: { id },
  })
}

// ✅ Get all variants for a specific productId (required)
export async function getVariants(productId: string) {
  if (!productId) {
    throw new Error('Product ID is required to fetch variants.')
  }

  return await prisma.variant.findMany({
    where: { productId },
    orderBy: { createdAt: 'asc' }, // Optional: sort by creation time
    include: {
      product: true,
    },
  })
}

// ✅ Get a single variant by ID
export async function getVariantById(id: string) {
  return await prisma.variant.findUnique({
    where: { id },
    include: {
      product: true,
    },
  })
}

// ✅ Create a variant
export async function createVariant(data: {
  productId: string
  type: string
  label: string
  price: Prisma.Decimal | string | number
  qty: number
  trackQty: boolean
}) {
  if (!data.productId || !data.type || !data.label || data.price === undefined) {
    throw new Error('Missing required variant fields')
  }

  let priceDecimal
  try {
    priceDecimal = new Prisma.Decimal(data.price)
  } catch {
    throw new Error('Invalid price format')
  }

  return await prisma.variant.create({
    data: {
      ...data,
      price: priceDecimal,
    },
  })
}

// ✅ Update a variant
export async function updateVariant(id: string, data: {
  type?: string
  label?: string
  price?: Prisma.Decimal | string | number
  qty?: number
  trackQty?: boolean
}) {
  const updateData = { ...data }

  if (updateData.price !== undefined) {
    updateData.price = new Prisma.Decimal(updateData.price)
  }

  return await prisma.variant.update({
    where: { id },
    data: updateData,
  })
}

// ✅ Delete a variant
export async function deleteVariant(id: string) {
  return await prisma.variant.delete({
    where: { id },
  })
}