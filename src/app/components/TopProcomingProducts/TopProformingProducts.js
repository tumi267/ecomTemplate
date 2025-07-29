'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Skeleton } from '../../../components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import styles from './TopProformingProducts.module.css'
export default function TopPerformingProducts({ topProducts = [], isLoading = false }) {
  // Prepare data for bar chart with error handling
  const chartData = topProducts?.map(product => ({
    name: product?.name?.length > 12 ? `${product.name.substring(0, 12)}...` : product?.name || 'Unknown',
    revenue: Number(product?.totalRevenue) || 0,
    units: Number(product?.totalQuantity) || 0,
    image: product?.image || null,
    avgPrice: product?.totalQuantity ? (product.totalRevenue / product.totalQuantity) : 0
  })) || [];
console.log(chartData)
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[200px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[200px]" />
          </CardHeader>
          <CardContent>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full mb-4 last:mb-0" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Chart Card */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {chartData.length > 0 ? (
                <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#8884d8" />
        <Bar dataKey="units" fill="#82ca9d" />
        </BarChart>
        </ResponsiveContainer>
        </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No product data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table  className={styles.tablecontain}>
            <TableHeader>
              <TableRow>
                <TableHead className={styles.theader}>Product</TableHead>
                <TableHead className={styles.theader}>Units Sold</TableHead>
                <TableHead className={styles.theader}>Total Revenue</TableHead>
                <TableHead className={styles.theader}>Avg. Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chartData.length > 0 ? (
                chartData.map((product, index) => (
                  <TableRow key={`${product.name}-${index}`}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        {product.image && (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={product.image}
                            alt={product.name}
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-product.png';
                            }}
                            width={100}
                            height={100}
                          />
                        )}
                        <span className="line-clamp-1" title={product.name}>
                          {product.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {product.units.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      R{product.revenue.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      R{product.avgPrice.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}