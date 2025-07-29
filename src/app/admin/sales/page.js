import { getOrdersPAID } from '../../libs/product';
import SalesSummary from '../../components/SalesSummery/SalesSummery';
import TopPerformingProducts from '../../components/TopProcomingProducts/TopProformingProducts';
import TopVariants from '../../components/TopVariants/TopVarianits';

async function Sales() {
  const orders = await getOrdersPAID('PAID');
  const today = new Date();

  // Helper function to parse productJSON
  const parseProducts = (productJSON) => {
    try {
      return JSON.parse(productJSON);
    } catch (e) {
      console.error('Error parsing productJSON:', e);
      return [];
    }
  };

  // Process all orders and products
  const allProducts = orders.flatMap(order => {
    const products = parseProducts(order.productJSON);
    return products.map(item => ({
      ...item,
      orderDate: new Date(order.createdAt),
      orderId: order.id
    }));
  });

  // Calculate daily data for charts
  const dailyData = orders.reduce((acc, order) => {
    const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
    const orderAmount = parseProducts(order.productJSON).reduce(
      (sum, product) => sum + Number(product.price || 0) * product.quantity, 
      0
    );
    
    if (!acc[orderDate]) {
      acc[orderDate] = {
        date: orderDate,
        amount: 0,
        count: 0
      };
    }
    
    acc[orderDate].amount += orderAmount;
    acc[orderDate].count += 1;
    
    return acc;
  }, {});

  // Convert to array and sort by date
  const sortedDailyData = Object.values(dailyData).sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );

  // Calculate basic metrics
  const totalOrders = orders.length;
  const totalPaid = allProducts.reduce((sum, product) => sum + Number(product.price || 0) * product.quantity, 0);
  const ordersToday = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return (
      orderDate.getFullYear() === today.getFullYear() &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getDate() === today.getDate()
    );
  }).length;

  // Analyze product performance
  const productPerformance = allProducts.reduce((acc, product) => {
    const productName = product.product?.name || 'Unknown Product';
    const productRevenue = Number(product.price || 0) * product.quantity;
    const productImage = product.product?.imagePath || null;
    
    if (!acc[productName]) {
      acc[productName] = {
        name: productName,
        salesCount: 0,
        totalRevenue: 0,
        totalQuantity: 0,
        image: productImage,
        variants: {}
      };
    }
    
    acc[productName].salesCount += 1;
    acc[productName].totalRevenue += productRevenue;
    acc[productName].totalQuantity += product.quantity;

    // Track variants
    const variantKey = product.options ? JSON.stringify(product.options) : 'default';
    if (!acc[productName].variants[variantKey]) {
      acc[productName].variants[variantKey] = {
        options: product.options || {},
        quantity: 0,
        revenue: 0
      };
    }
    acc[productName].variants[variantKey].quantity += product.quantity;
    acc[productName].variants[variantKey].revenue += productRevenue;
    
    return acc;
  }, {});

  // Sort and get top products
  const sortedProducts = Object.values(productPerformance).sort((a, b) => b.totalRevenue - a.totalRevenue);
  const topProducts = sortedProducts.slice(0, 5);

  // Variant analysis for top product
  const topProductVariants = topProducts[0] 
    ? Object.entries(topProducts[0].variants).map(([key, variant]) => ({
        ...variant,
        options: JSON.stringify(variant.options)
      }))
    : [];

  return (
    <div className="p-6 space-y-8">
      <SalesSummary 
        totalPaid={totalPaid}
        totalOrders={totalOrders}
        ordersToday={ordersToday}
        topProduct={topProducts[0]}
        dailyData={[sortedDailyData]}
      />
      
      <TopPerformingProducts 
        topProducts={topProducts} 
      />
      
      {topProducts[0] && (
        <TopVariants 
          productName={topProducts[0].name}
          variants={topProductVariants}
        />
      )}
    </div>
  );
}

export default Sales;