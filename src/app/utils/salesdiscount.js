export function calculateDiscount(costPrice, originalPrice, desiredProfitMargin) {
    // Calculate the minimum sale price to maintain desired profit margin
    const minSalePrice = costPrice / (1 - desiredProfitMargin);
  
    // Discount amount is difference between original price and minimum sale price
    const discountAmount = originalPrice - minSalePrice;
  
    // If discount is negative, no discount should be applied (return 0)
    return discountAmount > 0 ? discountAmount : 0;
  }
  




  //   // Example:
//   const cost = 50;
//   const original = 100;
//   const desiredMargin = 0.3; // 30%
  
//   const discount = calculateDiscount(cost, original, desiredMargin);
//   console.log(`Discount amount: $${discount.toFixed(2)}`);