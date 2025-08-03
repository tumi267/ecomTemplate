export function calculateDiscount(costPrice, originalPrice, desiredProfitMargin) {
    // Calculate the minimum sale price to maintain desired profit margin
    const minSalePrice = costPrice / (1 - desiredProfitMargin);
  
    // Discount amount is difference between original price and minimum sale price
    const discountAmount = originalPrice - minSalePrice;
  
    // If discount is negative, no discount should be applied (return 0)
    return discountAmount > 0 ? discountAmount : 0;
  }
  
