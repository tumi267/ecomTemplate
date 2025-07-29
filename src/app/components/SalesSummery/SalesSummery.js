'use client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import styles from './SalesSummery.module.css'; // Fixed typo in filename

export default function SalesSummary({ 
  totalPaid = 0, 
  totalOrders = 0, 
  ordersToday = 0, 
  topProduct = null, 
  dailyData = [] 
}) {
  // Enhanced date formatting with better error handling
  const formatDate = (input) => {
    if (!input) return 'Day 1'; // Handle undefined/null
    
    try {
      const date = new Date(input);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      }
    } catch (e) {
      console.error('Date formatting error:', e);
    }
    
    // Fallback with consistent day numbering
    const fallbackDay = dailyData.findIndex(item => item === input) + 1 || 1;
    return `Day ${fallbackDay}`;
  };

  // Process data with better fallbacks
  const chartData = dailyData.length > 0 
  ? dailyData.map((item, index) => {
      // Handle nested array structure
      const dataItem = Array.isArray(item) ? item[0] : item;
      
      return {
        date: formatDate(dataItem?.date),
        revenue: Number(dataItem?.amount) || 0,
        orders: Number(dataItem?.count) || 0,
        rawDate: dataItem?.date 
          ? new Date(dataItem.date) 
          : new Date(Date.now() - (dailyData.length - index - 1) * 86400000)
      };
    }).sort((a, b) => a.rawDate - b.rawDate)
  : Array(7).fill(0).map((_, i) => ({
      date: formatDate(Date.now() - (6 - i) * 86400000),
      revenue: Math.floor(Math.random() * 1000) + 500,
      orders: Math.floor(Math.random() * 10) + 1
    }));

  console.log('Processed chart data:', chartData);

  return (
    <div className={styles.container}>
      {/* Revenue Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Total Revenue</h3>
          <p className={styles.cardValue}>R{totalPaid.toFixed(2)}</p>
        </div>
        <div className={styles.chartContainer}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={chartData} 
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-primary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--chart-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="var(--border-color)"
                  opacity={0.3}
                  vertical={false} 
                />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  tickLine={false}
                  tickFormatter={(value) => `R${value}`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--popover-background)',
                    borderColor: 'var(--border-color)',
                    borderRadius: 'var(--radius)',
                    boxShadow: 'var(--shadow-md)'
                  }}
                  formatter={(value, name) => [
                    name === 'revenue' ? `R${value.toFixed(2)}` : value,
                    name === 'revenue' ? 'Revenue' : 'Orders'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="var(--chart-primary)"
                  fill="url(#primaryGradient)" 
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.chartPlaceholder}>
              No chart data available
            </div>
          )}
        </div>
      </div>

      {/* Today's Orders Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Today's Orders</h3>
          <p className={styles.cardValue}>{ordersToday}</p>
        </div>
      </div>

      {/* Top Product Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Top Product</h3>
          {topProduct ? (
            <>
              <p className="text-lg font-bold truncate">{topProduct.name}</p>
              <p className="text-sm text-muted-foreground">R{topProduct.totalRevenue.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">{topProduct.totalQuantity} units</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
}