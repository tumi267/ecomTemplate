import prisma from './prisma'
// Get a single courier tracking by orderId
export async function getCourierTracking(orderId: string) {
    return await prisma.courierTracking.findUnique({
      where: { orderId },
    })
  }

export async function getCourierByTracking(trackingNumber: string) {
    return await prisma.courierTracking.findUnique({
      where: { trackingNumber },
    })
  }
  
  // Create a new courier tracking record
  export async function createCourierTracking(data: {
    orderId: string
    trackingNumber?: string
    carrier?: string
    status: 'NOT_DISPATCHED' | 'SHIPPED' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED_ATTEMPT' | 'RETURNED_TO_SENDER'
    estimatedArrival?: Date
  }) {
    return await prisma.courierTracking.create({
      data,
    })
  }
  
  // Update an existing courier tracking record
  export async function updateCourierTracking(trackingNumber: string, data: {
    trackingNumber?: string
    carrier?: string
    status?: 'NOT_DISPATCHED' | 'SHIPPED' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED_ATTEMPT' | 'RETURNED_TO_SENDER'
    estimatedArrival?: Date
  }) {
    return await prisma.courierTracking.update({
      where: { trackingNumber },
      data,
    })
  }