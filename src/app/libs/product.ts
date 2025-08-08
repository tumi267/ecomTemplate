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

export async function findCategoryByName(name : string) {
  return await prisma.category.findUnique({ where: { name } })
}

export async function findSupplierByEmail(email: string) {
  return await prisma.supplier.findUnique({ where: { email } })
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

// create order
export async function createOrder(data: {
  userId?: string | null;
  items: {
    productId: string
    variantId: string | null
    quantity: number
    product: Record<string, any>
    price: number
    options: Record<string, any>
  }[];
  customer: {
    name: string;
    phone: string;
    email: string;
    streetAddress: string;
    suburb?: string;
    city: string;
    postalCode: string;
    province?: string;
    country?: string;
  };
}) {
  const { userId, items, customer } = data;

  if (!items || items.length === 0) throw new Error('No order items provided');
  if (
    !customer?.name ||
    !customer.email ||
    !customer.phone ||
    !customer.streetAddress ||
    !customer.city ||
    !customer.postalCode
  ) {
    throw new Error('Incomplete customer information');
  }

  const totalPrice = items.reduce(
    (sum, item) =>
      sum.add(new Prisma.Decimal(item.price).mul(item.quantity)),
    new Prisma.Decimal(0)
  );

  try {
    const order = await prisma.order.create({
      data: {
        status: 'PENDING',
        price: totalPrice,
        productJSON: JSON.stringify(items), // 👈 Save full items array as JSON
        shippingAddressLine1: customer.streetAddress,
        shippingAddressLine2: customer.suburb || '',
        shippingCity: customer.city,
        shippingProvince: customer.province || '',
        shippingPostalCode: customer.postalCode,
        shippingCountry: customer.country || '',
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        ...(userId ? { user: { connect: { id: userId } } } : {}),
      },
    });

    return order;
  } catch (error) {
    console.error('Order creation failed:', error);
    throw new Error(
      `Order creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
// get orders


export async function getOrders() {
  return await prisma.order.findMany({orderBy: {
    createdAt: 'desc', // Newest orders first
  },})
}
// get orders between
export async function getOrdersbetween({
  from,
  to,
}: {
  from?: string;
  to?: string;
}) {
  const filters: any = {};

  if (from && to) {
    filters.createdAt = {
      gte: new Date(from),
      lte: new Date(to),
    };
  }

  return await prisma.order.findMany({
    where: filters,
    orderBy: {
      createdAt: "desc",
    },
  });
}
export async function getuserOrders(customerEmail: string) {
  return await prisma.order.findMany({
    where: { customerEmail }, // Filters orders by the user's email
    orderBy: {
      createdAt: 'desc', // Newest orders first
    },
  })
}


export async function getSingleOrder(id: string){
  return await prisma.order.findUnique({
    where:{id}
  })
}
// update order
export async function proccessOrder(id: string,updatedItems:string,status:OrderStatus,payment:PaymentStatus) {
  await prisma.order.update({
    where: {id},
    data: {
      productJSON: JSON.stringify(updatedItems),
      status:status,
      paymentStatus:payment
    }
  });
}
// Get all orders where payment == "PAID"
export async function getOrdersPAID(status: string) {

  return await prisma.order.findMany({
    where: {
      paymentStatus: status as PaymentStatus,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}