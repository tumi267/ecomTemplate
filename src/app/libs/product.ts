import prisma from './prisma'
import { OrderStatus, PaymentStatus, Prisma } from '@prisma/client'

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
  imagePath?: string
  sku?: string
  categoryId: string
  currency?: 'ZAR' | 'USD' | 'EUR' | 'GBP'
  isAvailableForPurchase?: boolean
  bestSeller?: boolean
  weekSale?: boolean
  price: Prisma.Decimal | string | number
  qty: number
  trackQty: boolean
}) {
  if (
    !data.name ||
    !data.description ||
    !data.categoryId ||
    data.price === undefined ||
    data.qty === undefined ||
    data.trackQty === undefined
  ) {
    throw new Error('Missing required product fields')
  }

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
      imagePath: data.imagePath || '',
    },
  })
}
// Update a product
export async function updateProduct(
  id: string,
  data: {
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
    qty?: number
    trackQty?: boolean
  }
) {
  const updateData: any = { ...data }

  // Ensure price is a Decimal if provided
  if (updateData.price !== undefined) {
    updateData.price = new Prisma.Decimal(updateData.price)
  }

  return await prisma.product.update({
    where: { id },
    data: updateData,
  })
}
export async function updateProductSale(
  productId: string,
  quantity: number,
  variantId?: string
) {
  const now = new Date();

  if (variantId) {
    // Fetch variant with its product
    const variant = await prisma.variant.findUnique({
      where: { id: variantId },
      include: { product: true },
    });

    if (!variant) throw new Error("Variant not found");

    const variantUpdates: any = {};
    if (variant.trackQty && variant.qty >= quantity) {
      variantUpdates.qty = { decrement: quantity };
    }
    variantUpdates.unitsSold = { increment: quantity };

    const productUpdates: any = {
      qty:{ decrement: quantity },
      unitsSold: { increment: quantity },
    };

    const [updatedVariant, updatedProduct, newSale] = await prisma.$transaction([
      prisma.variant.update({
        where: { id: variantId },
        data: variantUpdates,
      }),
      prisma.product.update({
        where: { id: productId },
        data: productUpdates,
      }),
      prisma.productSale.create({
        data: {
          productId,
          variantId,
          quantity,
          soldAt: now,
        },
      }),
    ]);

    return { updatedVariant, updatedProduct, newSale };
  } else {
    // Fetch product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new Error("Product not found");
    const productUpdates: any = {
      qty:{ decrement: quantity },
      unitsSold: { increment: quantity },
    };
    if (product.trackQty && product.qty >= quantity) {
      productUpdates.qty = { decrement: quantity };
    }
    const [updatedProduct, newSale] = await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: productUpdates,
      }),
      prisma.productSale.create({
        data: {
          productId,
          variantId: null,
          quantity,
          soldAt: now,
        },
      }),
    ]);
    return { updatedProduct, newSale };
  }
}

// get product sales
export async function getProductSales(productID:string) {
  return await prisma.productSale.findMany({
    where: {
      productId: productID,
    },
  })
}

// Delete a product
export async function deleteProduct(id: string) {
  return await prisma.product.delete({
    where: { id },
  })
}

//get product unique by 
export async function uniqeProduct(sku: string) {
  return await prisma.product.findUnique({
    where: {
      sku,
    },
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
  options: Record<string, string> // e.g. { size: "S", color: "Red" }
  price: Prisma.Decimal | string | number
  qty: number
  trackQty: boolean
}) {
  if (!data.productId || !data.options || data.price === undefined || data.qty === undefined || data.trackQty === undefined) {
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
      productId: data.productId,
      options: data.options,
      price: priceDecimal,
      qty: data.qty,
      trackQty: data.trackQty,
    },
  })
}

// ✅ Update a variant
export async function updateVariant(id: string, data: {
  options?: Record<string, string>
  price?: Prisma.Decimal | string | number
  qty?: number
  trackQty?: boolean
}) {
  const updateData: any = { ...data }

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

