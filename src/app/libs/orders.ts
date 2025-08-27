import prisma from './prisma'

// create order
export async function createOrder(data: {
    userId?: string | null;
    cartId:string;
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
  //get order where cart id == local storage
  export async function getcartOrder(cartId: string){
    return await prisma.order.findUnique({
      where:{cartId}
    })
  }