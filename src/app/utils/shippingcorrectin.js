// Map Shiplogic status to Prisma enum
const mapStatus = (status) => {
    switch (status) {
      // Collection stage
      case 'collection-unassigned':
        return 'NOT_DISPATCHED';
      case 'collection-assigned':
        return 'COLLECTION_ASSIGNED';
      case 'collection-rejected':
      case 'collection-exception':
      case 'collection-failed-attempt':
        return 'FAILED_ATTEMPT';
      case 'collected':
      case 'at-hub':
      case 'returned-to-hub':
      case 'at-destination-hub':
        return 'IN_TRANSIT';
  
      // Transit
      case 'in-transit':
        return 'IN_TRANSIT';
  
      // Delivery stage
      case 'delivery-unassigned':
      case 'delivery-assigned':
        return 'SHIPPED';
      case 'delivery-rejected':
      case 'delivery-exception':
      case 'delivery-failed-attempt':
        return 'FAILED_ATTEMPT';
      case 'out-for-delivery':
      case 'in-locker':
        return 'IN_TRANSIT';
      case 'delivered':
        return 'DELIVERED';
  
      // End state
      case 'returned-to-sender':
        return 'RETURNED_TO_SENDER';
      case 'cancelled':
        return 'FAILED_ATTEMPT';
  
      default:
        return 'NOT_DISPATCHED';
    }
  };
  
  export default mapStatus;
  



  