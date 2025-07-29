'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

import styles from './TopVarianits.module.css'

export default function TopVariants({ productName, variants }) {
  const pieData = variants.map((variant) => ({
    name: Object.entries(JSON.parse(variant.options))
      .map(([k, v]) => `${k}:${v}`)
      .join(', '),
    value: variant.revenue,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Chart Card */}
      <Card>
        <CardHeader>
          <CardTitle>Variant Revenue Distribution</CardTitle>
        </CardHeader>
        <CardContent className={styles.chartcontain}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name.split(',')[0]} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <RechartsTooltip
                formatter={(value) => [`R${value.toFixed(2)}`, 'Revenue']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Top Variants of {productName}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Options</TableHead>
                <TableHead>Units Sold</TableHead>
                <TableHead>Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {variants.map((variant, index) => (
                <TableRow key={index}>
                  <TableCell className="text-sm text-muted-foreground">
                    {Object.entries(JSON.parse(variant.options)).map(
                      ([key, value]) => (
                        <div key={key}>
                          {key}: {value}
                        </div>
                      )
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {variant.quantity}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    R{variant.revenue.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
